import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../../screens/Splash';
import SignUp from '../../screens/SignUp'
import Login from '../../screens/Login';
const Stack = createStackNavigator()

function AppNavigator(props) {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                name={'Splash'}
                 component={Splash} 
                 options={{headerShown:false}}
                />
                <Stack.Screen 
                name={'SignUp'}
                 component={SignUp} 
                 options={{headerShown:false}}
                />
                <Stack.Screen 
                name={'Login'}
                 component={Login} 
                 options={{headerShown:false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;