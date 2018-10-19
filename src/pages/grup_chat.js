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

export default class Grup_chat extends Component<{}> {
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
                data_chat : [],
                //ip adress server
                ipadress : '',
                //variabel untuk mengirim pesan
                pesan : '',//isi pesan yag dikirim
                image : '',//path image yang akan di upload ke database p_msg
                group_id : null,
                group_name : '',
                path : '',
                image_size : null,
                selected_image_path : '',
                gambar : 'no',
                //state modal
                send_dialog : false,
                select_image_modal : false,
                image_galerry_modal : false
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

        //ambil data chat / refresh setiap 5 detik
        timerId = setInterval(()=>this.get_chat_update(), 10000);
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
                group_name : this.props.navigation.state.params.name,
                path : this.props.navigation.state.params.path,
            });
           this.get_chat();
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
    //send group chat
    send_chat=()=>{
        if(this.state.pesan == '' && this.state.image == ''){
            ToastAndroid.showWithGravity(
                'Tulis pesan!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
        else{
            RNFetchBlob.fetch('POST', this.state.ipadress+'/dchat/grup_send_chat.php', {
                Authorization: "Bearer access-token",
                otherHeader: "foo",
                'Content-Type': 'multipart/form-data',
            }, [
                    // element with property `filename` will be transformed into `file` in form data
                    { name: 'image', filename: 'tes', type: 'image/png', data: RNFetchBlob.wrap(this.state.image) },
                    {name : 'uname_pengirim', data : this.state.uname},
                    {name : 'grup_id', data : this.state.group_id},
                    {name : 'pesan', data : this.state.pesan},
                    {name : 'gambar', data : this.state.gambar}
                ]).then((resp) => {
                    //alert(JSON.stringify(resp));
                    this.setState({
                        send_dialog : false,
                        pesan : '',
                        gambar : 'no'
                    });
                    this.get_chat_update();
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
    //ambil data p_msg dari database
    get_chat=()=>{
        fetch(this.state.ipadress+'/dchat/grup_get_chat.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
               grup_id : this.state.group_id
            })
        }).then((response)=>response.json()).then((res)=>{
              //alert(JSON.stringify(res));
            if(res != 0){
                let path = this.state.ipadress+"/dchat/";
                for(var i = 0; i < res.length; i++){
                    if( res[i][1] == this.state.uname){
                        var align = 'flex-end';
                        var background_color = 'rgba(66, 244, 220,0.3)';
                    }
                    else{
                        var align = 'flex-start';  
                        var background_color = 'rgba(116, 162, 237,0.5)';             
                    }

                    if(res[i][6] == 12){
                        var usergroup = 'kasir';
                    }
                    else{
                        var usergroup = 'apoteker';
                    }
                this.items.push({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][3], pesan : res[i][2], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : usergroup});
                // this.items = this.items.filter((x)=> x.id !== res[i][0]);
                 }
                this.setState({
                    data_chat : this.items,
                    chat_length : res.length-1
                });
            }
        }).catch((err)=>{
            alert(err);
        });
    }
    //update chat
    get_chat_update=()=>{
        fetch(this.state.ipadress+'/dchat/grup_get_chat.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                grup_id : this.state.group_id
            })
        }).then((response)=>response.json()).then((res)=>{
            // alert(JSON.stringify(res));
            if(res != 0){
                let path = this.state.ipadress+"/dchat/";

                if(res.length >= this.items.length){
                    for(var i = 0; i < res.length; i++){
                        if( res[i][1] == this.state.uname){
                            var align = 'flex-end';
                            var background_color = 'rgba(66, 244, 220,0.3)';
                        }
                        else{
                            var align = 'flex-start';  
                            var background_color = 'rgba(116, 162, 237,0.5)';             
                        }
    
                        if(res[i][6] == 12){
                            var usergroup = 'kasir';
                        }
                        else{
                            var usergroup = 'apoteker';
                        }
                        var found = this.items.find(function(element) {
                            return element.id == res[i][0];
                        });
    
                        if(!found){
                             this.items.unshift({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][3], pesan : res[i][2], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : usergroup});
                        }
                    
                     }
                    this.setState({
                        data_chat : this.items,
                    });
                }
                else{
                    var tmp=[];
                    var dat = this.items;
                    for(var i = 0; i < res.length; i++){
                        if( res[i][1] == this.state.uname){
                            var align = 'flex-end';
                            var background_color = 'rgba(66, 244, 220,0.3)';
                        }
                        else{
                            var align = 'flex-start';  
                            var background_color = 'rgba(116, 162, 237,0.5)';             
                        }
    
                        if(res[i][6] == 12){
                            var usergroup = 'kasir';
                        }
                        else{
                            var usergroup = 'apoteker';
                        }
                        tmp.push({id : res[i][0], uname : res[i][1], path_gambar : path+res[i][3], pesan : res[i][2], waktu : res[i][4], posisi_chat : align, background_color : background_color, usergroup : usergroup});
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
                        data_chat : this.items
                    });
                }
            }
        // alert(JSON.stringify(this.state.data_chat));
        }).catch((err)=>{
        });
    }

    //BUKA KAMERA UNTUK MENGAMBIL FOTO
    open_camera=()=>{
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            compressImageQuality : 0.5,//kualitas foto dr rentang 0 - 0.8
            cropping: false
        }).then(image => {
            this.setState({
                image : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                send_dialog : true,
                gambar : 'yes'
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
            this.setState({
                image : image.path,//path image yg akan di kirim ke server (API)
                select_image_modal : false,
                send_dialog : true,
                gambar : 'yes'
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
            <View style={{marginLeft : 0, marginTop : 20,height : 40, width: 40,backgroundColor : 'white', borderRadius : 25}}>
                <Icon style={{color:'gray', fontSize:30, textAlign : 'center', marginTop : 5}} name='person' />
            </View>
            ;
        }
        else{
            com = 
            <View style={{marginLeft : 0, marginTop : 20,height : 40, width: 40,backgroundColor : 'white', borderRadius : 25}}>
                <Image source={{uri : this.state.path}} style={{height : 40, width : 40, borderRadius : 20}} />
            </View>
            ;
        }
        return(<View>{com}</View>);
    }

    //pergi ke halaman grup profile
    goto_grup_profile=()=>{
        const { navigate } = this.props.navigation;
        navigate("Grup_profile", {id : this.state.group_id,group_name : this.state.group_name, path : this.state.path});
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
                    
                    <View style={{width : 50, height : 80}}>
                       {this.cetak_photo_profile()}
                    </View>

                    <TouchableOpacity onPress={()=>this.goto_grup_profile()}>
                        <View style={{width : width-50, height : 80, paddingLeft : 2, paddingTop : "8%"}}>
                            <Text style={{color : 'white', fontSize : 18, marginLeft : 0}}>{this.state.group_name}</Text>
                        </View>
                    </TouchableOpacity>
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
                    style={{paddingHorizontal : 5}}
                    ref={(ref) => { this.flatListRef = ref; }}
                    keyExtractor={item => item.id}
                    data = {this.state.data_chat}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={0}
                    initialNumToRender={2}
                    inverted
                    ListHeaderComponent={this.render_FlatList_header}
                    contentInset={{ bottom: 0 }}
                    renderItem={({ item, index}) => (
                        <View>
                        {/* warna chat dari orang lain'rgba(116, 162, 237,0.5)'
                            warna chat punya owner 'rgba(44, 69, 232, 0.5)'
                    */}
                            <View style={{alignSelf : item.posisi_chat,marginTop : 5, backgroundColor : item.background_color, padding : 6, maxWidth : width-70, borderRadius : 5}}>
                                <View>
                                    <Text style={{color : 'blue', fontSize : 12}}>{item.uname} ~ {item.usergroup}</Text>
                                </View>
                                <View>
                                    {this.cetak_image(item.path_gambar)}
                                </View>
                                {/*<Image source={{uri : item.path_gambar}}  style={{height : 200, width : 200, alignSelf : 'center'}}/>
                                */}
                                <Text style={{color : 'black'}}>{item.pesan}</Text>
                                <View style={{alignSelf : 'flex-end', marginTop : 2}}>
                                    <Text style={{color : 'gray', fontSize : 10}}>{item.waktu}</Text>
                                </View>
                            </View>
                        </View>
                        )}
                    {...this.props}
                />
                <View style={{width : width,backgroundColor : 'rgb(239, 246, 247)'}}>
                   {/*kotak pesan di bawah list chat*/}
                   <View style={{flexDirection : 'row',width : width, alignSelf : 'center', marginTop : 10, marginBottom : 10}}>
                        <TextInput value={this.state.pesan} multiline={true} underlineColorAndroid="transparent" style={{borderWidth : 0.5,borderColor : 'gray', backgroundColor : 'white', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, paddingLeft : 8, maxHeight : 500, textAlignVertical : 'center'}} placeholder="Tulis pesan..." placeholderTextColor='gray' onChangeText={(pesan)=>this.setState({pesan})}/>
                        {/*tombol kirim*/}
                        <TouchableOpacity onPress={()=>this.send_chat()} style={{marginLeft : 10,backgroundColor : '#1f88e5', width : 40, height : 40, borderRadius : 25, position : 'absolute', right : 53, bottom : 0}}>
                            <Icon name="ios-send" style={{color : "white", textAlign : 'center', fontSize : 30, marginTop : 5}}/>
                        </TouchableOpacity>
                        {/*tombol attach*/}
                        <TouchableOpacity onPress={()=>this.setState({select_image_modal : true})} style={{marginLeft : 10,backgroundColor : 'rgb(87, 184, 219)', width : 40, height : 40, borderRadius : 25, position : 'absolute', right : 8, bottom : 0}}>
                            <Icon name="ios-attach" style={{color : "white", textAlign : 'center', fontSize : 30, marginTop : 5}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
                {/*modal untuk menampilkan gambar yg difoto dan memberi deskripsi terhadap gambar tersebut*/}
                <Modal animationType = {"fade"} transparent   = {true} visible  = {this.state.send_dialog} onRequestClose ={()=>this.setState({send_dialog : false, image : '', pesan : '', gambar : 'no'})}>
                <Content>
                <TouchableWithoutFeedback onPress={()=>this.setState({send_dialog : false, image : '', pesan : '', gambar : 'no'})}>
                    <View style={{height : height, width : width, backgroundColor : 'rgba(51,44,43,0.5)'}}>
                    <TouchableWithoutFeedback>
                        <View style={{backgroundColor : 'white', width : width-10, borderRadius : 5, alignSelf : 'center', marginTop : 100}}>
                        <View style={{height : 35, width : width-10, backgroundColor : '#1f88e5', borderTopLeftRadius : 5, borderTopRightRadius : 5 }}>
                            <Text style={{color : 'white', fontSize : 18, textAlign : 'center', marginTop : 5}}>Tulis Pesan</Text>
                        </View>
                            {/*menampilkan gambar yg telah diambil dengan kamera*/}
                            <View>
                                <Image source={{uri : this.state.image}}  style={{height : 250, width : 250, alignSelf : 'center', marginTop : 10}}/>
                            </View>
                            {/*deskripsi foto yg akan dikirim*/}
                            <View style={{flexDirection : 'row',width : width-30, alignSelf : 'center', marginTop : 10, marginBottom : 10}}>
                                <TextInput value={this.state.pesan} multiline={false} underlineColorAndroid="transparent" style={{borderWidth : 1,borderColor : 'black', borderRadius : 25,color : 'black', width : width-100, marginLeft : 5, height : 50}} placeholder="Tulis sesuatu..." placeholderTextColor='black' onChangeText={(pesan)=>this.setState({pesan})}/>
                                {/*tombol kirim*/}
                                <TouchableOpacity onPress={()=>this.send_chat()} style={{marginLeft : 10,backgroundColor : '#1f88e5', width : 50, height : 50, borderRadius : 25}}>
                                    <Icon name="ios-send" style={{color : "white", textAlign : 'center', fontSize : 30, marginTop : 10}}/>
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