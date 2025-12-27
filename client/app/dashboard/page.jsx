"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getEquipments, getRequests } from "../lib/api";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeEquipment: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [equipments, requests] = await Promise.all([
          getEquipments(),
          getRequests(),
        ]);

        const activeEquipment = equipments.filter((eq) => eq.status === "ACTIVE").length;
        const pendingRequests = requests.filter(
          (req) => req.status === "NEW" || req.status === "IN_PROGRESS"
        ).length;

        setStats({
          totalEquipment: equipments.length,
          activeEquipment,
          totalRequests: requests.length,
          pendingRequests,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {user?.name}!
          </h1>

          {loading ? (
            <div className="text-center py-12">Loading dashboard...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Equipment</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.totalEquipment}
                </div>
                <Link href="/equipments" className="mt-4 text-sm text-blue-600 hover:text-blue-800">
                  View all →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Active Equipment</div>
                <div className="mt-2 text-3xl font-semibold text-green-600">
                  {stats.activeEquipment}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total Requests</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.totalRequests}
                </div>
                <Link href="/requests" className="mt-4 text-sm text-blue-600 hover:text-blue-800">
                  View all →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Pending Requests</div>
                <div className="mt-2 text-3xl font-semibold text-orange-600">
                  {stats.pendingRequests}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/equipments/new"
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
              >
                Add Equipment
              </Link>
              <Link
                href="/requests/new"
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
              >
                Create Request
              </Link>
              {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <Link
                  href="/teams/new"
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
                >
                  Create Team
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

