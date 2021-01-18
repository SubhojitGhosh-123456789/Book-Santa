import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Modal,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";

export default class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      displayName: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      isLoading: false,
      isModalVisible: false,
    };
  }

  showRegisterScreen = () => {
    return (
      <Modal
        borderRadius={5}
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%", height: "100%" }}>
            <View style={styles.inputView}>
              <View style={styles.modalView}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.logot}>Register</Text>
                  <Text
                    style={[
                      styles.logot,
                      { color: "white", position: "absolute", right: 10 },
                    ]}
                    onPress={() => {
                      this.setState({ isModalVisible: false });
                    }}
                  >
                    X
                  </Text>
                </View>

                <TextInput
                  placeholder="Name"
                  placeholderTextColor="white"
                  style={{
                    borderWidth: 2,
                    borderColor: "blue",
                    color: "white",
                    backgroundColor: "#4F92FF",
                    borderRadius: 25,
                    height: 50,
                    width: "90%",
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "bold",
                  }}
                  onChangeText={(text) => this.setState({ displayName: text })}
                  value={this.state.displayName}
                />
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: "blue",
                    color: "white",
                    backgroundColor: "#4F92FF",
                    borderRadius: 25,
                    height: 50,
                    width: "90%",
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "bold",
                  }}
                  placeholder="Phone Number"
                  placeholderTextColor="white"
                  onChangeText={(text) => this.setState({ phone: text })}
                  value={this.state.phone}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="white"
                  style={{
                    borderWidth: 2,
                    borderColor: "blue",
                    color: "white",
                    backgroundColor: "#4F92FF",
                    borderRadius: 25,
                    height: 50,
                    width: "90%",
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "bold",
                  }}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                />
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: "blue",
                    color: "white",
                    backgroundColor: "#4F92FF",
                    borderRadius: 25,
                    height: 50,
                    width: "90%",
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "bold",
                  }}
                  placeholder="Password"
                  placeholderTextColor="white"
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />

                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: "blue",
                    color: "white",
                    backgroundColor: "#4F92FF",
                    borderRadius: 10,
                    width: "95%",
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "bold",
                    marginBottom: 30,
                  }}
                  underlineColorAndroid="transparent"
                  placeholder="Address"
                  placeholderTextColor="white"
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(text) => {
                    this.setState({ address: text });
                  }}
                  value={this.state.address}
                />
                <View style={styles.inputView}>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={this.registerUser}
                  >
                    <Text style={styles.loginText}>REGISTER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  login = async (email, password) => {
    if (email && password) {
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        if (response) {
          ToastAndroid.show(
            "You Have Logged in Successfully!!",
            ToastAndroid.SHORT
          );
          this.setState({ email: "", password: "" });
          this.props.navigation.navigate("Drawer");
        }
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            ToastAndroid.show(
              "User doesn't Exist. Please Register If You do not have an Account.",
              ToastAndroid.SHORT
            );
            this.setState({ email: "", password: "" });
            break;
          case "auth/invalid-email":
            ToastAndroid.show("Incorrect Email entered", ToastAndroid.SHORT);
            this.setState({ email: "", password: "" });
            break;
          case "auth/wrong-password":
            ToastAndroid.show("Incorrect Password entered", ToastAndroid.SHORT);
            this.setState({ email: "", password: "" });
            break;
        }
      }
    } else {
      ToastAndroid.show(
        "Please Enter Your Email and Password",
        ToastAndroid.SHORT
      );
    }
  };
  createUserId() {
    return Math.random().toString(36).substring(7);
  }

  registerUser = () => {
    if (this.state.email === "" && this.state.password === "") {
      ToastAndroid.show(
        "Please Enter Your Details to Signup",
        ToastAndroid.SHORT
      );
    } else if (this.state.email === "" || this.state.password === "") {
      ToastAndroid.show(
        "Please Enter Your Details to Signup",
        ToastAndroid.SHORT
      );
    } else {
      this.setState({ isLoading: true });

      firebase.firestore().collection("Users").add({
        Name: this.state.displayName,
        Email: this.state.email,
        Password: this.state.password,
        Phone: this.state.phone,
        Address: this.state.address,
        UserID: this.createUserId(),
        isBookRequestActive: false,
      });

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          res.user.updateProfile({
            displayName: this.state.displayName,
          });
          ToastAndroid.show(
            "You have Registered successfully!!",
            ToastAndroid.SHORT
          );
          this.setState({
            isLoading: false,
            displayName: "",
            displayName: "",
            phone: "",
            address: "",
          });
          this.setState({ isModalVisible: false });
        })
        .catch((error) => ToastAndroid.show(error.message), ToastAndroid.SHORT);
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View>{this.showRegisterScreen()}</View>
          <View>
            <Image
              source={require("../assets/santa.gif")}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginTop: 35,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "yellow",
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              Book Santa Login
            </Text>
          </View>
          <View style={{ alignSelf: "center", alignItems: "center" }}>
            <TextInput
              style={styles.loginBox}
              placeholder="Email"
              onChangeText={(text) => {
                this.setState({
                  email: text,
                });
              }}
              value={this.state.email}
            />

            <TextInput
              style={styles.loginBox}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
              value={this.state.password}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: 200,
                backgroundColor: "#fb5b5a",
                height: 38,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
                borderWidth: 2,
                borderColor: "white",
                alignSelf: "center",
              }}
              onPress={() => {
                this.login(this.state.email, this.state.password);
              }}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 20 }}
              >
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.wText}>Do not have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isModalVisible: true });
              }}
            >
              <Text style={[styles.wText, { color: "blue" }]}> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  inputView: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginBtn: {
    width: 200,
    backgroundColor: "#fb5b5a",
    height: 38,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  loginText: {
    color: "white",
    fontSize: 20,
  },
  logot: {
    fontWeight: "bold",
    fontSize: 25,
    color: "blue",
    textAlign: "center",
    marginTop: 70,
    marginBottom: 30,
  },
  loginBox: {
    borderWidth: 2,
    borderColor: "blue",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    width: 300,
    textAlign: "center",
    marginTop: 30,
  },

  wText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
