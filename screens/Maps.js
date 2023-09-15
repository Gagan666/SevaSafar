import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import firebase from 'firebase/compat/app';
const Maps = () => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const initMarkers  = async () =>{
        try {
            setLoading(true);
          const querySnapshot = await firebase.firestore().collection('Agency').get();
          const agencies = [];
          const marker = [];
          querySnapshot.forEach((documentSnapshot) => {
            // Access the data of eachdocument
            const data = documentSnapshot.data();
            console.log(data);
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
    useEffect(() => {
        initMarkers();
      }, []);
    // const markers = [
    //     {
    //       latitude: 37.78825,
    //       longitude: -122.4324,
    //       title: 'Marker 1',
    //       description: 'This is Marker 1',
    //     },
    //     {
    //       latitude: 37.77845,
    //       longitude: -122.4424,
    //       title: 'Marker 2',
    //       description: 'This is Marker 2',
    //     },
    //     // Add more markers as needed
    //   ];
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Add yo navigation bar content here */}
        {/* Example: */}
        <Text style={styles.navbarText}>My Map App</Text>
      </View>
      {loading ? (
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
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>
        )
      )}
      
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
});

export default Maps;