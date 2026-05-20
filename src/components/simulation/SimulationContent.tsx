import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ActionSimulation } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { STICKY_PAGE_ACTIONS_HEIGHT } from '../StickyPageActions';
import { toDisplayTextArray } from '../../utils/displayText';
import { SimulationHeroCard } from './SimulationHeroCard';
import { SimulationMetricTransitionsSection } from './SimulationMetricTransitionsSection';
import {
  SimulationAssumptionsSection,
  SimulationEvidenceSection,
  SimulationRisksSection,
} from './SimulationSections';
import { SimulationProjectedOutcome } from './SimulationProjectedOutcome';

interface SimulationContentProps {
  simulation: ActionSimulation;
  /** Firestore document ID for this simulation record. */
  simulationId: string;
}

export const SimulationContent: React.FC<SimulationContentProps> = ({
  simulation,
  simulationId,
}) => {
  const expectedChanges = simulation.expectedChanges ?? [];
  const assumptions = toDisplayTextArray(simulation.assumptions);
  const risks = toDisplayTextArray(simulation.risks);
  const evidenceUsed = toDisplayTextArray(simulation.evidenceUsed);

  return (
    <View style={styles.outer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SimulationHeroCard
          simulationId={simulationId}
          actionTitle={simulation.actionTitle}
          confidence={simulation.confidence ?? 0}
        />

        {simulation.projectedOutcome ? (
          <SimulationProjectedOutcome text={simulation.projectedOutcome} />
        ) : null}

        {assumptions.length > 0 && (
          <SimulationAssumptionsSection items={assumptions} />
        )}

        <SimulationMetricTransitionsSection changes={expectedChanges} />

        {evidenceUsed.length > 0 && (
          <SimulationEvidenceSection items={evidenceUsed} />
        )}

        {risks.length > 0 && (
          <SimulationRisksSection items={risks} />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: STICKY_PAGE_ACTIONS_HEIGHT,
  },
});
