import React from 'react'
import {Text, TextInput, Button, StyleSheet, View} from 'react-native'
import { Consumer } from '../core/context';


export default class UpdateView extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            id: props.navigation.getParam('id'),
            description: props.navigation.getParam('description'),
            priority: props.navigation.getParam('priority'),
          } 
    }

    handleDescriptionChange = description =>{
        this.setState({description})
    }

    handlePriorityChange = priority =>{
        this.setState({priority})
    }

    handleUpdateButtonPressed = async () =>{

        const udpateTaskFunction = this.props.navigation.getParam('onUpdateTask')
        await udpateTaskFunction({id: this.state.id, description: this.state.description, priority: this.state.priority})
        
        this.props.navigation.pop()

    }

    render(){
        return (
                <View style={styles.container}>            

                    <Text>Description</Text>
                    <TextInput 
                        value = {this.state.description}
                        onChangeText = {this.handleDescriptionChange}>            
                    </TextInput>
                    <Text>Priority</Text>
                    <TextInput 
                        value = {this.state.priority.toString()}
                        onChangeText = {this.handlePriorityChange}>
                    </TextInput>
                    <Button 
                        title = 'Update'
                        onPress={this.handleUpdateButtonPressed}
                    />
            
                </View>
        )
    }

    


}

const styles = StyleSheet.create({

    container:{
        justifyContent: 'center',
        flex: 1,
    },

})