import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    setTimeout(() => {
      this.props.navigation.navigate("RegisterScreen");
    }, 5000);
  }

  render() {
    return (
      <View style={{ backgroundColor: "white" }}>
        <View
          style={{
            width: SCREEN_WIDTH,
            height: 0,
            borderTopColor: "red",
            borderTopWidth: SCREEN_HEIGHT / 3,
            borderRightWidth: SCREEN_WIDTH / 1,
            borderRightColor: "transparent",
          }}
        ></View>
        <View style={styles.SplashView}>
          <Text style={styles.SplashText}>Book Santa</Text>
          <Text style={styles.SplashSubtitleText}>Born Santa.</Text>
        </View>
        <View
          style={{
            transform: [{ rotate: "180deg" }],
            width: SCREEN_WIDTH,
            height: 0,
            borderTopColor: "red",
            borderTopWidth: SCREEN_HEIGHT / 4,
            borderRightWidth: SCREEN_WIDTH / 1,
            borderRightColor: "transparent",
          }}
        ></View>
        <View style={{ backgroundColor: "red" }}>
          <ActivityIndicator
            size={80}
            color="white"
            style={{ marginBottom: 20 }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SplashView: {
    backgroundColor: "red",
    height: 220,
    justifyContent: "center",
  },
  SplashText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
  },
  SplashSubtitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "yellow",
    alignSelf: "center",
  },
  SplashButton: {
    alignSelf: "center",
    backgroundColor: "#309BE3",
    height: 60,
    width: 250,
    justifyContent: "center",
    borderRadius: 80,
    marginBottom: 120,
  },
});
