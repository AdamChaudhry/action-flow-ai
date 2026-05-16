import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AnalyzeSubmitSection } from '../components/analyze/AnalyzeSubmitSection';
import { ContentInputSection } from '../components/analyze/ContentInputSection';
import { UrlImportSection } from '../components/analyze/UrlImportSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useSubmitAnalysis } from '../hooks/useSubmitAnalysis';
import type { MainTabParamList } from '../navigation/MainTabNavigator';

type AnalyzeNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Analyze'
>;

export const AnalyzeScreen: React.FC = () => {
  const navigation = useNavigation<AnalyzeNavigationProp>();

  const {
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
  } = useSubmitAnalysis();

  const handleSubmit = useCallback(async () => {
    const jobId = await submit();
    if (jobId) {
      navigation.navigate('Processing', { jobId });
    }
  }, [navigation, submit]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ContentInputSection
        textContent={textContent}
        pickedFile={pickedFile}
        pickedImage={pickedImage}
        onTextChange={setTextContent}
        onPickDocument={pickDocument}
        onPickImage={pickImage}
        onClearFile={clearFile}
        onClearImage={clearImage}
      />

      <UrlImportSection />

      <AnalyzeSubmitSection
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: 24,
  },
});
