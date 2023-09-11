import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { auth } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';



function Login(props) {
  const entity = AsyncStorage.getItem('selectedRole');
  console.log(entity)
    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("");
    const navigation = useNavigation();

    const handleLogin = ()=>{
        auth
            .createUserWithEmailAndPassword(email, pass)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }
    console.log(props.params + " login")
    return (
        <KeyboardAvoidingView style={styles.container}>

        
        <View>
      <Text style={styles.title}>Login</Text>
    
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