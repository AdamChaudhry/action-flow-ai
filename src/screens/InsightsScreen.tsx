import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InsightsContent } from '../components/insights/InsightsContent';
import {
  InsightsFeedbackState,
  InsightsLoadingState,
} from '../components/insights/InsightsStateView';
import { InsightsStickyCta } from '../components/insights/InsightsStickyCta';
import { colors } from '../theme/colors';
import { useInsights } from '../hooks/useInsights';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type InsightsRouteProp = RouteProp<AnalyzeStackParamList, 'Insights'>;
type InsightsNavigationProp = NativeStackNavigationProp<
  AnalyzeStackParamList,
  'Insights'
>;
type RootTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export const InsightsScreen: React.FC = () => {
  const route = useRoute<InsightsRouteProp>();
  const navigation = useNavigation<InsightsNavigationProp>();
  const jobId = route.params?.jobId;

  const { insights, isLoading, error, refetch } = useInsights(jobId);

  const navigateToActions = useCallback(() => {
    navigation.getParent<RootTabNavigationProp>()?.jumpTo('Actions');
  }, [navigation]);

  if (isLoading && insights.length === 0) {
    return <InsightsLoadingState />;
  }

  if (error && insights.length === 0) {
    return (
      <InsightsFeedbackState
        title="Something went wrong"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!isLoading && insights.length === 0) {
    return (
      <InsightsFeedbackState
        title="No insights yet"
        message="Insights will appear here once the analysis is complete."
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <InsightsContent
        insights={insights}
        isRefreshing={isLoading}
        onRefresh={refetch}
      />
      <InsightsStickyCta onPress={navigateToActions} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
