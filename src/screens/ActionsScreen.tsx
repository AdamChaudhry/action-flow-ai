import React, { useCallback } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActionsContent } from '../components/actions/ActionsContent';
import {
  ActionsFeedbackState,
  ActionsLoadingState,
} from '../components/actions/ActionsStateView';
import { useRecommendedActions } from '../hooks/useRecommendedActions';
import { useSubmitSimulation } from '../hooks/useSubmitSimulation';
import type { ActionsStackParamList } from '../navigation/ActionsStackNavigator';

type ActionsNavProp = NativeStackNavigationProp<ActionsStackParamList, 'ActionsList'>;
type ActionsRouteProp = RouteProp<ActionsStackParamList, 'ActionsList'>;

export const ActionsScreen: React.FC = () => {
  const route      = useRoute<ActionsRouteProp>();
  const navigation = useNavigation<ActionsNavProp>();
  const jobId      = route.params?.jobId;

  const { actions, isLoading, error, refetch } = useRecommendedActions(jobId);
  const { triggerSimulation, isSubmitting }     = useSubmitSimulation();

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
    <ActionsContent
      actions={actions}
      isRefreshing={isLoading}
      onRefresh={refetch}
      onSimulate={handleSimulate}
      isSimulating={isSubmitting}
    />
  );
};
