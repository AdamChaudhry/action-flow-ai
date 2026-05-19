import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { Implication } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { STICKY_PAGE_ACTIONS_HEIGHT } from '../StickyPageActions';
import { ImplicationsListSection } from './ImplicationsListSection';

interface ImplicationsContentProps {
  implications: Implication[];
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ImplicationsContent: React.FC<ImplicationsContentProps> = ({
  implications,
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
    <ImplicationsListSection implications={implications} />
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
    height: STICKY_PAGE_ACTIONS_HEIGHT,
  },
});
