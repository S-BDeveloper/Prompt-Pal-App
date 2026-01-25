import { useUserProgressStore } from '@/features/user/store';
import { logger } from '@/lib/logger';
import * as SecureStore from 'expo-secure-store';
import { api, ApiClient } from './api';
import { SYNC_INTERVAL_MS } from './constants';

// Constants
const MAX_SYNC_RETRIES = 3;
const SYNC_RETRY_DELAY_MS = 1000; // 1 second

/**
 * Manages synchronization of game state with the backend
 */
export class SyncManager {
  private static syncInProgress = false;
  private static syncIntervalId: ReturnType<typeof setTimeout> | null = null;
  private static isOnline = true;

  /**
   * Starts periodic background synchronization
   */
  static startPeriodicSync(): void {
    if (this.syncIntervalId) {
      logger.warn('SyncManager', 'Periodic sync already running');
      return;
    }

    logger.info('SyncManager', 'Starting periodic sync', { interval: SYNC_INTERVAL_MS });
    this.syncIntervalId = setInterval(() => {
      this.syncUserProgress();
    }, SYNC_INTERVAL_MS);
  }

  /**
   * Stops periodic background synchronization
   */
  static stopPeriodicSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
      logger.info('SyncManager', 'Stopped periodic sync');
    }
  }

  /**
   * Manually triggers a sync of user progress
   * @returns Promise that resolves when sync is complete
   */
  static async syncUserProgress(): Promise<void> {
    if (this.syncInProgress) {
      logger.debug('SyncManager', 'Sync already in progress, skipping');
      return;
    }

    if (!this.isOnline) {
      logger.debug('SyncManager', 'Offline, skipping sync');
      return;
    }

    try {
      this.syncInProgress = true;

      // Get local user progress data
      const userProgress = useUserProgressStore.getState();

      // Sync user progress data with backend
      await this.performSync(userProgress);

      logger.info('SyncManager', 'Progress synced successfully');

    } catch (error) {
      logger.error('SyncManager', error, { operation: 'syncUserProgress' });
      // Don't throw - sync failures shouldn't break gameplay
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Performs the actual synchronization with retry logic
   * @param gameState - Current game state to sync
   * @param retryCount - Current retry attempt (internal use)
   */
  private static async performSync(
    userProgress: any,
    retryCount = 0
  ): Promise<void> {
    try {
      // Sync user progress data to match server schema
      await ApiClient.updateUserProgressStats({
        progress: {
          level: userProgress.level,
          xp: userProgress.xp,
          currentStreak: userProgress.currentStreak,
          longestStreak: userProgress.longestStreak,
          lastActivityDate: userProgress.lastActivityDate,
        }
      });
    } catch (error) {
      if (retryCount < MAX_SYNC_RETRIES) {
        logger.warn('SyncManager', `Sync failed, retrying (${retryCount + 1}/${MAX_SYNC_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, SYNC_RETRY_DELAY_MS * (retryCount + 1)));
        return this.performSync(userProgress, retryCount + 1);
      }

      // Mark as offline if sync consistently fails
      this.isOnline = false;
      throw error;
    }
  }

  /**
   * Updates online status and triggers sync if coming back online
   * @param online - Whether the device is online
   */
  static setOnlineStatus(online: boolean): void {
    const wasOffline = !this.isOnline;
    this.isOnline = online;

    if (online && wasOffline) {
      logger.info('SyncManager', 'Back online, triggering sync');
      // Trigger immediate sync when coming back online
      this.syncUserProgress();
    }
  }

  /**
   * Gets current sync status
   * @returns Object with sync status information
   */
  static getSyncStatus(): {
    isOnline: boolean;
    syncInProgress: boolean;
    periodicSyncActive: boolean;
  } {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      periodicSyncActive: this.syncIntervalId !== null,
    };
  }

  /**
   * Forces a sync regardless of current state (useful for manual sync)
   * @returns Promise that resolves when sync is complete
   */
  static async forceSync(): Promise<void> {
    const previousSyncState = this.syncInProgress;
    this.syncInProgress = false; // Allow forced sync

    try {
      await this.syncUserProgress();
    } finally {
      this.syncInProgress = previousSyncState;
    }
  }

  /**
   * Queue an action to be processed when online
   * @param action - The action to queue (endpoint and data)
   */
  private static async queueOfflineAction(action: { endpoint: string; data: any }) {
    const queue = await SecureStore.getItemAsync('offline_queue');
    const actions = queue ? JSON.parse(queue) : [];
    actions.push({ ...action, timestamp: Date.now() });
    await SecureStore.setItemAsync('offline_queue', JSON.stringify(actions));
  }

  /**
   * Process all queued offline actions
   */
  static async processOfflineQueue() {
    const queue = await SecureStore.getItemAsync('offline_queue');
    if (!queue) return;
    
    const actions = JSON.parse(queue);
    for (const action of actions) {
      try {
        await api.post(action.endpoint, action.data);
      } catch (error) {
        logger.error('SyncManager', error, { operation: 'processOfflineQueue', action });
      }
    }
    await SecureStore.deleteItemAsync('offline_queue');
  }

  /**
   * Check if there are offline actions pending
   */
  static async hasPendingOfflineActions(): Promise<boolean> {
    const queue = await SecureStore.getItemAsync('offline_queue');
    return !!queue;
  }
}