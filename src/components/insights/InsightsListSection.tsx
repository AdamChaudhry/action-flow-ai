import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Insight } from '../../types/analysis';
import { spacing } from '../../theme/spacing';
import { CompactInsightCard } from './CompactInsightCard';
import { FeaturedInsightCard } from './FeaturedInsightCard';
import { InsightsHeader } from './InsightsHeader';

interface InsightsListSectionProps {
  insights: Insight[];
}

export const InsightsListSection: React.FC<InsightsListSectionProps> = ({
  insights,
}) => {
  const [featured, ...secondary] = insights;

  return (
    <>
      <InsightsHeader insightCount={insights.length} />

      {featured && <FeaturedInsightCard insight={featured} />}

      {secondary.length > 0 && (
        <View style={styles.secondaryList}>
          {secondary.map(insight => (
            <CompactInsightCard key={insight.id} insight={insight} />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  secondaryList: {
    gap: spacing.stackMd,
  },
});
