import * as Icons from "../icons";
import type { NavSection } from "./types";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.House,
        url: "/dashboard",
        items: [],
      },
      {
        title: "Recognitions",
        url: "/dashboard/recognitions",
        icon: Icons.Award,
        items: [],
      },
      {
        title: "Directory",
        url: "/subscriptions",
        icon: Icons.Users,
        items: [],
      },
      {
        title: "Reports",
        icon: Icons.ChartLineIcon,
        url: "/notifications",
        items: [],
      },
      {
        title: "Settings",
        icon: Icons.Settings,
        url: "/settings",
        items: [],
      },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [],
  // },
];
