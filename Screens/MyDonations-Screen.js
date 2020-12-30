import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { ListItem, Header, Card } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default class MyDonationsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
    };
    this.donateRef = null;
  }

  getDonatedBooksList = async () => {
    this.donateRef = firebase
      .firestore()
      .collection("DonateBooks")
      .onSnapshot((snapshot) => {
        var donatedBookList = snapshot.docs.map((document) => document.data());
        this.setState({ list: donatedBookList });
      });
  };
  componentDidMount() {
    this.getDonatedBooksList();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>Book Name: {item.BookName}</ListItem.Title>
          <Card.Divider />
          <Text>Requested By: {item.RequestedBy}</Text>
          <Text>Requested Email: {item.RequestedEmail}</Text>
          <Card.Divider />
          <Text>Donated By:{item.DonatedBy}</Text>
          <Text>Donated Email: {item.DonatedEmail}</Text>
          <Card.Divider />
          <Text>Request Status: {item.RequestStatus}</Text>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Donated Books",
            style: { color: "white", fontSize: 17, marginTop: 10 },
          }}
        />
        <ScrollView>
          <View style={{ flex: 1 }}>
            {this.state.list.length === 0 ? (
              <View style={styles.subContainer}>
                <Text>Please Check Your Internet Connection</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.list}
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
    marginTop: 20,
    width: 200,
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
