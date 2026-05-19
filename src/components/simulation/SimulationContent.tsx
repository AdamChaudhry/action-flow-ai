import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ActionSimulation } from '../../types/analysis';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { STICKY_PAGE_ACTIONS_HEIGHT } from '../StickyPageActions';
import { SimulationHeroCard } from './SimulationHeroCard';
import { SimulationTargetAction } from './SimulationTargetAction';
import { SimulationMetricTransitionsSection } from './SimulationMetricTransitionsSection';
import {
  SimulationAssumptionsSection,
  SimulationEvidenceSection,
  SimulationRisksSection,
} from './SimulationSections';
import { SimulationOutcomeScore } from './SimulationOutcomeScore';
import { SimulationProjectedOutcome } from './SimulationProjectedOutcome';

interface SimulationContentProps {
  simulation: ActionSimulation;
}

/**
 * Full simulation result layout matching the updated design:
 *
 *  1. Hero (simulation ID, title, confidence badge)
 *  2. Target Action card (action title, owner, duration, type)
 *  3. Expected Metric Transitions
 *  4. Key Assumptions
 *  5. Remaining Risks
 *  6. Evidence Used
 *  7. Overall Outcome Score (dark animated circle)
 *  8. Projected Outcome
 *  ─────────────────────────────────────────
 */
export const SimulationContent: React.FC<SimulationContentProps> = ({
  simulation,
}) => {
  const expectedChanges = simulation.expectedChanges ?? [];
  const assumptions     = simulation.assumptions     ?? [];
  const risks           = simulation.risks           ?? [];
  const evidenceUsed    = simulation.evidenceUsed    ?? [];

  return (
    <View style={styles.outer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 ─ Hero header */}
        <SimulationHeroCard
          actionId={simulation.actionId}
          actionTitle={simulation.actionTitle}
          confidence={simulation.confidence ?? 0}
        />

        {/* 2 ─ Target action */}
        <SimulationTargetAction
          actionTitle={simulation.actionTitle}
          actionType={simulation.actionType}
          parameters={simulation.parameters ?? {}}
        />

        {/* 3 ─ Metric transitions */}
        <SimulationMetricTransitionsSection changes={expectedChanges} />

        {/* 4 ─ Key assumptions */}
        {assumptions.length > 0 && (
          <SimulationAssumptionsSection items={assumptions} />
        )}

        {/* 5 ─ Remaining risks */}
        {risks.length > 0 && (
          <SimulationRisksSection items={risks} />
        )}

        {/* 6 ─ Evidence used */}
        {evidenceUsed.length > 0 && (
          <SimulationEvidenceSection items={evidenceUsed} />
        )}

        {/* 7 ─ Overall outcome score */}
        <SimulationOutcomeScore confidence={simulation.confidence ?? 0} />

        {/* 8 ─ Projected outcome */}
        {simulation.projectedOutcome ? (
          <SimulationProjectedOutcome text={simulation.projectedOutcome} />
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer:         { flex: 1, backgroundColor: colors.background },
  scroll:        { flex: 1 },
  content:       { padding: spacing.marginMobile, gap: spacing.stackMd },
  bottomSpacer:  { height: STICKY_PAGE_ACTIONS_HEIGHT },
});
