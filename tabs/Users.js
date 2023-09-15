import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    // TextInput
  } from 'react-native';
  import { useState } from 'react';
  import firebase from 'firebase/compat/app'; // Import the Firebase app module
  import 'firebase/compat/auth';
  import {useIsFocused, useNavigation} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';

function Users(props) {
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const [mode, setMode] = useState('LIGHT');
    const[entity,setEntity] = useState("");
    const isFocued = useIsFocused();
    const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
    const [searchQuery, setSearchQuery] = useState(''); 
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
      
      const handleSearch = (query) => {
        const filtered = users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log(filtered)
        setFilteredUsers(filtered);
        setSearchQuery(query);
      };
    
      
    const getUsers = async () => {
      
        console.log("ent "+entity)
        let tempData = [];
        //  id= await AsyncStorage.getItem('userID');
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
            setFilteredUsers(tempData);
          });
      };
      // console.log(users)

    return (
     
        <View
      style={[
        styles.container,
        {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
      ]}>
      
      {/* <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} > */}
      {/* <View > */}
      <View style={styles.header}>
        <Text style={styles.title}>INBOX</Text>
      </View> 
      {/* </LinearGradient> */}
      <View style={styles.searchBox}>
        <IonIcon name="search" size={20} color="black" style={styles.vector}/>
        {/* <LinearGradient style={styles.searchInput}
          colors={['#f5f5f5', '#c3eff8', '#7cc5ec']}
          >    */}
          <View style={styles.input}>
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
            style={{textAlign:'center', fontSize: 15}}
          />
          </View>
        {/* </LinearGradient> */}
      </View>
      
      {/* </View> */}
      

      <View>
        <FlatList
          data={filteredUsers}
          renderItem={({item, index}) => {
            return (
            <LinearGradient 
              colors={['#ffffff', '#efefef', '#e1e1e1']}
              >
              <TouchableOpacity
                style={[styles.userItem]}
                onPress={() => {
                  navigation.navigate('Chat', {data: item, email: email});
                }}>
                {/* <Image
                  source={require('../assets/images/user.png')}
                  style={styles.userIcon}
                /> */}
                <IonIcon name="person" size={33} color="black" />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            </LinearGradient>
            );
          }}
        />
      </View>
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'black',
      fontSize: 30,
      fontWeight: 'bold',
    },
    userItem: {
      // width: Dimensions.get('window').width - 20,
      alignSelf: 'stretch',
      marginBottom: 3,
      flexDirection: 'row',
      height: 90,
      paddingLeft: 20,
      alignItems: 'center',
      marginBottom: 10,
    },
    userIcon: {
      width: 40,
      height: 40,
    },
    input: {
      flexDirection: 'row',
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 16,
      borderBottomColor: '#000',
      borderBottomWidth: 1,
      height: 50,
      fontSize: 18,
      width: '70%',
    },
    // searchInput: {
    //   borderWidth: 0.5,
    //   borderColor: '#ccc',
    //   borderRadius: 25,
    //   width:"60%",
    //   alignSelf:'center',
    //   marginBottom: 20,
    //   marginTop: 10,
    //   padding: 10,
    //   height: 42,
    //   textAlign:'center',
    //   backgroundColor: '#4de6f6',
    //   // color: "#fff",
      
    // },
    searchBox: {
      flexDirection: 'row',
      marginHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',

    },
    vector: {
      marginRight: 3,
      marginBottom: 7,

    },
    name: {
      color: 'black', 
      marginLeft: 20, 
      fontSize: 20,
      // marginBottom: 5,
    },
  });