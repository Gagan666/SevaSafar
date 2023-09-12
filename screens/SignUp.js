import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Alert } from "react-native";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const navigation = useNavigation();
  const [entity, setEntity] = useState('');
  //entity is either agency or survivor based on the buttton clickeed

  useEffect(() => {
    const getStoredValue = async () => {
      try {
        const value = await AsyncStorage.getItem('selectedRole');
        const aut = await AsyncStorage.getItem('userID');
        console.log(aut)
        if(aut){
          navigation.replace("Chats");
        }
        if (value !== null) {
          setEntity(value);
        }
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };
      getStoredValue();
  }, []);
  
  

  // console.log(entity)

  const handleSignup = async () => {
    try {
      if (pass === ConfPass) {
        // Check if the email and phone number are already registered
        const emailExists = await checkIfEmailExists(email);
        const mobileExists = await checkIfMobileExists(mobile);
        
        if (!emailExists && !mobileExists) {
          // Create user with email and password
          const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);

          // Store user details in Firestore
          const user = userCredential.user;
          const userDetails = {
            name,
            email,
            mobile,
          };
          console.log(userDetails)
          await firebase.firestore().collection(entity).doc(user.uid).set(userDetails);

          // Navigate to the next screen or perform other actions
        } else {
          Alert.alert('Error', 'Email or mobile number already registered');
        }
      } else {
        Alert.alert('Error', 'Passwords do not match');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const checkIfEmailExists = async (email) => {
    const querySnapshot = await firebase.firestore().collection(entity).where('email', '==', email).get();
    return !querySnapshot.empty;
  };

  const checkIfMobileExists = async (mobile) => {
    const querySnapshot = await firebase.firestore().collection(entity).where('mobile', '==', mobile).get();
    return !querySnapshot.empty;
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    
    <View>
    
    <Text style={styles.title}>{entity} SignUp</Text>
      
      <TextInput
        placeholder="Enter Name"
        style={[{ marginTop: 50 }, styles.input]}
        value={name}
        onChangeText={(txt) => setName(txt)}
      />
      <TextInput
        placeholder="Enter Email"
        style={[{ marginTop: 20 }, styles.input]}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />
      <TextInput
        placeholder="Enter Mobile"
        style={[{ marginTop: 20 }, styles.input]}
        keyboardType={"number-pad"}
        value={mobile}
        onChangeText={(txt) => setMobile(txt)}
      />
      <TextInput
        placeholder="Enter Password"
        style={[{ marginTop: 20 }, styles.input]}
        value={pass}
        onChangeText={(txt) => setPass(txt)}
      />
      <TextInput
        placeholder="Enter Confirm Password"
        style={[{ marginTop: 20 }, styles.input]}
        value={ConfPass}
        onChangeText={(txt) => setConfPass(txt)}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btn_txt}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.orLogin} onPress={()=>{navigation.navigate("Login",{propKey:entity})}}>
        Or Login
      </Text>
    </View>
        
    </KeyboardAvoidingView>
  );
}
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
export default SignUp;
