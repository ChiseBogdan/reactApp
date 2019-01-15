import React from 'react'
import {View, Button, StyleSheet, TextInput, Text, AsyncStorage} from 'react-native'

import {login} from '../core/api'

export default class LoginScreen extends React.Component{

    state = {
        username: '',
        password: '',
        issue: null,

    }

    handleUsernameUpdate = username =>{

        this.setState({username})
    }

    handlePasswordUpdate= password =>{
        
        this.setState({password})
    }

    _store_token = async token =>{

        try {
            await AsyncStorage.setItem('authorization', token);
          } catch (error) {
            console.log("ERROR WHEN TRYING TO PERSIST DATA")
          }

    }

    onLoginButtonPress = () =>{
        
        this.setState({issue: null})
        login(this.state.username, this.state.password).then(response =>{
            
            this._store_token(response)
            this.props.navigation.replace('Main')

        }).catch(error => {
            this.setState({issue: "INVALID USERNAME OR PASSWORD"})
        })
        
    }

    render(){

        return (

            <View style={styles.container}>
                <TextInput
                    placeholder = 'Usename'
                    value = {this.state.username}
                    onChangeText = {this.handleUsernameUpdate}
                    autoCapitalize = 'none'
                />
                <TextInput 
                placeholder = 'Password'
                value = {this.state.password}
                onChangeText = {this.handlePasswordUpdate}
                secureTextEntry
                />
                
                <Button 
                title = 'Log in'
                onPress = {this.onLoginButtonPress}
                />

                <Text>{this.state.issue}</Text>

            </View>

        )

    }

}

const styles = StyleSheet.create({

    container:{
        justifyContent: 'center',
        flex: 1,
    }

})