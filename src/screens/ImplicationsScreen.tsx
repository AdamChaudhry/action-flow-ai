import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImplicationsContent } from '../components/implications/ImplicationsContent';
import {
  ImplicationsFeedbackState,
  ImplicationsLoadingState,
} from '../components/implications/ImplicationsStateView';
import { ImplicationsStickyCta } from '../components/implications/ImplicationsStickyCta';
import { colors } from '../theme/colors';
import { useImplications } from '../hooks/useImplications';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type ImplicationsNavProp = NativeStackNavigationProp<
  AnalyzeStackParamList,
  'Implications'
>;
type ImplicationsRouteProp = RouteProp<AnalyzeStackParamList, 'Implications'>;
type RootTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export const ImplicationsScreen: React.FC = () => {
  const route = useRoute<ImplicationsRouteProp>();
  const navigation = useNavigation<ImplicationsNavProp>();
  const jobId = route.params?.jobId;

  const { implications, isLoading, error, refetch } = useImplications(jobId);

  const navigateToActions = useCallback(() => {
    navigation.getParent<RootTabNavigationProp>()?.jumpTo('Actions');
  }, [navigation]);

  if (isLoading && implications.length === 0) {
    return <ImplicationsLoadingState />;
  }

  if (error && implications.length === 0) {
    return (
      <ImplicationsFeedbackState
        title="Something went wrong"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!isLoading && implications.length === 0) {
    return (
      <ImplicationsFeedbackState
        title="No implications yet"
        message="Implications will appear once the analysis identifies business impacts."
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ImplicationsContent
        implications={implications}
        isRefreshing={isLoading}
        onRefresh={refetch}
      />
      <ImplicationsStickyCta onPress={navigateToActions} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
