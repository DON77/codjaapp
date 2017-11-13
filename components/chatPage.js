import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AppRegistry, TextInput, Button, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import IO from 'socket.io-client/dist/socket.io';
import AutoScroll from 'react-native-auto-scroll';
import storage from 'react-native-modest-storage';
import configs from '../app.config';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class ChatPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
       text: '',
       password: '',
       chat: ''
    };
    this.socket = IO(`${configs.apiIoUrl}`, { jsonp: false });
  }
  
  componentWillMount() {
    this.loadChats()
  }
  loadChats(){
    let chatId = this.props.navigation.state.params.chatId;
    let token = this.props.navigation.state.params.token;
    
    this.socket.emit('getChatMessages', {
      chatId: chatId,
      token: token,
      limit: 1000,
      skip: 0,
    });

    this.socket.on('getChatMessages', (msg) => {
        this.setChat(msg.data)
    });
  }
  setChat(chat) {
    this.setState({
      chat
    })
  }
  onPressLearnMore() {

  }
  sendMessage() {
    const { text } = this.state;
    let chatId = this.props.navigation.state.params.chatId;
    let token = this.props.navigation.state.params.token;

    this.socket.emit('newMessage', {
      chatId: chatId,
      token: token,
      message: text
    });
    this.setState({
      text: ''
    })
  }
  componentDidMount() {
    this.socket.on('newMessage', () => {
      this.loadChats()
    });
  }
  async deleteTokenChat() {
    await storage.clear().then(() => Actions.Login())
  }
  
  render() {
    const { ownerId } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.chatBar}>
          <View style={styles.backContainer}>
            <Button
              style={styles.backBtn}
              title="All Chats"
              onPress={Actions.ChatList}
            /> 
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.logoutBtn}
              title="Log Out"
              onPress={this.deleteTokenChat}
            />  
          </View>    
        </View>
        <AutoScroll contentContainerStyle={styles.contentContainer} >
          {(this.state.chat.length > 0) && this.state.chat.map((item,i)=>{
            return (
              <View key={i}>
                {(ownerId !== item.from) &&
                  <View style={styles.massageMe}>
                    <Text>{item.message}</Text>
                    {/* <Text>{item.from}</Text> */}
                  </View>}
                {(ownerId === item.from) &&
                  <View style={styles.massageClient}>
                    <Text style={{ color: 'white' }}>{item.message}</Text>
                    {/* <Text style={{ color: 'white' }}>{item.from}</Text> */}
                  </View>}
              </View>
            )
          })}
        </AutoScroll>
        <View style={styles.massageSender}>
          <TextInput
            style={styles.massageInput}
            onChangeText={(text) => this.setState({ text: text })}
            value={this.state.text}
            underlineColorAndroid='transparent'
            placeholder="Write Answer"
            multiline = {true}
          />
          <Button
            style={styles.sendBtn}
            title="Send"
            onPress={() => this.sendMessage()}
          /> 
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('simplechat', () => ChatPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatBar: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#dcdcdc',
    height: 50,
  },
  backBtn: {
    height: 40,
    padding: 5,
  },
  logoutBtn: {
    flex: 1,
    margin: 20,
  },
  backContainer: {
    width: 100,
    padding: 5,
  },
  buttonContainer: {
    width: 100,
    padding: 5,
  },
  contentContainer: {
    paddingVertical: 20
  },
  massageClient: {
    borderColor: 'blue',
    backgroundColor: 'blue',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 5,
    marginHorizontal: 10,
    alignSelf: 'flex-end',  
  },
  massageMe: {
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 5,
    marginHorizontal: 10,
    alignSelf: 'flex-start',  
  },
  massageSender: {
    height: 45,
    borderWidth: 3,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  massageInput: {
    flex: 1
  },
  sendBtn: {
    width: 150,
  }
});
