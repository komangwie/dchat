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
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import Gallery from 'react-native-image-gallery';

var{width,height} = Dimensions.get('window');

//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Grup_profile extends Component<{}> {
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
                image : '',
                list_anggota : [],
                //ip adress server
                ipadress : '',
                //variabel untuk mengirim pesan
                group_id : null,
                group_name : '',
                group_new_name : '',
                path : '',
                tmp_path : '',
                selected_image_path : '',
                admin_grup : null,
                //state modal
                send_dialog : false,
                select_image_modal : false,
                image_galerry_modal : false,
                setting : false,
                //kontrol update
                update : false
            };
            this.items = [];
            this.get_user_id();
    }
    //fungsi yg akan di kirim sebagai parameter untuk menangani perubahan state tombol back
    updateList = data => {
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
     //fungsi default yg akan berjalan jika terjadi perubahan state
     componentDidUpdate=()=>{
        if(this.state.update==true){
            this.items = [];
            this.setState({update : false, list_anggota : this.items});
            this.get_list_anggota();
        }
    }
    //fungsi yang menangani tombol back
    backPressed = () => {
        const { navigation } = this.props;
        navigation.goBack();
        // navigation.state.params.onSelectScreen({ selected: true });
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
            this.setState({
                group_id : this.props.navigation.state.params.id,
                group_name : this.props.navigation.state.params.group_name,
                group_new_name : this.props.navigation.state.params.group_name,
                path : this.props.navigation.state.params.path,
                tmp_path :  this.props.navigation.state.params.path
            });
            this.get_list_anggota();
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

    //untuk menambahkan header sebagai gap di bagian bottom list chat
    //reference on FlatList
    render_FlatList_header = () => {
        var header_View = (
        <View style={{width : width, height : 30}}></View>
        );
        return header_View ;
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
    //cetak image pada bubble chat, jika ada image
    cetak_image=(path)=>{
        let path_image;
        if(path == this.state.ipadress+"/dchat/null" || path == this.state.ipadress+"/dchat"){

        }
        else{
            path_image = <TouchableOpacity onPress={()=>this.view_image(path)}><Image source={{uri : path}}  style={{height : 200, width : 200, alignSelf : 'center'}}/></TouchableOpacity>;
        }
        return(<View>{path_image}</View>);
    }
    //fungsi untuk membuka/melihat image yg di klik pada chat
    //reference on TouchableOpacity onpress pd chat
    view_image=(path)=>{
        this.setState({
            image_galerry_modal : true,
            selected_image_path : path
        });
    }

    //cetak foto profile grup
    cetak_photo_profile=()=>{
        let com;
        if(this.state.path == ''){
            com = 
            <TouchableOpacity onPress={()=>this.setState({select_image_modal : true})}>
                <View style={{height : height/3, width: width,backgroundColor : 'rgb(66, 244, 179)'}}>
                    <Icon style={{color:'gray', fontSize:150, textAlign : 'center', marginTop : '10%'}} name='people' />
                </View>
            </TouchableOpacity>
            ;
        }
        else{
            com =
            <TouchableOpacity onPress={()=>this.setState({image_galerry_modal : true})}>
                <Image source={{uri : this.state.path}} style={{height : height/3, width : width}} />
            </TouchableOpacity>
            ;
        }
        return(<View>{com}</View>);
    }

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
        else{
            //update foto profile grup
            RNFetchBlob.fetch('POST', this.state.ipadress+'/dchat/grup_update_foto.php', {
                Authorization: "Bearer access-token",
                otherHeader: "foo",
                'Content-Type': 'multipart/form-data',
            }, [
                    // element with property `filename` will be transformed into `file` in form data
                    { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.path) },
                    {name : 'grup_id', data : this.state.group_id}
                ]).then((resp) => {
                    this.setState({
                        image_galerry_modal : false
                    });
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
    }

    ubah_nama_grup=()=>{
        if(this.state.group_name === this.state.group_new_name){
            this.setState({
                setting : false
            });
        }
        else{
            if(this.state.group_new_name == ''){
                ToastAndroid.showWithGravity(
                    'Nama grup tidak boleh kosong!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
            else{
                  //kirim data ke server
                    fetch( this.state.ipadress+'/dchat/grup_update_name.php',{
                        method : 'POST',
                        headers :{
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json'
                        },
                        body : JSON.stringify({
                            grup_id : this.state.group_id,
                            grup_name : this.state.group_new_name
                        }),
                    }).then((response)=>response.json()).then((res)=>{
                        // alert(res);
                        if(res == 'gagal'){
                            ToastAndroid.showWithGravity(
                                'Tidak dapat mengubah nama grup',
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                        }
                        else{
                            this.setState({
                                group_name : this.state.group_new_name,
                                setting : false
                            });
                        }
                    }).catch((err)=>{
                        ToastAndroid.showWithGravity(
                            'Terjadi kesalahan menghubungkan ke server',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                        );
                    });
            }
        }
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
    //ambil data member grup
    get_list_anggota=()=>{
        fetch(this.state.ipadress+'/dchat/grup_list_anggota.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                grup_id : this.state.group_id
            })
        }).then((response)=>response.json()).then((res)=>{
            if(res != 0){
                for(var i = 0; i < res.length; i++){
                    if( res[i][5] == 12){
                        var usergroup = 'Kasir';
                    }
                    else{
                        var usergroup = 'Apoteker';           
                    }
                    if(res[i][1] == 'admin'){
                        this.setState({admin_grup :res[i][0]});
                    }
                this.items.push({id : res[i][2], uname : res[i][0], status : res[i][1] , usergroup : usergroup, name : res[i][4]});
                 }
                this.setState({
                    list_anggota : this.items
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
    //mencetak list anggota grup pada flatlist
    cetak_list_anggota=(id, uname, status, usergroup, name)=>{
        let list;
        if(status == 'admin'){
            list = 
            <TouchableOpacity style={{width : width}} >
            <View style={{ flexDirection : 'row', padding : 5, height : 60,marginTop : 5,width : width}}>
                <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : '#1f88e5'}}>
                     <Icon style={{color:'white', fontSize:35, marginTop : 8, textAlign : 'center'}} name='person' />
                </View>
                <View style={{marginLeft : 10, marginTop : 5}}>
                    <Text style={{color : '#1f88e5'}}>{uname} ~ {status}</Text>
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
        else{
            list = 
            <TouchableOpacity style={{width : width}} >
            <View style={{ flexDirection : 'row', padding : 5, height : 60,marginTop : 5,width : width}}>
                <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor :'#1f88e5'}}>
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
        return(<View>{list}</View>);
    }

    //goto halaman grup_taambah_anggota
    goto_tambah_anggota=()=>{
        const { navigate } = this.props.navigation;
        navigate("Grup_tambah_anggota", {id : this.state.group_id, group_name : this.state.group_name, path : this.state.path, admin : this.state.admin_grup, updateList : this.updateList});
    }
     //reference on FlatList
     render_FlatList_header = () => {
        var header_View = (
        <TouchableWithoutFeedback onPress={()=>this.goto_tambah_anggota()}>
        <View  style={{width : width, height : 40}}>
            <Text style={{color : 'black', fontSize : 18, textAlign : 'center', marginTop :10}}>Anggota Grup</Text>
            <View style={{position :'absolute', right : '25%', top : 5, backgroundColor : '#1f88e5', width : 30, height : 30, borderRadius : 20}}>
                <TouchableOpacity onPress={()=>this.goto_tambah_anggota()} style={{backgroundColor : '#1f88e5', width : 30, height : 30, borderRadius : 20}}>
                    <Icon style={{color:'white', marginTop : -5, textAlign : 'center', fontSize:40}} name='ios-add' />
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
        );
        return header_View ;
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                {/* header bar */}
                <View style={{width : width, height : 80, backgroundColor :  '#1f88e5',flexDirection : 'row', paddingTop : 10}}>
                    <View style={{width : 50, height : 80}}>
                        <Button transparent light style={{zIndex:1,position:'absolute',marginTop : "45%", marginLeft: -2}} onPress={()=>this.backPressed()}>
                            <Icon style={{color:'white', fontSize:30}} name='arrow-back' />
                        </Button>
                    </View>
                   
                    <View style={{width : width-50, height : 80, paddingLeft : 2, paddingTop : "8%"}}>
                        <Text style={{color : 'white', fontSize : 18, marginLeft : 0}}>Group profile</Text>
                    </View>
                </View>
                
                {/*bagian foto grup dan nama grup*/}
                <View style={{width : width, height : height/3}}>
                    {this.cetak_photo_profile()}
                    <View style={{marginTop : -40, backgroundColor : 'rgba(65, 208, 244, 0.8)', flexDirection : 'row'}}>
                        <Text style={{marginLeft : 5,color : 'white', fontSize : 30}}>{this.state.group_name}</Text>
                        <View style={{position : 'absolute', top : '15%', right : 20}}>
                            <TouchableOpacity onPress={()=>this.setState({setting : true})}>
                                 <Icon style={{color:'white', fontSize:25}} name='ios-brush' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/*list member grup*/}
                  {/*list pegawai*/}
                  <View style={{ flex: 1, height : height, width : width}}>
                    <FlatList
                        ref={(ref) => { this.flatListRef = ref; }}
                        keyExtractor={item => item.id}
                        data = {this.state.list_anggota}
                        getItemLayout={this.getItemLayout}
                        initialScrollIndex={0}
                        initialNumToRender={2}
                        ListHeaderComponent = {()=>this.render_FlatList_header()}
                        contentInset={{ bottom: 0 }}
                        renderItem={({ item, index}) => this.cetak_list_anggota(item.id, item.uname, item.status, item.usergroup, item.name)}
                        {...this.props}
                    />
                </View>

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
                                { source: { uri: this.state.path } }
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
                 {/*modal untuk setting ip address*/}
               <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.setting} onRequestClose ={()=>this.setState({setting : false})}>
                <Content>
                <TouchableWithoutFeedback onPress={()=>this.setState({setting : false})}>
                    <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                    <TouchableWithoutFeedback>
                    <View style={{backgroundColor : 'white', width : width-10, borderRadius : 5, alignSelf : 'center', marginTop : height/3}}>
                    <View style={{height : 35, width : width-10, backgroundColor : '#1f88e5', borderTopLeftRadius : 5, borderTopRightRadius : 5 }}>
                        <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5}}>Ubah nama grup</Text>
                    </View>
                        {/*Modal set ip server*/}
                        <View style={{flexDirection : 'row',width : width-30, alignSelf : 'center', marginTop : 10, marginBottom : 10}}>
                            <TextInput value={this.state.group_new_name} multiline={false} underlineColorAndroid="transparent" style={{borderWidth : 1,borderColor : 'black', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, height : 50, fontSize : 20}} placeholder="Nama grup" placeholderTextColor='black' onChangeText={(group_new_name)=>this.setState({group_new_name})}/>
                            {/*tombol kirim*/}
                            <TouchableOpacity onPress={()=>this.ubah_nama_grup()} style={{marginLeft : 10,backgroundColor : '#1f88e5', width : 50, height : 50, borderRadius : 25}}>
                                <Icon name="ios-checkmark" style={{color : "white", textAlign : 'center', fontSize : 40, marginTop : 6}}/>
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