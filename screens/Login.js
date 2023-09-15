import { useNavigation } from "@react-navigation/native";
import { useState,useEffect  } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
// import { auth } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import firebase from 'firebase/compat/app'; // Import the Firebase app module
import 'firebase/compat/auth';
import { Alert } from "react-native";
import checkLoginStatus from "../functions/checkLoginStatus";
import IonIcon from 'react-native-vector-icons/Ionicons';


function Login(props) {
  
    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("");
    const[entity,setEntity] = useState("");
    const navigation = useNavigation();
    
    const getStoredValue = async () =>{
      const ent = await AsyncStorage.getItem("selectedRole");
      setEntity(ent);
    }
    useEffect(() => {
      
      getStoredValue()
    }, []);
    checkLoginStatus();
    // console.log("##"+entity)
    const handleLogin = async () => {
      try {
        // Check if the email is present in the database
        const emailExists = await checkIfEmailExists(email);
  
        if (emailExists) {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
          // User has successfully logged in
          // Navigate to the Maps screen
          const user = userCredential.user;
      
      // Store the user ID in AsyncStorage
        await AsyncStorage.setItem('userID', user.uid);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('pass', pass);
        // console.log(user.uid)
          navigation.replace('Home');
        } else {
          // Display an alert if the email is not found in the database
          Alert.alert('Error', 'Email not found in the database');
        }
      } catch (error) {
        // Display an alert for login errors
        Alert.alert('Error', error.message);
      }
    };
  
    const checkIfEmailExists = async (email) => {
      console.log(entity)
      try {
        const querySnapshot = await firebase.firestore().collection(entity).where('email', '==', email).get();
        return !querySnapshot.empty;
      } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
      }
    };
  
   
    return (
      <ScrollView style={styles.container}>

          <View>
          {/* <Image source={require("../assets/images/logo.png")} style={styles.appLogo} /> */}
          <Image
              source={require("../assets/images/loginImage(1).png")}  
              style={styles.backgroundImage} 
          />
          </View>
          <View style={styles.loginpart}>
          {/* <Text style={styles.title}>{entity.toUpperCase()}{" "} LOGIN</Text> */}
          {entity === 'Survivor'? (<Text style={styles.title}>Need Help?</Text>) : (<Text style={styles.title}>Be part of a community</Text>)}
          
          <View style={styles.input}>
          <IonIcon name="mail" size={20} color="black" style={styles.icon}/>
          <TextInput
            placeholder="Email"
            style={{marginLeft: 15, fontSize: 18}}
            value={email}
            onChangeText={txt=>setEmail(txt)}
          />
          </View>

          <View style={styles.input}>
          <IonIcon name="key" size={20} color="black" style={styles.icon}/>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={{marginLeft: 15, fontSize: 18}}
            value={pass}
            onChangeText={txt=>setPass(txt)}
          />
          </View>
      
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <View>
              <Text style={styles.text}>LOGIN</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.donthaveaccount}>Don't have an account?</Text>
          <Text style={styles.orLogin} onPress={()=>{navigation.navigate("SignUp")}}>SignUp</Text>
          </View>
          </View>

      </ScrollView>
    );
}

export default Login;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: "black",
      alignSelf: "center",
      marginBottom: 10,
    },
    loginpart: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    // appLogo: {
    //   alignSelf: 'flex-end',
    //   height: 120,
    //   width: 120,
    //   marginTop: 30,
    //   marginRight: 10,
    //   // position: 'absolute',
    // },
    backgroundImage: {
      justifyContent:'center',
      width: '100%',
      height: 500, 
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      marginBottom: 15,
    },
    // inputSection:{
    //     // flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginVertical: 8,
    //     // backgroundColor: '#fff',
        
    // },
    // // input: {
    //   width:"70%",
    //   flexDirection: 'row',
    // borderRadius: 8,
    // paddingHorizontal: 8,
    // marginBottom: 2,
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
    // height: 50,
    // fontSize: 18,
    // },
    input: {
      width: '80%',
      alignSelf:'center',
      flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 50,
    fontSize: 18,
    },
    button: {
      marginTop: 18,
      padding: 10,
      height: 50,
      width: 150,
      borderRadius: 30,
      marginHorizontal: 10,
      justifyContent: 'center',
      alignSelf: "center",
      elevation: 3,
      backgroundColor: '#4de6f6',
    },
    text: {
      fontSize: 20,
      color: 'white',
      justifyContent: 'center',
      alignSelf: "center",
      paddingHorizontal: 10,
      fontWeight: 'bold',
    },
    donthaveaccount: {
      fontSize: 19,
      alignSelf: 'center',
      marginTop: 20,
    },
    orLogin: {
      fontSize: 24,
      alignSelf: "center",
      marginTop: 2,
      // textDecorationLine: "underline",
      fontWeight: "bold",
    },
    icon: {
      marginTop: 15,
    },
  });