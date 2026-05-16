import React from 'react';
import { StyleSheet } from 'react-native';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';

interface IntelligenceEngineCardProps {
  onStartAnalysis: () => void;
}

export const IntelligenceEngineCard: React.FC<IntelligenceEngineCardProps> = ({
  onStartAnalysis,
}) => (
  <Card style={styles.card} glass variant="flat">
    <Badge
      label="AI POWERED"
      variant="ai"
      icon={<Sparkles size={14} color={colors.aiBlue} />}
      style={styles.badge}
    />
    <Typography variant="headlineLg" style={styles.title}>
      Launch Intelligence Engine
    </Typography>
    <Typography
      variant="bodyMd"
      color={colors.textSecondary}
      style={styles.description}
    >
      Start a new session to process complex documents, URLs, or raw text into
      actionable tasks and strategic summaries.
    </Typography>
    <Button
      accessibilityLabel="Start new analysis"
      title="Start New Analysis"
      variant="primary"
      style={styles.button}
      icon={<ArrowRight size={18} color={colors.primaryInverse} />}
      onPress={onStartAnalysis}
    />
  </Card>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F4FF',
    borderColor: '#D8E2FF',
    borderWidth: 1,
    padding: spacing.stackLg,
    marginBottom: spacing.stackLg,
    borderRadius: rounded.xl,
  },
  badge: {
    marginBottom: spacing.stackMd,
  },
  title: {
    marginBottom: spacing.stackSm,
  },
  description: {
    marginBottom: spacing.stackLg,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
