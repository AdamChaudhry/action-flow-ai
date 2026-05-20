import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InsightsContent } from '../components/insights/InsightsContent';
import {
  InsightsFeedbackState,
  InsightsLoadingState,
} from '../components/insights/InsightsStateView';
import { colors } from '../theme/colors';
import { getAnalysisResult } from '../services/analysisApi';
import { useAnalysisResult } from '../context/AnalysisResultContext';
import type { Insight } from '../types/analysis';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';

type InsightsRouteProp = RouteProp<AnalyzeStackParamList, 'Insights'>;
type InsightsNavigationProp = NativeStackNavigationProp<AnalyzeStackParamList, 'Insights'>;

export const InsightsScreen: React.FC = () => {
  const route      = useRoute<InsightsRouteProp>();
  const navigation = useNavigation<InsightsNavigationProp>();
  const jobId      = route.params?.jobId;

  const { result, setResult } = useAnalysisResult();

  const [insights, setInsights]   = useState<Insight[]>(result?.insights ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchResult = useCallback(() => {
    if (!jobId) { return; }

    setIsLoading(true);
    setError(null);

    getAnalysisResult(jobId)
      .then(r => {
        // Cache the full result in context so implications/actions screens
        // can use it directly without additional API calls.
        setResult(r);
        setInsights(r.insights ?? []);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load insights.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [jobId, setResult]);

  useEffect(() => {
    // If we already have a cached result for this job, use it directly.
    if (result && result.jobId === jobId) {
      setInsights(result.insights ?? []);
      return;
    }
    fetchResult();
  }, [jobId]); // eslint-disable-line react-hooks/exhaustive-deps

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
        onRetry={fetchResult}
      />
    );
  }

  if (!isLoading && insights.length === 0) {
    return (
      <InsightsFeedbackState
        title="No insights yet"
        message="Insights will appear here once the analysis is complete."
        onRetry={fetchResult}
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <InsightsContent
        insights={insights}
        isRefreshing={isLoading}
        onRefresh={fetchResult}
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
