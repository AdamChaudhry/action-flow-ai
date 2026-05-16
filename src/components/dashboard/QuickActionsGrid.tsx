import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, Clipboard, FileText, Link } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { QuickActionCard } from './QuickActionCard';

const quickActions = [
  { label: 'Paste Text', Icon: Clipboard },
  { label: 'Upload Report', Icon: FileText },
  { label: 'Add Article Link', Icon: Link },
  { label: 'Upload Screenshot', Icon: Camera },
] as const;

interface QuickActionsGridProps {
  onActionPress: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onActionPress,
}) => (
  <View style={styles.grid}>
    {quickActions.map(({ label, Icon }) => (
      <QuickActionCard
        key={label}
        label={label}
        icon={<Icon size={24} color={colors.aiBlue} />}
        onPress={onActionPress}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.stackLg,
  },
});
