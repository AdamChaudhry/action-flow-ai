import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import type { Insight } from '../../types/analysis';
import { spacing } from '../../theme/spacing';
import { CompactInsightCard } from './CompactInsightCard';
import { FeaturedInsightCard } from './FeaturedInsightCard';
import { InsightsHeader } from './InsightsHeader';

interface InsightsListSectionProps {
  insights: Insight[];
  onViewImplications: (insightId: string) => void;
}

export const InsightsListSection: React.FC<InsightsListSectionProps> = ({
  insights,
  onViewImplications,
}) => {
  const [featuredInsightId, setFeaturedInsightId] = useState<string | null>(
    insights[0]?.id ?? null,
  );

  useEffect(() => {
    if (!insights.length) {
      setFeaturedInsightId(null);
      return;
    }

    const featuredStillExists = insights.some(
      insight => insight.id === featuredInsightId,
    );

    if (!featuredInsightId || !featuredStillExists) {
      setFeaturedInsightId(insights[0].id);
    }
  }, [featuredInsightId, insights]);

  const handleSelectInsight = useCallback((insightId: string) => {
    if (insightId === featuredInsightId) {
      return;
    }

    LayoutAnimation.configureNext({
      duration: 260,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setFeaturedInsightId(insightId);
  }, [featuredInsightId]);

  return (
    <>
      <InsightsHeader insightCount={insights.length} />

      <View style={styles.insightsList}>
        {insights.map(insight =>
          insight.id === featuredInsightId ? (
            <FeaturedInsightCard
              key={insight.id}
              insight={insight}
              onViewImplications={onViewImplications}
            />
          ) : (
            <CompactInsightCard
              key={insight.id}
              insight={insight}
              onPress={() => handleSelectInsight(insight.id)}
            />
          ),
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  insightsList: {
    gap: spacing.stackMd,
  },
});
