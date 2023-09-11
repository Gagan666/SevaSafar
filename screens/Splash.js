import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Splash(props) {
    useEffect(() => {
        const clearStoredData = async () => {
          try {
            // Check if the value exists in AsyncStorage
            const storedValue = await AsyncStorage.getItem('selectedRole');
            if (storedValue) {
              // Clear the value if it exists
              await AsyncStorage.removeItem('selectedRole');
            }
          } catch (error) {
            console.error('Error clearing data:', error);
          }
        };
    
        clearStoredData();
      }, []);
    
    const navigation = useNavigation();
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('selectedRole', value);
          // Navigate to the next screen or perform any other actions
        } catch (error) {
          console.error('Error storing data:', error);
        }
        const entity = AsyncStorage.getItem('selectedRole');
        
      };
    
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>FireBase Chat App</Text>
            <TouchableOpacity style={styles.btn} onPress={()=>{storeData('agency');navigation.navigate("SignUp")}}><Text style={styles.btn_txt}>Agent</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={()=>{storeData('survivor');navigation.navigate("SignUp")}}><Text style={styles.btn_txt}>Survivor</Text></TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"orange",
        justifyContent:'center'
    },
    logo:{
        fontSize:40,
        color:"white",
        textAlign:"center"
    },
    btn:{
        // width: "90%",
        height: 50,
        width:"80%",
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 50,
        backgroundColor: "red",
        justifyContent:'center',
        alignItems:"center"
    },
    btn_txt:{

        color:"white"
    }
})
export default Splash;