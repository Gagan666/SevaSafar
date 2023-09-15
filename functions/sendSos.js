import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SOSButton = () => {
  const [emergencyDetails, setEmergencyDetails] = useState({
    location: 'Some Location',
    message: 'Emergency SOS!',
    timestamp: new Date().toString(),
  });

  const sendSos = async () => {
    // Assuming you have a Firestore collection called "agencies"
    const agenciesSnapshot = await firestore().collection('agencies').get();

    agenciesSnapshot.forEach((doc) => {
      const agencyData = doc.data();

      // Create a notification document for each agency
      firestore()
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
      <Text>Emergency Location: {emergencyDetails.location}</Text>
      <Text>Emergency Message: {emergencyDetails.message}</Text>
      <Button title="Send SOS" onPress={sendSOS} />
    </View>
  );
};

export default sendSos;
