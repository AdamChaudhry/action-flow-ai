import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CheckCircle2, MoreVertical } from 'lucide-react-native';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

export interface RecentAnalysisItem {
  id: string;
  title: string;
  timestamp: string;
  typeLabel: string;
  matchLabel: string;
  icon: React.ReactNode;
}

interface RecentAnalysisCardProps {
  item: RecentAnalysisItem;
}

export const RecentAnalysisCard: React.FC<RecentAnalysisCardProps> = ({
  item,
}) => (
  <Card style={styles.card}>
    <View style={styles.row}>
      {item.icon}
      <View style={styles.content}>
        <Typography variant="labelMd">{item.title}</Typography>
        <Typography variant="bodySm" color={colors.textSecondary}>
          {item.timestamp}
        </Typography>
      </View>
      <View style={styles.typeTag}>
        <Typography variant="labelSm" color={colors.textSecondary}>
          {item.typeLabel}
        </Typography>
      </View>
    </View>
    <View style={styles.footer}>
      <Badge
        label={item.matchLabel}
        variant="success"
        icon={<CheckCircle2 size={12} color={colors.aiBlue} />}
      />
      <TouchableOpacity
        accessibilityLabel={`More options for ${item.title}`}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MoreVertical size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.stackMd,
    borderRadius: rounded.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.stackMd,
  },
  content: {
    flex: 1,
    marginLeft: spacing.stackMd,
  },
  typeTag: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: rounded.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
