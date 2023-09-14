import { useEffect, useState } from "react";
import firebase from "firebase/compat/app"; // Import the Firebase app module
import "firebase/compat/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const checkLoginStatus = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const getStoredValue = async () => {
    const em = await AsyncStorage.getItem("email");
    console.log("storedvali " + em);
    setEmail(em);
    const pa = await AsyncStorage.getItem("pass");
    console.log("storedvali " + pa);
    setPass(pa);
  };
  const handleLogout = async () =>  {
    try {
      await firebase.auth().signOut();
      // User has successfully signed out

      // Remove the userID value from AsyncStorage
      await AsyncStorage.removeItem("userID");
      // await AsyncStorage.removeItem("selectedRole");
      await AsyncStorage.removeItem("pass");
      await AsyncStorage.removeItem("email");

      // Navigate to the login or welcome screen
      // navigation.replace("Splash"); // Replace with your login or welcome screen name
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  const check = async () => {
    if (firebase.auth().currentUser == null) {
      console.log('$' + email)
      console.log('$' + pass)

      if (email && pass) {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        navigation.replace("Home")
      } else handleLogout();
    }
    
  };

  const checkAsyncStorageAndAuthenticate = async () => {
    try {
      // Check if email and password are stored in AsyncStorage
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('pass');
      console.log(storedEmail+storedPassword);
      if (storedEmail && storedPassword) {
        // Attempt Firebase authentication with the stored email and password
        await firebase.auth().signInWithEmailAndPassword(storedEmail, storedPassword);
        // Authentication successful, you can navigate to the main screen or perform other actions.
        navigation.replace("Home")

      } else {
        // Email and password are not stored, navigate to the login screen
        handleLogout(); // Replace with your actual navigation logic
      }
    } catch (error) {
      // Handle any errors that occur during AsyncStorage retrieval or authentication
      console.error('Error:', error.message);
    }
  };
  

  useEffect(() => {
    if(firebase.auth().currentUser==null)
    checkAsyncStorageAndAuthenticate();
    
  }, []);
};

export default checkLoginStatus;
