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
  StyleSheet,
  ListView,
  FlatList,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  AsyncStorage,
} from 'react-native';
import { Container, Input, Content,Button, Icon,Thumbnail, Fab, ListItem, Item,Body} from 'native-base';
import { StackNavigator } from 'react-navigation';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Drawer from 'react-native-drawer';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
var{width,height} = Dimensions.get('window');

//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Tes extends Component {
static navigationOptions = {
    header: null,
};

constructor(props){
    super(props);
    this.state = {
            username : null,
            password : null,
            user_id : null,
            status : 0, //0 untuk apoteker dan 1 untuk kasirselected : false,//state untuk mengontrol tombol back, fungsi onSelectScreen
            send_dialog : false, //state untuk menampilkan/menyembunyikan modal
            image_path : '',
            deskripsi : '',// deskripsi tentang foto yg akan di upload,
            data_chat : [{key : 1, align : 'flex-end'},{key : 2,align : 'flex_start'}], //array yg menampung semua data chat
        };
        this.items = [];
        this.get_user_id();
    }
    //fungsi yg akan di kirim sebagai parameter untuk menangani perubahan state tombol back
    onSelectScreen = data => {
        this.setState(data);
    };
    
    //control side bar atau drawer
    closeControlPanel = () => {
        this._drawer.close();
    };
    
    openControlPanel = () => {
        this._drawer.open();
    };
    //control side bar selesai
    
    //fungsi default
    componentWillMount() {
        //jalankan perintah untuk menangani tombol back
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }
    //fungsi default untuk menghilangkan atau destroy perintah di dalamnya
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }
    //fungsi default yg akan berjalan jika terjadi perubahan state
    componentDidUpdate=()=>{
        if(this.state.selected==true){
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
        this.setState({selected : false});
        }
    }
    //fungsi yg menangani tombol back
    backPressed = () => {
        // this.props.navigation.goBack();
        BackHandler.exitApp();
        return false;
    }
    //BUKA KAMERA UNTUK MENGAMBIL FOTO
    open_camera=()=>{
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true
        }).then(image => {
            // alert(JSON.stringify(image));
            this.setState({
                image_path : image.path,
                send_dialog : true
            });
        });
    }
    //upload chat
    upload_chat=()=>{
        RNFetchBlob.fetch('POST', 'http://192.168.43.69/dchat/upload_chat.php', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.image_path) },
                {name : 'user_id', data : this.state.user_id},
                {name : 'deskripsi', data : this.state.deskripsi}
            ]).then((resp) => {
                this.setState({
                    send_dialog : false
                });
                // this.imageEventUrl.push({"imageName" : resp.data});
            }).catch((err) => {
                alert('error : ' + err);
            });
    }
    
    //ambil id user untuk keperluan upload chat
    get_user_id=()=>{
        AsyncStorage.multiGet(['user_id']).then((data) => {
            this.setState({
                user_id :  data[0][1]
            });
        });
    }
//ambil data chat dari database
get_chat=()=>{
    fetch('http://192.168.43.69/dchat/get_chat.php',{
        method : 'POST',
        headers :{
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
          key : 'getData'
        })
      }).then((response)=>response.json()).then((res)=>{
         // alert(JSON.stringify(res));
         let path = "http://192.168.43.69/dchat/";
        for(var i = 0; i < res.length; i++){
            if( res[i][1] == this.state.user_id){
                var align = 'flex-end';
                var background_color = 'rgba(44, 69, 232, 0.5)';
            }
            else{
                var align = 'flex-start';  
                var background_color = 'rgba(116, 162, 237,0.5)';             
            }
          this.items.push({id : res[i][0], user_id : res[i][1], path_gambar : path+res[i][2], deskripsi : res[i][3], waktu : res[i][4], posisi_chat : align, background_color : background_color});
        }
        this.setState({
          data_chat : this.items
        });
        this.scrollToBottom();
        //this.flatListRef.scrollToIndex({animated: true, index:3});
       // alert(JSON.stringify(this.state.data_chat));
      }).catch((err)=>{
        alert(err);
      });
}

