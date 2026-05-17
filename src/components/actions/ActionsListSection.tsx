import React, { useMemo } from 'react';
import type { RecommendedAction } from '../../types/analysis';
import { ActionsHeader } from './ActionsHeader';
import { ActionsQueueDivider } from './ActionsQueueDivider';
import { CompactActionCard } from './CompactActionCard';
import { FeaturedActionCard } from './FeaturedActionCard';

interface ActionsListSectionProps {
  actions: RecommendedAction[];
}

export const ActionsListSection: React.FC<ActionsListSectionProps> = ({
  actions,
}) => {
  const { featuredActions, compactActions } = useMemo(
    () => ({
      featuredActions: actions.filter(action => action.requiresHumanApproval),
      compactActions: actions.filter(action => !action.requiresHumanApproval),
    }),
    [actions],
  );

  return (
    <>
      <ActionsHeader totalCount={actions.length} newCount={actions.length} />

      {featuredActions.map(action => (
        <FeaturedActionCard key={action.id} action={action} />
      ))}

      {compactActions.length > 0 && featuredActions.length > 0 && (
        <ActionsQueueDivider />
      )}

      {compactActions.map(action => (
        <CompactActionCard key={action.id} action={action} />
      ))}
    </>
  );
};
