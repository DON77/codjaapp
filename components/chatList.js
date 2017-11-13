import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AppRegistry, TextInput, Button, ScrollView, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import IO from 'socket.io-client/dist/socket.io';
import storage from 'react-native-modest-storage';
import configs from '../app.config';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
       login: '',
       password: '',
       search: '',
       getWaitingChats: [],
       getActiveChats: []
    };
    this.socket = IO(`${configs.apiIoUrl}`, { jsonp: false });
    
  }
  onPressLearnMore() {

  }
  getWaitingChats(getWaitingChats) {
    this.setState({
      getWaitingChats
    })
  }
  getActiveChats(getActiveChats) {
    this.setState({
      getActiveChats
    })
  }
  async getToken() {
    await storage.get('user').then((res, err) => {
      if (res) {
        this.setState({token: res.token, ownerId: res.ownerId})
        Actions.ChatList({token: res.token, ownerId: res.ownerId})
      }
    }) 
  }
  componentWillMount() {
    this.getToken();
    let token = this.props.navigation.state.params.token;
    this.socket.emit('getActiveChats', {
      token: token,
    });
    
    this.socket.emit('getWaitingChats', {
      token: token,
    });
    this.socket.on('getActiveChats',(msg) => {
      this.getActiveChats(msg.data)
    });
    this.socket.on('getWaitingChats',(msg) => {
      this.getWaitingChats(msg.data)
    });
  }
 
  async deleteToken() {
    await storage.clear().then(() => Actions.Login())
  }
  render() {
    const { getWaitingChats, getActiveChats } = this.state;
    const { token, ownerId } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.searchInput}
              onChangeText={(text) => this.setState({search: text})}
              value={this.state.search}
              underlineColorAndroid='transparent'
              placeholder="Search..."
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.logoutBtn}
              title="Log Out"
              onPress={this.deleteToken}
            />  
          </View>    
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {getWaitingChats && getWaitingChats.map((item, i) => {
            return <TouchableHighlight key={i} onPress={() => Actions.ChatPage({chatId: item._id, token: token, ownerId: ownerId})}>
              <View style={styles.chatBox}>
                <Text>Waiting ID: {item._id}</Text>
              </View>
            </TouchableHighlight>
          })}
          {getActiveChats && getActiveChats.map((item, i) => {
            return <TouchableHighlight key={i} onPress={() => Actions.ChatPage({chatId: item._id, token: token, ownerId: ownerId})}>
              <View style={styles.chatBox}>
                <Text>ID: {item._id}</Text>
              </View>
            </TouchableHighlight>
          })}
        </ScrollView>
      </View>
    );
  }
}

AppRegistry.registerComponent('simplechat', () => ChatList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#dcdcdc',
    height: 50,
  },
  searchInput: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderRadius: 50,
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  logoutBtn: {
    flex: 1,
    margin: 20,
  },
  inputContainer: {
    width: 200,
  },
  buttonContainer: {
    width: 100,
    padding: 5,
  },
  contentContainer: {
    paddingVertical: 20
  },
  chatBox: {
    borderColor: 'gray',
    borderRadius: 3,
    borderWidth: 2,
    padding: 20,
    marginBottom: 5,
    marginHorizontal: 10,
  }
});
