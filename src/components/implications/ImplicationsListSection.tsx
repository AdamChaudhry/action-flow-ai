import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Implication } from '../../types/analysis';
import { spacing } from '../../theme/spacing';
import { ImplicationCard } from './ImplicationCard';
import { ImplicationsHeader } from './ImplicationsHeader';

interface ImplicationsListSectionProps {
  implications: Implication[];
}

export const ImplicationsListSection: React.FC<ImplicationsListSectionProps> = ({
  implications,
}) => (
  <>
    <ImplicationsHeader count={implications.length} />
    <View style={styles.list}>
      {implications.map(implication => (
        <ImplicationCard key={implication.id} implication={implication} />
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  list: {
    gap: spacing.stackMd,
  },
});
