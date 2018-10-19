import React, { Component } from 'react'; 
import {
  View,
  Image, 
  StatusBar,
  Dimensions,
  Animated,
  Text,
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
import {Button, Icon, Item} from 'native-base';
import { StackNavigator } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';
import Gallery from 'react-native-image-gallery';

var{width,height} = Dimensions.get('window');

//RN fetch blob property
const polyfill = RNFetchBlob.polyfill;
window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;

export default class Grup_list extends Component<{}> {
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
                ipadress : '',
                //state utk update app
                selected : false,
                isFetching : false
            };
            this.items = [];
            this.get_user_id();
    }
    //fungsi yg akan di kirim sebagai parameter untuk menangani perubahan state tombol back
    update_listGroup = data => {
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
        if(this.state.selected==true){
            this.items = [];
            this.setState({selected : false, data_chat : this.items});
            this.get_group();
        }
    }
    //fungsi yang menangani tombol back
    backPressed = () => {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelectScreen({ selected: true });
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
            this.get_group();
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

    goto_buat_grup=()=>{
        const { navigate } = this.props.navigation;
        navigate("Grup_buat", { update_listGroup: this.update_listGroup });
    }

    //ambil data grup list
    get_group=()=>{
        fetch(this.state.ipadress+'/dchat/grup_list.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                uname : this.state.uname
            })
        }).then((response)=>response.json()).then((res)=>{
            //   alert(JSON.stringify(res.group_list));
            let path = this.state.ipadress+"/dchat/";
            if(res != 0){
                for(var i = 0; i < res.group_list.length; i++){
                     this.items.push({id : res.group_list[i][0], g_name : res.group_list[i][1], g_gambar : path+res.group_list[i][2]});
                 }
                this.setState({
                    data_chat : this.items
                });
            }
            else{
                ToastAndroid.showWithGravity(
                    'Belum ada Grup!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
        }).catch((err)=>{
            // alert(err);
        });
    }

     //ambil data grup list
     get_group_refresh=()=>{
         this.items = [];
        fetch(this.state.ipadress+'/dchat/grup_list.php',{
            method : 'POST',
            headers :{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                uname : this.state.uname
            })
        }).then((response)=>response.json()).then((res)=>{
            let path = this.state.ipadress+"/dchat/";
            if(res != 0){
                for(var i = 0; i < res.group_list.length; i++){
                     this.items.push({id : res.group_list[i][0], g_name : res.group_list[i][1], g_gambar : path+res.group_list[i][2]});
                 }
                this.setState({
                    data_chat : this.items,
                    isFetching : false
                });
            }
            else{
                ToastAndroid.showWithGravity(
                    'Belum ada Grup!',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                );
            }
        }).catch((err)=>{
            // alert(err);
        });
    }
    //untuk menceteak list grup
    renderItem_group_list=(id, name, gambar)=>{
        let component;
        if(gambar ==  this.state.ipadress+"/dchat/null"){
            component =  
            <TouchableOpacity style={{width : width}} onPress={()=>this.goto_grup_chat(id,name, '')}>
                <View style={{ flexDirection : 'row', padding : 5, height : 60,marginTop : 5,width : width}}>
                    <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : 'blue'}}>
                        <Icon style={{color:'white', fontSize:35, marginTop : 8, textAlign : 'center'}} name='person' />
                    </View>
                    <View style={{marginLeft : 10, marginTop : 15}}>
                        <Text style={{color : 'black'}}>{name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            ;
        }
        else{
            component =  
            <TouchableOpacity style={{width : width}} onPress={()=>this.goto_grup_chat(id,name, gambar)}>
                <View style={{ flexDirection : 'row', padding : 5, height : 60,marginTop : 5,width : width}}>
                    <View style={{height : 50, width : 50, borderRadius : 25, backgroundColor : 'blue'}}>
                        <Image source={{uri : gambar}} style={{width : 50, height : 50, borderRadius : 25}} />
                    </View>
                    <View style={{marginLeft : 10, marginTop : 15}}>
                        <Text style={{color : 'black'}}>{name}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        }
    return(<View>{component}</View>)
    }

    //pindah ke halaman chat grup
    goto_grup_chat=(id,name, path)=>{
        const { navigate } = this.props.navigation;
        navigate("Grup_chat", {id : id, name : name, path : path});
    }

    onRefresh() {
        this.setState({ isFetching: true }, function() { this.get_group_refresh() });
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
                        <Text style={{color : 'white', fontSize : 18}}>Grup Anda</Text>
                    </View>
                    {/*tombol utk membuat grup baru*/}
                    <View style={{width : 50, height : 80, position :'absolute', right : 10, top : 10}}>
                        <Button onPress={()=>this.goto_buat_grup()} transparent light style={{zIndex:1,position:'absolute',marginTop : "40%", marginLeft: -2}}>
                            <Icon style={{color:'white', fontSize:35}} name='ios-add' />
                        </Button>
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
                    renderItem={({ item, index}) => this.renderItem_group_list(item.id, item.g_name, item.g_gambar)}
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