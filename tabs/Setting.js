import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util';
import { func } from 'prop-types';
import { useNavigation } from '@react-navigation/core';
const Setting = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile:'',
    map :{lat:'',long:''}
    // Add other user details here
  });
  const [location,setLocation]=useState({ latitude: 0, longitude: 0 });
  const [entity, setEntity] = useState('')
 
   const getEntity = async () => {
    try {
      const ent = await AsyncStorage.getItem("selectedRole")
      setEntity(ent)
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      // User has successfully signed out

      // Remove the userID value from AsyncStorage
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');

      await AsyncStorage.removeItem('selectedRole');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('pass');
      // Navigate to the login or welcome screen
      navigation.replace('Splash'); // Replace with your login or welcome screen name
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
// 
  const getDetails = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      await firebase.firestore()
        .collection(entity)
        .doc(userId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            setUserDetails({
              name: data.name,
              email: data.email,
              mobile:data.mobile,
              // Populate other user details as neededsa
            });
            setLocation({
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            });
            console.log(userDetails,location)
          }
        })
        .catch((error) => {
          console.error('Error fetching user details: ', error);
        });

        
    }
    else{
      console.log("Not logged in")
    }
  };
  async function exec(){
    // Fetch current user details from Firestore
     await getEntity();
     console.log(entity)

    await getDetails();
    console.log(userDetails)
        console.log(location)
  }
  useEffect(() => {
    // Fetch current user details from Firestore
    exec()
  }, [entity]);

  const handleUpdateDetails = () => {
    // Update user details in Firestore
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      firebase.firestore()
        .collection(entity)
        .doc(userId)
        .update({
          name: userDetails.name,
          email: userDetails.email,
          mobile:userDetails.mobile,
          location:location
          // Update other user details as needed
        })
        .then(() => {
          Alert.alert('Updated', entity +' details updated successfully.');
          // You can add a success message or navigation logic here.
        })
        .catch((error) => {
          console.error('Error updating user details: ', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} >
        <View style={styles.headcontents}>
          <Text style={styles.heading}>SETTINGS</Text>
          <Text style={styles.subheading}>Update your details</Text>
          <TouchableOpacity style={{alignSelf:"flex-end",top:50,right:20,backgroundColor:'#4de6f6',borderRadius:10,position: 'absolute'}} onPress={handleLogout}>
            <View>
              <Text style={{color:"white",padding:10,fontWeight: 'bold',}}>Logout</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </LinearGradient>
      
      {/* <View style={{alignSelf:"flex-end",right:20,backgroundColor:'#4de6f6'}}>
              <Button title="Logout" onPress={handleLogout} />
        </View>  */}
        <View style={styles.contents}>

          <View style={styles.input}>
          <IonIcon name="person" size={20} color="black" style={styles.icon}/>
          <TextInput
            style={{marginLeft: 15, fontSize: 18}}
            value={userDetails.name}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, name: text })
            }
            placeholder='Name'
          />
          </View>

          <View style={styles.input}>
          <IonIcon name="mail" size={20} color="black" style={styles.icon}/>
          <TextInput
            style={{marginLeft: 15, fontSize: 18}}
            value={userDetails.email}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, email: text })
            }
            placeholder='Email'
          />
          </View>

          <View style={styles.input}>
          <IonIcon name="call" size={20} color="black" style={styles.icon}/>
          <TextInput
            style={{marginLeft: 15, fontSize: 18}}
            value={userDetails.mobile}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, mobile: text })
            }
            placeholder='Mobile number'
          />
          </View>
         
        {entity==='Agency' &&location.latitude !== 0 && location.longitude !== 0 ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          onPress={(e) => {
            setLocation(e.nativeEvent.coordinate)
            console.log(location)
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="User Location"
          />
        </MapView>) : (
        <Text></Text>
      )}
      {/* Add other input fields for aditional user details */}

      <TouchableOpacity style={styles.button} onPress={handleUpdateDetails}>
            <View>
              <Text style={styles.text}>UPDATE DETAILS</Text>
            </View>
          </TouchableOpacity>
      </View> 

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  headcontents: {
    marginVertical: 3,
    // flexDirection:'row',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
    marginTop: 30,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
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
    height: 350,
    marginBottom: 5,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    padding: 10,
    height: 50,
    width: 150,
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignSelf: "center",
    elevation: 6,
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
  icon: {
    marginTop: 15,
  },
});

export default Setting;
