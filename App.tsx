import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { useAppStatePersistence } from './src/hooks/useAppStatePersistence';
import AppNavigator from './src/navigation/AppNavigator';


const App = () => {
  useAppStatePersistence()

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  )
}
export default App;
