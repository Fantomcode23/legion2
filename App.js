import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppNavigator from './src/Screens/AppNavigator'
import registerNNPushToken from 'native-notify'

export default function App ()  {
  registerNNPushToken(17070, '2pX8QCDodu54PvxdVOuMJy');

  return (
    <AppNavigator/>
  )
}

