import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImplicationsContent } from '../components/implications/ImplicationsContent';
import {
  ImplicationsFeedbackState,
  ImplicationsLoadingState,
} from '../components/implications/ImplicationsStateView';
import { colors } from '../theme/colors';
import { useAnalysisResult } from '../context/AnalysisResultContext';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type ImplicationsNavProp = NativeStackNavigationProp<AnalyzeStackParamList, 'Implications'>;
type ImplicationsRouteProp = RouteProp<AnalyzeStackParamList, 'Implications'>;
type RootTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export const ImplicationsScreen: React.FC = () => {
  const route      = useRoute<ImplicationsRouteProp>();
  const navigation = useNavigation<ImplicationsNavProp>();
  const jobId      = route.params?.jobId;

  // Read directly from the cached result — no API call needed.
  const { result } = useAnalysisResult();
  const implications = result?.implications ?? [];

  const navigateToActions = useCallback((implicationId: string) => {
    navigation.getParent<RootTabNavigationProp>()?.navigate('Actions', {
      screen: 'ActionsList',
      params: { jobId, implicationId },
    } as any);
  }, [navigation, jobId]);

  const filteredImplications = useMemo(() => {
    if (!route.params?.insightId) return implications;
    return implications.filter(imp => imp.relatedInsightIds.includes(route.params!.insightId!));
  }, [implications, route.params?.insightId]);

  // Context not loaded yet (shouldn't normally happen — InsightsScreen always runs first).
  if (!result) {
    return <ImplicationsLoadingState />;
  }

  if (filteredImplications.length === 0) {
    return (
      <ImplicationsFeedbackState
        title="No implications"
        message="No implications are linked to this insight."
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ImplicationsContent
        implications={filteredImplications}
        isRefreshing={false}
        onRefresh={() => {}}
        onViewActions={navigateToActions}
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
