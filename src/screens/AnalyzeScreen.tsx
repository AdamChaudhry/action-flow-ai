import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { ContentInputSection } from '../components/analyze/ContentInputSection';
import { WorkflowTimelineCard } from '../components/analyze/WorkflowTimelineCard';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAnalysisJob } from '../hooks/useAnalysisJob';
import { useSubmitAnalysis } from '../hooks/useSubmitAnalysis';
import { useAnalysisResult } from '../context/AnalysisResultContext';
import type { AnalyzeStackParamList } from '../navigation/AnalyzeStackNavigator';

type AnalyzeNavProp = NativeStackNavigationProp<AnalyzeStackParamList, 'AnalyzeInput'>;
type AnalyzeRouteProp = RouteProp<AnalyzeStackParamList, 'AnalyzeInput'>;

export const AnalyzeScreen: React.FC = () => {
  const navigation = useNavigation<AnalyzeNavProp>();
  const route      = useRoute<AnalyzeRouteProp>();
  const [activeJobId, setActiveJobId] = useState<string | undefined>();

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
  const { clearResult } = useAnalysisResult();

  const isJobActive         = activeJobId !== undefined;
  const isAnalyzing         = isJobActive && jobState === 'processing';
  const isAnalysisCompleted = isJobActive && jobState === 'completed';
  const isAnalysisFailed    = isJobActive && jobState === 'failed';

  // Reset the form when a reset token is passed (e.g. from a "New Analysis" action).
  useEffect(() => {
    if (route.params?.resetToken === undefined) {
      return;
    }
    clearResult();
    reset();
    setActiveJobId(undefined);
  }, [clearResult, reset, route.params?.resetToken]);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (isAnalyzing) {
      return;
    }
    const jobId = await submit();
    if (jobId) {
      setActiveJobId(jobId);
    }
  }, [isAnalyzing, submit]);

  const handleSeeInsights = useCallback(() => {
    if (!activeJobId) {
      return;
    }
    navigation.navigate('Insights', { jobId: activeJobId });
  }, [activeJobId, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Input card + Start button — hidden once a job is submitted ── */}
        {!isJobActive && (
          <>
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

            <Button
              title={isSubmitting ? 'Starting…' : 'Start Analysis'}
              onPress={handleSubmit}
              disabled={isSubmitting}
              icon={
                isSubmitting
                  ? <ActivityIndicator size="small" color={colors.primaryInverse} />
                  : <ArrowRight size={16} color={colors.primaryInverse} />
              }
            />
          </>
        )}

        {/* ── Workflow timeline — visible once job is submitted ──────── */}
        {isJobActive && (
          <WorkflowTimelineCard
            steps={steps}
            activeStepLabel={activeStepLabel}
            isCompleted={isAnalysisCompleted}
            isError={isAnalysisFailed}
          />
        )}

        {/* ── See Insights button — visible only after completion ────── */}
        {isAnalysisCompleted && (
          <Button
            title="See Insights"
            onPress={handleSeeInsights}
            icon={<ArrowRight size={16} color={colors.primaryInverse} />}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingBottom: spacing.stackLg,
  },
  bottomSpacer: {
    height: 8,
  },
});
