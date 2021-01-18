import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Icon, ListItem, Header } from "react-native-elements";
import db from "../config.js";
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import MyHeader from "../components/AppHeader";

export default class MyDonationsScreen extends React.Component {
  static navigationOptions = { header: null };

  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      donorName: firebase.auth().currentUser.displayName,
      allDonations: [],
    };
  }

  sendBook = async (bookDetails) => {
    console.log(bookDetails);
    if (bookDetails.RequestStatus === "Donor Interested") {
      var requestStatus = "Sent Book";
      await firebase
        .firestore()
        .collection("DonateBooks")
        .where("DonorEmail", "==", bookDetails.DonorEmail)
        .where("RequestID", "==", bookDetails.RequestID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id);
            firebase.firestore().collection("DonateBooks").doc(doc.id).update({
              RequestStatus: requestStatus,
            });
          });
        });
      this.sendNotification(bookDetails, bookDetails.RequestStatus);
    } else {
      alert("Changing Request Status To Donor Interested");
      var requestStatus = "Donor Interested";
      await firebase
        .firestore()
        .collection("DonateBooks")
        .where("DonorEmail", "==", bookDetails.DonorEmail)
        .where("RequestID", "==", bookDetails.RequestID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id);
            firebase.firestore().collection("DonateBooks").doc(doc.id).update({
              RequestStatus: requestStatus,
            });
          });
        });

      this.sendNotification(bookDetails, bookDetails.RequestStatus);
    }
  };

  sendNotification = async (bookDetails, requestStatus) => {
    var requestId = bookDetails.RequestedEmail;
    var donorId = bookDetails.DonorEmail;

    await firebase
      .firestore()
      .collection("Notifications")
      .where("DonorEmail", "==", donorId)
      .where("RequestedEmail", "==", requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Sent Book") {
            message =
              this.state.donorName + " has Shown Interest In Donating The Book";
          } else {
            message = this.state.donorName + " has Sent You The Book";
          }
          firebase.firestore().collection("Notifications").doc(doc.id).update({
            Message: message,
            NotificationStatus: "Unread",
            Date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  getAllDonations = async () => {
    await firebase
      .firestore()
      .collection("DonateBooks")
      .where("DonorEmail", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = snapshot.docs.map((document) => document.data());
        this.setState({
          allDonations: allDonations,
        });
      });
  };
  componentDidMount() {
    this.getAllDonations();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.BookName}</ListItem.Title>
        <ListItem.Subtitle>Requested By: {item.RequestedBy}</ListItem.Subtitle>
        <ListItem.Subtitle>
          Request Status: {item.RequestStatus}
        </ListItem.Subtitle>
      </ListItem.Content>
      <View>
        <Icon
          name="book"
          type="font-awesome"
          color="magenta"
          size={50}
          containerStyle={{ marginBottom: 20 }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.sendBook(item);
          }}
        >
          <Text style={{ color: "#ffff" }}>Send Book</Text>
        </TouchableOpacity>
      </View>
    </ListItem>
  );

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="My Donations" navigation={this.props.navigation} />
        <ScrollView>
          <View style={{ flex: 1 }}>
            {this.state.allDonations.length === 0 ? (
              <View style={styles.subtitle}>
                <Text
                  style={{ fontSize: 30, alignSelf: "center", color: "white" }}
                >
                  No Donations
                </Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },

  logost: {
    fontWeight: "bold",
    fontSize: 30,
    color: "yellow",
    textAlign: "center",
    marginBottom: 20,
  },
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    backgroundColor: "#fb5b5a",
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.44,
    shadowRadius: 50.32,
    elevation: 16,
    alignSelf: "center",
    color: "white",
  },
});
