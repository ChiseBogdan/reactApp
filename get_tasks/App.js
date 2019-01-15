import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MainScreen from './screens/MainScreen'
import LoginScreen from './screens/LoginScreen'
import UpdateScreen from './screens/UpdateView'

import {createStackNavigator} from 'react-navigation'

const AppNavigator = createStackNavigator(
  {
    Main: MainScreen,
    Login: LoginScreen,
    Update: UpdateScreen
  },
  {
    initialRouteName: 'Login',
  }
)

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator/>
    );
  }
}
