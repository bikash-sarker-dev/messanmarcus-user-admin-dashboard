import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [
          // {
          //   title: "eCommerce",
          //   url: "/",
          // },
        ],
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Subscriptions",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Notifications",
        icon: Icons.Alphabet,
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
