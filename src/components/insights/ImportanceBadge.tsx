import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { rounded } from '../../theme/spacing';
import type { ImportanceLevel } from '../../types/analysis';

interface ImportanceBadgeProps {
  level?: ImportanceLevel | string | null;
  featured?: boolean;
}

const TOKEN: Record<
  ImportanceLevel,
  { bg: string; text: string; dot: string | null; label: string }
> = {
  critical: {
    bg: '#FEE2E2',
    text: '#DC2626',
    dot: '#DC2626',
    label: 'Importance: Critical',
  },
  high: {
    bg: '#FEF3C7',
    text: '#D97706',
    dot: '#D97706',
    label: 'Importance: High',
  },
  medium: {
    bg: '#0F172A',
    text: '#FFFFFF',
    dot: null,
    label: 'MEDIUM',
  },
  low: {
    bg: '#334155',
    text: '#FFFFFF',
    dot: null,
    label: 'LOW',
  },
};

function normalizeImportance(
  level: ImportanceBadgeProps['level'],
): ImportanceLevel {
  const normalizedLevel = level?.toLowerCase();

  if (
    normalizedLevel === 'critical' ||
    normalizedLevel === 'high' ||
    normalizedLevel === 'medium' ||
    normalizedLevel === 'low'
  ) {
    return normalizedLevel;
  }

  return 'medium';
}

export const ImportanceBadge: React.FC<ImportanceBadgeProps> = ({
  level,
  featured = false,
}) => {
  const token = TOKEN[normalizeImportance(level)];

  if (featured) {
    return (
      <View style={[styles.base, { backgroundColor: token.bg }]}>
        {token.dot && (
          <View style={[styles.dot, { backgroundColor: token.dot }]} />
        )}
        <Typography variant="labelSm" color={token.text}>
          {token.label}
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.base, styles.compact, { backgroundColor: token.bg }]}>
      <Typography
        variant="labelSm"
        color={token.text}
        style={styles.compactText}
      >
        {token.label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: rounded.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  compact: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  compactText: {
    letterSpacing: 0.4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
