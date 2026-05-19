import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { Insight } from '../../types/analysis';
import { toDisplayText } from '../../utils/displayText';

interface CompactInsightCardProps {
  insight: Insight;
  onPress?: () => void;
}

/**
 * Secondary insight card — compact row layout with importance pill,
 * title, summary, progress bar, and reliability percentage.
 */
export const CompactInsightCard: React.FC<CompactInsightCardProps> = ({
  insight,
  onPress,
}) => {
  const reliabilityPercent = Math.round(
    insight.confidence <= 1 ? insight.confidence * 100 : insight.confidence,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Insight: ${toDisplayText(insight.title)}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {/* Category label */}
      <Typography variant="labelSm" color={colors.textSecondary} style={styles.category}>
        {insight.category.replace(/_/g, ' ')}
      </Typography>

      {/* Title */}
      <Typography variant="headlineMd" style={styles.title}>
        {toDisplayText(insight.title)}
      </Typography>

      {/* Description */}
      <Typography variant="bodySm" color={colors.textSecondary} style={styles.description}>
        {toDisplayText(insight.description)}
      </Typography>

      {/* Confidence bar */}
      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${reliabilityPercent}%` }]} />
        </View>
        <Typography variant="labelSm" color={colors.textSecondary}>
          {reliabilityPercent}% Reliable
        </Typography>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    borderColor: colors.aiBlue,
  },
  category: {
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  title: {
    lineHeight: 28,
  },
  description: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: rounded.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.full,
  },
});
