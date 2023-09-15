import React from 'react';
import { View,Text, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { useEffect,useState,useCallback } from 'react';
import { useRoute,useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import checkLoginStatus from '../functions/checkLoginStatus';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

function Chat(props) {

  const navigation = useNavigation();
    const [messages, setMessages] = useState([])
    const route = useRoute();

      checkLoginStatus();

    useEffect(() => {
        // console.log(firebase.auth().currentUser.uid)
        
        const unsubscribe = firebase.firestore()
          .collection('chats')
          .doc(route.params.email+route.params.data.email) // Replace with the chat room ID
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .onSnapshot((querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
              const message = doc.data();
              console.log(message)
              messages.push({
                _id: doc.id,
                text: message.text,
                createdAt: message.createdAt.toDate(),
                user: {
                  _id: message.user._id,
                    //   name: message.user.name,
                },
              });
            });
            setMessages(messages);
          });
      
        return () => {
          unsubscribe();
        };
      }, []);
    
      const onSend = useCallback((messages = []) => {
        const msg = messages[0];
        const myMsg={
            ...msg,
            sendBy:route.params.email,
            sendTo:route.params.data.email,
            user: {
                _id: firebase.auth().currentUser.uid, // Replace with the user's ID
                //  name:firebase.firestore().collection("Agency").doc(firebase.auth().currentUser.uid).name// Replace with the user's name
              },
        }
        // 
        console.log(msg)
        console.log(myMsg)
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, myMsg),
        );
        firebase.firestore().collection("chats")
        .doc(''+route.params.email+route.params.data.email)
        .collection("messages").add(myMsg);

        firebase.firestore().collection("chats")
        .doc(''+route.params.data.email+route.params.email)
        .collection("messages").add(myMsg);
      }, [])

    return (
        <View style={{flex:1}}>
          <LinearGradient colors={['#7af0fc', '#c8faff', '#ffffff']} >
          <View style={{ padding: 10,alignItems:'center', backgroundColor:'transparent' }}>
          <IonIcon name="person" size={37} color="black" style={{alignSelf: 'center', marginTop: 28}}/>
          <Text style={styles.header}>{route.params.data.name}</Text>
          </View>
          </LinearGradient>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: firebase.auth().currentUser.uid,
                }}
            />
        </View>
    );
}

export default Chat;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    elevation: 5,
    // backgroundColor: 'transparent'
  }
});