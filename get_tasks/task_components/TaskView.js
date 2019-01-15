import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';


const TaskView = props =>(

    <TouchableOpacity onPress={() => props.onSelectTask(props)} style={styles.row}>            
        <Text>Priority: {props.priority}</Text>
        <Text>Description: {props.description}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({

    row:{
        padding:20,
    },

})

export default TaskView

