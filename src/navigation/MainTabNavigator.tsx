import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, LineChart, ListChecks, Clock } from 'lucide-react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AnalyzeScreen } from '../screens/AnalyzeScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { ActionsScreen } from '../screens/ActionsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { colors } from '../theme/colors';

interface TabBarIconProps {
  color: string;
  size: number;
}

export type MainTabParamList = {
  Dashboard: undefined;
  Analyze: undefined;
  Processing: { jobId?: string };
  Actions: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderDashboardIcon = ({ color, size }: TabBarIconProps) => (
  <LayoutGrid color={color} size={size} />
);

const renderAnalyzeIcon = ({ color, size }: TabBarIconProps) => (
  <LineChart color={color} size={size} />
);

const renderActionsIcon = ({ color, size }: TabBarIconProps) => (
  <ListChecks color={color} size={size} />
);

const renderHistoryIcon = ({ color, size }: TabBarIconProps) => (
  <Clock color={color} size={size} />
);

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: renderDashboardIcon,
        }}
      />
      <Tab.Screen
        name="Analyze"
        component={AnalyzeScreen}
        options={{
          tabBarIcon: renderAnalyzeIcon,
        }}
      />
      <Tab.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{
          tabBarIcon: renderAnalyzeIcon,
          tabBarLabel: 'Processing',
        }}
      />
      <Tab.Screen
        name="Actions"
        component={ActionsScreen}
        options={{
          tabBarIcon: renderActionsIcon,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: renderHistoryIcon,
        }}
      />
    </Tab.Navigator>
  );
};
