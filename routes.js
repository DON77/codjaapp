import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { LoginPage, ChatList, ChatPage } from './components/index';

export default class RootNavigator extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="Login" hideNavBar component={LoginPage} title="Login" initial={true} />
          <Scene key="ChatList" hideNavBar component={ChatList} title="ChatList" />
          <Scene key="ChatPage" hideNavBar component={ChatPage} title="ChatPage" />
        </Scene>
      </Router>
    )
  }
}