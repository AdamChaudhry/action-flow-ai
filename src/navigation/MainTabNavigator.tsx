import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { AnalyzeStackNavigator } from './AnalyzeStackNavigator';
import { ActionsStackNavigator } from './ActionsStackNavigator';
import type { AnalyzeStackParamList } from './AnalyzeStackNavigator';

export type MainTabParamList = {
  Analyze: NavigatorScreenParams<AnalyzeStackParamList> | undefined;
  Actions: { jobId?: string } | undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tab.Screen
        name="Analyze"
        component={AnalyzeStackNavigator}
      />
      <Tab.Screen
        name="Actions"
        component={ActionsStackNavigator}
      />
    </Tab.Navigator>
  );
};
