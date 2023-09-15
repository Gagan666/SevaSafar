import React, { useDebugValue, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator,TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const Maps = () => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const[location,setLocation]=useState([]);
    const [entity,setEntity] = useState('');
    const [isLocationReady, setIsLocationReady] = useState(false);
    const [help, setHelp] = useState(false);

    const initMarkers  = async () =>{
        try {
            setLoading(true);
            const ent = await AsyncStorage.getItem("selectedRole");
            setEntity(ent);
          const querySnapshot = await firebase.firestore().collection('Agency').get();
          const marker = [];
          querySnapshot.forEach((documentSnapshot) => {
            // Access the data of eachdocument
            const data = documentSnapshot.data();
            // console.log(data);
            if(data?.location){
                marker.push(data.location);
            }
            // agencies.push(data);
          });
        //   console.log(agencies);
          setMarkers(marker)
        //   console.log(marker)
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
        finally {
            setLoading(false); // Set loading to false when the request is completed
          }
    }
    const sendSos = async () => {
      // Assuming you have aFirestore collection called "agencies"
      const ed ={
        location: location,
        userId:firebase.auth().currentUser.uid,
        message: 'Emergency SOS!',
        timestamp: new Date().toString(),
        agencyHelp:false
       }
       console.log(ed)
       
      await firebase.firestore().collection('Help').doc(firebase.auth().currentUser.uid).set(ed)
      const docRef = firebase.firestore().collection('Help').doc(ed.userId);
      const unsubscribe = docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const accept = data.agencyHelp || false; // Default to false if "accept" is not present
          console.log("%"+accept)
          // Update the state based on the "accept" value
          if(accept)
          setMarkers([data.location,data.agencyLocation])
        console.log(markers)
        }
      });
      return () => unsubscribe();
    };
    // 
    const getCurrentLocation = async () => {
      try{
        setLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
    
       if(status=='granted'){
         console.log("yes")
         const loc = await Location.getCurrentPositionAsync({});
         console.log("asda"+loc)
        //  const locCoor = {
        //    latitude:loc.coords.latitude, 
        //    longitude:loc.coords.longitude,
        //  }
         setLocation({
          latitude:loc.coords.latitude,
          longitude:loc.coords.longitude
        })
        console.log(location)
        // setIsLocationReady(true);
        //  console.log(locCoor);
         
        //  console.log('Current location=>', emergencyDetails);
       }
       else{
         console.log("No permissions");
       }
      //  
      }
      catch(error){
        console.error('Error fetching data: ', error);
      }
      finally{
        setLoading(false);
      }
      
   };
    useEffect(() => {
       getCurrentLocation();

        initMarkers();
      }, []);
    

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Add yo navigation bar content here */}
        {/* Example: */}
        <Text style={styles.navbarText}>My Map App</Text>
      </View>


{(loading) ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        markers.length>0 && (
            <MapView
            style={styles.map}
            initialRegion={{
              latitude: markers[0].latitude,
              longitude: markers[0].longitude,
              latitudeDelta: 0.222,
              longitudeDelta: 0.221,
            }}
          >
            {/* User location */}
            <Marker
            coordinate={location}
            title="Your Location"
            description="You are here"
          />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={"Agency"}
                description={"Agency Location"}
              />
            ))}
            {/*  */}
          </MapView>
          
        )
      )}
      
      <TouchableOpacity style={styles.sosButton} onPress={sendSos}>
        {/* Your SOS button UI */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    backgroundColor: 'blue', // Set the background color of your navbar
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarText: {
    color: 'white', // Set the text color of your navbar
    fontSize: 20,
  },
  map: {
    flex: 1,
  },
  sosButton: {
    position: 'absolute',
    bottom: 16, // Adjust the position as needed
    right: 16, // Adjust the position as needed
    backgroundColor: 'red', // Customize button style
    borderRadius: 50, // Make it circular
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Maps;