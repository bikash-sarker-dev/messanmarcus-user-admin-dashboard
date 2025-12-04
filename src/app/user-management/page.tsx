import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "user Page",
  // other metadata
};

const UserManagementPage = () => {
  return (
    <>
      <Breadcrumb pageName="User" />
    </>
  );
};

export default UserManagementPage;
