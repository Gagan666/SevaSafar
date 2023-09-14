import { useNavigation,useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import firebase from 'firebase/compat/app'; // Import the Firebase app modle
import 'firebase/compat/auth'; 
import checkLoginStatus from '../functions/checkLoginStatus';
import * as Permissions from 'expo-permissions';

function Splash(props) {
  const [entity, setEntity] = useState('');
  async function checkAuthenticationStatus() {
    if(firebase.auth().currentUser!=null)
    navigation.replace('Home')
  }
  useFocusEffect(
    React.useCallback(() => {

        checkAuthenticationStatus();
    }, [])
  );
  checkLoginStatus();
    
    const navigation = useNavigation();
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('selectedRole', value);
          // Navigate to the next screen or perform any other actions
        } catch (error) {
          console.error('Error storing data:', error);
        }
        
      };
    
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>FireBase Chat App</Text>
            <TouchableOpacity style={styles.btn} onPress={()=>{storeData('Agency');navigation.navigate("SignUp",{entity:"Agency"})}}><Text style={styles.btn_txt}>Agent</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={()=>{storeData('Survivor');navigation.navigate("SignUp",{entity:"Survivor"})}}><Text style={styles.btn_txt}>Survivor</Text></TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"orange",
        justifyContent:'center'
    },
    logo:{
        fontSize:40,
        color:"white",
        textAlign:"center"
    },
    btn:{
        // width: "90%",
        height: 50,
        width:"80%",
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 50,
        backgroundColor: "red",
        justifyContent:'center',
        alignItems:"center"
    },
    btn_txt:{

        color:"white"
    }
})
export default Splash;