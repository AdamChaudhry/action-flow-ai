import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Camera, FileUp } from 'lucide-react-native';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { Typography } from '../Typography';
import { colors } from '../../theme/colors';
import { rounded, spacing } from '../../theme/spacing';
import type { PickedFile } from '../../types/analysis';
import { AttachmentChip } from './AttachmentChip';
import { SupportedTypesList } from './SupportedTypesList';
import { UploadOptionTile } from './UploadOptionTile';

interface ContentInputSectionProps {
  textContent: string;
  pickedFile: PickedFile | null;
  pickedImage: PickedFile | null;
  onTextChange: (text: string) => void;
  onPickDocument: () => void;
  onPickImage: () => void;
  onClearFile: () => void;
  onClearImage: () => void;
}

export const ContentInputSection: React.FC<ContentInputSectionProps> = ({
  textContent,
  pickedFile,
  pickedImage,
  onTextChange,
  onPickDocument,
  onPickImage,
  onClearFile,
  onClearImage,
}) => {
  const hasAttachments = pickedFile !== null || pickedImage !== null;

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Typography variant="headlineMd">Content Input</Typography>
        <Badge label="Auto-detect" variant="outline" />
      </View>

      <View style={styles.textAreaContainer}>
        <TextInput
          accessibilityLabel="Content to analyze"
          style={styles.textArea}
          placeholder="Paste notes, reports, articles, meeting summaries, or raw content here"
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
          value={textContent}
          onChangeText={onTextChange}
        />
      </View>

      {hasAttachments && (
        <View style={styles.attachmentsRow}>
          {pickedFile && (
            <AttachmentChip label={pickedFile.name} onClear={onClearFile} />
          )}
          {pickedImage && (
            <AttachmentChip label={pickedImage.name} onClear={onClearImage} />
          )}
        </View>
      )}

      <View style={styles.uploadRow}>
        <UploadOptionTile
          title="Upload File"
          description="PDF, Doc, Spreadsheet"
          isActive={pickedFile !== null}
          icon={<FileUp size={20} color={colors.aiBlue} />}
          activeIcon={<FileUp size={20} color={colors.primaryInverse} />}
          onPress={onPickDocument}
        />

        <View style={styles.uploadDivider} />

        <UploadOptionTile
          title="Screenshot"
          description="Image, Dashboard"
          isActive={pickedImage !== null}
          icon={<Camera size={20} color={colors.aiBlue} />}
          activeIcon={<Camera size={20} color={colors.primaryInverse} />}
          onPress={onPickImage}
        />
      </View>

      <SupportedTypesList />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.gutter,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: rounded.md,
    backgroundColor: colors.surface,
    minHeight: 120,
    padding: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  textArea: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: colors.textPrimary,
  },
  attachmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  uploadRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: rounded.md,
    overflow: 'hidden',
    marginBottom: spacing.stackMd,
  },
  uploadDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.stackMd,
  },
});
