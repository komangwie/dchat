/**
 * WRITTEN BY RH DEV CO
 */

import React, { Component } from 'react'; 
import {
  View,
  Image, 
  StatusBar,
  Dimensions,
  Animated,
  AsyncStorage
} from 'react-native';
import { Content, Icon } from 'native-base';
import { StackNavigator } from 'react-navigation';
var{width,height} = Dimensions.get('window');
export default class Splash_screen extends Component<{}>{

static navigationOptions = {
  header: null,
}; 

constructor(props){
  super(props);
  this.state = {
    animatedValue : new Animated.Value(0),
    interpolatedColorAnimation : null,
  };
  this.splashing();
}

splashing=()=>{
  const { navigate } = this.props.navigation
    Animated.timing(this.state.animatedValue, {
      toValue: 100,
      duration: 1000
    }).start(()=>{
      //cek asynstorage apakah user sebelumnya sudah login atau belum
      //jika belum arahkan ke halaman 'login'
      //jika sudah maka langsung ke 'Home_page'
      AsyncStorage.multiGet(['uname']).then((data) => {
        const { navigate } = this.props.navigation;
            let email = data[0][1];
  
            if(email!=null){
             navigate('Home_page');
            }
            else{
             navigate('Login');
            }
      });
    }); 
}

render(){
    const { navigate } = this.props.navigation
		return(
		    <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center',backgroundColor: 'white'}}>
             {/*status bar color and transparecy*/}
                <StatusBar
                    backgroundColor = {"rgba(16, 19, 22,0.05)"}
                    translucent
                />
                <View>
                    <Image source={require('./../image/DChat_logo.png')}  style={{height : 155, width : 150, alignSelf : 'center'}}/>
                </View>
		    </View>
		);
	}
}
