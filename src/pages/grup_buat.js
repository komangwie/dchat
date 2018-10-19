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

export default class Grup_buat extends Component<{}> {
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
                name : '',//nama lengkap,
                nama_grup : '',
                data_chat : [],
                list_anggota : [],
                image : '',
                gambar : 'no',
                //modal
                select_image_modal : false,
                //ip adress server
                ipadress : ''
            };
            this.items = [];
            this.anggota = [];
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
        // navigation.state.params.onSelectScreen({ selected: true });
        return true;
    }
     //back ketika berhasil membuat grup
     backPressed_on_complete = () => {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.update_listGroup({ selected: true });
        return true;
    }
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
    //ambil data list pegawai
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
             <TouchableOpacity style={{width : width}} onPress={()=>this.tambah_anggota(uname)}>
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
    //mencetak list anggota grupyg baru ditambahkan
    cetak_anggota_grup=(uname)=>{
        let list_pegawai = 
        <TouchableOpacity style={{height : 80}} onPress={()=>this.remove_anggota(uname)}>
            <View style={{height : 60,marginTop : 5,width : 60, marginLeft : 10, alignItems : 'center'}}>
                <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : 'blue'}}>
                    <Icon style={{color:'white', fontSize:35, marginTop : 8, textAlign : 'center'}} name='person' />
                </View>
                <View style={{marginTop : 5}}>
                    <Text style={{color : 'black'}}>{uname}</Text>
                </View>
            </View>
        </TouchableOpacity>
        ;
    return(<View>{list_pegawai}</View>);
    }
    //BUKA KAMERA UNTUK MENGAMBIL FOTO
    open_camera=()=>{
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            compressImageQuality : 0.5,//kualitas foto dr rentang 0 - 0.8
            cropping: true
        }).then(image => {
            this.setState({
                image : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                gambar : 'yes'
            });
            
        });
    }
    //BUKA GALLERY UNTUK MEMILIH FOTO
    open_gallery=()=>{
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true
          }).then(image => {
            this.setState({
                image : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                gambar : 'yes'
            });
          });    
    }
    //fungsi yang d butuhkan untuk melakukan scrollToen/bottom pd FlatList anggota baru
    getItemLayout_anggota = (data, index) => (
        { length: 160, offset: 160 * index, index }
    )
    //scroll ke user paling terakhir ditambahkan
    scrollToEnd_anggota=()=>{
        let last = this.items.length;
        setTimeout(() => this.anggotaListRef.scrollToEnd(), 0)
    }
    //jika user sudah ada diklik lagi maka akan dilakukan scroll ke user bersangkutan
    scrollToItem_anggota = (index) => {
        this.anggotaListRef.scrollToIndex({animated: true, index: index});
    }
    //ketika user memilih angota maka anggota akan bertambah pada horizontal list
    //reference on cetak_list_pegawai
    tambah_anggota=(uname)=>{
        var found = this.anggota.find(function(element) {
            return element.uname === uname;
        });
       
        if(!found){
            this.anggota.push({uname : uname});
            this.setState({
                list_anggota : this.anggota
            });
            this.scrollToEnd_anggota();        
        }
        else{
            var index = this.anggota.findIndex(element => element.uname === uname);
            this.scrollToItem_anggota(index);
        }
    }
     //reference on FlatList
    render_FlatList_header = () => {
        var header_View = (
        <View style={{width : width, height : 50, backgroundColor :'rgba(180,180,180,0.1)'}}>
            <Text style={{textAlign : 'center', marginTop : 10}}>Pilih anggota grup</Text>
        </View>
        );
        return header_View ;
    }
    //proses buat grup
    buat_grup=()=>{
        if(this.state.nama_grup == '')
        {
            ToastAndroid.showWithGravity(
                'Nama grup tidak boleh kosong!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
        else{
            if(this.anggota.length == 0){
                ToastAndroid.showWithGravity(
                    'Silakan pilih anggota!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
            else{
                    //buat grup
                    RNFetchBlob.fetch('POST', this.state.ipadress+'/dchat/grup_buat.php', {
                        Authorization: "Bearer access-token",
                        otherHeader: "foo",
                        'Content-Type': 'multipart/form-data',
                    }, [
                            // element with property `filename` will be transformed into `file` in form data
                            { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.image) },
                            {name : 'uname', data : this.state.uname},
                            {name : 'uname_anggota', data : JSON.stringify(this.state.list_anggota)},
                            {name : 'nama_grup', data : this.state.nama_grup},
                            {name : 'gambar', data : this.state.gambar}
                    ]).then((resp) => {
                          this.backPressed_on_complete();
                    }).catch((err) => {
                        Alert.alert(
                            'Kesalahan',
                            'Terjasi kesalah saat membuat grup',
                            [
                                {text : 'ok'}
                            ],
                            {cancelable : false}
                        );
                    });
                
            }
        }
    }
    //hapus anggota
    remove_anggota=(uname)=>{
        var index = this.anggota.findIndex(element => element.uname === uname);
        this.anggota.splice(index,1);
        this.setState({
            list_anggota : this.anggota
        });
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
                        <Text style={{color : 'white', fontSize : 18}}>Buat grup</Text>
                    </View>
                    {/*tombol utk membuat grup baru
                    <View style={{width : 50, height : 80, position :'absolute', right : 10, top : 10}}>
                        <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}}>
                            <Icon style={{color:'white', fontSize:35}} name='ios-add' />
                        </Button>
                    </View>
                    */}
                </View>
                {/*Bagian nama grup dan foto grup*/}
                <View style={{ borderBottomWidth :0.5, borderBottomColor : 'gray'}}>
                    <View style={{height :80, width: width, padding : 10, flexDirection : 'row'}}>
                        <View style={{height : 60, width : 60, borderRadius : 30}}>
                            <TouchableOpacity onPress={()=>this.setState({select_image_modal : true})} style={{height : 60, width : 60, borderRadius : 30, backgroundColor : '#1f88e5'}}>
                                <Icon style={{color:'white', fontSize:35, textAlign : 'center', marginTop : '20%'}} name='ios-camera' />
                                <View style={{position : 'absolute'}}>
                                    <Image source={{uri : this.state.image}} style={{height : 60, width : 60, borderRadius : 30}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{height : 40, width : width-100, marginLeft : 10, marginTop : '5%'}}>
                            <TextInput underlineColorAndroid='black' placeholderTextColor='gray' placeholder='Nama grup' style={{color : 'black'}} onChangeText={(nama_grup)=>this.setState({nama_grup})}/>
                        </View>
                    </View>
                     {/*list anggota yg telah dipilih berbentuk horizontal*/}
                    <View style={{height : 100}}>
                    <FlatList
                        ref={(ref) => { this.anggotaListRef = ref; }}
                        keyExtractor={item => item.uname}
                        data = {this.state.list_anggota}
                        horizontal
                        getItemLayout={this.getItemLayout_anggota}
                        initialScrollIndex={0}
                        initialNumToRender={2}
                        contentInset={{ bottom: 0 }}
                        renderItem={({ item, index}) => this.cetak_anggota_grup(item.uname)}
                        {...this.props}
                    />
                    </View>
                    <TouchableOpacity onPress={()=>this.buat_grup()} style={{width : width-100, height : 40, backgroundColor :'#1f88e5', alignSelf : 'center', borderRadius : 20, marginBottom : 5}}>
                        <Text style={{color : 'white', textAlign : 'center', marginTop : 10}}>Buat grup</Text>
                    </TouchableOpacity>
                </View>
                

                {/*list pegawai*/}
                <View style={{ flex: 1, height : height, width : width}}>
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data = {this.state.data_chat}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={0}
                    initialNumToRender={2}
                    contentInset={{ bottom: 0 }}
                    ListHeaderComponent={this.render_FlatList_header}
                    renderItem={({ item, index}) => this.cetak_list_pegawai(item.uname, item.name, item.usergroup)}
                    {...this.props}
                />
                </View>
                  {/*modal untuk menampilkan pilihan dari kamera atau dari galerry*/}
                  <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.select_image_modal} onRequestClose ={()=>this.setState({select_image_modal : false})}>
                    <TouchableWithoutFeedback onPress={()=>this.setState({select_image_modal: false})}>
                        <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                        <TouchableWithoutFeedback>
                            <View style={{backgroundColor : 'white', borderTopLeftRadius : 5, borderTopRightRadius : 5, width : width-100, alignSelf : 'center', marginTop : height/2.5}}>
                                <View style={{height : 35, width : width-100, backgroundColor : '#1f88e5', borderTopLeftRadius : 5, borderTopRightRadius : 5 }}>
                                    <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5}}>Pilih Gambar</Text>
                                </View>
                                <TouchableOpacity onPress={()=>this.open_camera()} style={{height : 40}}>
                                    <Text style={{color : 'black', fontSize : 16, marginTop : 10, marginLeft : 15}}>Pilih dari kamera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.open_gallery()} style={{height : 40}}>
                                    <Text style={{color : 'black', fontSize : 16, marginTop : 10, marginLeft : 15}}>Pilih dari Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
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