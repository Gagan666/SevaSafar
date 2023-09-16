import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Button, StyleSheet, TouchableOpacity  } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
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
  console.log(userId)
  let latitude=null;
  let longitude=null;
  agencyCollection
  .doc(firebase.auth().currentUser.uid)
  .get()
  .then(async (doc) => {
    if (doc.exists) {
      // Document exists, retrieve location data from the document
      const data = doc.data();
      console.log(data.location)
      await helpCollection
      .doc(userId)
      .update({ agencyHelp: true,agencyLocation:{latitude:data.location.latitude,longitude:data.location.longitude}, name: data.name })
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
          
  // setLoading(false);
  
  
  initNoti();
  // setLoading(true);
    } else {
      // Document doesn't exist for the specified user ID
      console.log('Document does not exist.');
    }
  })
  .catch((error) => {
    console.error('Error getting location data:', error);
  });

}
  
  useEffect(() => {
   initNoti();
  }, []);

  return (
    <View style={styles.container}>

      <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} >
      <View style={styles.heading}>
      <IonIcon name="notifications" size={35} color="black" style={styles.icon}/>
      <Text style={styles.headingText}>SOS</Text>
      <Text style={styles.headingText}>NOTIFICATIONS</Text>
      </View>
      </LinearGradient>

      <ScrollView>
      <View style={styles.flatline}>
        
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id} // Assuming each notification document has an "id" field
        renderItem={({ item }) => (
          <View style={styles.flatlineContent}>
            <Text style={styles.flatlineheading}>Location: </Text>
            {/* <Text>latitude = {item.location.latitude}{"\n"}longitude= {item.location.longitude}</Text> */}

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
                latitudeDelta: 0.00022,
                longitudeDelta: 0.00121,
              }}
              >
              <Marker coordinate={item.location} />
            </MapView>

            <Text style={styles.flatlineheading}>Message:</Text>
            <Text> {item.message}</Text>
            <Text style={styles.flatlineheading}>Timestamp: </Text>
            <Text>{item.timestamp}</Text>
            {/* <Button onPress={()=>acceptReq(item.userId)} title='Accept'></Button> */}
            
            <TouchableOpacity style={styles.button} onPress={()=>acceptReq(item.userId)}>
              <View>
                <Text style={styles.text}>Accept</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      
      </View>
      </ScrollView>
    </View>
  );
};

export default Bell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // headcontents: {
  //   marginVertical: 20,
  // },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
    marginTop: 50,
    // backgroundColor: "#4de6f6"
  },
  headingText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "center",
    // justifyContent:'center'
  },
  icon: {
    alignSelf:'center',
  },
  flatline: {
    padding: 15,
    marginVertical: 5,
    // marginBottom: 5,
  },
  flatlineContent: {
    backgroundColor: 'lightgray',
    padding:10,
    borderRadius: 8,
    marginBottom: 10,
  },
  flatlineheading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // contents: {
  //   padding: 25,
  // },
  // input: {
  //   flexDirection: 'row',
  //   borderRadius: 8,
  //   paddingHorizontal: 8,
  //   marginBottom: 16,
  //   borderBottomColor: '#ccc',
  //   borderBottomWidth: 1,
  //   height: 50,
  //   fontSize: 18,
  // },
  // map: {
  //   width: '100%',
  //   height: 350,
  //   marginBottom: 10,
  //   marginTop: 10,
  // },
  button: {
    marginTop: 10,
    // padding: 10,
    height: 40,
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
    color: '#fff',
    justifyContent: 'center',
    alignSelf: "center",
    // paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  map: {
    // flex: 1,
    width: '100%',
    height: 350,
    marginBottom: 10,
    marginTop: 10,
  },
});