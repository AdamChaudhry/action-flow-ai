import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const DashboardHeaderSection: React.FC = () => (
  <View style={styles.container}>
    <Typography variant="headlineXl" style={styles.title}>
      Turn content into action
    </Typography>
    <Typography
      variant="bodyLg"
      color={colors.textSecondary}
      style={styles.subtitle}
    >
      Leverage fluid AI intelligence to synthesize insights and automate your
      professional workflow instantly.
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    marginBottom: spacing.stackMd,
  },
});
