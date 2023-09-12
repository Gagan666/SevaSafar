import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../../screens/Splash';
import SignUp from '../../screens/SignUp'
import Login from '../../screens/Login';
import Chats from '../../screens/Chats';
import Chat from '../../screens/Chat';
// import AuthenticatedStack from './AuthenticatedStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator()
import { useState,useEffect } from 'react';
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
                <Stack.Screen 
                name={'Chats'}
                 component={Chats} 
                 options={{headerShown:false}}
                />
                <Stack.Screen 
                name={'Chat'}
                 component={Chat} 
                 options={{headerShown:true}}
                />
                
            

            </Stack.Navigator>

        </NavigationContainer>
    );
}

export default AppNavigator;