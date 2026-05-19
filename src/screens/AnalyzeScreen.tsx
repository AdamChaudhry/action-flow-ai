import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContentInputSection } from '../components/analyze/ContentInputSection';
import { WorkflowTimelineCard } from '../components/analyze/WorkflowTimelineCard';
import {
  StickyPageActions,
  STICKY_PAGE_ACTIONS_HEIGHT,
} from '../components/StickyPageActions';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAnalysisJob } from '../hooks/useAnalysisJob';
import { useSubmitAnalysis } from '../hooks/useSubmitAnalysis';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';

type AnalyzeNavProp = NativeStackNavigationProp<AnalyzeStackParamList, 'AnalyzeInput'>;
type AnalyzeRouteProp = RouteProp<AnalyzeStackParamList, 'AnalyzeInput'>;

export const AnalyzeScreen: React.FC = () => {
  const navigation = useNavigation<AnalyzeNavProp>();
  const route = useRoute<AnalyzeRouteProp>();
  const [activeJobId, setActiveJobId] = useState<string | undefined>();
  const hasNavigatedToInsightsRef = useRef(false);

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
    reset,
    submit,
  } = useSubmitAnalysis();

  const { steps, jobState, activeStepLabel } = useAnalysisJob(activeJobId);
  const isAnalyzing = activeJobId !== undefined && jobState === 'processing';
  const isAnalysisCompleted = activeJobId !== undefined && jobState === 'completed';
  const isAnalysisFailed = activeJobId !== undefined && jobState === 'failed';

  useEffect(() => {
    if (route.params?.resetToken === undefined) {
      return;
    }

    reset();
    setActiveJobId(undefined);
    hasNavigatedToInsightsRef.current = false;
  }, [reset, route.params?.resetToken]);

  useEffect(() => {
    if (
      jobState === 'completed' &&
      activeJobId &&
      !hasNavigatedToInsightsRef.current
    ) {
      hasNavigatedToInsightsRef.current = true;
      navigation.navigate('Insights', { jobId: activeJobId });
    }
  }, [activeJobId, jobState, navigation]);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    if (isAnalyzing) {
      return;
    }

    const jobId = await submit();
    if (jobId) {
      hasNavigatedToInsightsRef.current = false;
      setActiveJobId(jobId);
    }
  }, [isAnalyzing, submit]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
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

        {activeJobId && (
          <WorkflowTimelineCard
            steps={steps}
            activeStepLabel={activeStepLabel}
            isCompleted={isAnalysisCompleted}
            isError={isAnalysisFailed}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <StickyPageActions
        previousTitle="Start"
        nextTitle="Start"
        onNext={handleSubmit}
        isPreviousDisabled
        isNextDisabled={isSubmitting || isAnalyzing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
  },
  bottomSpacer: {
    height: STICKY_PAGE_ACTIONS_HEIGHT,
  },
});
