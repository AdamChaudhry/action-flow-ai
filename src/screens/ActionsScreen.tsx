import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActionsContent } from '../components/actions/ActionsContent';
import {
  ActionsFeedbackState,
  ActionsLoadingState,
} from '../components/actions/ActionsStateView';
import { StickyPageActions } from '../components/StickyPageActions';
import { colors } from '../theme/colors';
import { useRecommendedActions } from '../hooks/useRecommendedActions';
import { useSubmitSimulation } from '../hooks/useSubmitSimulation';
import { useActionsJobId } from '../navigation/ActionsJobContext';
import type { ActionsStackParamList } from '../navigation/ActionsStackNavigator';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type ActionsNavProp = NativeStackNavigationProp<ActionsStackParamList, 'ActionsList'>;
type ActionsRouteProp = RouteProp<ActionsStackParamList, 'ActionsList'>;
type RootTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export const ActionsScreen: React.FC = () => {
  const route      = useRoute<ActionsRouteProp>();
  const navigation = useNavigation<ActionsNavProp>();
  const contextJobId = useActionsJobId();
  const jobId = contextJobId ?? route.params?.jobId;

  const { actions, isLoading, error, refetch } = useRecommendedActions(jobId);
  const { triggerSimulation, isSubmitting }     = useSubmitSimulation();

  const navigateToImplications = useCallback(() => {
    navigation.getParent<RootTabNavigationProp>()?.navigate('Analyze', {
      screen: 'Implications',
      params: { jobId },
    });
  }, [jobId, navigation]);

  const handleSimulate = useCallback(async (actionId: string) => {
    if (!jobId) { return; }
    const simulationId = await triggerSimulation(jobId, actionId);
    if (simulationId) {
      navigation.navigate('SimulationResult', { jobId, simulationId });
    }
  }, [jobId, triggerSimulation, navigation]);

  if (isLoading && actions.length === 0) {
    return <ActionsLoadingState />;
  }

  if (error && actions.length === 0) {
    return (
      <ActionsFeedbackState
        title="Something went wrong"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!jobId || (!isLoading && actions.length === 0)) {
    return (
      <ActionsFeedbackState
        title="No actions yet"
        message="Run an analysis to generate recommended actions for your workflow."
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ActionsContent
        actions={actions}
        isRefreshing={isLoading}
        onRefresh={refetch}
        onSimulate={handleSimulate}
        isSimulating={isSubmitting}
      />
      <StickyPageActions
        previousTitle="Implications"
        nextTitle="Simulation"
        onPrevious={navigateToImplications}
        isNextDisabled
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
