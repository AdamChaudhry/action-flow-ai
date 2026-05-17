import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';

interface ActionsHeaderProps {
  totalCount: number;
  newCount: number;
}

/**
 * Screen header for the Recommended Actions screen.
 * Shows title, subtitle, and a "N New Suggestions" badge.
 */
export const ActionsHeader: React.FC<ActionsHeaderProps> = ({ totalCount, newCount }) => (
  <View style={styles.container}>
    <Typography variant="headlineLg" style={styles.title}>
      Recommended Actions
    </Typography>
    <Typography variant="bodyMd" color={colors.textSecondary} style={styles.subtitle}>
      {totalCount > 0
        ? `${totalCount} AI-synthesized optimization${totalCount > 1 ? 's' : ''} based on your current customer lifecycle data and operational bottlenecks.`
        : 'AI-synthesized optimizations based on your current customer lifecycle data and operational bottlenecks.'}
    </Typography>
    {newCount > 0 && (
      <View style={styles.badge}>
        <Zap size={12} color={colors.aiBlue} />
        <Typography variant="labelSm" color={colors.aiBlue}>
          {newCount} New Suggestion{newCount > 1 ? 's' : ''}
        </Typography>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    lineHeight: 24,
    marginBottom: spacing.stackMd,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: rounded.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});
