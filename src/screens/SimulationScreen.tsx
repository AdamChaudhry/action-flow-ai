import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SimulationContent } from '../components/simulation/SimulationContent';
import {
  SimulationErrorState,
  SimulationLoadingState,
} from '../components/simulation/SimulationStateView';
import { StickyPageActions } from '../components/StickyPageActions';
import { colors } from '../theme/colors';
import { useActionSimulation } from '../hooks/useActionSimulation';
import type { ActionsStackParamList } from '../navigation/ActionsStackNavigator';

type SimulationNavigationProp = NativeStackNavigationProp<
  ActionsStackParamList,
  'SimulationResult'
>;
type SimulationRouteProp = RouteProp<ActionsStackParamList, 'SimulationResult'>;

export const SimulationScreen: React.FC = () => {
  const route = useRoute<SimulationRouteProp>();
  const navigation = useNavigation<SimulationNavigationProp>();
  const { jobId, simulationId } = route.params;

  const { simulation, isLoading, error } = useActionSimulation(
    jobId,
    simulationId,
  );

  if (isLoading) {
    return <SimulationLoadingState />;
  }

  if (error || !simulation) {
    return (
      <SimulationErrorState
        message={error ?? 'The simulation result could not be found.'}
        onBack={navigation.goBack}
      />
    );
  }

  return (
    <View style={styles.outer}>
      <SimulationContent simulation={simulation} simulationId={simulationId} />
      <StickyPageActions
        nextTitle="Complete"
        onBack={navigation.goBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
