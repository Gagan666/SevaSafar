import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Setting = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile:'',
    map :{lat:'',long:''}
    // Add other user details here
  });
  const [location,setLocation]=useState({ latitude: 0, longitude: 0 });

  const getDetails = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      await firebase.firestore()
        .collection('Agency')
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
          }
        })
        .catch((error) => {
          console.error('Error fetching user details: ', error);
        });

        console.log(userDetails)
        console.log(location)
    }
    else{
      console.log("Not logged in")
    }
  };
  
  useEffect(() => {
    // Fetch current user details from Firestore
    getDetails();
    
  }, []);

  const handleUpdateDetails = () => {
    // Update user details in Firestore
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      firebase.firestore()
        .collection('Agency')
        .doc(userId)
        .update({
          name: userDetails.name,
          email: userDetails.email,
          mobile:userDetails.mobile,
          location:location
          // Update other user details as needed
        })
        .then(() => {
          console.log('User details updated successfully.');
          // You can add a success message or navigation logic here.
        })
        .catch((error) => {
          console.error('Error updating user details: ', error);
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} >
        <View style={styles.headcontents}>
          <Text style={styles.heading}>SETTINGS</Text>
          <Text style={styles.subheading}>Update your details</Text>
        </View>
      </LinearGradient>

        <View style={styles.contents}>

          <View style={styles.input}>
          <IonIcon name="person" size={35} color="black" />
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
          <IonIcon name="mail" size={35} color="black" />
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
          <IonIcon name="call" size={35} color="black" />
          <TextInput
            style={{marginLeft: 15, fontSize: 18}}
            value={userDetails.mobile}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, mobile: text })
            }
            placeholder='Mobile number'
          />
          </View>
         
        {location.latitude !== 0 && location.longitude !== 0 ? (
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
        <Text>Loading map...</Text>
      )}
      {/* Add other input fields for aditional user details */}

      <TouchableOpacity style={styles.button} onPress={handleUpdateDetails}>
            <View>
              <Text style={styles.text}>UPDATE DETAILS</Text>
            </View>
          </TouchableOpacity>
      </View> 

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  headcontents: {
    marginVertical: 20,
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
    marginBottom: 10,
    marginTop: 10,
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
    color: '#000',
    justifyContent: 'center',
    alignSelf: "center",
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
});

export default Setting;
