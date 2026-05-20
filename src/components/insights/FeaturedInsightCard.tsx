import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { ConfidenceBadge } from './ConfidenceBadge';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import type { Insight } from '../../types/analysis';
import { toDisplayText, toDisplayTextArray } from '../../utils/displayText';

interface FeaturedInsightCardProps {
  insight: Insight;
  onViewImplications: (insightId: string) => void;
}

/**
 * Large, prominent insight card with left blue accent border.
 * Shows confidence, category, importance badges, evidence, and explanation.
 */
export const FeaturedInsightCard: React.FC<FeaturedInsightCardProps> = ({
  insight,
  onViewImplications,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const evidenceItems = toDisplayTextArray(insight.evidence);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [insight.id, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Left accent line */}
      <View style={styles.accentBar} />

      <View style={styles.body}>
        {/* Badge row: confidence + category */}
        <View style={styles.badgeRow}>
          <ConfidenceBadge value={insight.confidence} />
          <View style={styles.categoryChip}>
            <Typography variant="labelSm" color={colors.textSecondary}>
              {insight.category.replace(/_/g, ' ')}
            </Typography>
          </View>
        </View>

        {/* Headline */}
        <Typography variant="headlineLg" style={styles.title}>
          {toDisplayText(insight.title)}
        </Typography>

        {/* Description */}
        <Typography variant="bodyMd" color={colors.textSecondary} style={styles.description}>
          {toDisplayText(insight.description)}
        </Typography>

        {/* Evidence */}
        {evidenceItems.length > 0 && (
          <>
            <Typography variant="labelSm" color={colors.textTertiary} style={styles.sectionLabel}>
              EVIDENCE
            </Typography>
            {evidenceItems.map((item, i) => (
              <Typography key={i} variant="bodyMd" color={colors.textSecondary} style={styles.evidenceText}>
                "{item}"
              </Typography>
            ))}
          </>
        )}

        {/* View Implications CTA */}
        <View style={styles.footer}>
          <Button
            title="View Implications"
            onPress={() => onViewImplications(insight.id)}
            variant="secondary"
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.aiBlue,
  },
  body: {
    flex: 1,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: 2,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderRadius: rounded.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  description: {
    lineHeight: 24,
    marginBottom: spacing.stackSm,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    marginTop: spacing.stackMd,
    marginBottom: 4,
  },
  evidenceText: {
    fontStyle: 'italic',
  },
  footer: {
    marginTop: spacing.stackMd,
    paddingTop: spacing.stackSm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
