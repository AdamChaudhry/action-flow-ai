import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import {
  MainTabNavigator,
  type MainTabParamList,
} from './src/navigation/MainTabNavigator';
import { Header } from './src/components/Header';
import { colors } from './src/theme/colors';

const navigationRef = createNavigationContainerRef<MainTabParamList>();

function App() {
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

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.container}>
          <Header onStartAnalysis={handleStartAnalysis} />
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
