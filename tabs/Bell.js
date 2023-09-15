import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Button } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Bell = () => {
  const [notifications, setNotifications] = useState([]);
  const [entity, setEntity] = useState([]);
  const [loading, setLoading] = useState([]);

  const initNoti  = async () =>{
    try {
        setLoading(true);
        const ent = await AsyncStorage.getItem("selectedRole");
        setEntity(ent);
      const querySnapshot = await firebase.firestore().collection('Help');
      

    // Add a real-time listener to the collection
    const unsubscribe = querySnapshot.onSnapshot((querySnapshot) => {
      const newNotifications = [];

      // Iterate through the documents in the collection
      querySnapshot.forEach((doc) => {
        // Extract data from each document
        const data = doc.data();

        // Add the notification to the list
        newNotifications.push(data);
      });

      // Update the state with the new notifications
      setNotifications(newNotifications);
      
      return () => {
        unsubscribe();
      };
    });
    
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    finally {
        setLoading(false); // Set loading to false when the request is completed
      }
} 
const acceptReq  = async (userId) =>{
  const helpCollection = firebase.firestore().collection('Help');
  const agencyCollection = await firebase.firestore().collection("Agency");
  let latitude=null;
  let longitude=null;
  agencyCollection
  .doc(userId)
  .get()
  .then(async (doc) => {
    if (doc.exists) {
      // Document exists, retrieve location data from the document
      const data = doc.data();
      console.log(data.location)
      await helpCollection
      .doc(userId)
      .update({ agencyHelp: true,agencyLocation:{latitude:data.location.latitude,longitude:data.location.longitude} })
      .then(() => {
        console.log('Value "agencyHelp" updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating "agencyHelp" value:', error);
      });
      await helpCollection
        .doc(userId)
        .delete()
        .then(() => {
          console.log('Document deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting document:', error);
        });
    } else {
      // Document doesn't exist for the specified user ID
      console.log('Document does not exist.');
    }
  })
  .catch((error) => {
    console.error('Error getting location data:', error);
  });
  
  setLoading(false);
  
  
  initNoti();
  setLoading(true);
}
  
  useEffect(() => {
   initNoti();
  }, []);

  return (
    <View style={{marginTop:20}}>
      <Text>Notifications:</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id} // Assuming each notification document has an "id" field
        renderItem={({ item }) => (
          <View>
            <Text>Location: latitude = {item.location.latitude}, longitude= {item.location.latitude}</Text>
            <Text>Message: {item.message}</Text>
            <Text>Timestamp: {item.timestamp}</Text>
            <Button onPress={()=>acceptReq(item.userId)} title='Accept'></Button>
          </View>
        )}
      />
    </View>
  );
};

export default Bell;
