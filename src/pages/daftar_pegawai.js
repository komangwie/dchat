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
  FlatList,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  AsyncStorage,
  Alert,
  ToastAndroid
} from 'react-native';
import { Container, Input, Content,Button, Icon,Thumbnail, Fab, ListItem, Item,Body} from 'native-base';
import { StackNavigator } from 'react-navigation';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Drawer from 'react-native-drawer';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import Gallery from 'react-native-image-gallery';

var{width,height} = Dimensions.get('window');

//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Daftar_pegawai extends Component<{}> {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        let timerId;
        this.state = {
                uname : null,//as user id
                pword : null,
                usergroup : null, //sebagai apoteker atau kasir, 12 utk kasir, 21 untk apoteker
                name : '',//nama lengkap
                //ip adress server
                ipadress : ''
            };
            this.items = [];
            this.get_user_id();
    }
    //fungsi yg akan di kirim sebagai parameter untuk menangani perubahan state tombol back
    onSelectScreen = data => {
        this.setState(data);
    };

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
        navigation.state.params.onSelectScreen({ selected: true });
        return true;
    }
    //ambil id user untuk keperluan upload chat
    //tdk hanya id, nama_lengkap akan ditampilkan pd sidebar
    //jabatan akan di gunakan ketika longPress (tekan lama) pd chat, ini digunakan karena menu yg ditampilkan berbeda
    //antara chat kasir dengan chat milik apoteker
    //reference on constructor
    get_user_id=()=>{
        AsyncStorage.multiGet(['uname', 'usergroup', 'name', 'ipadress']).then((data) => {
            this.setState({
                uname :  data[0][1],
                usergroup : data[1][1],
                name : data[2][1],
                ipadress : data[3][1]
            });
        }).then(()=>{
            this.get_pegawai();
        });
    }
    //ambil data pegawai dari database
    //reference on get_user_id
    get_pegawai=()=>{
        fetch(this.state.ipadress+'/dchat/get_pegawai.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
            key : 'getData'
            })
        }).then((response)=>response.json()).then((res)=>{
            //   alert(JSON.stringify(res));

            if(res != 0){
                for(var i = 0; i < res.length; i++){
                    if( res[i][1] == 12){
                        var usergroup = 'Kasir';
                    }
                    else{
                        var usergroup = 'Apoteker';           
                    }
                this.items.push({uname : res[i][0], usergroup : usergroup, name : res[i][2]});
                 }
                this.setState({
                    data_chat : this.items,
                    chat_length : res.length-1
                });
            }
            else{
                ToastAndroid.showWithGravity(
                    'Daftar Pegawai masih kosong!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
        }).catch((err)=>{
            // alert(err);
        });
    }
    
    //fungsi yang d butuhkan untuk melakukan scrollToen/bottom pd FlatList
    getItemLayout = (data, index) => (
        { length: height/2, offset: (height/2) * index, index }
    )
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

    //pindah ke halaman char person to person
    goto_private_message=(uname, name, usergroup)=>{
        const { navigate } = this.props.navigation;
            navigate('Private_message', {uname : uname, name : name, usergroup : usergroup});
    }
    //cetak list pegawai, jika uname == user sekarang berarti dy tdk bisa mengklik dirinya sendiri
    cetak_list_pegawai=(uname, name, usergroup)=>{
       let list_pegawai;
        if(uname == this.state.uname){
            
            list_pegawai = 
                <View style={{ flexDirection : 'row', backgroundColor : 'rgba(180,180,180,0.2)', padding : 5, height : 60,marginTop : 5,width : width}}>
                    <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : 'blue'}}>
                         <Icon style={{color:'white', fontSize:35, marginTop : 8, textAlign : 'center'}} name='person' />
                    </View>
                    <View style={{marginLeft : 10, marginTop : 5}}>
                        <Text style={{color : 'black'}}>{uname}</Text>
                        <View>
                            <Text style={{color : 'gray', fontSize : 12}}>{name}</Text>
                        </View>
                    </View>
                    <View style={{position : 'absolute', right : 5, top : 20}}>
                        <Text>{usergroup}</Text>
                    </View>
                </View>
            ;
        }
        else{
            
            list_pegawai = 
            <TouchableOpacity style={{width : width}} onPress={()=>this.goto_private_message(uname,name,usergroup)}>
            <View style={{ flexDirection : 'row', padding : 5, height : 60,marginTop : 5,width : width}}>
                <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : 'blue'}}>
                     <Icon style={{color:'white', fontSize:35, marginTop : 8, textAlign : 'center'}} name='person' />
                </View>
                <View style={{marginLeft : 10, marginTop : 5}}>
                    <Text style={{color : 'black'}}>{uname}</Text>
                    <View>
                        <Text style={{color : 'gray', fontSize : 12}}>{name}</Text>
                    </View>
                </View>
                <View style={{position : 'absolute', right : 5, top : 20}}>
                    <Text>{usergroup}</Text>
                </View>
            </View>
            </TouchableOpacity>
        ;
        }
     return(<View>{list_pegawai}</View>);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* header bar */}
                <View style={{width : width, height : 80, backgroundColor :  '#1f88e5',flexDirection : 'row', paddingTop : 10}}>
                    <View style={{width : 50, height : 80}}>
                        <Button onPress={()=>this.backPressed()} transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}}>
                            <Icon style={{color:'white', fontSize:25}} name='arrow-back' />
                    </Button>
                    </View>
                    <View style={{width : width-50, height : 80, paddingLeft : 2, paddingTop : "8%"}}>
                        <Text style={{color : 'white', fontSize : 18}}>Daftar Pegawai</Text>
                    </View>
                </View>
                
                {/*list pegawai*/}
                <View style={{ flex: 1, height : height, width : width}}
                   >
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data = {this.state.data_chat}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={0}
                    initialNumToRender={2}
                    contentInset={{ bottom: 0 }}
                    renderItem={({ item, index}) => this.cetak_list_pegawai(item.uname, item.name, item.usergroup)}
                    {...this.props}
                />
                </View>
                </View>
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