import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnalyzeScreen } from '../screens/AnalyzeScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { ImplicationsScreen } from '../screens/ImplicationsScreen';

export type AnalyzeStackParamList = {
  AnalyzeInput: undefined;
  Processing: { jobId?: string };
  Insights: { jobId?: string };
  Implications: { jobId?: string };
};

const Stack = createNativeStackNavigator<AnalyzeStackParamList>();

/**
 * Stack navigator for the Analyze flow:
 *   AnalyzeInput → Processing → Insights → Implications
 */
export const AnalyzeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyzeInput" component={AnalyzeScreen} />
      <Stack.Screen name="Processing" component={ProcessingScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="Implications" component={ImplicationsScreen} />
    </Stack.Navigator>
  );
};
