"use client";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Activity,
} from "lucide-react";

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    createdDate: string;
    lastActive: string;
    subscription: string;
    status: "active" | "inactive" | "suspended";
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const defaultUser = {
    name: "Lebron James",
    email: "Lebronjames003@gmail.com",
    phone: "+8801638148194",
    location: "California, USA",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    createdDate: "Jan 15, 2024",
    lastActive: "2 min ago",
    subscription: "Enterprise",
    status: "active" as const,
  };

  const userData = user || defaultUser;

  const handleSuspend = () => {
    // console.log("Suspend user clicked");
  };

  const handleBan = () => {
    // console.log("Ban account clicked");
  };

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header Card */}
        <div className="mb-14">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-start lg:w-auto">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="h-28 w-28 rounded-full border-4 border-gray-100 object-cover sm:h-32 sm:w-32 lg:h-40 lg:w-40"
                />
                <div
                  className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white sm:bottom-2 sm:right-2 sm:h-5 sm:w-5 sm:border-4 ${
                    userData.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>

              {/* User Info */}
              <div className="w-full space-y-3 text-center sm:w-auto sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {userData.name}
                </h1>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-600 sm:justify-start">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all text-xs sm:text-sm">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600 sm:justify-start">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{userData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600 sm:justify-start">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">
                      {userData.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <button
                onClick={handleSuspend}
                className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 sm:w-auto sm:px-6 sm:text-sm"
              >
                Suspend User
              </button>
              <button
                onClick={handleBan}
                className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-red-700 sm:w-auto sm:px-6 sm:text-sm"
              >
                Ban Account
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Created Date */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-2">
                <Calendar className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Created Date
              </span>
            </div>
            <p className="ml-10 text-lg font-semibold text-indigo-600 sm:ml-11 sm:text-2xl">
              {userData.createdDate}
            </p>
          </div>

          {/* Last Active */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-purple-50 p-2">
                <Clock className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Last Active
              </span>
            </div>
            <p className="ml-10 text-lg font-semibold text-purple-600 sm:ml-11 sm:text-2xl">
              {userData.lastActive}
            </p>
          </div>

          {/* Subscription */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-blue-50 p-2">
                <CreditCard className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Subscription
              </span>
            </div>
            <p className="ml-10 text-lg font-semibold text-blue-600 sm:ml-11 sm:text-2xl">
              {userData.subscription}
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-green-50 p-2">
                <Activity className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-gray-500 sm:text-sm">
                Status
              </span>
            </div>
            <p className="ml-10 text-lg font-semibold capitalize text-green-600 sm:ml-11 sm:text-2xl">
              {userData.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
