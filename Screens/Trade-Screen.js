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
import { ListItem, Header } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export default class TradeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
    };
    this.requestRef = null;
  }

  getRequestedBooksList = async () => {
    this.requestRef = firebase
      .firestore()
      .collection("RequestedBooks")
      .onSnapshot((snapshot) => {
        var requestedBookList = snapshot.docs.map((document) =>
          document.data()
        );
        this.setState({ list: requestedBookList });
      });
  };
  componentDidMount() {
    this.getRequestedBooksList();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.BookName}</ListItem.Title>
          <ListItem.Subtitle>{item.Reason}</ListItem.Subtitle>
          <Text>Request by {item.UserName}</Text>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate("DetailsScreen");
              }}
            >
              <Text style={{ color: "white" }}>Donate</Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Find Book Requests",
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
