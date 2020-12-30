import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import TradeScreen from "../Screens/Trade-Screen";
import RecieverDetailsScreen from "../Screens/RecieverDetails-Screen";

export const AppStackNavigator = createStackNavigator(
  {
    TradeScreen: {
      screen: TradeScreen,
    },
    DetailsScreen: {
      screen: RecieverDetailsScreen,
    },
  },
  {
    initialRouteName: "TradeScreen",
  }
);
