import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Sparkles, ArrowRight, Clipboard, FileText, Link, Camera, MessageSquare, Calendar, Globe, MoreVertical, CheckCircle2 } from 'lucide-react-native';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing, rounded } from '../theme/spacing';

export const DashboardScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title Section */}
      <View style={styles.headerSection}>
        <Typography variant="headlineXl" style={styles.title}>
          Turn content into action
        </Typography>
        <Typography variant="bodyLg" color={colors.textSecondary} style={styles.subtitle}>
          Leverage fluid AI intelligence to synthesize insights and automate your professional workflow instantly.
        </Typography>
      </View>

      {/* Status Pill */}
      <View style={styles.statusPill}>
        <View style={styles.statusDot} />
        <Typography variant="labelSm" color={colors.textPrimary}>
          Ready to analyze new content
        </Typography>
      </View>

      {/* Big AI Card */}
      <Card style={styles.aiCard} glass variant="flat">
        <Badge
          label="AI POWERED"
          variant="ai"
          icon={<Sparkles size={14} color={colors.aiBlue} />}
          style={styles.aiBadge}
        />
        <Typography variant="headlineLg" style={styles.aiCardTitle}>
          Launch Intelligence Engine
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary} style={styles.aiCardText}>
          Start a new session to process complex documents, URLs, or raw text into actionable tasks and strategic summaries.
        </Typography>
        <Button
          title="Start New Analysis"
          variant="primary"
          style={styles.aiButton}
          icon={<ArrowRight size={18} color={colors.primaryInverse} />}
        />
      </Card>

      {/* Quick Actions Grid */}
      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <Clipboard size={24} color={colors.aiBlue} />
          <Typography variant="labelMd" style={styles.gridCardText}>Paste Text</Typography>
        </Card>
        <Card style={styles.gridCard}>
          <FileText size={24} color={colors.aiBlue} />
          <Typography variant="labelMd" style={styles.gridCardText}>Upload Report</Typography>
        </Card>
        <Card style={styles.gridCard}>
          <Link size={24} color={colors.aiBlue} />
          <Typography variant="labelMd" style={styles.gridCardText}>Add Article Link</Typography>
        </Card>
        <Card style={styles.gridCard}>
          <Camera size={24} color={colors.aiBlue} />
          <Typography variant="labelMd" style={styles.gridCardText}>Upload Screenshot</Typography>
        </Card>
      </View>

      {/* Recent Analyses Header */}
      <View style={styles.sectionHeader}>
        <Typography variant="headlineMd">Recent Analyses</Typography>
        <TouchableOpacity>
          <Typography variant="labelMd" color={colors.aiBlue}>View All</Typography>
        </TouchableOpacity>
      </View>

      {/* Recent Analyses List */}
      <View style={styles.list}>
        {/* Item 1 */}
        <Card style={styles.listItem}>
          <View style={styles.listItemRow}>
            <FileText size={20} color={colors.textSecondary} />
            <View style={styles.listItemContent}>
              <Typography variant="labelMd">Sales report analysis</Typography>
              <Typography variant="bodySm" color={colors.textSecondary}>2 hours ago</Typography>
            </View>
            <View style={styles.listItemTag}>
              <Typography variant="labelSm" color={colors.textSecondary}>DOC</Typography>
            </View>
          </View>
          <View style={styles.listItemFooter}>
            <Badge label="98% Match" variant="success" icon={<CheckCircle2 size={12} color={colors.aiBlue} />} />
            <TouchableOpacity><MoreVertical size={20} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        </Card>

        {/* Item 2 */}
        <Card style={styles.listItem}>
          <View style={styles.listItemRow}>
            <MessageSquare size={20} color={colors.textSecondary} />
            <View style={styles.listItemContent}>
              <Typography variant="labelMd">Customer feedback summary</Typography>
              <Typography variant="bodySm" color={colors.textSecondary}>Yesterday</Typography>
            </View>
            <View style={styles.listItemTag}>
              <Typography variant="labelSm" color={colors.textSecondary}>CHAT</Typography>
            </View>
          </View>
          <View style={styles.listItemFooter}>
            <Badge label="95% Match" variant="success" icon={<CheckCircle2 size={12} color={colors.aiBlue} />} />
            <TouchableOpacity><MoreVertical size={20} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        </Card>

        {/* Item 3 */}
        <Card style={styles.listItem}>
          <View style={styles.listItemRow}>
            <Calendar size={20} color={colors.textSecondary} />
            <View style={styles.listItemContent}>
              <Typography variant="labelMd">Weekly operations update</Typography>
              <Typography variant="bodySm" color={colors.textSecondary}>3 days ago</Typography>
            </View>
            <View style={styles.listItemTag}>
              <Typography variant="labelSm" color={colors.textSecondary}>LIST</Typography>
            </View>
          </View>
          <View style={styles.listItemFooter}>
            <Badge label="99% Match" variant="success" icon={<CheckCircle2 size={12} color={colors.aiBlue} />} />
            <TouchableOpacity><MoreVertical size={20} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        </Card>

        {/* Item 4 */}
        <Card style={styles.listItem}>
          <View style={styles.listItemRow}>
            <Globe size={20} color={colors.textSecondary} />
            <View style={styles.listItemContent}>
              <Typography variant="labelMd">Competitor article review</Typography>
              <Typography variant="bodySm" color={colors.textSecondary}>Oct 24</Typography>
            </View>
            <View style={styles.listItemTag}>
              <Typography variant="labelSm" color={colors.textSecondary}>URL</Typography>
            </View>
          </View>
          <View style={styles.listItemFooter}>
            <Badge label="92% Match" variant="success" icon={<CheckCircle2 size={12} color={colors.aiBlue} />} />
            <TouchableOpacity><MoreVertical size={20} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.gutter,
    paddingBottom: spacing.stackLg * 3, // Extra padding for bottom nav
  },
  headerSection: {
    marginBottom: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    marginBottom: spacing.stackMd,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: rounded.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.stackLg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.aiBlue,
    marginRight: 8,
  },
  aiCard: {
    backgroundColor: '#F0F4FF', // Soft blue tinted background for the AI card
    borderColor: '#D8E2FF',
    borderWidth: 1,
    padding: spacing.stackLg,
    marginBottom: spacing.stackLg,
    borderRadius: rounded.xl,
  },
  aiBadge: {
    marginBottom: spacing.stackMd,
  },
  aiCardTitle: {
    marginBottom: spacing.stackSm,
  },
  aiCardText: {
    marginBottom: spacing.stackLg,
  },
  aiButton: {
    alignSelf: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.stackLg,
  },
  gridCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.stackLg,
    marginBottom: spacing.stackMd,
    borderRadius: rounded.lg,
  },
  gridCardText: {
    marginTop: spacing.stackSm,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  list: {
    gap: spacing.stackMd,
  },
  listItem: {
    padding: spacing.stackMd,
    borderRadius: rounded.lg,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.stackMd,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.stackMd,
  },
  listItemTag: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
