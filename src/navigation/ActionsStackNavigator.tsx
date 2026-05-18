import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActionsScreen } from '../screens/ActionsScreen';
import { SimulationScreen } from '../screens/SimulationScreen';
import { ActionsJobProvider } from './ActionsJobContext';
import type { MainTabParamList } from './MainTabNavigator';

export type ActionsStackParamList = {
  ActionsList: { jobId?: string } | undefined;
  SimulationResult: { jobId: string; simulationId: string };
};

const Stack = createNativeStackNavigator<ActionsStackParamList>();

/**
 * Stack navigator for the Actions tab:
 *   ActionsList → SimulationResult
 *
 * Reads the jobId from the parent tab route and exposes it to nested screens.
 */
export const ActionsStackNavigator: React.FC = () => {
  const route = useRoute<RouteProp<MainTabParamList, 'Actions'>>();
  const jobId = route.params?.jobId;

  return (
    <ActionsJobProvider value={jobId}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ActionsList" component={ActionsScreen} />
        <Stack.Screen name="SimulationResult" component={SimulationScreen} />
      </Stack.Navigator>
    </ActionsJobProvider>
  );
};
