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
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import { ScrollView } from "react-native-gesture-handler";
import checkLoginStatus from "../functions/checkLoginStatus";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const navigation = useNavigation();
  const [entity, setEntity] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  //entity is either agency or survivor based on the buttton clickeed

  const getStoredValue = async () =>{
    const ent = await AsyncStorage.getItem("selectedRole");
    setEntity(ent);
  }
  useEffect(() => {
    
    getStoredValue()
  }, []);
  checkLoginStatus();
  
  const getCurrentLocation = async () => {
     let { status } = await Location.requestForegroundPermissionsAsync();

    if(status=='granted'){
      console.log("yes")
      const location = await Location.getCurrentPositionAsync({});
      const locCoor = {
        latitude:location.coords.latitude,
        longitude:location.coords.longitude
      }
      setLocation(locCoor)
      console.log('Current location:', location.coords);
    }
    else{
      console.log("No permissions");
    }
    
  };

  useEffect(()=>{
      // getCurrentLocation();
  },[])

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
            location
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
  
    <View style={{marginTop:10,flex:1}}>
    <ScrollView contentContainerStyle={styles.container}>
    
    <Text style={styles.header}>{entity} Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Agency Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Agency Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Agency Mobile Number"
        value={mobile}
        onChangeText={(text) => setMobile(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={pass}
        onChangeText={(text) => setPass(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={ConfPass}
        onChangeText={(text) => setConfPass(text)}
      />
      <Text style={styles.header}>Enter Location</Text>
      <TouchableOpacity onPress={getCurrentLocation} style={[styles.button,{marginBottom:20}]}>
            <Text style={[styles.buttonText]}>Get Current Location</Text>
          </TouchableOpacity>
    
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.00022,
          longitudeDelta: 0.00121,
        }}
        onPress={(e) => {
          console.log("Pressed")
          setLocation(e.nativeEvent.coordinate)}}
      ><Marker coordinate={location} /></MapView>
      
      <TouchableOpacity style={styles.SignUpbtn} onPress={handleSignup}>
        <Text style={styles.btn_txt}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.orLogin} onPress={()=>{navigation.replace("Login",{propKey:entity})}}>
        Or Login
      </Text>
    </ScrollView>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  orLogin: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 50,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  SignUpbtn:{
    width: "90%",
      height: 50,
      borderRadius: 10,
      alignSelf: "center",
      marginTop: 50,
      backgroundColor: "orange",
      alignItems: "center",
      justifyContent: "center",
  }
});
export default SignUp;
