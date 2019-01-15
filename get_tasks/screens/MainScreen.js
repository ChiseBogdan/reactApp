import React from 'react';
import {View} from 'react-native'

import TaskStore from '../task_components/TaskStore';
import { TaskList } from '../task_components/TaskList';

export default class MainView extends React.Component{

  handleSelectTask = task =>{
    this.props.navigation.push('Update', task)
  }

  render(){

    return(

      <View>
        <TaskStore>
          <TaskList onSelectItem={this.handleSelectTask}/>
        </TaskStore>
      </View>

    )
  }

}