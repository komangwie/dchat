import React, { Component } from 'react'; 
import {
  View,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import {Content,Button, Icon, Item} from 'native-base';
import Drawer from 'react-native-drawer';
import Gallery from 'react-native-image-gallery';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
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
        this.state = {
                uname : null,//as user id
                pword : null,
                usergroup : null, //sebagai apoteker atau kasir, 12 utk kasir, 21 untk apoteker
                name : '',//nama lengkap,
                data_chat : [],
                isFetching : false,
                path : '',
                tmp_path : '',
                //ip adress server
                ipadress : '',
                //state tombol back
                selected : false,
                //modal
                setting : false,
                image_galerry_modal : false,
                select_image_modal : false
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
        timerId = setInterval(()=>this.get_percakapan_update(), 10000);
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
            this.get_pesan();
        });
    }
    //ambil data chat dari database ketika app pertama kali dibuka
    //reference on get_user_id
    get_pesan=()=>{
        fetch(this.state.ipadress+'/dchat/get_daftar_pesan.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
             uname_pengirim : this.state.uname
            })
        }).then((response)=>response.json()).then((res)=>{
              //alert(JSON.stringify(res));
            console.log('panjang = '+res.length);
            if(res != 0){
                for(var i = 0; i < res.length; i++){
                    if( res[i][1] == 12){
                        var usergroup = 'Kasir';
                    }
                    else{
                        var usergroup = 'Apoteker';           
                    }
                    var found = this.items.find(function(element) {
                        return element.uname === res[i][0];
                    });
                   
                    if(!found){
                        console.log('found = '+res[i][2]);
                        this.items.push({uname : res[i][0], name : res[i][2]});
                    }
                 }
                this.setState({
                    data_chat : this.items
                });
                
            }
            else{
                ToastAndroid.showWithGravity(
                    'Anda belum mempunyai percakapan!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
        }).catch((err)=>{
            // alert(err);
        });
    }
    //update list percakapan
    //reference on componentWillMount
    get_percakapan_update=()=>{
        fetch(this.state.ipadress+'/dchat/get_daftar_pesan.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
             uname_pengirim : this.state.uname
            })
        }).then((response)=>response.json()).then((res)=>{
              //alert(JSON.stringify(res));
            if(res != 0){
                for(var i = 0; i < res.length; i++){
                    if( res[i][1] == 12){
                        var usergroup = 'Kasir';
                    }
                    else{
                        var usergroup = 'Apoteker';           
                    }
                    var found = this.items.find(function(element) {
                        return element.uname === res[i][0];
                    });
                   
                    if(!found){
                        console.log('found = '+res[i][2]);
                        this.items.push({uname : res[i][0], name : res[i][2]});
                    }
                 }
                this.setState({
                    data_chat : this.items,
                    isFetching : false
                });
                
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
    //fungsi untuk pindah ke halaman Daftar_pegawai
    goto_daftar_pegawai=()=>{
        const { navigate } = this.props.navigation;
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
        navigate("Daftar_pegawai", { onSelectScreen: this.onSelectScreen });
    }
    //fungsi untuk pindah ke halaman Daftar_pesan
    goto_pesan_group=()=>{
        const { navigate } = this.props.navigation;
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
        navigate("Grup_list", { onSelectScreen: this.onSelectScreen });
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

      //pindah ke halaman char person to person
    goto_private_message=(uname, name, usergroup)=>{
        const { navigate } = this.props.navigation;
        //jika user mengklik dirinya sendiri maka perintah private message ke diri sendiri tdk dapat dilakukan
        if(uname == this.state.uname){
            ToastAndroid.showWithGravity(
                'Perintah tidak dapat dilakukan!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
        else{
            navigate('Private_message', {uname : uname, name : name, usergroup : usergroup});
        }
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.get_percakapan_update() });
     }
      //BUKA KAMERA UNTUK MENGAMBIL FOTO
    open_camera=()=>{
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true
        }).then(image => {
            this.setState({
                path : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                image_galerry_modal : true,
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
                path : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                image_galerry_modal : true
            });
          });    
    }
     //tutup modal gellery view image
     tutup_view_image=()=>{
        if(this.state.path !== this.state.tmp_path){
            this.setState({
                path : this.state.tmp_path,
                image_galerry_modal : false
            });
        }
        else{
            this.setState({
                image_galerry_modal : false
            });
        }
    }

     //ubah foto profil grup
     ubah_foto_profile=()=>{
        if(this.state.path == this.state.tmp_path){
            this.setState({
                image_galerry_modal : false
            });
            ToastAndroid.showWithGravity(
                'Tidak ada perubahan',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
        // else{
        //     //update foto profile grup
        //     RNFetchBlob.fetch('POST', this.state.ipadress+'/dchat/grup_update_foto.php', {
        //         Authorization: "Bearer access-token",
        //         otherHeader: "foo",
        //         'Content-Type': 'multipart/form-data',
        //     }, [
        //             // element with property `filename` will be transformed into `file` in form data
        //             { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.path) },
        //             {name : 'grup_id', data : this.state.group_id}
        //         ]).then((resp) => {
        //             this.setState({
        //                 image_galerry_modal : false
        //             });
        //         }).catch((err) => {
        //             // alert('error : ' + err);
        //             Alert.alert(
        //                 'Kesalahan',
        //                 'Terjasi kesalah saat mengirim pesan',
        //                 [
        //                     {text : 'ok'}
        //                 ],
        //                 {cancelable : false}
        //             );
        //     });
        // }
    }

    open_profile=()=>{
        this.setState({image_galerry_modal : true});
        this.closeControlPanel();
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
                    <TouchableOpacity onPress={()=>this.open_profile()} style={{height : 80, width : 80,borderRadius : 40, backgroundColor : 'white'}} >
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
                    <Item style={{height : 50, paddingLeft : 10}} onPress={()=>this.goto_pesan_group()}>
                        <Icon name="ios-chatbubbles" style={{color : '#353E4F'}}/>
                        <Text style={{marginLeft : 8, color : 'gray'}}>Pesan Grup</Text>
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
                        <Text style={{color : 'white', fontSize : 18}}>Percakapan</Text>
                    </View>
                </View>
                 {/*list chat user*/}
                 <View style={{ flex: 1, height : height, width : width}}
                   >
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data = {this.state.data_chat}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={0}
                    initialNumToRender={2}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    contentInset={{ bottom: 0 }}
                    renderItem={({ item, index}) => (
                        <View>
                        {/* warna chat dari orang lain'rgba(116, 162, 237,0.5)'
                            warna chat punya owner 'rgba(44, 69, 232, 0.5)'
                    */}
                        <TouchableOpacity style={{width : width}} onPress={()=>this.goto_private_message(item.uname,item.name,item.usergroup)}>
                            <View style={{ flexDirection : 'row', padding : 5, height : 70,marginTop : 5,width : width}}>
                                <View style={{height : 60, width : 60, borderRadius : 30, backgroundColor : '#1f88e5'}}>
                                     <Icon style={{color:'white', fontSize:35, marginTop : 10, textAlign : 'center'}} name='person' />
                                </View>
                                <View style={{marginLeft : 10, marginTop : 5}}>
                                    <Text style={{color : 'black', fontWeight : 'bold', fontSize : 18}}>{item.uname}</Text>
                                    <View>
                                        <Text style={{color : 'gray', fontSize : 12}}>{item.name}</Text>
                                    </View>
                                </View>
                                <View style={{position : 'absolute', right : 5, top : 20}}>
                                    <Text>{item.usergroup}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                        )}
                    {...this.props}
                />
                </View>
                 {/**tombol tambah percakpan*/}
                 <View style={{width : 50, height : 50, borderRadius : 25, position : 'absolute', bottom : 10, right :10, backgroundColor : '#1f88e5'}}>
                    <TouchableOpacity onPress={()=>this.goto_daftar_pegawai()} style={{height : 50, width : 50, borderRadius : 25, alignItems : 'center', paddingTop : 5}}>
                        <Icon style={{color:'white', fontSize:40}} name='ios-add' />
                    </TouchableOpacity>
                </View>
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
                 {/*modal untuk menampilkan gambar setelah gambar di klik*/}
                 <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.image_galerry_modal} onRequestClose ={()=>this.tutup_view_image()}>
                <Content>
                <TouchableWithoutFeedback onPress={()=>this.tutup_view_image()}>
                    <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                    <TouchableWithoutFeedback>
                        <View style={{backgroundColor : 'white', width : width, height : height, alignSelf : 'center'}}>
                            <View style={{width : width, height : 50, flexDirection : 'row', backgroundColor : 'black'}}>
                                <View style={{width : 50, height : 80}}>
                                    <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "5%", marginLeft: -2}} onPress={()=>this.tutup_view_image()}>
                                        <Icon style={{color:'white', fontSize:30}} name='arrow-back' />
                                    </Button>
                                </View>
                                <View style={{width : 60, height : 80, position : 'absolute', right : 10}}>
                                    <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "5%", marginLeft: -2}} onPress={()=>this.setState({select_image_modal : true})}>
                                        <Icon style={{color:'white', fontSize:30}} name='ios-camera' />
                                    </Button>
                                </View>
                            </View>
                            <Gallery
                                style={{ flex: 1, backgroundColor: 'black' }}
                                images={[
                                { source: { uri: this.state.path} }
                                ]}
                            />
                             {/**tombol ubah foto profile*/}
                            <View style={{width : 50, height : 50, borderRadius : 25, position : 'absolute', bottom : 40, right :10, backgroundColor : '#1f88e5'}}>
                                <TouchableOpacity onPress={()=>this.ubah_foto_profile()} style={{height : 50, width : 50, borderRadius : 25, alignItems : 'center', paddingTop : 5}}>
                                    <Icon style={{color:'white', fontSize:40}} name='ios-checkmark' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                </Content>
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
        </View>
        </Drawer>
        );
    }
    }

    const drawerStyles = {
        drawer: {shadowColor: 'black', shadowOpacity: 0.5, shadowRadius: 1},
    }

    const styles = StyleSheet.create({
        container: {
        flex: 1,
        width : width+ 5,
        alignItems: 'center',
        backgroundColor: 'white'
        },
    });