import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
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
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={userDetails.name}
        onChangeText={(text) =>
          setUserDetails({ ...userDetails, name: text })
        }
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={userDetails.email}
        onChangeText={(text) =>
          setUserDetails({ ...userDetails, email: text })
        }
      
      />
      <Text>Mobile:</Text>
      <TextInput
        style={styles.input}
        value={userDetails.mobile}
        onChangeText={(text) =>
          setUserDetails({ ...userDetails, mobile: text })
        }
        />
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

      <Button
        title="Update Details"
        onPress={handleUpdateDetails}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:40
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default Setting;
