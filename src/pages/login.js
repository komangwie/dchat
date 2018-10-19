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
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  AsyncStorage,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ToastAndroid
} from 'react-native';
import { Content, Icon } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';

var{width,height} = Dimensions.get('window');
//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Login extends Component<{}>{

static navigationOptions = {
  header: null,
}; 

constructor(props){
  super(props);
  this.state = {
        username : null,
        password : null,
        selected : false,
        setting : false,
        ipadress : ''
  };
  this.get_ip();
}

//fungsi untuk memanage tombol back
onSelect = data => {
    this.setState(data);
};

//fungsi untuk pergi ke halaman 'Home_page
goto_Home_page=()=>{
    const { navigate } = this.props.navigation;
    navigate('Home_page');
}
//fungsi yg berjalan secara otomatis
componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}
//fungsi yg secara otomatis berjalan
componentWillUnmount() {
    //memberi perintah untuk menjalankan fungsi backpresses (tombol back)
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
 }
//fungsi untuk update state ketika ada state yg berubah
componentDidUpdate=()=>{    
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);  
}
 
 //fungsi tombol back
backPressed = () => {
   BackHandler.exitApp();
   return true;
}
//fungsi ambil ip adress sever dari cache
get_ip=()=>{
    AsyncStorage.multiGet(['ipadress']).then((data) => {
        this.setState({
            ipadress:  data[0][1]
        });
    });
}

//fungsi login
login=()=>{
    var username = this.state.username;
    var password = this.state.password;
    if(!username || !password){
        ToastAndroid.showWithGravity(
            'Pastikn semua data telah terisi!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    }
    else{
        //kirim data ke server
        fetch(this.state.ipadress+'/dchat/login.php',{
            method : 'POST',
            headers :{
              'Accept' : 'application/json',
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              username : this.state.username,
              password : this.state.password
            })
          }).then((response)=>response.json()).then((res)=>{
              if(res != "gagal"){
                // simpan session
                AsyncStorage.multiSet([
                  ["uname", res.uname],
                  ["pword", this.state.password],
                  ["usergroup", res.usergroup],
                  ["name", res.name]
                ]);
                //pindah ke halaman 'Home_page'
                const { navigate } = this.props.navigation;
                navigate('Home_page');
              }
              else{
                Alert.alert(
                    'Info',
                    'Username atau password salah!',
                    [
                      {text: 'ok'}
                    ],
                    { cancelable: false }
                );
              }
          }).catch((err)=>{
              Alert.alert(
                  'Gagal',
                  'Terjasi kesalahan saat menghubungkan ke server '+err,
                  [
                      {text : 'ok'}
                  ],
                  {cancelable : false}
              );
          });
    }
}

simpan_address=()=>{
    if(this.state.ipadress != ''){
        let add = 'http://'+this.state.ipadress;
        AsyncStorage.multiSet([
            ["ipadress", add],
          ]);
          Alert.alert(
            'Info',
            'Tersimpan',
            [
                {text : 'ok'}
            ],
            {cancelable : false}
        );
        this.setState({
            setting : false
        });
    }
    else{
        Alert.alert(
            'Info',
            'Pastikan data telah terisi!',
            [
                {text : 'ok'}
            ],
            {cancelable : false}
        );
    }
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
            
            <Content style={{width : width, height : height}}>
                <TouchableOpacity transparent light style={{marginLeft : 5, marginTop : 25, width : 25}} onPress={()=>this.setState({setting : true})}>
                            <Icon style={{color:'black', fontSize:30}} name='ios-settings' />
                </TouchableOpacity>
                <View>
                    <Image source={require('./../image/DChat_logo.png')}  style={{height : 155, width : 150, alignSelf : 'center', marginTop : 80}}/>
                </View>

                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 30, alignSelf : 'center'}}>
                    <Icon name="ios-person" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" style={{color : 'grey', width : width-120, marginLeft : 10, fontSize : 16}} placeholder="username" placeholderTextColor='grey' onChangeText={(username)=>this.setState({username})}/>
                </View>

                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 10, alignSelf : 'center'}}>
                    <Icon name="ios-key" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" secureTextEntry={true} style={{color : 'grey', width : width-120, marginLeft : 6, fontSize : 16}} placeholder="Password" placeholderTextColor='grey' onChangeText={(password)=>this.setState({password})}/>
                </View>
                {/*tombol login*/}
                <TouchableOpacity onPress={()=>this.login()} style={{ width: width-150,  height: 40,backgroundColor: '#1f88e5', borderRadius: 5, marginVertical: 25, justifyContent: 'center', alignSelf : 'center'}}>
                    <Text style={{fontSize : 18, color : 'white', textAlign : 'center'}}>Masuk</Text>
                </TouchableOpacity>
                <View style={{height : 20}}></View>
            </Content> 
             {/*modal untuk setting ip address*/}
             <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.setting} onRequestClose ={()=>this.setState({setting : false})}>
                <Content>
                <TouchableWithoutFeedback onPress={()=>this.setState({setting : false})}>
                    <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                    <TouchableWithoutFeedback>
                    <View style={{backgroundColor : 'white', width : width-10, borderRadius : 5, alignSelf : 'center', marginTop : height/3}}>
                    <View style={{height : 35, width : width-10, backgroundColor : '#1f88e5', borderTopLeftRadius : 5, borderTopRightRadius : 5 }}>
                        <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5}}>IP address</Text>
                    </View>
                        {/*Modal set ip server*/}
                        <View style={{flexDirection : 'row',width : width-30, alignSelf : 'center', marginTop : 10, marginBottom : 10}}>
                            <TextInput multiline={false} underlineColorAndroid="transparent" style={{borderWidth : 1,borderColor : 'black', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, height : 50}} placeholder="xx.xx.xx.xx/" placeholderTextColor='black' onChangeText={(ipadress)=>this.setState({ipadress})}/>
                            {/*tombol kirim*/}
                            <TouchableOpacity onPress={()=>this.simpan_address()} style={{marginLeft : 10,backgroundColor : '#1f88e5', width : 50, height : 50, borderRadius : 25}}>
                                <Icon name="ios-send" style={{color : "white", textAlign : 'center', fontSize : 30, marginTop : 10}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                </Content>
                </Modal>
		</View>
		);
	}
}
