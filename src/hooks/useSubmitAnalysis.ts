import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { submitAnalysisJob } from '../services/analysisApi';
import type { PickedFile, InputType } from '../types/analysis';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseSubmitAnalysisResult {
  textContent: string;
  setTextContent: (text: string) => void;
  pickedFile: PickedFile | null;
  pickedImage: PickedFile | null;
  isSubmitting: boolean;
  pickDocument: () => Promise<void>;
  pickImage: () => Promise<void>;
  clearFile: () => void;
  clearImage: () => void;
  submit: () => Promise<string | null>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages the Analyze form state: text input, file/image picking, and submission.
 * Returns a jobId on successful submission; null on failure.
 */
export function useSubmitAnalysis(): UseSubmitAnalysisResult {
  const [textContent, setTextContent] = useState('');
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [pickedImage, setPickedImage] = useState<PickedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── File Picker ────────────────────────────────────────────────────────────

  const pickDocument = useCallback(async () => {
    try {
      const [result] = await pick({
        type: [
          types.pdf,
          types.doc,
          types.docx,
          types.plainText,
        ],
        copyTo: 'cachesDirectory',
      });

      setPickedFile({
        uri: result.uri,
        name: result.name ?? 'document',
        mimeType: result.type ?? 'application/octet-stream',
      });
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }

      Alert.alert('Error', 'Could not open the file. Please try again.');
    }
  }, []);

  // ── Image Picker ───────────────────────────────────────────────────────────

  const pickImage = useCallback(async () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.9 },
      (response) => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        setPickedImage({
          uri: asset.uri,
          name: asset.fileName ?? 'image.jpg',
          mimeType: asset.type ?? 'image/jpeg',
        });
      },
    );
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const clearFile = useCallback(() => setPickedFile(null), []);
  const clearImage = useCallback(() => setPickedImage(null), []);

  // ── Determine input type ───────────────────────────────────────────────────

  function resolveInputType(
    hasText: boolean,
    hasFile: boolean,
    hasImage: boolean,
    fileMime: string | undefined,
  ): InputType | undefined {
    if (hasText && (hasFile || hasImage)) {
      return 'mixed';
    }
    if (hasImage) {
      return 'dashboard_screenshot';
    }
    if (hasFile) {
      return fileMime === 'application/pdf' ? 'pdf' : 'text';
    }
    if (hasText) {
      return 'text';
    }
    return undefined;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const submit = useCallback(async (): Promise<string | null> => {
    const hasText = textContent.trim().length > 0;
    const activeFile = pickedFile ?? pickedImage;

    if (!hasText && !activeFile) {
      Alert.alert(
        'Nothing to analyze',
        'Please enter some text, upload a file, or pick a screenshot.',
      );
      return null;
    }

    const inputType = resolveInputType(
      hasText,
      pickedFile !== null,
      pickedImage !== null,
      activeFile?.mimeType,
    );

    setIsSubmitting(true);
    try {
      const { jobId } = await submitAnalysisJob({
        content: hasText ? textContent.trim() : undefined,
        file: activeFile ?? undefined,
        inputType,
      });
      return jobId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error occurred.';
      Alert.alert('Submission failed', message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [textContent, pickedFile, pickedImage]);

  return {
    textContent,
    setTextContent,
    pickedFile,
    pickedImage,
    isSubmitting,
    pickDocument,
    pickImage,
    clearFile,
    clearImage,
    submit,
  };
}
