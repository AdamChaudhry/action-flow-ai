import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ActionsContent } from '../components/actions/ActionsContent';
import {
  ActionsFeedbackState,
  ActionsLoadingState,
} from '../components/actions/ActionsStateView';
import { useRecommendedActions } from '../hooks/useRecommendedActions';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type ActionsRouteProp = RouteProp<MainTabParamList, 'Actions'>;

export const ActionsScreen: React.FC = () => {
  const route = useRoute<ActionsRouteProp>();
  const jobId = route.params?.jobId;

  const { actions, isLoading, error, refetch } = useRecommendedActions(jobId);

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
    />
  );
};
