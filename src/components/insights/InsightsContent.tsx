import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { Insight } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { InsightsListSection } from './InsightsListSection';

interface InsightsContentProps {
  insights: Insight[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onViewImplications: (insightId: string) => void;
}

export const InsightsContent: React.FC<InsightsContentProps> = ({
  insights,
  isRefreshing,
  onRefresh,
  onViewImplications,
}) => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        tintColor={colors.aiBlue}
      />
    }
  >
    <InsightsListSection insights={insights} onViewImplications={onViewImplications} />
    <View style={styles.bottomSpacer} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: spacing.stackLg,
  },
});
