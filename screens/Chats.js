import {View, Text, StyleSheet, TouchableOpacity, Image,Button} from 'react-native';
import React, {useState,useEffect} from 'react';
import Users from '../tabs/Users';
import Setting from '../tabs/Setting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app'; // Import the Firebase app modle
import 'firebase/compat/auth'; 
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

function Chats(props) {
  navigation=useNavigation()
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      // User has successfully signed out

      // Remove the userID value from AsyncStorage
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('selectedRole');
      // Navigate to the login or welcome screen
      navigation.replace('Splash'); // Replace with your login or welcome screen name
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    // <View>
        
        
    //  </View>
     <View style={styles.container}>
     <View style={{marginTop:40,alignSelf:"flex-end"}}>
          <Button title="Logout" onPress={handleLogout} />
        </View> 
     <Users /> 

   </View>
 );
};

  

export default Chats;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
});