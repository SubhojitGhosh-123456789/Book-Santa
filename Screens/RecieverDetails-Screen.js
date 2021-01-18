import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Header, Icon, Card } from "react-native-elements";

export default class RecieverDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: firebase.auth().currentUser.email,
      donor: firebase.auth().currentUser.displayName,
      donorName: "",
      email: this.props.navigation.getParam("Details")["Email"],
      requestId: this.props.navigation.getParam("Details")["RequestID"],
      username: this.props.navigation.getParam("Details")["UserName"],
      bookname: this.props.navigation.getParam("Details")["BookName"],
      reason: this.props.navigation.getParam("Details")["Reason"],
      address: "",
      phone: "",
      recieverRequestId: "",
    };
  }

  getUserDetails = async (email) => {
    await firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().Name,
          });
        });
      });
  };

  getRecieverDetails = async () => {
    await firebase
      .firestore()
      .collection("Users")
      .where("Email", "==", this.state.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data);
          this.setState({
            phone: doc.data().Phone,
            address: doc.data().Address,
          });
        });
      });

    await firebase
      .firestore()
      .collection("RequestedBooks")
      .where("RequestID", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverRequestId: doc.id,
          });
        });
      });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userEmail);
  }

  updateBookStatus = async () => {
    await firebase.firestore().collection("DonateBooks").add({
      BookName: this.state.bookname,
      RequestedBy: this.state.username,
      RequestedEmail: this.state.email,
      Donor: this.state.donor,
      DonorEmail: this.state.userEmail,
      RequestID: this.state.requestId,
      RequestStatus: "Donor Interested",
    });

    this.props.navigation.goBack();

    ToastAndroid.show("Shown Interest Successfully", ToastAndroid.SHORT);
  };

  addNotification = async () => {
    var message =
      this.state.donorName +
      " has shown interest in donating the book- " +
      this.state.bookname;
    await firebase.firestore().collection("Notifications").add({
      BookName: this.state.bookname,
      RequestedBy: this.state.username,
      RequestedEmail: this.state.email,
      Donor: this.state.donor,
      DonorEmail: this.state.userEmail,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      NotificationStatus: "Unread",
      RequestID: this.state.requestId,
      Message: message,
    });

    this.props.navigation.goBack();

    ToastAndroid.show("Shown Interest Successfully", ToastAndroid.SHORT);
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="white"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={{
            text: "Donate Book",
            style: { color: "white", fontSize: 17, marginTop: 10 },
          }}
        />
        <ScrollView>
          <View style={{ flex: 1 }}>
            <Card borderRadius={25}>
              <Card.Title>Book Request Information</Card.Title>
              <Card.Divider />
              <Card.Title>Book Name: {this.state.bookname}</Card.Title>
              <Card.Title>Reason: {this.state.reason}</Card.Title>
              <Card.Divider />
              <Card.Title>Name: {this.state.username}</Card.Title>
              <Card.Divider />
              <Card.Title>Mobile Number:</Card.Title>
              <Card.Title>{this.state.phone}</Card.Title>
              <Card.Divider />
              <Card.Title>Address:</Card.Title>
              <Card.Title>{this.state.address}</Card.Title>
              <Card.Divider />
              <Card.Title>Email:</Card.Title>
              <Card.Title>{this.state.email}</Card.Title>
            </Card>
            <View>
              {this.state.userEmail !== this.state.email ? (
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyDonationsScreen");
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      alignSelf: "center",
                    }}
                  >
                    Interested To Donate Book
                  </Text>
                </TouchableOpacity>
              ) : (
                ToastAndroid.show(
                  "You Cannot Donate To Yourself",
                  ToastAndroid.LONG
                )
              )}
            </View>
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
    backgroundColor: "#00547A",
  },
  loginBtn: {
    width: "75%",
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
