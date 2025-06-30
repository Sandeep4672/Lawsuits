import React from "react";
import { Mail, CalendarCheck, CaseSensitive, Users } from "lucide-react";

export const dashboardCards = [
  {
    label: "Pending Requests",
    to: "/lawyer/connection-requests",
    borderColor: "border-t-4 border-red-400",
    icon: <Mail className="text-red-500" size={28} />,
  },
  {
    label: "Accepted Requests",
    to: "/lawyer/accepted-connections",
    borderColor: "border-t-4 border-green-500",
    icon: <Users className="text-green-600" size={28} />,
  },
  {
    label: "Appointments",
    to: "/lawyer/appointments",
    borderColor: "border-t-4 border-red-500",
    icon: <CalendarCheck className="text-blue-600" size={28} />,
  },
  {
    label: "Messages",
    to: "/chat/lawyer/threads",
    borderColor: "border-t-4 border-yellow-400",
    icon: <Mail className="text-yellow-500" size={28} />,
  },
  {
    label: "Case Uploads",
    to: "/lawyer/cases",
    borderColor: "border-t-4 border-purple-500",
    icon: <CaseSensitive className="text-purple-500" size={28} />,
  },
];
