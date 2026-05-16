import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../components/Typography';
import { colors } from '../theme/colors';

export const AnalyzeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Typography variant="headlineMd">Analyze Content</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
