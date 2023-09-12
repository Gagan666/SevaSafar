import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
function Setting(props) {
    return (
        <View>
            <Text>Settings</Text>
        </View>
    );
}

export default Setting;
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