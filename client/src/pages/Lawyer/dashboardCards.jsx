import React from "react";
import { Mail, CalendarCheck, Users } from "lucide-react";

export const dashboardCards = [
  {
    label: "Pending Requests",
    to: "/lawyer/connection-requests",
    borderColor: "border-l-4 border-red-500",
    icon: <Mail className="text-red-400" size={28} />,
  },
  {
    label: "Accepted Requests",
    to: "/lawyer/accepted-connections",
    borderColor: "border-l-4 border-green-500",
    icon: <Users className="text-green-400" size={28} />,
  },

  {
    label: "Messages",
    to: "/chat/lawyer/threads",
    borderColor: "border-l-4 border-yellow-400",
    icon: <Mail className="text-yellow-400" size={28} />,
  },
];
