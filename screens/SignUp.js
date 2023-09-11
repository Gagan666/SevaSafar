import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState("");
  const [ConfPass, setConfPass] = useState("");
  const navigation = useNavigation();
  const [entity, setEntity] = useState('');

  useEffect(() => {
    const getStoredValue = async () => {
      try {
        const value = await AsyncStorage.getItem('selectedRole');
        if (value !== null) {
          setEntity(value);
        }
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };
      getStoredValue();
  }, []);
  
  //entity is either agency or survivor based on the buttton clickeed

  console.log(entity)

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    
    <View>
    <Text style={styles.title}>SignUp</Text>
      
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
      <TouchableOpacity style={styles.btn}>
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
