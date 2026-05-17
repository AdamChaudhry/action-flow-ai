import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react-native';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { spacing, rounded } from '../../theme/spacing';

// ─── Assumptions (string[]) ───────────────────────────────────────────────────

export const SimulationAssumptionsSection: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={section.container}>
    <Typography variant="headlineMd" style={section.title}>Key Assumptions</Typography>
    {items.map((item, i) => (
      <View key={i} style={section.row}>
        <CheckCircle size={15} color={colors.aiBlue} style={section.icon} />
        <Typography variant="bodyMd" color={colors.textSecondary} style={section.rowText}>
          {item}
        </Typography>
      </View>
    ))}
  </View>
);

// ─── Risks (string[]) ────────────────────────────────────────────────────────

export const SimulationRisksSection: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={section.container}>
    <Typography variant="headlineMd" style={section.title}>Remaining Risks</Typography>
    {items.map((item, i) => (
      <View key={i} style={section.row}>
        <AlertTriangle size={15} color="#D97706" style={section.icon} />
        <Typography variant="bodyMd" color={colors.textSecondary} style={section.rowText}>
          {item}
        </Typography>
      </View>
    ))}
  </View>
);

// ─── Evidence (string[]) ─────────────────────────────────────────────────────

export const SimulationEvidenceSection: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={section.container}>
    <Typography variant="headlineMd" style={section.title}>Evidence Used</Typography>
    {items.map((item, i) => (
      <View key={i} style={section.row}>
        <View style={section.evidenceIconBox}>
          <FileText size={12} color={colors.aiBlue} />
        </View>
        <Typography variant="bodyMd" color={colors.textSecondary} style={section.rowText}>
          {item}
        </Typography>
      </View>
    ))}
  </View>
);

// ─── Shared styles ────────────────────────────────────────────────────────────

const section = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.gutter,
    gap: 10,
  },
  title:    { marginBottom: spacing.stackSm },
  row:      { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.stackSm },
  icon:     { marginTop: 3 },
  rowText:  { flex: 1, lineHeight: 22 },
  evidenceIconBox: {
    width: 26,
    height: 26,
    borderRadius: rounded.sm,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
