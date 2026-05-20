import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { Implication } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ImplicationsListSection } from './ImplicationsListSection';

interface ImplicationsContentProps {
  implications: Implication[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onViewActions: (implicationId: string) => void;
}

export const ImplicationsContent: React.FC<ImplicationsContentProps> = ({
  implications,
  isRefreshing,
  onRefresh,
  onViewActions,
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
    <ImplicationsListSection implications={implications} onViewActions={onViewActions} />
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
