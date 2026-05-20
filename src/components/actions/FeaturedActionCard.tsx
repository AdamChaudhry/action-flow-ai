import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AlertCircle, Eye, RefreshCw } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';
import type { ActionPriority, RecommendedAction } from '../../types/analysis';
import { toDisplayText } from '../../utils/displayText';

const PRIORITY_TOKEN: Record<ActionPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: '#EF4444', text: '#FFFFFF', label: 'Critical Priority' },
  high: { bg: '#F87171', text: '#FFFFFF', label: 'High Priority' },
  medium: { bg: '#0F172A', text: '#FFFFFF', label: 'Medium Priority' },
  low: { bg: '#94A3B8', text: '#FFFFFF', label: 'Low Priority' },
};

type Level = 'high' | 'medium' | 'low';

const LEVEL_COLOR: Record<Level, string> = {
  high: '#059669',
  medium: '#D97706',
  low: '#3B82F6',
};

interface FeaturedActionCardProps {
  action: RecommendedAction;
  onSimulate?: () => void;
  onViewResult?: () => void;
  isSimulating?: boolean;
  /** True once at least one simulation has completed for this action. */
  isSimulated?: boolean;
}

interface ActionButtonsProps {
  requiresHumanApproval: boolean;
  onSimulate?: () => void;
  onViewResult?: () => void;
  isSimulating?: boolean;
  isSimulated?: boolean;
}

const PriorityBadge: React.FC<{ priority: ActionPriority }> = ({ priority }) => {
  const token = PRIORITY_TOKEN[priority] ?? PRIORITY_TOKEN.medium;

  return (
    <View style={[badge.container, { backgroundColor: token.bg }]}>
      <Typography variant="labelSm" color={token.text}>
        {token.label}
      </Typography>
    </View>
  );
};

const MetricRow: React.FC<{ label: string; value: Level }> = ({ label, value }) => (
  <View style={metric.row}>
    <Typography variant="labelSm" color={colors.textTertiary} style={metric.label}>
      {label}
    </Typography>
    <View style={metric.valueRow}>
      <View style={[metric.dot, { backgroundColor: LEVEL_COLOR[value] }]} />
      <Typography variant="bodyMd" color={LEVEL_COLOR[value]} style={metric.valueText}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Typography>
    </View>
  </View>
);

function deriveImpactLevel(expectedImpact: unknown): Level {
  const lower = toDisplayText(expectedImpact).toLowerCase();
  if (lower.includes('significant') || lower.includes('critical') || lower.includes('major')) {
    return 'high';
  }
  if (lower.includes('moderate') || lower.includes('medium')) {
    return 'medium';
  }
  return 'high';
}

function deriveEffortLevel(priority: ActionPriority): Level {
  return priority === 'critical' || priority === 'high' ? 'medium' : 'low';
}

function deriveRiskLevel(priority: ActionPriority): Level {
  if (priority === 'critical') {
    return 'high';
  }
  return priority === 'high' ? 'medium' : 'low';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  requiresHumanApproval,
  onSimulate,
  onViewResult,
  isSimulating,
  isSimulated,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSimulating) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => { animation.stop(); };
  }, [isSimulating, pulse]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, speed: 28, bounciness: 4, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, speed: 28, bounciness: 5, useNativeDriver: true }).start();
  };

  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.22] });
  const pulseScale   = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  // ── Simulated state: View Result + Rerun ─────────────────────────────────
  if (isSimulated) {
    return (
      <View style={button.row}>
        {/* View Simulation Result */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View simulation result"
          style={[button.simulate, button.viewResult]}
          onPress={onViewResult}
        >
          <Eye size={14} color={colors.primary} />
          <Typography variant="labelMd" color={colors.primary}>View Result</Typography>
        </Pressable>

        {/* Rerun Simulation */}
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rerun simulation"
            accessibilityState={{ busy: Boolean(isSimulating), disabled: Boolean(isSimulating) }}
            disabled={isSimulating}
            onPress={onSimulate}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[button.simulate, button.rerun, isSimulating && button.simulateBusy]}
          >
            {isSimulating ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <RefreshCw size={14} color={colors.textSecondary} />
            )}
            <Typography variant="labelMd" color={colors.textSecondary}>
              {isSimulating ? 'Running...' : 'Rerun'}
            </Typography>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // ── Default state: Simulate ───────────────────────────────────────────────
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Simulate action"
        accessibilityState={{
          busy: Boolean(isSimulating),
          disabled: Boolean(isSimulating),
        }}
        disabled={isSimulating}
        onPress={onSimulate}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[button.simulate, button.simulatePrimary, isSimulating && button.simulateBusy]}
      >
        {isSimulating && (
          <Animated.View
            pointerEvents="none"
            style={[
              button.pulseOverlay,
              { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
            ]}
          />
        )}
        {isSimulating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <RefreshCw size={14} color="#FFFFFF" />
        )}
        <Typography variant="labelMd" color="#FFFFFF">
          {isSimulating
            ? requiresHumanApproval ? 'Starting...' : 'Simulating...'
            : 'Simulate'}
        </Typography>
      </Pressable>
    </Animated.View>
  );
};

export const FeaturedActionCard: React.FC<FeaturedActionCardProps> = ({
  action,
  onSimulate,
  onViewResult,
  isSimulating,
  isSimulated,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const impactLevel = deriveImpactLevel(action.expectedImpact);
  const effortLevel = deriveEffortLevel(action.priority);
  const riskLevel = deriveRiskLevel(action.priority);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [action.id, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <PriorityBadge priority={action.priority} />

      <Typography variant="headlineLg" style={styles.title}>
        {toDisplayText(action.title)}
      </Typography>

      <View style={styles.metricsSection}>
        <MetricRow label="EXPECTED IMPACT" value={impactLevel} />
        <MetricRow label="EFFORT" value={effortLevel} />
        <MetricRow label="RISK" value={riskLevel} />
      </View>

      <View style={styles.quoteBlock}>
        <AlertCircle size={14} color={colors.aiBlue} style={styles.quoteIcon} />
        <View style={styles.quoteBody}>
          <Typography variant="bodySm" color={colors.textSecondary} style={styles.quoteText}>
            "{toDisplayText(action.description)}"
          </Typography>
          <View style={styles.progressBar} />
        </View>
      </View>

      <ActionButtons
        requiresHumanApproval={action.requiresHumanApproval}
        onSimulate={onSimulate}
        onViewResult={onViewResult}
        isSimulating={isSimulating}
        isSimulated={isSimulated}
      />
    </Animated.View>
  );
};

const badge = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
});

const metric = StyleSheet.create({
  row: { marginBottom: 6 },
  label: { letterSpacing: 0.6, marginBottom: 3 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  valueText: { fontWeight: '600' },
});

const button = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.stackSm,
  },
  simulate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
    borderRadius: rounded.md,
    paddingVertical: 12,
  },
  simulatePrimary: {
    backgroundColor: colors.primary,
  },
  viewResult: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rerun: {
    flex: 0,
    paddingHorizontal: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simulateBusy: {
    opacity: 0.86,
  },
  pulseOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    borderRadius: rounded.md,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackMd,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  title: {
    lineHeight: 32,
  },
  metricsSection: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    padding: spacing.stackMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteBlock: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.md,
    padding: spacing.stackMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteBody: {
    flex: 1,
    gap: spacing.stackSm,
  },
  quoteText: {
    lineHeight: 20,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 3,
    width: '60%',
    marginTop: spacing.stackSm,
    backgroundColor: colors.aiBlue,
    borderRadius: rounded.full,
  },
});
