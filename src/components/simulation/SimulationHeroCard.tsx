import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Typography } from '../Typography';
import { spacing, rounded } from '../../theme/spacing';

// ─── Animated confidence ring ─────────────────────────────────────────────────

/** @param value — confidence from the API: 0.0 – 1.0 */
const ConfidenceRing: React.FC<{ value: number }> = ({ value }) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const pct = Math.round(value * 100);

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }).start();
  }, [scale]);

  return (
    <Animated.View style={[ring.container, { transform: [{ scale }] }]}>
      <View style={ring.circle}>
        <Typography variant="headlineLg" color="#FFFFFF" style={ring.percent}>
          {pct}%
        </Typography>
        <Typography variant="labelSm" color="rgba(255,255,255,0.7)" style={ring.label}>
          CONFIDENCE
        </Typography>
      </View>
    </Animated.View>
  );
};

const ring = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: spacing.stackMd },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: { fontWeight: '700', lineHeight: 32 },
  label:   { letterSpacing: 0.8, marginTop: 2 },
});

// ─── Hero card ────────────────────────────────────────────────────────────────

interface SimulationHeroCardProps {
  actionTitle: string;
  projectedOutcome: string;
  /** confidence from ActionSimulation — 0.0 to 1.0 */
  confidence: number;
  actionId: string;
}

export const SimulationHeroCard: React.FC<SimulationHeroCardProps> = ({
  actionTitle,
  projectedOutcome,
  confidence,
  actionId,
}) => (
  <View style={styles.card}>
    {/* Status row */}
    <View style={styles.statusRow}>
      <View style={styles.successBadge}>
        <CheckCircle size={12} color="#059669" />
        <Typography variant="labelSm" color="#059669">Simulation Success</Typography>
      </View>
      <Typography variant="labelSm" color="rgba(255,255,255,0.5)">
        ID: {actionId.toUpperCase()}
      </Typography>
    </View>

    {/* Title */}
    <Typography variant="headlineLg" color="#FFFFFF" style={styles.title}>
      {actionTitle}
    </Typography>

    {/* Projected outcome */}
    <Typography variant="bodyMd" color="rgba(255,255,255,0.75)" style={styles.outcome}>
      {projectedOutcome}
    </Typography>

    {/* Confidence ring */}
    <ConfidenceRing value={confidence} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0D1B4B',
    borderRadius: rounded.xl,
    padding: spacing.gutter,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderRadius: rounded.full,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  title:   { lineHeight: 32, marginBottom: spacing.stackSm },
  outcome: { lineHeight: 22 },
});
