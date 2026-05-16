import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  File,
  FileEdit,
  FileText,
  Layout,
  LayoutDashboard,
  Smartphone,
} from 'lucide-react-native';
import { Badge } from '../Badge';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const supportedTypes = [
  { label: 'Text', Icon: FileText },
  { label: 'PDF', Icon: File },
  { label: 'Article', Icon: Layout },
  { label: 'Dashboard', Icon: LayoutDashboard },
  { label: 'Screenshot', Icon: Smartphone },
  { label: 'Notes', Icon: FileEdit },
] as const;

export const SupportedTypesList: React.FC = () => (
  <View style={styles.container}>
    <Typography
      variant="labelSm"
      color={colors.textSecondary}
      style={styles.label}
    >
      Supported:
    </Typography>
    <View style={styles.tagsGrid}>
      {supportedTypes.map(({ label, Icon }) => (
        <Badge
          key={label}
          icon={<Icon size={12} color={colors.textSecondary} />}
          label={label}
          variant="neutral"
          style={styles.tag}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: {
    marginRight: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
  },
  tag: {
    marginBottom: spacing.stackSm,
  },
});
