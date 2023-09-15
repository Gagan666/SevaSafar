import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../../screens/Splash';
import SignUp from '../../screens/SignUp'
import Login from '../../screens/Login';
import Chats from '../../screens/Chats';
import Chat from '../../screens/Chat';
import Home from '../../screens/Home';
import Bell from '../../tabs/Bell';
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
                <Stack.Screen 
                name={'Chats'}
                 component={Chats} 
                 options={{headerShown:false}}
                />
                <Stack.Screen 
                name={'Chat'}
                 component={Chat} 
                 options={{headerShown:false}}
                />
                <Stack.Screen 
                name={'Home'}
                 component={Home} 
                 options={{headerShown:false}}
                />
                {/* <Stack.Screen 
                name={'Bell'}
                 component={Bell} 
                 options={{headerShown:false}}
                /> */}
                
            </Stack.Navigator>

        </NavigationContainer>
    );
}

export default AppNavigator;