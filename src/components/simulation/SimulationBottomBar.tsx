import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Download, RefreshCw, Zap } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface SimulationBottomBarProps {
  onExport?: () => void;
  onRefine: () => void;
  onExecute: () => void;
}

export const SimulationBottomBar: React.FC<SimulationBottomBarProps> = ({
  onExport,
  onRefine,
  onExecute,
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Export simulation"
      style={styles.outlineButton}
      onPress={onExport}
      activeOpacity={0.7}
    >
      <Download size={14} color={colors.textSecondary} />
      <Typography variant="labelMd" color={colors.textSecondary}>
        Export
      </Typography>
    </TouchableOpacity>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Refine simulation"
      style={styles.outlineButton}
      onPress={onRefine}
      activeOpacity={0.7}
    >
      <RefreshCw size={14} color={colors.textSecondary} />
      <Typography variant="labelMd" color={colors.textSecondary}>
        Refine
      </Typography>
    </TouchableOpacity>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Execute action"
      style={styles.executeButton}
      onPress={onExecute}
      activeOpacity={0.85}
    >
      <Zap size={14} color={colors.primaryInverse} />
      <Typography variant="labelMd" color={colors.primaryInverse}>
        Execute
      </Typography>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    padding: spacing.marginMobile,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: rounded.md,
    paddingVertical: 12,
  },
  executeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 12,
  },
});
