import * as Icons from "../icons";
import type { NavSection } from "./types";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Subscriptions",
        url: "/subscriptions",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Notifications",
        icon: Icons.Alphabet,
        url: "/notifications",
        items: [],
      },
      {
        title: "Settings",
        icon: Icons.Alphabet,
        url: "/pages/settings",
        items: [],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [],
  },
];
