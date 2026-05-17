import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ActionsQueueDivider: React.FC = () => (
  <View style={styles.divider}>
    <Typography
      variant="labelSm"
      color={colors.textTertiary}
      style={styles.dividerText}
    >
      AUTO-EXECUTE QUEUE
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginVertical: spacing.stackSm,
  },
  dividerText: {
    letterSpacing: 0.6,
  },
});
