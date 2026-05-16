import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing, rounded } from '../theme/spacing';
import { 
  FileText, File, Layout, LayoutDashboard, Smartphone, FileEdit, 
  Link as LinkIcon, BarChart2, FileUp, Camera, ChevronRight
} from 'lucide-react-native';

export const AnalyzeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Content Input Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Typography variant="headlineMd">Content Input</Typography>
          <Badge label="Auto-detect" variant="outline" />
        </View>
        
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Paste notes, reports, articles, meeting summaries, or raw content here"
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.supportedSection}>
          <Typography variant="labelSm" color={colors.textSecondary} style={styles.supportedLabel}>
            Supported:
          </Typography>
          <View style={styles.tagsGrid}>
            <Badge icon={<FileText size={12} color={colors.textSecondary} />} label="Text" variant="neutral" style={styles.tag} />
            <Badge icon={<File size={12} color={colors.textSecondary} />} label="PDF" variant="neutral" style={styles.tag} />
            <Badge icon={<Layout size={12} color={colors.textSecondary} />} label="Article" variant="neutral" style={styles.tag} />
            <Badge icon={<LayoutDashboard size={12} color={colors.textSecondary} />} label="Dashboard" variant="neutral" style={styles.tag} />
            <Badge icon={<Smartphone size={12} color={colors.textSecondary} />} label="Screenshot" variant="neutral" style={styles.tag} />
            <Badge icon={<FileEdit size={12} color={colors.textSecondary} />} label="Notes" variant="neutral" style={styles.tag} />
          </View>
        </View>
      </Card>

      {/* Import from URL Card */}
      <Card style={styles.card}>
        <View style={styles.urlHeader}>
          <LinkIcon size={16} color={colors.aiBlue} style={styles.urlIcon} />
          <Typography variant="labelMd">Import from URL</Typography>
        </View>
        <TextInput
          style={styles.urlInput}
          placeholder="https://article-or-report.com/path"
          placeholderTextColor={colors.textTertiary}
        />
      </Card>

      {/* Upload Documents Box */}
      <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
        <View style={styles.uploadIconContainer}>
          <FileUp size={24} color={colors.aiBlue} />
        </View>
        <Typography variant="labelMd" style={styles.uploadTitle}>Upload Documents</Typography>
        <Typography variant="bodySm" color={colors.textSecondary}>Drag and drop or click to browse</Typography>
      </TouchableOpacity>

      {/* Upload Screenshot Box */}
      <Card style={styles.screenshotCard}>
        <View style={styles.screenshotRow}>
          <View style={styles.screenshotIconBox}>
            <Camera size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.screenshotText}>
            <Typography variant="labelMd">Upload Screenshot</Typography>
            <Typography variant="bodySm" color={colors.textSecondary}>Analyze visual data</Typography>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </View>
      </Card>

      {/* Analyze Content Button */}
      <Button 
        title="Analyze Content" 
        icon={<BarChart2 size={16} color={colors.primaryInverse} />} 
        style={styles.analyzeButton} 
      />

      {/* Bottom padding so content is not hidden behind tabs */}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  card: {
    padding: spacing.gutter,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: rounded.md,
    backgroundColor: colors.surface,
    minHeight: 120,
    padding: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  textArea: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: colors.textPrimary,
  },
  supportedSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  supportedLabel: {
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
  urlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.stackSm,
  },
  urlIcon: {
    marginRight: spacing.stackSm,
  },
  urlInput: {
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
  analyzeButton: {
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: rounded.lg,
    padding: spacing.gutter,
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginVertical: spacing.stackSm,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: rounded.full,
    backgroundColor: colors.badgeBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.stackSm,
  },
  uploadTitle: {
    marginBottom: 4,
  },
  screenshotCard: {
    padding: spacing.stackMd,
  },
  screenshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenshotIconBox: {
    width: 40,
    height: 40,
    borderRadius: rounded.md,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.stackMd,
  },
  screenshotText: {
    flex: 1,
  },
});
