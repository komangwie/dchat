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
import ImageResizer from 'react-native-image-resizer';

var{width,height} = Dimensions.get('window');

//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Home_page extends Component<{}> {
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
                status : 0, //0 untuk apoteker dan 1 untuk kasirselected : false,//state untuk mengontrol tombol back, fungsi onSelectScreen
                image_path : '',
                deskripsi : '',// deskripsi tentang foto yg akan di upload,
                image_size : null,//ukkuran file image
                data_chat : [], //array yg menampung semua data chat
                chat_length : null,//agar saat pertama dibuka chat paling terakhir menjadi fokus
                selected_image_path : '',
                active_chat_id : null, //chat id yg sedang aktif, view, delete
                //modal control
                send_dialog : false, //state untuk menampilkan/menyembunyikan modal
                image_galerry_modal : false,//modal untuk menampilkan gambar yg dklik dari chat
                owner_modal : false,
                other_user_modal : false,
                select_image_modal : false,
                setting : false,
                //ip adress server
                ipadress : '',
                //state tombol back
                selected : false
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
        //ambil data chat / refresh setiap 5 detik
        timerId = setInterval(()=>this.get_chat_update(), 5000);
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
            compressImageQuality : 0.5,//kualitas foto dr rentang 0 - 0.8
            cropping: false
        }).then(image => {
            // console.log(image);
            // let size = image.size;
            // let quality = 100;
            // let path = image.path;
            // while(size > 1000000){
            //     ImageResizer.createResizedImage(path, 300, 200, "PNG", quality,0, null).then((response) => {
            //         // response.uri is the URI of the new image that can now be displayed, uploaded... 
            //         // response.path is the path of the new image 
            //         // response.name is the name of the new image with the extension 
            //         // response.size is the size of the new image 
            //         path = response.uri;
            //       }).catch((err) => {
            //         // Oops, something went wrong. Check that the filename is correct and 
            //         // inspect err to get more details. 
            //         //alert("Error has Occurred");
            //           Alert.alert(
            //             'In Map',
            //             'Error has Occurred!',
            //             [
            //               {text: 'OK'}],
            //             { cancelable: false }
            //           );
                    
            //       });
            //       quality = quality - 5;
            // }
            this.setState({
                image_path : image.path,//path image yg akan di kirim ke server (API)
                send_dialog : true, //menampilkan modal kirim gambar dan deskripsi/caption gambar
                image_size : ""+image.size+"",//ukuran gambar yang di ambil
                select_image_modal : false
            });
            
        });
    }
    //BUKA GALLERY UNTUK MEMILIH FOTO
    open_gallery=()=>{
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: false
          }).then(image => {
            let size = image.size;
            console.log('ori siz = '+size);
            let quality = 95;
            let path = image.path;
            let width = image.width;
            let height = image.height;
            console.log('w = '+width+'////// h = '+height);
            while(size > 10000){
                ImageResizer.createResizedImage(path, width, height, "PNG", 50,0, null).then((response) => {
                    // response.uri is the URI of the new image that can now be displayed, uploaded... 
                    // response.path is the path of the new image 
                    // response.name is the name of the new image with the extension 
                    // response.size is the size of the new image 
                    path = response.uri;
                    console.log(JSON.stringify(response));
                  }).catch((err) => {
                    // Oops, something went wrong. Check that the filename is correct and 
                    // inspect err to get more details. 
                    //alert("Error has Occurred");
                      Alert.alert(
                        'In Map',
                        'Error has Occurred!',
                        [
                          {text: 'OK'}],
                        { cancelable: false }
                      );
                    
                  });
                  quality = quality - 5;
            }
            this.setState({
                image_path : image.path,//path image yg akan di kirim ke server (API)
                send_dialog : true, //menampilkan modal kirim gambar dan deskripsi/caption gambar
                image_size : ""+image.size+"",//ukuran gambar yang di ambil
                select_image_modal : false
            });
          });    
    }
    //upload chat
    upload_chat=()=>{
        RNFetchBlob.fetch('POST', this.state.ipadress+'/dchat/upload_chat.php', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.image_path) },
                {name : 'uname', data : this.state.uname},
                {name : 'deskripsi', data : this.state.deskripsi},
                {name : 'image_size', data : this.state.image_size}
            ]).then((resp) => {
                this.setState({
                    send_dialog : false,
                    deskripsi : '',
                    image_path : ''
                });
                this.get_chat_update();
                // this.imageEventUrl.push({"imageName" : resp.data});
            }).catch((err) => {
                // alert('error : ' + err);
                Alert.alert(
                    'Kesalahan',
                    'Terjasi kesalah saat mengirim pesan',
                    [
                        {text : 'ok'}
                    ],
                    {cancelable : false}
                );
            });
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
            this.get_chat();
        });
    }
    //ambil data chat dari database ketika app pertama kali dibuka
    //reference on constructor
    get_chat=()=>{
        fetch(this.state.ipadress+'/dchat/get_chat.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
            key : 'getData'
            })
        }).then((response)=>response.json()).then((res)=>{
            //  alert(JSON.stringify(res));
           
            if(res != 0){
                let path = this.state.ipadress+"/dchat/";
                for(var i = 0; i < res.length; i++){
                    if( res[i][1] == this.state.uname){
                        var align = 'flex-end';
                        var background_color = 'rgba(44, 69, 232, 0.5)';
                    }
                    else{
                        var align = 'flex-start';  
                        var background_color = 'rgba(116, 162, 237,0.5)';             
                    }
                     //nama group kasir/apoteker
                     if(res[i][5] == 12){
                        var nama_group = 'kasir';
                    }
                    else{
                        var nama_group = 'apoteker';
                    }
                this.items.push({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][2], server_path : res[i][2], deskripsi : res[i][3], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : res[i][5], nama_group : nama_group});
                // this.items = this.items.filter((x)=> x.id !== res[i][0]);
                 }
                this.setState({
                    data_chat : this.items,
                    chat_length : res.length-1
                });
            }
        // alert(JSON.stringify(this.state.data_chat));
        }).catch((err)=>{
            alert(err);
        });
    }
    //ambil data chat dari database ketika ada perubahan seprti baru kirim chat
    //fungis ini juga di panggil setiap 5 detik
    //reference on componetnWillMount, uploadChat
    get_chat_update=()=>{
        fetch(this.state.ipadress+'/dchat/get_chat.php',{
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
            if(res != 0){
                let path = this.state.ipadress+"/dchat/";

                if(res.length >= this.items.length){
                    for(var i = 0; i < res.length; i++){
                        if( res[i][1] == this.state.uname){
                            var align = 'flex-end';
                            var background_color = 'rgba(44, 69, 232, 0.5)';
                        }
                        else{
                            var align = 'flex-start';  
                            var background_color = 'rgba(116, 162, 237,0.5)';             
                        }
                        //nama group kasir/apoteker
                        if(res[i][5] == 12){
                            var nama_group = 'kasir';
                        }
                        else{
                            var nama_group = 'apoteker';
                        }

                        var found = this.items.find(function(element) {
                            return element.id == res[i][0];
                        });
    
                        if(!found){
                             this.items.unshift({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][2], server_path : res[i][2], deskripsi : res[i][3], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : res[i][5], nama_group : nama_group});
                        }
                    
                     }
                    this.setState({
                        data_chat : this.items,
                        chat_length : res.length-1
                    });
                }
                else{
                    var tmp=[];
                    var dat = this.items;
                    for(var i = 0; i < res.length; i++){
                        if( res[i][1] == this.state.uname){
                            var align = 'flex-end';
                            var background_color = 'rgba(44, 69, 232, 0.5)';
                        }
                        else{
                            var align = 'flex-start';  
                            var background_color = 'rgba(116, 162, 237,0.5)';             
                        }
                        //nama group kasir/apoteker
                        if(res[i][5] == 12){
                            var nama_group = 'kasir';
                        }
                        else{
                            var nama_group = 'apoteker';
                        }
                        tmp.push({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][2], server_path : res[i][2], deskripsi : res[i][3], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : res[i][5], nama_group : nama_group});
                     }
                    
                     for(var i = 0; i < this.items.length; i++){
                        var found = tmp.findIndex(function(element) {
                            return element.id == dat[i].id;
                        });
                     
                        if(found == -1){
                            var removed = dat.splice(i,1);
                        }
                     }
                    this.items = dat;
                    // alert(JSON.stringify(found));
                    this.setState({
                        data_chat : this.items,
                        chat_length : res.length-1
                    });
                }
            }
        // alert(JSON.stringify(this.state.data_chat));
        }).catch((err)=>{
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
    //fungsi untuk membuka/melihat image yg di klik pada chat
    //reference on TouchableOpacity onpress pd chat
    view_image=(path)=>{
        this.setState({
            image_galerry_modal : true,
            selected_image_path : path
        });
    }
    //fungsi untuk menampilkan menu ketika chat di longpress
    //user hanya bisa menghapus jika jabatannya sama
    //jabatan 0 = apoteker
    //jabatan 1 = kasir
    //modal untuk user dengan jabatan sama berada pada kondisi if, sedangkan pada jabatan yg berbeda ada pd else
    //reference on touchableopacity longpress pd chat
    open_menu=(uname, id, usergroup, path_gambar)=>{
        if(usergroup == this.state.usergroup){
            this.setState({
                owner_modal : true,
                active_chat_id : id,
                selected_image_path : path_gambar
            });
        }
        else{
            this.setState({
                other_user_modal : true,
                active_chat_id : id,
                selected_image_path : path_gambar
            });
        }
    }
    //fungsi untuk menghapus chat (gambar dan text chat), dan memanggil fungsi dibawahnya (hapus())
    //reference on modal pd chat longpress
    delete_chat=()=>{
        Alert.alert(
            'Hapus pesan',
            'Apakah Anda yakin ingin menghapus pesan ini?',
            [
              {text: 'yes', onPress: () => this.hapus()},
              {text: 'no', onPress: ()=> this.setState({owner_modal : false})},
            ],
            { cancelable: false }
        );
    }
    //reference on delete_chat()
    hapus=()=>{
        let image_path = this.state.selected_image_path;
        fetch(this.state.ipadress+'/dchat/delete_chat.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                image_path : image_path,
                chat_id : this.state.active_chat_id
            })
        }).then((response)=>response.json()).then((res)=>{
            // alert(JSON.stringify(res));
            this.setState({
                owner_modal : false
            });

        }).catch((err)=>{
            alert(err);
        });
    }
    // fungsi untuk mendownload gambar ke storage
    download_to_storage=()=>{
        let path = this.state.ipadress+"/dchat/images/chat/"+this.state.selected_image_path;
        RNFetchBlob
        .config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          fileCache : true,
        })
        .fetch('GET', path, {
          //some headers ..
        })
        .then((res) => {
          // the temp file path
          alert('The file saved to ', res.path())
        })
    }
    //LOGOUT
    //reference on sidebar => keluar
    logout=()=>{
        let keys = ['uname', 'pword', 'usergroup'];
        AsyncStorage.multiRemove(keys, (err) => {
            alert("Logged out!");
        });
        BackHandler.exitApp();
        return false;
    }
    //untuk menambahkan header sebagai gap di bagian bottom list chat
    //reference on FlatList
    render_FlatList_header = () => {
       var header_View = (
       <View style={{width : width, height : 70}}></View>
       );
       return header_View ;
    }
    //fungsi untuk pindah ke halaman Daftar_pegawai
    goto_daftar_pegawai=()=>{
        const { navigate } = this.props.navigation;
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
        navigate("Daftar_pegawai", { onSelectScreen: this.onSelectScreen });
    }
    //fungsi untuk pindah ke halaman Daftar_pesan
    goto_daftar_pesan=()=>{
        const { navigate } = this.props.navigation;
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
        navigate("Daftar_pesan", { onSelectScreen: this.onSelectScreen });
    }
    //simpan ip address pd menu setting
    simpan_address=()=>{
        if(this.state.ipadress != ''){
            let add = this.state.ipadress;
            AsyncStorage.multiSet([
                ["ipadress", add],
              ]);
              ToastAndroid.showWithGravity(
                'Tersimpan!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            this.setState({
                setting : false
            });
        }
        else{
            ToastAndroid.showWithGravity(
                'Pastikan data telah tersi!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
    }
    //buka setting pada sidebar
    buka_setting=()=>{
        this.closeControlPanel();
        this.setState({setting : true});
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
                    <TouchableOpacity style={{height : 80, width : 80,borderRadius : 40, backgroundColor : 'white'}} >
                    <View style={{height : 80, width : 80, borderRadius : 40, position : 'absolute'}}>
                        <Icon name="person" style={{color : 'gray', textAlign : 'center', marginTop : 18, fontSize : 50}} />                        
                    </View>
                    <Image style={{alignSelf:'center', height: 80, width: 80, borderRadius : 40}} source={{uri:this.state.imagesUri}} />                
                    </TouchableOpacity>
                </View>
            </View>
        
                    <Text style={{fontSize:18, color : "white"}}>
                    {this.state.name} {/** cetak nama user**/}
                    </Text>
                </View>
                {/* Bagian profil user END
                 */}
                 <View style={{ height : height, width : '100%'}}>
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.goto_daftar_pegawai()}>
                        <Icon name="ios-people" style={{color : '#353E4F'}}/>
                        <Text style={{marginLeft : 8, color : 'gray'}}>Daftar Pegawai</Text>
                    </Item>
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.goto_daftar_pesan()}>
                        <Icon name="ios-chatbubbles" style={{color : '#353E4F'}}/>
                        <Text style={{marginLeft : 8, color : 'gray'}}>Daftar Pesan</Text>
                    </Item>
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>alert('asss')}>
                    <Icon name="ios-grid" style={{color : '#353E4F'}}/>
                    <Text style={{marginLeft : 10, color : 'gray'}}>Lihat semua foto</Text>
                    </Item>
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.buka_setting()}>
                        <Icon name="ios-settings" style={{color : '#353E4F'}}/>
                        <Text style={{marginLeft : 10, color : 'gray'}}>Pengaturan</Text>
                    </Item>
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.logout()}>
                        <Icon name="exit" style={{color :  '#353E4F'}}/>
                        <Text style={{marginLeft : 10, color : 'gray'}}>Keluar</Text>                 
                    </Item>
                 </View>
                </View> 
               
            }>
            <View style={styles.container}>
                {/* header bar */}
                <View style={{width : width, height : 80, backgroundColor :  '#1f88e5',flexDirection : 'row', paddingTop : 10}}>
                    <View style={{width : 50, height : 80}}>
                        <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}} onPress={()=>this.openControlPanel()}>
                            <Icon style={{color:'white', fontSize:30}} name='menu' />
                    </Button>
                    </View>
                    <View style={{width : width-50, height : 80, paddingLeft : 2, paddingTop : "8%"}}>
                        <Text style={{color : 'white', fontSize : 18}}>DChat group</Text>
                    </View>
                    <View style={{width : 50, height : 80, position : 'absolute', right : 5, top : '20%'}}>
                        <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}} onPress={()=>this.get_chat_update()}>
                            <Icon style={{color:'white', fontSize:30}} name='refresh' />
                        </Button>
                    </View>
                </View>
                
                {/*list chat user*/}
                <View style={{ flex: 1, height : height, width : width}}
                   >
                <FlatList
                    style={{paddingHorizontal : 10}}
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data = {this.state.data_chat}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={0}
                    initialNumToRender={2}
                    ListHeaderComponent={this.render_FlatList_header}
                    contentInset={{ bottom: 0 }}
	                inverted
                    renderItem={({ item, index}) => (
                        <View>
                        {/* warna chat dari orang lain'rgba(116, 162, 237,0.5)'
                            warna chat punya owner 'rgba(44, 69, 232, 0.5)'
                    */}
                        <TouchableOpacity style={{width : width/2, alignSelf : item.posisi_chat,}} onPress={()=>this.view_image(item.path_gambar)} onLongPress={()=>this.open_menu(item.uname, item.id,item.usergroup, item.server_path)}>
                            <View style={{marginTop : 10,borderRadius : 5, backgroundColor : item.background_color, padding : 4, width : width/2}}>
                                <Text>{item.uname} ~ {item.nama_group}</Text>
                                <Image source={{uri : item.path_gambar}}  style={{height : 200, width : '100%', alignSelf : 'center'}}/>
                                <View>
                                    <Text style={{color : 'black'}}>{item.deskripsi}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                        )}
                    {...this.props}
                />
                </View>
                {/**tombol add gambar*/}
                <View style={{width : 50, height : 50, borderRadius : 25, position : 'absolute', bottom : 4, right : 4, backgroundColor : '#1f88e5'}}>
                    <TouchableOpacity onPress={()=>this.setState({select_image_modal : true})} style={{height : 50, width : 50, borderRadius : 25, alignItems : 'center', paddingTop : 12}}>
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

                 {/*modal untuk menampilkan gambar setelah gambar di klik*/}
                 <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.image_galerry_modal} onRequestClose ={()=>this.setState({image_galerry_modal : false})}>
                <Content>
                <TouchableWithoutFeedback onPress={()=>this.setState({image_galerry_modal : false})}>
                    <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                    <TouchableWithoutFeedback>
                        <View style={{backgroundColor : 'white', width : width, height : height, alignSelf : 'center'}}>
                            <Gallery
                                style={{ flex: 1, backgroundColor: 'black' }}
                                images={[
                                { source: { uri: this.state.selected_image_path } }
                                ]}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                </Content>
                </Modal>
                {/*modal untuk menampilkan pilihan ketika user mengklik chat yg dikirm oleh jabatan = jabatan owner*/}
                <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.owner_modal} onRequestClose ={()=>this.setState({owner_modal : false})}>
                    <TouchableWithoutFeedback onPress={()=>this.setState({owner_modal : false})}>
                        <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                        <TouchableWithoutFeedback>
                            <View style={{backgroundColor : 'white', width : width-100, alignSelf : 'center', marginTop : height/2.5}}>
                                <TouchableOpacity onPress={()=>this.delete_chat()} style={{height : 40}}>
                                    <Text style={{color : 'black', fontSize : 16, marginTop : 10, marginLeft : 15}}>Hapus</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{height : 40}}>
                                    <Text style={{color : 'black', fontSize : 16, marginTop : 10, marginLeft : 15}} onPress={()=>this.download_to_storage()}>Unduh gambar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                 {/*modal untuk menampilkan pilihan ketika user mengklik chat yg dikirm oleh jabatan != jabatan owner*/}
                 <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.other_user_modal} onRequestClose ={()=>this.setState({other_user_modal : false})}>
                    <TouchableWithoutFeedback onPress={()=>this.setState({other_user_modal : false})}>
                        <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                        <TouchableWithoutFeedback>
                            <View style={{backgroundColor : 'white', width : width-100, alignSelf : 'center', marginTop : height/2.5}}>
                                <TouchableOpacity style={{height : 40}}>
                                    <Text style={{color : 'black', fontSize : 16, marginTop : 10, marginLeft : 15}}>Unduh gambar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
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
                            <TextInput value={this.state.ipadress} multiline={false} underlineColorAndroid="transparent" style={{borderWidth : 1,borderColor : 'black', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, height : 50}} placeholder="xx.xx.xx.xx/" placeholderTextColor='black' onChangeText={(ipadress)=>this.setState({ipadress})}/>
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