import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnalyzeScreen } from '../screens/AnalyzeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { ImplicationsScreen } from '../screens/ImplicationsScreen';

export type AnalyzeStackParamList = {
  AnalyzeInput: { resetToken?: number } | undefined;
  Insights: { jobId?: string };
  Implications: { jobId?: string };
};

const Stack = createNativeStackNavigator<AnalyzeStackParamList>();

/**
 * Stack navigator for the Analyze flow:
 *   AnalyzeInput -> Insights -> Implications
 */
export const AnalyzeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyzeInput" component={AnalyzeScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="Implications" component={ImplicationsScreen} />
    </Stack.Navigator>
  );
};
