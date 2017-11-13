import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions/index';
import storage from 'react-native-modest-storage';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
       login: '',
       password: '',
       token: '',
       ownerId: ''
    };
  }

  componentWillMount() {
    this.getToken();
  }
  async setToken(token, ownerId) {
    await storage.set('user', {token: token, ownerId: ownerId })
  }
  async getToken() {
    await storage.get('user').then((res, err) => {
      if (res) {
        this.setState({token: res.token, ownerId: res.ownerId})
        Actions.ChatList({token: res.token, ownerId: res.ownerId})
      }
    }) 
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps && nextProps.user) {
      this.setToken(nextProps.user.token, nextProps.user.ownerId);
      this.getToken();
    }
  }
  componentDidMount() {
    
  }
  
  onPressLearnMore() {
    const { login, password } = this.state;
    this.props.login(login, password);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Agent Login
        </Text>
          <View style={styles.loginInput}>
            <TextInput
              style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({login: text})}
              value={this.state.login}
              placeholder="Username"
              underlineColorAndroid='transparent'
              onSubmitEditing={(event) => { 
                this.refs.PassInput.focus(); 
              }}
              autoCapitalize = 'none'
              returnKeyType = {"next"}
            />
          </View>
          <View style={styles.loginInput}>
            <TextInput
              ref='PassInput'
              style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              underlineColorAndroid='transparent'
              placeholder="Password"
              onSubmitEditing={() => this.onPressLearnMore()}
              secureTextEntry
            />
          </View>
          <View>
            <Button
              onPress={() => this.onPressLearnMore()}
              title="Connect"
              color="#36A934"
            />
          </View>
          {/* <View>
            <Button
              onPress={Actions.ChatList}
              title="e"
              color="#36A934"
            />
          </View> */}
          
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { LoginReducer } = state;
  return { 
    user: LoginReducer.user,

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => {
      dispatch(actions.login(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

AppRegistry.registerComponent('simplechat', () => LoginPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
  },
  loginInput: {
    margin: 10,
  }
});
