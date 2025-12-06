import React from "react";

interface Activity {
  id: number;
  name: string;
  action: string;
  time: string;
  avatar: string;
  bgColor: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      name: "Cameron Williamson",
      action: "Upgraded to Pro",
      time: "2m ago",
      avatar: "CW",
      bgColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Darrell Steward",
      action: "New signup",
      time: "15m ago",
      avatar: "DS",
      bgColor: "bg-pink-500",
    },
    {
      id: 3,
      name: "Guy Hawkins",
      action: "Cancelled subscription",
      time: "1h ago",
      avatar: "GH",
      bgColor: "bg-teal-500",
    },
    {
      id: 4,
      name: "Leslie Alexander",
      action: "Upgraded to Enterprise",
      time: "2m ago",
      avatar: "LA",
      bgColor: "bg-orange-500",
    },
    {
      id: 5,
      name: "Arlene McCoy",
      action: "New signup",
      time: "3h ago",
      avatar: "AM",
      bgColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="">
        <div className="overflow-hidden shadow-sm">
          {/* Header */}
          <div className="">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Recent Activity
            </h2>
          </div>

          {/* Activity List */}
          <div className="mt-7 rounded-xl border py-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="cursor-pointer px-4 py-3 transition-colors duration-150 hover:bg-gray-50 sm:px-6 lg:px-8"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left side: Avatar + Info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div
                      className={`${activity.bgColor} flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md sm:h-12 sm:w-12 sm:text-base`}
                    >
                      {activity.avatar}
                    </div>

                    {/* Name and Action */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        {activity.name}
                      </h3>
                      <p className="truncate text-xs text-gray-500 sm:text-sm">
                        {activity.action}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Time */}
                  <div className="flex-shrink-0">
                    <span className="whitespace-nowrap text-xs font-medium text-gray-400 sm:text-sm">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile optimized notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 sm:text-sm">
            Showing recent user activities
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
