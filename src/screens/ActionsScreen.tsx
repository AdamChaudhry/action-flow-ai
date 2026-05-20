import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
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

type ActionsNavProp = NativeStackNavigationProp<ActionsStackParamList, 'ActionsList'>;
type ActionsRouteProp = RouteProp<ActionsStackParamList, 'ActionsList'>;

export const ActionsScreen: React.FC = () => {
  const route      = useRoute<ActionsRouteProp>();
  const navigation = useNavigation<ActionsNavProp>();
  const contextJobId = useActionsJobId();
  const jobId = contextJobId ?? route.params?.jobId;
  const implicationId = route.params?.implicationId;

  const { actions, isLoading, error, refetch } = useRecommendedActions(jobId);
  const { triggerSimulation, isSubmitting }     = useSubmitSimulation();

  const filteredActions = useMemo(() => {
    if (!implicationId) return actions;
    return actions.filter(act => act.relatedImplicationIds.includes(implicationId));
  }, [actions, implicationId]);

  const handleSimulate = useCallback(async (actionId: string) => {
    if (!jobId) { return; }
    const simulationId = await triggerSimulation(jobId, actionId);
    if (simulationId) {
      navigation.navigate('SimulationResult', { jobId, simulationId });
    }
  }, [jobId, triggerSimulation, navigation]);

  if (isLoading && filteredActions.length === 0) {
    return <ActionsLoadingState />;
  }

  if (error && filteredActions.length === 0) {
    return (
      <ActionsFeedbackState
        title="Something went wrong"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!jobId || (!isLoading && filteredActions.length === 0)) {
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
        actions={filteredActions}
        isRefreshing={isLoading}
        onRefresh={refetch}
        onSimulate={handleSimulate}
        isSimulating={isSubmitting}
      />
      <StickyPageActions
        nextTitle="Simulation"
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
