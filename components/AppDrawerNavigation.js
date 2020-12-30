import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import SideBar from "./CustomSideBar";
import { AppTabNavigator } from "./AppTabNavigator";
import SettingsScreen from "../Screens/Settings-Screen";
import MyDonationsScreen from "../Screens/MyDonations-Screen";

export const AppDrawer = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Donations: {
      screen: MyDonationsScreen,
    },
  },
  {
    contentComponent: SideBar,
  },
  {
    initialRouteName: "Home",
  }
);
