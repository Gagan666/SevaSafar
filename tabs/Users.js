import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import { useState } from 'react';
  import firebase from 'firebase/compat/app'; // Import the Firebase app module
  import 'firebase/compat/auth';
  import {useIsFocused, useNavigation} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
function Users(props) {
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const [mode, setMode] = useState('LIGHT');
    const[entity,setEntity] = useState("");
    const isFocued = useIsFocused();
    //getting agency or survivor roles
    useEffect(() => {
        const getStoredValue = async () => {
          try {
            // const value = await AsyncStorage.getItem('selectedRole');
            // setEntity(value)
            await getUsers();
          } catch (error) {
            console.error('Error getting data:', error)
          }
        };
          getStoredValue();
      }, []);
      
      
    const getUsers = async () => {
      
        console.log("ent "+entity)
        let tempData = [];
         id= await AsyncStorage.getItem('userID');
         email = await AsyncStorage.getItem('email');
        // console.log(email)
        firebase.firestore() 
          .collection("Agency")
          .where('email', '!=', email)
          .get()
          .then(res => {
            // console.log(res)
            if (res.docs != []) {
              res.docs.map(item => {
                tempData.push(item.data());
              });
            }
            setUsers(tempData);
          });
      };
      console.log(users)

    return (
        <View
      style={[
        styles.container,
        {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
      ]}>
      <View style={styles.header}>
        <Text style={styles.title}>RN Firebase Chat App</Text>
      </View> 
      <FlatList
        data={users}
        renderItem={({item, index}) => {
          return (

            <TouchableOpacity
              style={[styles.userItem, {backgroundColor: 'white'}]}
              onPress={() => {
                navigation.navigate('Chat', {data: item, email: email});
              }}>
              <Image
                source={require('../assets/images/user.png')}
                style={styles.userIcon}
              />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
      </View>
    );
}

export default Users;
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
    },
    header: {
      width: '100%',
      height: 60,
      backgroundColor: 'white',
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'purple',
      fontSize: 20,
      fontWeight: '600',
    },
    userItem: {
      width: Dimensions.get('window').width - 50,
      alignSelf: 'center',
      marginTop: 20,
      flexDirection: 'row',
      height: 60,
      borderWidth: 0.5,
      borderRadius: 10,
      paddingLeft: 20,
      alignItems: 'center',
    },
    userIcon: {
      width: 40,
      height: 40,
    },
    name: {color: 'black', marginLeft: 20, fontSize: 20},
  });