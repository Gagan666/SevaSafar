import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import checkLoginStatus from '../functions/checkLoginStatus';

// Screens
import Chats from './Chats';
import Setting from '../tabs/Setting';
import Maps from './Maps';

//Screen names
const mapsName = "Maps";
const chatName = "Chats";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function Home() {
    checkLoginStatus();
  return (
    
      <Tab.Navigator
        initialRouteName={mapsName}
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "grey",
            tabBarLabelStyle: {
            paddingBottom: 10,
            fontSize: 10
         },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === mapsName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === chatName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        >

        <Tab.Screen name={mapsName} component={Maps} options={{headerShown:false}}/>
        <Tab.Screen name={chatName} component={Chats} options={{headerShown:false}}/>
        <Tab.Screen name={settingsName} component={Setting} options={{headerShown:false}}/>

      </Tab.Navigator>
    
  );
}

export default Home;