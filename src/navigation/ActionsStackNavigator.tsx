import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActionsScreen } from '../screens/ActionsScreen';
import { SimulationScreen } from '../screens/SimulationScreen';
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
 * Reads the jobId from the parent tab route and forwards it
 * as initial params to ActionsList.
 */
export const ActionsStackNavigator: React.FC = () => {
  const route = useRoute<RouteProp<MainTabParamList, 'Actions'>>();
  const jobId = route.params?.jobId;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ActionsList"
        component={ActionsScreen}
        initialParams={{ jobId }}
      />
      <Stack.Screen name="SimulationResult" component={SimulationScreen} />
    </Stack.Navigator>
  );
};
