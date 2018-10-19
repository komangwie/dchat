/** @format */


import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';
import { StackNavigator } from 'react-navigation';

import Splash_screen from './src/pages/splash_screen';
import Login from './src/pages/login';
import Home_page from './src/pages/home_page';
import Daftar_pegawai from './src/pages/daftar_pegawai';
import Private_message from './src/pages/private_message';
import Daftar_pesan from './src/pages/daftar_pesan';
import Grup_list from './src/pages/grup_list';
import Grup_buat from './src/pages/grup_buat';
import Grup_chat from './src/pages/grup_chat';
import Grup_profile from './src/pages/grup_profile';
import Grup_tambah_anggota from './src/pages/grup_tambah_anggota';

export default class index extends Component<Props> {
    render() {
        const { navigation } = this.props;
		const { navigate } = this.props.navigation;
		return(
			<View style={{flex : 1}}>
                <Login navigation={navigation}/>
			</View>
		);
    }
}

const DChatNav = StackNavigator ({
    Splash_screen : {screen : Splash_screen},
    Login : {screen : Login},
    Home_page : {screen : Home_page},
    Daftar_pegawai : {screen : Daftar_pegawai},
    Private_message : {screen : Private_message},
    Daftar_pesan : {screen : Daftar_pesan},
    Grup_list : {screen : Grup_list},
    Grup_buat : {screen : Grup_buat},
    Grup_chat : {screen : Grup_chat},
    Grup_profile : {screen : Grup_profile},
    Grup_tambah_anggota : {screen : Grup_tambah_anggota}
});

AppRegistry.registerComponent('DChat', () => DChatNav);
