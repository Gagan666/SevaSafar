import { useNavigation, useRoute } from "@react-navigation/native";
import { useState,useEffect } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image } from "react-native";
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
import { LinearGradient } from 'expo-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';

function SignUp2(props) {
    let route = useRoute();

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
      setName(route.params.name)
      setEmail(route.params.email)
      setMobile(route.params.mobile)
      setPass(route.params.pass)
      setConfPass(route.params.confPass)
      setEntity(route.params.entity)

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
          Alert.alert('Message', 'Registered Successfully');
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
  
    <View style={{flex:1}}>
    <ScrollView contentContainerStyle={styles.container}>

    <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} >
      <View style={styles.headcontents}>
        
        <Image source={require("../assets/images/logo.png")} style={styles.appLogo} />
        <Text style={styles.heading}>{entity} {'\n'}Registration</Text>
      </View>
    </LinearGradient>

    <View style={styles.contents}>

      

      <Text style={[styles.locheading]}>Enter Location</Text>
      <TouchableOpacity style={styles.button} onPress={getCurrentLocation} >
        <Text style={styles.text}>Get Current Location</Text>
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
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.donthaveaccount}>Already have an account?</Text>
      <Text style={styles.orLogin} onPress={()=>{navigation.replace("Login",{propKey:entity})}}>
        Login
      </Text>

      </View>
    </ScrollView>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: 'center',
    // padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    // alignSelf: "left",
    marginTop: 30,
    marginRight: 80,
    // justifyContent: 'left',
  },
  locheading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
    marginTop: 10,
  },
  headcontents: {
    marginVertical: 15,
    flexDirection: 'row-reverse',
  },
  contents: {
    padding: 25,
  },
  input: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 50,
    fontSize: 18,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    height: 50,
    width: 250,
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignSelf: "center",
    elevation: 6,
    backgroundColor: '#4de6f6',
  },
  text: {
    fontSize: 20,
    color: '#000',
    justifyContent: 'center',
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  orLogin: {
    fontSize: 24,
    alignSelf: "center",
    marginTop: 2,
    // textDecorationLine: "underline",
    fontWeight: "bold",
  },
  // SignUpbtn:{
  //   width: "90%",
  //     height: 50,
  //     borderRadius: 10,
  //     alignSelf: "center",
  //     marginTop: 10,
  //     backgroundColor: "orange",
  //     alignItems: "center",
  //     justifyContent: "center",
  // },
  appLogo: {
      alignSelf: 'flex-end',
      height: 100,
      width: 100,
      marginTop: 10,
      marginRight: 5,
      // position: 'absolute',
  },
  donthaveaccount: {
    fontSize: 19,
    alignSelf: 'center',
    marginTop: 30,
  },
});
export default SignUp2;
