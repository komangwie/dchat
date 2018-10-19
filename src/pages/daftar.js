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
  AsyncStorage
} from 'react-native';
import { Content, Icon } from 'native-base';
import { StackNavigator } from 'react-navigation';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
var{width,height} = Dimensions.get('window');

export default class Daftar extends Component<{}>{

static navigationOptions = {
  header: null,
}; 

constructor(props){
  super(props);
  this.state = {
        username : null,
        password : null,
        repassword : null,
        nama_lengkap : null,
        jabatan : null,
        status : 0, //0 untuk apoteker dan 1 untuk kasir
  };
}
//fungsi default
componentWillMount() {
    //perintah tombol back
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
}
//fungsi defaut
componentWillUnmount() {
    //perintah tombol back
   BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
}
//fungsi yang menangani tombol back
backPressed = () => {
  const { navigation } = this.props;
  navigation.goBack();
  navigation.state.params.onSelect({ selected: true });
  return true;
}

//fungsi untuk pergi ke halaman 'Home_page
goto_Home_page=()=>{
    const { navigate } = this.props.navigation;
    navigate('Home_page');
}

//fungsi untuk daftar user baru
daftar=()=>{
    var username = this.state.username;
    var nama_lengkap = this.state.nama_lengkap;
    var password = this.state.password;
    var repassword = this.state.repassword;
    var jabatan = this.state.status;
    
     if(!username || !nama_lengkap || !password || !repassword){
        alert("Pastikan semua data telah terisi!");
     }
     else{
         if(password != repassword){
            alert("Password salah!");
         }
         else{
             //kirim data ke server
             fetch('http://192.168.43.69/dchat/daftar.php',{
                method : 'POST',
                headers :{
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                  username : this.state.username,
                  password : this.state.password,
                  nama_lengkap : this.state.nama_lengkap,
                  jabatan : this.state.status
                })
              }).then((response)=>response.json()).then((res)=>{
                  if(res == "berhasil"){
                    // simpan session
                    AsyncStorage.multiSet([
                      ["username", this.state.username],
                      ["password", this.state.password]
                    ]);
                    //pindah ke halaman 'Home_page'
                    const { navigate } = this.props.navigation;
                    navigate('Home_page');
                  }
                  else{
                    alert("email atau password salah");
                  }
              }).catch((err)=>{
                alert(err);
              });
        }
     }
}

render(){
    const { navigate } = this.props.navigation;
    var radio_props = [
        {label: 'Apoteker', value: 0 },
        {label: 'Kasir', value: 1 }
      ];
		return(
		<View style={{ flex: 1, alignItems: 'center',justifyContent: 'center',backgroundColor: 'white'}}>
            {/*status bar color and transparecy*/}
            <StatusBar
                backgroundColor = {"rgba(16, 19, 22,0.05)"}
                translucent
            />
            {/*header bar*/}
            <View style={{backgroundColor : '#1f88e5', width : width, height : 70, flexDirection : 'row'}}>
                <View style={{marginTop : 30, marginLeft : 10}}>
                    <TouchableOpacity style={{width : 20}} onPress={()=>this.backPressed()}>
                        <Icon name="ios-arrow-back" style={{color : "white", fontSize : 30}}/>
                    </TouchableOpacity>
                </View>
                <View style={{ width : width-80, marginTop : 30}}>
                    <Text style={{color : 'white', textAlign : 'center', fontSize : 18, marginTop : 5}}>Daftar</Text>
                </View>
            </View>  
            
            <Content style={{width : width, height : height}}>
                 {/*textbox username*/}
                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 30, alignSelf : 'center'}}>
                    <Icon name="ios-person" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" style={{color : 'grey', width : width-120, marginLeft : 10, fontSize : 16}} placeholder="Username" placeholderTextColor='grey' onChangeText={(username)=>this.setState({username})}/>
                </View>
                {/*textbox Nama lengkap*/}
                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 10, alignSelf : 'center'}}>
                    <Icon name="ios-person" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" style={{color : 'grey', width : width-120, marginLeft : 10, fontSize : 16}} placeholder="Nama Lengkap" placeholderTextColor='grey' onChangeText={(nama_lengkap)=>this.setState({nama_lengkap})}/>
                </View>
                {/*textbox Password*/}
                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 10, alignSelf : 'center'}}>
                    <Icon name="ios-key" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" secureTextEntry={true} style={{color : 'grey', width : width-120, marginLeft : 6, fontSize : 16}} placeholder="Password" placeholderTextColor='grey' onChangeText={(password)=>this.setState({password})}/>
                </View>
                 {/*textbox Ketik ulang password*/}
                <View style={{flexDirection : 'row',width : width-50, paddingLeft : 20, marginTop : 10, alignSelf : 'center'}}>
                    <Icon name="ios-key" style={{color : "grey", fontSize : 25, marginTop : 10}}/>
                    <TextInput underlineColorAndroid="grey" secureTextEntry={true} style={{color : 'grey', width : width-120, marginLeft : 6, fontSize : 16}} placeholder="Ketik Ulang Password" placeholderTextColor='grey' onChangeText={(repassword)=>this.setState({repassword})}/>
                </View>
                {/*Radio button untuk memilih kasir atau apoteker*/}
                <View style={{ width : width-100, alignSelf : 'center',  marginTop : 20}}>
                    <RadioForm
                        radio_props={radio_props}
                        initial={this.state.status}
                        labelHorizontal = {true}
                        formHorizontal = {false}
                        onPress={(value) => {this.setState({status:value})}}
                        
                    />
                </View>
                {/*Tombol Daftar*/}
                <TouchableOpacity onPress={()=>this.daftar()} style={{ width: width-150,  height: 40,backgroundColor: '#1f88e5', borderRadius: 5, marginVertical: 25, justifyContent: 'center', alignSelf : 'center'}}>
                    <Text style={{fontSize : 18, color : 'white', textAlign : 'center'}}>Daftar</Text>
                </TouchableOpacity>

                <View style={{marginTop : 10, width : width-120, alignSelf : 'center'}}>
                      <Text style = {{color : 'grey', textAlign : 'center'}}>Pastikan data yang anda masukkan telah benar.</Text>
                </View>
                <View style={{height : 20}}></View>
            </Content> 
		</View>
		);
	}
}
