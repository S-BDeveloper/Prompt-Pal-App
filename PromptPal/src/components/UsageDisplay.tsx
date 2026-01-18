import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UsageStats } from '../lib/usage';

interface UsageDisplayProps {
  usage: UsageStats;
  compact?: boolean;
}

export function UsageDisplay({ usage, compact = false }: UsageDisplayProps) {
  const getUsageColor = (used: number, limit: number) => {
    const percent = (used / limit) * 100;
    if (percent >= 90) return '#F44336'; // Red
    if (percent >= 70) return '#FF9800'; // Orange
    return '#4CAF50'; // Green
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactText}>
          {usage.tier.toUpperCase()}: {usage.used.textCalls + usage.used.imageCalls}/{usage.limits.textCalls + usage.limits.imageCalls}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usage ({usage.tier.toUpperCase()})</Text>

      <View style={styles.usageRow}>
        <Text style={styles.label}>Text Calls:</Text>
        <Text style={[styles.value, { color: getUsageColor(usage.used.textCalls, usage.limits.textCalls) }]}>
          {usage.used.textCalls}/{usage.limits.textCalls}
        </Text>
      </View>

      <View style={styles.usageRow}>
        <Text style={styles.label}>Image Calls:</Text>
        <Text style={[styles.value, { color: getUsageColor(usage.used.imageCalls, usage.limits.imageCalls) }]}>
          {usage.used.imageCalls}/{usage.limits.imageCalls}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  compactContainer: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  compactText: {
    color: '#BB86FC',
    fontSize: 12,
    fontWeight: '500',
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
});