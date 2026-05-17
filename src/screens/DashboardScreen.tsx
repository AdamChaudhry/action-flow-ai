import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AnalysisStatusPill } from '../components/dashboard/AnalysisStatusPill';
import { DashboardHeaderSection } from '../components/dashboard/DashboardHeaderSection';
import { IntelligenceEngineCard } from '../components/dashboard/IntelligenceEngineCard';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { RecentAnalysesSection } from '../components/dashboard/RecentAnalysesSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type DashboardNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Dashboard'
>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();

  const navigateToAnalyze = useCallback(() => {
    navigation.jumpTo('Analyze');
  }, [navigation]);

  const navigateToHistory = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DashboardHeaderSection />
      <AnalysisStatusPill label="Ready to analyze new content" />
      <IntelligenceEngineCard onStartAnalysis={navigateToAnalyze} />
      <QuickActionsGrid onActionPress={navigateToAnalyze} />
      <RecentAnalysesSection onViewAll={navigateToHistory} />
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
    paddingBottom: spacing.stackLg * 3,
  },
});
