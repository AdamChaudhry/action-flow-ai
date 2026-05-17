import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface SimulationErrorStateProps {
  message: string;
  onBack: () => void;
}

export const SimulationLoadingState: React.FC = () => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.center}>
      <Animated.View style={[styles.loadingRing, { opacity: pulse }]}>
        <ActivityIndicator size="large" color={colors.aiBlue} />
      </Animated.View>
      <Typography variant="headlineMd" align="center" style={styles.title}>
        Loading Simulation
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary} align="center">
        Fetching projected outcomes and risk analysis...
      </Typography>
    </View>
  );
};

export const SimulationErrorState: React.FC<SimulationErrorStateProps> = ({
  message,
  onBack,
}) => (
  <View style={styles.center}>
    <Typography variant="headlineMd" align="center" style={styles.title}>
      Simulation Unavailable
    </Typography>
    <Typography variant="bodyMd" color={colors.textSecondary} align="center">
      {message}
    </Typography>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.7}
    >
      <Typography variant="labelMd" color={colors.primaryInverse}>
        Go Back
      </Typography>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.gutter,
    gap: spacing.stackMd,
    backgroundColor: colors.background,
  },
  loadingRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackSm,
  },
  title: {
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: rounded.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.gutter,
  },
});
