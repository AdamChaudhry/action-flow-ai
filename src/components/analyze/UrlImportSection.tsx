import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Link as LinkIcon } from 'lucide-react-native';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

export const UrlImportSection: React.FC = () => (
  <Card style={styles.card}>
    <View style={styles.header}>
      <LinkIcon size={16} color={colors.aiBlue} style={styles.icon} />
      <Typography variant="labelMd">Import from URL</Typography>
    </View>
    <TextInput
      accessibilityLabel="Import URL"
      style={styles.input}
      placeholder="https://article-or-report.com/path"
      placeholderTextColor={colors.textTertiary}
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="url"
    />
  </Card>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.stackSm,
  },
  icon: {
    marginRight: spacing.stackSm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: rounded.md,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: 10,
    fontFamily: 'Inter',
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
});
