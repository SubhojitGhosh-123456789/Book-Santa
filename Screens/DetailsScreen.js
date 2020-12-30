import React from "react";
import { Text, View } from "react-native";

export default class DetailsScreen extends React.Component {
  render() {
    alert("called from details");
    return (
      <View>
        <Text>alert</Text>
      </View>
    );
  }
}
