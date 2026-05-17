import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { RecommendedAction } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ActionsListSection } from './ActionsListSection';

interface ActionsContentProps {
  actions: RecommendedAction[];
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ActionsContent: React.FC<ActionsContentProps> = ({
  actions,
  isRefreshing,
  onRefresh,
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
    <ActionsListSection actions={actions} />
    <View style={styles.bottomSpacer} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: 32,
  },
});
