import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import SideBar from "./CustomSideBar";
import { AppTabNavigator } from "./AppTabNavigator";
import SettingsScreen from "../Screens/Settings-Screen";
import MyDonationsScreen from "../Screens/MyDonations-Screen";
import NotificationsScreen from "../Screens/Notifications-Screen";
import RecievedBooksScreen from "../Screens/RecievedBooks-Screen";

export const AppDrawer = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Notifications: {
      screen: NotificationsScreen,
    },
    Donations: {
      screen: MyDonationsScreen,
    },

    Recieved: {
      screen: RecievedBooksScreen,
    },
  },
  {
    contentComponent: SideBar,
  },
  {
    initialRouteName: "Home",
  }
);
