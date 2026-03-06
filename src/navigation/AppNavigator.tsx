import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import { RootStackParamList } from '../types/navigation';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                    headerTintColor: '#007AFF',
                    headerTitleStyle: {
                        fontWeight: '700',
                    },
                    headerBackVisible: true,
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ title: 'Search' }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{ title: 'Product Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
