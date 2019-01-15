import { httpApiUrl } from '../core/api';
import React, {Component} from 'react';
import {Provider} from '../core/context';
import {AsyncStorage} from 'react-native'
import { Accelerometer } from 'expo';

import SockJsClient from 'react-stomp';

const SockJS = require('@stomp/stompjs');
const Stomp = require('stompjs');

export default class TaskStore extends Component {

    constructor(props){
        super(props)

        this.state = {

            tasks: null,
            issue: null,
            updateTask: null,
            shouldHide: true,
            copyOfTasks: null,

        }
    }


    componentDidMount() {
        this.loadTasks();

        this._subscribeToAccelerometer()
        Accelerometer.setUpdateInterval(1000); 

        // this.connectToSocket()

    }

    connectCallback = () =>{
        console.log("connected")
    }

    errorCallback = error =>{
        console.log(error.headers.message);
    }

    connectToSocket = () =>{

        const client = Stomp.overWS('ws://192.168.0.104:8080/my-ws/websocket');
        client.connect("", "", this.connectCallback, errorCallback);

        let subscription = client.subscribe("/queue/test", function(message) {
            // called when the client receives a STOMP message from the server
            if (message.body) {
              console.log("got message with body " + message.body)
            } else {
              console.log("got empty message");
            }
          });




        // const socket = new SockJS('/spring-mvc-java/chat');
        // stompClient = Stomp.over(socket);  
        // stompClient.connect({}, function(frame) {
        //     setConnected(true);
        //     console.log('Connected: ' + frame);
        //     stompClient.subscribe('/topic/messages', function(messageOutput) {
        //         showMessageOutput(JSON.parse(messageOutput.body));
        //     });
        // })
        // .catch(e => console.log(e));

    }

    _subscribeToAccelerometer = () => {
        if (this._subscription) {
          this._unsubscribe();
        } else {
          this._subscribe();
        }
    }



    _subscribe = () => {
        this._subscription = Accelerometer.addListener(accelerometerData => {
    
            if(accelerometerData.z < 0 && this.state.shouldHide === true ){
                this.setState({shouldHide: false ,tasks: []})

            }
        

            else if(accelerometerData.z < 0 && !this.state.shouldHide){
                this.setState({shouldHide: true})
                this.getBackTasks()
            }
          
        });
      }

    getBackTasks = () =>{
        this._getPersistedTasks().then(retreivedTasks =>{

            console.log(retreivedTasks)

            this.setState({tasks: retreivedTasks})
        })
    }
    
    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    _updateTaskByIdLocally = task =>{

        const localCopyOfTasks = JSON.parse(JSON.stringify(this.state.tasks))

        const searchedTask = localCopyOfTasks.find(el => el.id === task.id)

        searchedTask.description = task.description
        searchedTask.priority = task.priority

        this.setState({tasks: localCopyOfTasks})
    }
    

    _updateTask = task => {

        this._updateTaskByIdLocally(task)

        this._persistTasksLocally(this.state.tasks).then(
            
            this._retrieveAuthorizationToken()
            .then(auth =>{
    
                fetch(`${httpApiUrl}/tasks/update`,{
                    method: 'PUT',
                    headers: {'content-type': 'application/json', 'Authorization': auth},
                    body: JSON.stringify(task),
                })
                .catch(error => this.setState({ issue: error }));
    
            })    

        )   
    }

    _retrieveAuthorizationToken = async () => {
        try {
          const value = await AsyncStorage.getItem('authorization');
          if (value !== null) {
                return value
            }
        } catch (error) {
           console.log(error)
        }
    }

    _getPersistedTasks = async () =>{
        try {
            const value = await AsyncStorage.getItem('tasks');
            if (value !== null) {
              // We have data!!
              return JSON.parse(value)
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    _persistTasksLocally = async tasks =>{
        AsyncStorage.setItem('tasks', JSON.stringify(tasks))
    }

    loadTasks = () => {
        
        this._retrieveAuthorizationToken().then(auth =>{

            fetch(`${httpApiUrl}/tasks`,{
                method: 'GET',
                headers: {'content-type': 'application/json', 'Authorization': auth},
            })
            .then(response => response.json())
            .then(tasks=>{

                console.log("INITIAL")
                console.log(tasks)

                this.setState({tasks: tasks, updateTask: this._updateTask}) 
                return tasks
                
            }).then(tasks => {
                this._persistTasksLocally(tasks)
            })
            .catch(error => this.setState({ issue: error }));

        })

        
        
    };

    render() {
        return (
        <Provider value={this.state}>
        <SockJsClient url='http://localhost:8080/ws' topics={['/topics/all']}
            onMessage={(msg) => { console.log(msg); }}
            ref={ (client) => { this.clientRef = client }} />
            {this.props.children}
        </Provider>
        );
    }
}