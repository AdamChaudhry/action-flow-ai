import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LayoutGrid } from 'lucide-react-native';
import { ActionsContent } from '../components/actions/ActionsContent';
import {
  ActionsFeedbackState,
  ActionsLoadingState,
} from '../components/actions/ActionsStateView';
import { Typography } from '../components/Typography';
import { colors } from '../theme/colors';
import { rounded, spacing } from '../theme/spacing';
import { useSubmitSimulation } from '../hooks/useSubmitSimulation';
import { useActionsJobId } from '../navigation/ActionsJobContext';
import { useAnalysisResult } from '../context/AnalysisResultContext';
import type { ActionsStackParamList } from '../navigation/ActionsStackNavigator';

type ActionsNavProp = NativeStackNavigationProp<ActionsStackParamList, 'ActionsList'>;
type ActionsRouteProp = RouteProp<ActionsStackParamList, 'ActionsList'>;

export const ActionsScreen: React.FC = () => {
  const route = useRoute<ActionsRouteProp>();
  const navigation = useNavigation<ActionsNavProp>();
  const contextJobId = useActionsJobId();
  const jobId = contextJobId ?? route.params?.jobId;
  const implicationId = route.params?.implicationId;

  // When true, ignore the implication filter and show all actions.
  const [showAll, setShowAll] = useState(false);

  const { result } = useAnalysisResult();
  const allActions = result?.recommendedActions ?? [];

  const { triggerSimulation, simulatingActionId } = useSubmitSimulation();

  const isFiltered = Boolean(implicationId) && !showAll;

  const filteredActions = useMemo(() => {
    if (!isFiltered) return allActions;
    return allActions.filter(act => act.relatedImplicationIds.includes(implicationId!));
  }, [allActions, isFiltered, implicationId]);

  const handleSimulate = useCallback(async (actionId: string) => {
    if (!jobId) { return; }
    await triggerSimulation(jobId, actionId);
  }, [jobId, triggerSimulation]);

  const handleViewResult = useCallback((simulationId: string) => {
    if (!jobId) { return; }
    navigation.navigate('SimulationResult', { jobId, simulationId });
  }, [jobId, navigation]);

  if (!result) {
    return <ActionsLoadingState />;
  }

  if (!jobId || allActions.length === 0) {
    return (
      <ActionsFeedbackState
        title="No actions yet"
        message="Run an analysis to generate recommended actions for your workflow."
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* ── "See All" toggle — only shown when a filter is active ── */}
      {implicationId && (
        <View style={styles.filterBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showAll ? 'Showing all actions' : 'See all actions'}
            onPress={() => setShowAll(v => !v)}
            style={({ pressed }) => [
              styles.seeAllButton,
              showAll && styles.seeAllButtonActive,
              pressed && styles.seeAllButtonPressed,
            ]}
          >
            <LayoutGrid
              size={14}
              color={showAll ? colors.primaryInverse : colors.textSecondary}
            />
            <Typography
              variant="labelMd"
              color={showAll ? colors.primaryInverse : colors.textSecondary}
            >
              {showAll
                ? `See Related Actions`
                : `See all ${allActions.length} actions`}
            </Typography>
          </Pressable>
        </View>
      )}

      <ActionsContent
        actions={filteredActions}
        isRefreshing={false}
        onRefresh={() => { }}
        onSimulate={handleSimulate}
        onViewResult={handleViewResult}
        simulatingActionId={simulatingActionId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackSm,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: rounded.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.border,
  },
  seeAllButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  seeAllButtonPressed: {
    opacity: 0.75,
  },
});
