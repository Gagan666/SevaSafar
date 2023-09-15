import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import * as Location from 'expo-location';

const SOSButton = () => {
  const [emergencyDetails, setEmergencyDetails] = useState({
    location: 'Some Location',
    message: 'Emergency SOS!',
    timestamp: new Date().toString(),
  });
  const [location,setLocation] = useState([]);
  const [loading,setLoading]=useState(false);

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
     if(location.length>0)
     setEmergencyDetails({location:location,...emergencyDetails})
     console.log('Current location:', location.coords);
   }
   else{
     console.log("No permissions");
   }
   
 };
 useEffect(()=>{
    getCurrentLocation();
 },[])

  const sendSos = async () => {
    // Assuming you have a Firestore collection called "agencies"
    const agenciesSnapshot = await firestore().collection('agencies').get();

    agenciesSnapshot.forEach((doc) => {
      const agencyData = doc.data();

      // Create a notification document for each agency
      firebase.firestore()
        .collection('notifications')
        .add({
          agencyId: doc.id,
          ...emergencyDetails,
        })
        .then(() => {
          console.log('SOS notification sent to agency:', agencyData.name);
        })
        .catch((error) => {
          console.error('Error sending SOS notification:', error);
        });
    });
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        response && (
          <View>
            <Button title="Send SOS" onPress={sendSOS} />
          </View>
        )
      )}
      
    </View>
  );
};

export default sendSos;
