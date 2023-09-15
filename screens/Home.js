import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import checkLoginStatus from '../functions/checkLoginStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

// Screens
import Chats from './Chats';
import Setting from '../tabs/Setting';
import Maps from './Maps';
import Bell from '../tabs/Bell';
//Screen names
const mapsName = "Maps";
const chatName = "Chats";
const settingsName = "Settings";
const alerts = "Alert"
const Tab = createBottomTabNavigator();

function Home() {
    checkLoginStatus();
    const[entity,setEntity] = useState("");

    const getStoredValue = async () =>{
      const ent = await AsyncStorage.getItem("selectedRole");
      setEntity(ent);
    }

    React.useEffect(()=>{
      getStoredValue();
    },[])
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
              iconName = focused ? 'map' : 'map-outline';

            } else if (rn === chatName) {
              iconName = focused ? 'mail' : 'mail-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }else if (rn === alerts) {
              iconName = focused ? 'notifications' : 'notifications-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        >

        <Tab.Screen name={mapsName} component={Maps} options={{headerShown:false}}/>
        { entity === 'Survivor' ? (<></>):( <Tab.Screen name={chatName} component={Chats} options={{headerShown:false}}/> )}
        { entity === 'Survivor' ? (<></>):( <Tab.Screen name={alerts} component={Bell} options={{headerShown:false}}/> )}
        <Tab.Screen name={settingsName} component={Setting} options={{headerShown:false}}/>
        

      </Tab.Navigator>
    
  );
}

export default Home;