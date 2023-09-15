import { useNavigation,useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View,StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import firebase from 'firebase/compat/app'; // Import the Firebase app modle
import 'firebase/compat/auth'; 
import checkLoginStatus from '../functions/checkLoginStatus';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';

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
            <View> 
            <Image
              source={require("../assets/images/backgroundimg(1).jpg")}  
              style={styles.backgroundImage} 
            />
            <Image source={require("../assets/images/logo.png")} style={styles.appLogo} />
            </View>
            <View >
              <Text style={styles.titleTag}>"Strength in Unity{"\n"}Relief in Diversity"</Text>
            </View>
            <View style={styles.buttonContainer} >
            <TouchableOpacity onPress={()=>{storeData('Agency');navigation.navigate("SignUp")}}>
            <LinearGradient
              colors={['#aeeef5', '#b8eef0', '#ffffff']}
              style={styles.button}>
              <Text style={styles.text}>AGENCY</Text>
            </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{storeData('Survivor');navigation.navigate("SignUp")}}>
            <LinearGradient
              colors={['#ffffff', '#ebf5f5', '#b8eef0']}
              style={styles.button}>
              <Text style={styles.text}>SURVIVOR</Text>
            </LinearGradient>
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        justifyContent:'flex-start',
        flexDirection: 'column',
    },
    backgroundImage: {
        justifyContent:'center',
        width: '100%',
        height: 550, 
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginBottom: 15,
    },
    buttonContainer: {
        justifyContent:'center',
        flexDirection: 'row',
    },
    appLogo: {
        alignSelf: 'flex-end',
        height: 120,
        width: 120,
        marginTop: 30,
        marginRight: 30,
        position: 'absolute',
    },
    centerText: {
        fontSize:40,
        color:"black",
        textAlign:"center",
    },
    titleTag: {
        fontSize:30,
        color:"black",
        textAlign:"center",
        marginBottom: 50,
    },
    button: {
      padding: 15,
      height: 70,
      borderRadius: 30,
      alignSelf: "center",
      alignItems:"center",
      margin: 10,
    },
    text: {
      backgroundColor: 'transparent',
      fontSize: 25,
      color: '#000',
    },
})
export default Splash;