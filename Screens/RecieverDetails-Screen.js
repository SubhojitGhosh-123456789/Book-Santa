import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
      requestId: this.props.navigation.getParam("Details")["RequestID"],
      username: this.props.navigation.getParam("Details")["UserName"],
      bookname: this.props.navigation.getParam("Details")["BookName"],
      reason: this.props.navigation.getParam("Details")["Reason"],
      address: "",
      phone: "",
      name: "",
      email: "",
      recieverRequestId: "",
    };
  }

  getRecieverDetails = async () => {
    firebase.firestore
      .collection("Users")
      .where("Name", "==", this.state.username)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().Name,
            phone: doc.data().Phone,
            address: doc.data().Address,
            email: doc.data().Email,
          });
        });
      });

    firebase.firestore
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
  }

  updateBookStatus = async () => {
    firebase.firestore.collection("DonateBooks").add({
      BookName: this.state.bookname,
      RequestedBy: this.state.username,
      RequestedEmail: this.state.email,
      DonatedBy: this.state.donor,
      DonatedEmail: this.state.userEmail,
      RequestStatus: "Donor Interested",
    });
  };

  render() {
    alert("being Called");
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="left-arrow"
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
            <Card>
              <Card.Title>Book Request Information</Card.Title>
            </Card>
            <Card>
              <Card.Title>Book Name: {this.state.bookname}</Card.Title>
              <Card.Title>Reason: {this.state.reason}</Card.Title>
              <Card.Title>Name: {this.state.name}</Card.Title>
              <Card.Title>Mobile Number: {this.state.phone}</Card.Title>
              <Card.Title>Address:{this.state.address}</Card.Title>
            </Card>
            <View>
              {this.state.userEmail !== this.state.email ? (
                <TouchableOpacity
                  onPress={() => {
                    this.updateBookStatus();
                    this.props.navigation.navigate("MyDonationsScreen");
                  }}
                >
                  <Text>Interested To Donate Book</Text>
                </TouchableOpacity>
              ) : null}
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
});
