"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  X,
  User,
  Calendar,
  Clock,
  Shield,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  subscription: "Enterprise" | "Pro" | "Free";
  createdDate: string;
  lastActive: string;
  status: "Active" | "Inactive" | "Suspended";
}

type FilterStatus = "All" | "Active" | "Inactive" | "Suspended";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Dianne Russell",
      email: "felicia.reid@example.com",
      subscription: "Enterprise",
      createdDate: "Jan 16, 2024",
      lastActive: "2 min ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Albert Flores",
      email: "debra.holt@example.com",
      subscription: "Pro",
      createdDate: "Feb 3, 2024",
      lastActive: "2 min ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Darrell Steward",
      email: "tanya.hill@example.com",
      subscription: "Free",
      createdDate: "Mar 12, 2024",
      lastActive: "2 min ago",
      status: "Active",
    },
    {
      id: 4,
      name: "Jacob Jones",
      email: "debra.holt@example.com",
      subscription: "Pro",
      createdDate: "Jan 28, 2024",
      lastActive: "2 min ago",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Floyd Miles",
      email: "felicia.reid@example.com",
      subscription: "Enterprise",
      createdDate: "Apr 5, 2024",
      lastActive: "2 min ago",
      status: "Active",
    },
    {
      id: 6,
      name: "Kristin Watson",
      email: "sara.cruz@example.com",
      subscription: "Free",
      createdDate: "May 20, 2024",
      lastActive: "2 min ago",
      status: "Suspended",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: User["status"]): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSubscriptionColor = (subscription: User["subscription"]): string => {
    switch (subscription) {
      case "Enterprise":
        return "bg-gray-800 text-white";
      case "Pro":
        return "bg-gray-600 text-white";
      case "Free":
        return "bg-gray-300 text-gray-700";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const handleViewDetails = (user: User): void => {
    setSelectedUser(user);
    setShowDetailsModal(true);
    setActiveActionMenu(null);
  };

  const handleSuspendUser = (userId: number): void => {
    setUsers(
      users.map((user: User) =>
        user.id === userId ? { ...user, status: "Suspended" as const } : user,
      ),
    );
    setActiveActionMenu(null);
  };

  const filterOptions: FilterStatus[] = [
    "All",
    "Active",
    "Inactive",
    "Suspended",
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all users across your platform
          </p>
        </div>

        {/* User Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              All Users ({filteredUsers.length})
            </h2>

            {/* Search and Filter Bar */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {filterStatus}
                  </span>
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="py-2">
                      {filterOptions.map((status: FilterStatus) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left transition-colors hover:bg-gray-50 ${
                            filterStatus === status
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user: User) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                          <span className="text-sm font-semibold text-indigo-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${getSubscriptionColor(user.subscription)}`}
                      >
                        {user.subscription}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {user.createdDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {user.lastActive}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveActionMenu(
                              activeActionMenu === user.id ? null : user.id,
                            )
                          }
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>

                        {activeActionMenu === user.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="py-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-gray-50"
                              >
                                <User className="h-4 w-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 transition-colors hover:bg-gray-50"
                              >
                                <Shield className="h-4 w-4" />
                                <span>Suspend User</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-3xl font-bold text-indigo-700">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Subscription
                      </span>
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getSubscriptionColor(selectedUser.subscription)}`}
                    >
                      {selectedUser.subscription}
                    </span>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Status
                      </span>
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedUser.status)}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Created Date
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {selectedUser.createdDate}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Last Active
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {selectedUser.lastActive}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                    Edit User
                  </button>
                  <button
                    onClick={() => {
                      handleSuspendUser(selectedUser.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Suspend User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
