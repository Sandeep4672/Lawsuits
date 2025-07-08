import { Users, FileCheck2, FilePlus, FolderSearch } from "lucide-react";

export const adminCards = [
  {
    title: "All Verified Lawyers",
    description: "Browse through all verified lawyers",
    path: "/admin/lawyers",
    bg: "bg-green-600",
    icon: <Users className="w-6 h-6 text-white" />,
  },
  {
    title: "Pending Lawyer Requests",
    description: "View and approve new lawyer applications",
    path: "/admin/lawyer-requests",
    bg: "bg-yellow-500",
    icon: <FileCheck2 className="w-6 h-6 text-white" />,
  },
  {
    title: "Add Case",
    description: "Add new legal case to the system",
    path: "/admin/add-case",
    bg: "bg-pink-500",
    icon: <FilePlus className="w-6 h-6 text-white" />,
  },
  {
    title: "Show Cases",
    description: "View all uploaded legal cases",
    path: "/admin/all-cases", // fixed: remove dot before "/admin"
    bg: "bg-blue-600",
    icon: <FolderSearch className="w-6 h-6 text-white" />,
  },
];
 