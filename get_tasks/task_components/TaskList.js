import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Consumer } from '../core/context';
import TaskView from './TaskView'

export class TaskList extends Component {


    // renderItem = ({item}) => <TaskView key={item.key} id={item.key} priority={item.priority} description={item.description}/>

    

    render() {
        
        return (
        <Consumer>
            {({issue, tasks, updateTask}) => (

                issue   ? 
                <View style={{justifyContent:"center"}}>
                    <Text>Error</Text>
                </View> 
                       
                       : 
                
                <View style={{paddingTop:50}}>
                    {tasks && 
                    (<FlatList
                        data = {tasks}
                        renderItem = {({item}) => <TaskView onUpdateTask={updateTask} onSelectTask={this.props.onSelectItem} id={item.id} priority={item.priority} description={item.description}/>}
                        keyExtractor={(item) => item.id.toString()}

                    />)    

                    }
                </View>

            )}
            
        </Consumer>
        )
    }
}
