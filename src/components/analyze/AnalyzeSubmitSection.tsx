import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface AnalyzeSubmitSectionProps {
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const AnalyzeSubmitSection: React.FC<AnalyzeSubmitSectionProps> = ({
  isSubmitting,
  onSubmit,
}) => {
  if (isSubmitting) {
    return (
      <View
        accessibilityLabel="Submitting analysis"
        accessibilityRole="progressbar"
        style={styles.loadingContainer}
      >
        <ActivityIndicator color={colors.aiBlue} size="small" />
        <Typography variant="labelMd" color={colors.textSecondary}>
          Submitting...
        </Typography>
      </View>
    );
  }

  return (
    <Button
      title="Analyze Content"
      icon={<BarChart2 size={16} color={colors.primaryInverse} />}
      style={styles.button}
      onPress={onSubmit}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.stackSm,
    paddingVertical: 14,
  },
});
