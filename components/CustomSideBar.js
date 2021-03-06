import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from "react-native";
import { Avatar } from 'react-native-elements';
import { DrawerItems } from "react-navigation-drawer";
import SettingsScreen from "../Screens/Settings-Screen";
import MyDonationsScreen from "../Screens/MyDonations-Screen";
import db from "../config";
import firebase from "firebase";
import * as ImagePicker from 'expo-image-picker';

export default class SideBar extends React.Component {

  constructor(){
    super();
    this.state={
      image: '#',
      userId: firebase.auth().currentUser.email,
    }
  }

  selectPicture = async () => {
    const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
      this.setState({image: uri})
    }
  };

  uploadImage = async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase.storage().ref().child('UserProfiles/'+imageName);
    return ref.put(blob).then((response)=>{
       this.fetchImage(imageName);
    });

  }

  fetchImage = (imageName)=>{
    var storageRef = firebase.storage().ref().child('UserProfiles/'+imageName);
    storageRef.getDownloadURL().then((url)=>{
      this.setState({image: url})
    }).catch((error)=>{
      this.setState({image: '#'})
    })
  }

  componentDidMount(){
    this.fetchImage(this.state.userId)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../assets/draw.jpg")}
          style={{ width: "100%", height: 200 }}
        />
        <Avatar rounded source = {{uri: this.state.image}} size = 'medium' onPress = {()=>{this.selectPicture()}} containerStyle = {styles.imageContainer} showEditButton/>
        <View style={{ backgroundColor: "#1182C6" }}>
          <Text style={styles.displayText}>
            Hello {firebase.auth().currentUser.displayName}
          </Text>
        </View>

        <View style={styles.drawerItems}>
          <DrawerItems {...this.props} />
        </View>

        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              firebase.auth().signOut();
              this.props.navigation.navigate("RegisterScreen");
              ToastAndroid.show(
                "You Have Signed Out Successlly!!",
                ToastAndroid.SHORT
              );
            }}
          >
            <Text style={styles.logOutText}>SIGN OUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerItems: {
    flex: 0.2,
    marginTop: 50,
  },
  logOutContainer: {
    marginTop: 50,
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    justifyContent: "center",
    width: "50%",
    backgroundColor: "#fb5b5a",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    shadowOpacity: 0.44,
    shadowRadius: 50.32,
    elevation: 16,
    alignSelf: "center",
    color: "white",
  },
  logOutText: {
    fontSize: 20,
    color: "white",
  },
  displayText: {
    fontSize: 25,
    color: "white",
    margin: 20,
  },
  imageContainer:{
     backgroundColor: "#1182C6",
     borderRadius:100,
     alignSelf:'center'
  }
});
