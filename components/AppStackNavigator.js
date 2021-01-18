import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import TradeScreen from "../Screens/Trade-Screen";
import RecieverDetailsScreen from "../Screens/RecieverDetails-Screen";

export const AppStackNavigator = createStackNavigator(
  {
    TradeScreen: {
      screen: TradeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    DetailsScreen: {
      screen: RecieverDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "TradeScreen",
  }
);
