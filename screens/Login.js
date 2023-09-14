import { useNavigation } from "@react-navigation/native";
import { useState,useEffect  } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
// import { auth } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase/compat/app'; // Import the Firebase app module
import 'firebase/compat/auth';
import { Alert } from "react-native";
import checkLoginStatus from "../functions/checkLoginStatus";

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
        <KeyboardAvoidingView style={styles.container}>

        
        <View>
      <Text style={styles.title}>{entity} Login</Text>
    
      <TextInput
        placeholder="Enter Email"
        style={[{ marginTop: 20 }, styles.input]}
        value={email}
        onChangeText={txt=>setEmail(txt)}
      />
     
      <TextInput
        placeholder="Enter Password"
        style={[{ marginTop: 20 }, styles.input]}
        value={pass}
        onChangeText={txt=>setPass(txt)}
      />
      
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btn_txt}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.orLogin} onPress={()=>{navigation.navigate("SignUp")}}>Or SignUp</Text>
    </View>
    </KeyboardAvoidingView>
    );
}

export default Login;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    title: {
      fontSize: 40,
      color: "black",
      alignSelf: "center",
      marginTop: 100,
    },
    input: {
      width: "90%",
      borderWidth: 0.5,
      borderRadius: 10,
      alignSelf: "center",
      height: 50,
      paddingLeft: 20,
    },
    btn: {
      width: "90%",
      height: 50,
      borderRadius: 10,
      alignSelf: "center",
      marginTop: 50,
      backgroundColor: "orange",
      alignItems: "center",
      justifyContent: "center",
    },
    btn_txt: {
      fontSize: 20,
      color: "black",
    },
    orLogin: {
      fontSize: 20,
      alignSelf: "center",
      marginTop: 50,
      textDecorationLine: "underline",
      fontWeight: "600",
    },
  });