import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, FileText, Globe, MessageSquare } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import {
  RecentAnalysisCard,
  type RecentAnalysisItem,
} from './RecentAnalysisCard';

const recentAnalyses: RecentAnalysisItem[] = [
  {
    id: 'sales-report',
    title: 'Sales report analysis',
    timestamp: '2 hours ago',
    typeLabel: 'DOC',
    matchLabel: '98% Match',
    icon: <FileText size={20} color={colors.textSecondary} />,
  },
  {
    id: 'customer-feedback',
    title: 'Customer feedback summary',
    timestamp: 'Yesterday',
    typeLabel: 'CHAT',
    matchLabel: '95% Match',
    icon: <MessageSquare size={20} color={colors.textSecondary} />,
  },
  {
    id: 'weekly-operations',
    title: 'Weekly operations update',
    timestamp: '3 days ago',
    typeLabel: 'LIST',
    matchLabel: '99% Match',
    icon: <Calendar size={20} color={colors.textSecondary} />,
  },
  {
    id: 'competitor-article',
    title: 'Competitor article review',
    timestamp: 'Oct 24',
    typeLabel: 'URL',
    matchLabel: '92% Match',
    icon: <Globe size={20} color={colors.textSecondary} />,
  },
];

interface RecentAnalysesSectionProps {
  onViewAll: () => void;
}

export const RecentAnalysesSection: React.FC<RecentAnalysesSectionProps> = ({
  onViewAll,
}) => (
  <>
    <View style={styles.header}>
      <Typography variant="headlineMd">Recent Analyses</Typography>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="View all analyses"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={onViewAll}
      >
        <Typography variant="labelMd" color={colors.aiBlue}>
          View All
        </Typography>
      </TouchableOpacity>
    </View>

    <View style={styles.list}>
      {recentAnalyses.map(item => (
        <RecentAnalysisCard key={item.id} item={item} />
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  list: {
    gap: spacing.stackMd,
  },
});
