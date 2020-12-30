import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Header, Card } from "react-native-elements";

export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: firebase.auth().currentUser.displayName,
      bookName: "",
      reason: "",
    };
  }

  createRequestId() {
    return Math.random().toString(36).substring(7);
  }

  request = async (bookName, reason) => {
    var username = this.state.username;
    var requestId = this.createRequestId();
    firebase.firestore().collection("RequestedBooks").add({
      UserName: username,
      BookName: bookName,
      Reason: reason,
      RequestID: requestId,
    });

    this.setState({ bookName: "", reason: "" });
    ToastAndroid.show(
      "Your Request Has Been Submitted Successfully",
      ToastAndroid.SHORT
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Request Book",
            style: { color: "white", fontSize: 17, marginTop: 10 },
          }}
        />
        <View>
          <Card>
            <Card.Title>Hello {this.state.username}!!</Card.Title>
            <Text style={{ textAlign: "center" }}>
              Can You Please Enter These Details To Request A Book?
            </Text>
          </Card>

          <TextInput
            style={styles.formTextInput}
            placeholder={"Enter The Book Name"}
            onChangeText={(text) => {
              this.setState({
                bookName: text,
              });
            }}
            value={this.state.bookName}
          />

          <TextInput
            style={[styles.formTextInput, { height: 200, width: "90%" }]}
            multiline
            numberOfLines={8}
            placeholder={"Reason For Requirement Of this Book"}
            onChangeText={(text) => {
              this.setState({
                reason: text,
              });
            }}
            value={this.state.reason}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.request(this.state.bookName, this.state.reason);
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Request Book
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },

  logost: {
    fontWeight: "bold",
    fontSize: 30,
    color: "yellow",
    textAlign: "center",
    marginBottom: 20,
  },
  formTextInput: {
    borderWidth: 3,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    width: "75%",
    textAlign: "center",
    marginTop: 30,
    alignSelf: "center",
  },
  button: {
    width: "60%",
    backgroundColor: "#fb5b5a",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    shadowOpacity: 0.44,
    shadowRadius: 50.32,
    elevation: 16,
    alignSelf: "center",
    color: "white",
  },
});