componentWillMount(){
    this.get_chat();
}
  
  getItemLayout = (data, index) => (
    { length: 200, offset: 300 * index, index }
  )
  
  getColor(index) {
    const mod = index%3;
    return COLORS[mod];
  }
  
  scrollToIndex = () => {
    let randomIndex = Math.floor(Math.random(Date.now()) * this.items.length);
    this.flatListRef.scrollToIndex({animated: false, index: 0});
  }

  scrollToBottom=()=>{
    let num_last = this.items.length-1;
    this.flatListRef.scrollToIndex({animated: false, index: num_last});
  }

  scrollToEnd=()=>{
      let last = this.items.length;
      setTimeout(() => this.flatListRef.scrollToEnd(), 0)
  }
  
  scrollToItem = () => {
    let randomIndex = Math.floor(Math.random(Date.now()) * this.items.length);
    this.flatListRef.scrollToIndex({animated: true, index: "" + 2});
  }

  render() {
    return (
        <Drawer
        /** Drawer Content START **/
        ref={(ref)=>this._drawer=ref}
        type="static"
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          main: { opacity:(2-ratio)/2 }
        })}
    
      /** Content START **/
        content={
                
            /** isi dari sidebar START **/
            <View>
             {/** Bagian profil user START**/}
            <View style={{alignItems:'center', height: 150, justifyContent:'center', backgroundColor: '#1f88e5'}}>
                {/*
                <Image style={{alignSelf:'center', height: 80, width: 80, borderRadius : 90, borderWidth : 0.1, borderColor : "orange", marginTop : 10}} source={{uri:this.state.userProfilPicture}} />
                */}
               
            <View >
            <View style={{height : 80, width : 80,borderRadius : 40, backgroundColor : 'white', marginTop : 20,}}>
                <TouchableOpacity style={{height : 80, width : 80,borderRadius : 40, backgroundColor : 'white'}} onPress={()=>this.gotoProfile()}>
                <View style={{height : 80, width : 80, borderRadius : 40, position : 'absolute'}}>
                    <Icon name="person" style={{color : 'gray', textAlign : 'center', marginTop : 18, fontSize : 50}} />                        
                </View>
                <Image style={{alignSelf:'center', height: 80, width: 80, borderRadius : 40}} source={{uri:this.state.imagesUri}} />                
                </TouchableOpacity>
            </View>
           </View>
    
                <Text style={{fontSize:18, color : "white"}}>
                {this.state.username} {/** cetak nama user**/}
                </Text>
            </View>
            {/** Bagian profil user END **/}
            <Container>
                <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.tambahPasien()}>
                  <Icon name="ios-add" style={{color : '#353E4F'}}/>
                  <Text style={{marginLeft : 10, color : 'gray'}}>Tambah Pasien</Text>
                </Item>
                <Item style={{height : 50, paddingLeft : 10}} onPress={()=>alert('sss')}>
                  <Icon name="ios-trash" style={{color : '#353E4F'}}/>
                  <Text style={{marginLeft : 10, color : 'gray'}}>Hapus pasien</Text>
                </Item>
                <Item style={{height : 50, paddingLeft : 10}} onPress={()=>alert('sss')}>
                  <Icon name="ios-brush" style={{color : '#353E4F' ,fontSize : 20}}/>
                  <Text style={{marginLeft : 10, color : 'gray'}}>Edit Pasien</Text>
                </Item>
                <Item style={{height : 50, paddingLeft : 10}}>
                  <Icon name="exit" style={{color :  '#353E4F'}}/>
                  <Text style={{marginLeft : 10, color : 'gray'}}>Keluar</Text>
                </Item>
              </Container>
            </View>
            /** isi dari sidebar END **/
        }>
         <View style={styles.container}>
        {/* header bar */}
             <View style={{width : width, height : 80, backgroundColor :  '#1f88e5',flexDirection : 'row'}}>
                  <View style={{width : 50, height : 80}}>
                    <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}} onPress={()=>this.openControlPanel()}>
                        <Icon style={{color:'white', fontSize:30}} name='menu' />
                  </Button>
                  </View>
                  <View style={{width : width-50, height : 80, paddingLeft : 2, paddingTop : "8%"}}>
                      <Text style={{color : 'white', fontSize : 18}}>DChat</Text>
                  </View>
            </View>
            {/*list chat user*/}
            <FlatList
            style={{ flex: 1, width : width, padding : 10}}
            ref={(ref) => { this.flatListRef = ref; }}
            keyExtractor={item => item}
            data = {this.items}
            getItemLayout={this.getItemLayout}
            initialScrollIndex={2}
            initialNumToRender={2}
            renderItem={({ item, index}) => (
                <View>
                {/* warna chat dari orang lain'rgba(116, 162, 237,0.5)'
                    warna chat punya owner 'rgba(44, 69, 232, 0.5)'
            */}
                <View style={{alignSelf : item.posisi_chat,marginTop : 10,borderRadius : 5, backgroundColor : item.background_color, padding : 4, width : width/2}}>
                    <Image source={{uri : item.path_gambar}}  style={{height : 200, width : '100%', alignSelf : 'center'}}/>
                    <View>
                        <Text style={{color : 'black'}}>{item.deskripsi}</Text>
                    </View>
                </View>
            </View>
                )}
            {...this.props}
            />
        
            {/**tombol add gambar*/}
            <View style={{width : 50, height : 50, borderRadius : 25, position : 'absolute', bottom : 4, right : 4, backgroundColor : '#1f88e5'}}>
                <TouchableOpacity onPress={()=>this.open_camera()} style={{height : 50, width : 50, borderRadius : 25, alignItems : 'center', paddingTop : 12}}>
                    <Icon style={{color:'white', fontSize:25}} name='camera' />
                </TouchableOpacity>
            </View>
            {/*modal untuk menampilkan gambar yg difoto dan memberi deskripsi terhadap gambar tersebut*/}
            <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.send_dialog} onRequestClose ={()=>this.setState({send_dialog : false})}>
            <Content>
            <TouchableWithoutFeedback onPress={()=>this.setState({send_dialog : false})}>
                <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                <TouchableWithoutFeedback>
                    <View style={{backgroundColor : 'white', width : width-10, borderRadius : 5, alignSelf : 'center', marginTop : 100}}>
                    <View style={{height : 35, width : width-10, backgroundColor : '#1f88e5', borderTopLeftRadius : 5, borderTopRightRadius : 5 }}>
                        <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5}}>Tulis Pesan</Text>
                    </View>
                        {/*menampilkan gambar yg telah diambil dengan kamera*/}
                        <View>
                            <Image source={{uri : this.state.image_path}}  style={{height : 250, width : 250, alignSelf : 'center', marginTop : 10}}/>
                        </View>
                        {/*deskripsi foto yg akan dikirim*/}
                        <View style={{flexDirection : 'row',width : width-30, alignSelf : 'center', marginTop : 10, marginBottom : 10}}>
                            <TextInput multiline={false} underlineColorAndroid="transparent" style={{borderWidth : 1,borderColor : 'black', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, height : 50}} placeholder="Tulis sesuatu..." placeholderTextColor='black' onChangeText={(deskripsi)=>this.setState({deskripsi})}/>
                            {/*tombol kirim*/}
                            <TouchableOpacity onPress={()=>this.upload_chat()} style={{marginLeft : 10,backgroundColor : '#1f88e5', width : 50, height : 50, borderRadius : 25}}>
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
      </Drawer>
    );
  }
}

const drawerStyles = {
    drawer: { width:width,shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 1},

  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white'
    },
  });