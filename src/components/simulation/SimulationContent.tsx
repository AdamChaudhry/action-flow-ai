import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ActionSimulation } from '../../types/analysis';
import { spacing } from '../../theme/spacing';
import { SimulationHeroCard } from './SimulationHeroCard';
import { SimulationMetricTransitionsSection } from './SimulationMetricTransitionsSection';
import {
  SimulationAssumptionsSection,
  SimulationEvidenceSection,
  SimulationRisksSection,
} from './SimulationSections';

interface SimulationContentProps {
  simulation: ActionSimulation;
}

export const SimulationContent: React.FC<SimulationContentProps> = ({
  simulation,
}) => (
  <ScrollView
    style={styles.scroll}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <SimulationHeroCard
      actionTitle={simulation.actionTitle}
      projectedOutcome={simulation.projectedOutcome}
      confidence={simulation.confidence}
      actionId={simulation.actionId}
    />

    <SimulationMetricTransitionsSection
      changes={simulation.expectedChanges}
    />

    {simulation.assumptions.length > 0 && (
      <SimulationAssumptionsSection items={simulation.assumptions} />
    )}

    {simulation.risks.length > 0 && (
      <SimulationRisksSection items={simulation.risks} />
    )}

    {simulation.evidenceUsed.length > 0 && (
      <SimulationEvidenceSection items={simulation.evidenceUsed} />
    )}

    <View style={styles.bottomSpacer} />
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: 24,
  },
});
