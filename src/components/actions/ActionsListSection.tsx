import React, { useCallback, useEffect, useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import type { RecommendedAction } from '../../types/analysis';
import { spacing } from '../../theme/spacing';
import { ActionsHeader } from './ActionsHeader';
import { CompactActionCard } from './CompactActionCard';
import { FeaturedActionCard } from './FeaturedActionCard';

interface ActionsListSectionProps {
  actions: RecommendedAction[];
  onSimulate: (actionId: string) => void;
  isSimulating: boolean;
}

export const ActionsListSection: React.FC<ActionsListSectionProps> = ({
  actions,
  onSimulate,
  isSimulating,
}) => {
  const [featuredActionId, setFeaturedActionId] = useState<string | null>(
    actions[0]?.id ?? null,
  );

  useEffect(() => {
    if (!actions.length) {
      setFeaturedActionId(null);
      return;
    }

    const featuredStillExists = actions.some(
      action => action.id === featuredActionId,
    );

    if (!featuredActionId || !featuredStillExists) {
      setFeaturedActionId(actions[0].id);
    }
  }, [actions, featuredActionId]);

  const handleSelectAction = useCallback((actionId: string) => {
    if (actionId === featuredActionId) {
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

    setFeaturedActionId(actionId);
  }, [featuredActionId]);

  return (
    <>
      <ActionsHeader totalCount={actions.length} newCount={actions.length} />

      <View style={styles.list}>
        {actions.map(action =>
          action.id === featuredActionId ? (
            <FeaturedActionCard
              key={action.id}
              action={action}
              onSimulate={() => onSimulate(action.id)}
              isSimulating={isSimulating}
            />
          ) : (
            <CompactActionCard
              key={action.id}
              action={action}
              onPress={() => handleSelectAction(action.id)}
            />
          ),
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.stackMd,
  },
});
