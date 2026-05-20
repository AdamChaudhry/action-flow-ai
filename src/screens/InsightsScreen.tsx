import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InsightsContent } from '../components/insights/InsightsContent';
import {
  InsightsFeedbackState,
  InsightsLoadingState,
} from '../components/insights/InsightsStateView';
import { colors } from '../theme/colors';
import { useInsights } from '../hooks/useInsights';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';

type InsightsRouteProp = RouteProp<AnalyzeStackParamList, 'Insights'>;
type InsightsNavigationProp = NativeStackNavigationProp<
  AnalyzeStackParamList,
  'Insights'
>;

export const InsightsScreen: React.FC = () => {
  const route = useRoute<InsightsRouteProp>();
  const navigation = useNavigation<InsightsNavigationProp>();
  const jobId = route.params?.jobId;

  const { insights, isLoading, error, refetch } = useInsights(jobId);

  const navigateToImplications = useCallback((insightId: string) => {
    navigation.navigate('Implications', { jobId, insightId });
  }, [navigation, jobId]);

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
        onViewImplications={navigateToImplications}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
