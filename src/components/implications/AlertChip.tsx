import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Typography } from '../Typography';
import { rounded, spacing } from '../../theme/spacing';

interface AlertChipProps {
  label: string;
}

/** Red warning chip for regulatory or breach-level alerts (e.g. "Contractual Breach Alert") */
export const AlertChip: React.FC<AlertChipProps> = ({ label }) => (
  <View style={styles.chip}>
    <AlertTriangle size={11} color="#DC2626" />
    <Typography variant="labelSm" color="#DC2626" style={styles.label}>
      {label}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: rounded.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: spacing.stackSm,
  },
  label: {
    letterSpacing: 0.1,
  },
});
