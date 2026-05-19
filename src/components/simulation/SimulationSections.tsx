import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';
import { toDisplayText, toDisplayTextArray } from '../../utils/displayText';

// ─── Shared row ───────────────────────────────────────────────────────────────

interface BulletRowProps {
  icon: React.ReactNode;
  text: string;
}

const BulletRow: React.FC<BulletRowProps> = ({ icon, text }) => (
  <View style={row.container}>
    <View style={row.icon}>{icon}</View>
    <Typography variant="bodySm" color={colors.textSecondary} style={row.text}>
      {toDisplayText(text)}
    </Typography>
  </View>
);

const row = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.stackSm },
  icon:      { marginTop: 2 },
  text:      { flex: 1, lineHeight: 20 },
});

// ─── Shared section wrapper ───────────────────────────────────────────────────

const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <View style={card.container}>
    <View style={card.header}>
      {icon}
      <Typography variant="headlineMd" style={card.title}>{title}</Typography>
    </View>
    {children}
  </View>
);

const card = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: spacing.stackSm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.stackSm },
  title:  { flex: 1 },
});

// ─── Assumptions ─────────────────────────────────────────────────────────────

export const SimulationAssumptionsSection: React.FC<{ items: string[] }> = ({ items }) => (
  <SectionCard
    icon={<CheckCircle size={18} color={colors.aiBlue} />}
    title="Key Assumptions"
  >
    {toDisplayTextArray(items).map((item, i) => (
      <BulletRow
        key={i}
        icon={<Typography variant="bodyMd" color={colors.aiBlue}>→</Typography>}
        text={item}
      />
    ))}
  </SectionCard>
);

// ─── Risks ────────────────────────────────────────────────────────────────────

export const SimulationRisksSection: React.FC<{ items: string[] }> = ({ items }) => (
  <SectionCard
    icon={<AlertTriangle size={18} color="#D97706" />}
    title="Remaining Risks"
  >
    {toDisplayTextArray(items).map((item, i) => (
      <BulletRow
        key={i}
        icon={<Typography variant="bodyMd" color="#D97706">→</Typography>}
        text={item}
      />
    ))}
  </SectionCard>
);

// ─── Evidence ─────────────────────────────────────────────────────────────────

export const SimulationEvidenceSection: React.FC<{ items: string[] }> = ({ items }) => (
  <SectionCard
    icon={<FileText size={18} color={colors.textSecondary} />}
    title="Evidence Used"
  >
    {toDisplayTextArray(items).map((item, i) => (
      <BulletRow
        key={i}
        icon={<Typography variant="bodyMd" color={colors.textTertiary}>→</Typography>}
        text={item}
      />
    ))}
  </SectionCard>
);
