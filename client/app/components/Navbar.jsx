"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";
  const isTechnician = user?.role === "TECHNICIAN";
  const canManageEquipment = isAdmin || isManager;
  const canManageTeams = isAdmin || isManager;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-xl font-semibold text-gray-900">
              GearGuard
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                Dashboard
              </Link>
              <Link
                href="/equipments"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                Equipment
              </Link>
              <Link
                href="/requests"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
              >
                Requests
              </Link>
              {(canManageTeams || isTechnician) && (
                <Link
                  href="/teams"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                >
                  Teams
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

