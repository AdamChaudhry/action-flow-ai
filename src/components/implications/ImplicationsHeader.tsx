import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ImplicationsHeaderProps {
  count: number;
}

/** Screen title and context subtitle for the Implications screen. */
export const ImplicationsHeader: React.FC<ImplicationsHeaderProps> = ({ count }) => (
  <View style={styles.container}>
    <Typography variant="headlineLg" style={styles.title}>
      Analysis of Implications
    </Typography>
    <Typography variant="bodyMd" color={colors.textSecondary} style={styles.subtitle}>
      {count > 0
        ? `We've identified ${count} key outcome${count > 1 ? 's' : ''} based on the current workflow patterns. Review the critical impact areas before generating automated responses.`
        : "We've identified key outcomes based on the current workflow patterns. Review the critical impact areas before generating automated responses."}
    </Typography>
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
  },
});
