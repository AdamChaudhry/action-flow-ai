import React from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import {
  MainTabNavigator,
  type MainTabParamList,
} from './src/navigation/MainTabNavigator';
import { Header } from './src/components/Header';
import { colors } from './src/theme/colors';

const navigationRef = createNavigationContainerRef<MainTabParamList>();
const HIDDEN_BACK_ROUTES = ['Insights', 'SimulationResult'];

function shouldRestrictBack(): boolean {
  if (!navigationRef.isReady()) {
    return true;
  }

  const currentRouteName = navigationRef.getCurrentRoute()?.name as string | undefined;
  return (
    !navigationRef.canGoBack() ||
    HIDDEN_BACK_ROUTES.includes(currentRouteName ?? '')
  );
}

function App() {
  const [canGoBack, setCanGoBack] = React.useState(false);

  const syncHeaderBackState = React.useCallback(() => {
    setCanGoBack(!shouldRestrictBack());
  }, []);

  const handleStartAnalysis = React.useCallback(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.resetRoot({
      index: 0,
      routes: [{
        name: 'Analyze',
        state: {
          index: 0,
          routes: [{
            name: 'AnalyzeInput',
            params: { resetToken: Date.now() },
          }],
        },
      }],
    });
  }, []);

  const handleBack = React.useCallback(() => {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }, []);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (shouldRestrictBack()) {
        return true;
      }

      navigationRef.goBack();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={syncHeaderBackState}
        onStateChange={syncHeaderBackState}
      >
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.container}>
          <Header
            onStartAnalysis={handleStartAnalysis}
            onBack={handleBack}
            canGoBack={canGoBack}
          />
          <MainTabNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
