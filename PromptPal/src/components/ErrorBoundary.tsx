import React from 'react';
import { View, Text } from 'react-native';
import { logger } from '@/lib/logger';

interface Props { children: React.ReactNode; fallback?: React.ReactNode; }

export class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-error text-lg font-bold mb-4">Something went wrong</Text>
          <Text className="text-onSurfaceVariant text-center">Please restart the app</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
