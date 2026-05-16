import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../components/Typography';
import { colors } from '../theme/colors';

export const HistoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Typography variant="headlineMd">History Content</Typography>
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
