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
import MyHeader from "../components/AppHeader";

export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      username: firebase.auth().currentUser.displayName,
      bookName: "",
      reason: "",
      isBookRequestActive: false,

      requestedBookName: "",
      requestedBookStatus: "",
      requestedEmail: "",
      requestId: "",
      requesteddocId: "",
      userDocID: "",
    };
  }

  createRequestId() {
    return Math.random().toString(36).substring(7);
  }

  request = (bookName, reason) => {
    var email = this.state.userId;
    var username = this.state.username;
    var requestId = this.createRequestId();
    firebase.firestore().collection("RequestedBooks").add({
      UserName: username,
      BookName: bookName,
      Reason: reason,
      RequestID: requestId,
      Email: email,
      BookStatus: "Requested",
    });

    this.setState({
      isBookRequestActive: true,
    });

    firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firebase.firestore().collection("Users").doc(doc.id).update({
            isBookRequestActive: this.state.isBookRequestActive,
          });
        });
      });

    this.setState({ bookName: "", reason: "" });
    ToastAndroid.show(
      "Your Request Has Been Submitted Successfully",
      ToastAndroid.SHORT
    );
  };

  getisBookRequestActive = () => {
    firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var isBookRequestActive = doc.data().isBookRequestActive;
          this.setState({
            isBookRequestActive: isBookRequestActive,
            userDocID: doc.id,
          });
        });
      });
  };

  getBookRequest = () => {
    firebase
      .firestore()
      .collection("RequestedBooks")
      .where("Email", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().BookStatus === "Requested") {
            console.log(doc.data().BookName);
            this.setState({
              requestId: doc.data().RequestID,
              requestedBookName: doc.data().BookName,
              requestedBookStatus: doc.data().BookStatus,
              requesteddocId: doc.id,
              requestedEmail: doc.data().Email,
            });
          }
        });
      });
  };

  receivedBooks = async (requestedBookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    await firebase.firestore().collection("RecievedBooks").add({
      Email: userId,
      BookName: requestedBookName,
      RequestID: requestId,
      BookStatus: "Received",
    });
  };

  sendNotification = async () => {
    await firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().Name;

          firebase
            .firestore()
            .collection("Notifications")
            .where("RequestID", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donor = doc.data().Donor;
                var donorEmail = doc.data().DonorEmail;
                var bookName = doc.data().BookName;

                firebase
                  .firestore()
                  .collection("Notifications")
                  .add({
                    Name: donor,
                    RequestedEmail: donorEmail,
                    Message: name + " Has Received the Book " + bookName,
                    NotificationStatus: "Unread",
                    BookName: bookName,
                  });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getBookRequest();
    this.getisBookRequestActive();
  }

  updateBookRequestStatus = async () => {
    await firebase
      .firestore()
      .collection("RequestedBooks")
      .doc(this.state.requesteddocId)
      .update({
        BookStatus: "Recieved",
      });

    this.setState({
      isBookRequestActive: false,
    });

    await firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firebase.firestore().collection("Users").doc(doc.id).update({
            isBookRequestActive: this.state.isBookRequestActive,
          });
        });
      });
  };

  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={styles.container}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
          <View>
            <Card>
              <Card.Title>Book Name: {this.state.requestedBookName}</Card.Title>
              <Card.Title>
                Book Status: {this.state.requestedBookStatus}
              </Card.Title>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "orange",
                  backgroundColor: "orange",
                  width: 300,
                  alignSelf: "center",
                  alignItems: "center",
                  height: 30,
                  marginTop: 30,
                }}
                onPress={() => {
                  this.sendNotification();
                  this.updateBookRequestStatus();
                  this.receivedBooks(this.state.requestedBookName);
                }}
              >
                <Text>I Have Recieved The Book</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
