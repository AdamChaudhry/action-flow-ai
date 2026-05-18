import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';

// ─── Animated score circle ────────────────────────────────────────────────────

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 55,
      friction: 6,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={[circle.container, { transform: [{ scale }] }]}>
      <View style={circle.ring}>
        <Typography variant="headlineXl" color="#FFFFFF" style={circle.score}>
          {score}
        </Typography>
        <Typography variant="labelSm" color="rgba(255,255,255,0.6)" style={circle.outOf}>
          out of 100
        </Typography>
      </View>
    </Animated.View>
  );
};

const circle = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: spacing.stackMd },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: { fontWeight: '700', lineHeight: 44 },
  outOf: { letterSpacing: 0.4 },
});

// ─── Component ────────────────────────────────────────────────────────────────

interface SimulationOutcomeScoreProps {
  /** confidence 0.0 – 1.0, converted to score out of 100 */
  confidence: number;
}

/**
 * Dark card with "OVERALL OUTCOME SCORE" label and animated circle score.
 */
export const SimulationOutcomeScore: React.FC<SimulationOutcomeScoreProps> = ({
  confidence,
}) => {
  const score = Math.round(confidence * 100);

  return (
    <View style={styles.card}>
      <Typography variant="labelSm" color="rgba(255,255,255,0.55)" style={styles.label}>
        OVERALL OUTCOME SCORE
      </Typography>
      <ScoreCircle score={score} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0D1B4B',
    borderRadius: rounded.xl,
    padding: spacing.gutter,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: { letterSpacing: 1, marginBottom: spacing.stackSm },
});
