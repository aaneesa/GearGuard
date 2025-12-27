"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEquipment } from "../../lib/api";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const data = await getEquipment(params.id);
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchEquipment();
    }
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!equipment) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Equipment not found</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/equipments" className="text-blue-600 hover:text-blue-800">
              ← Back to Equipment
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
              <Link
                href={`/equipments/${equipment.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Serial Number</label>
                <p className="mt-1 text-lg text-gray-900">{equipment.serialNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="mt-1 text-lg text-gray-900">{equipment.category}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Location</label>
                <p className="mt-1 text-lg text-gray-900">{equipment.location}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    equipment.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              {equipment.purchaseDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Date</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(equipment.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {equipment.warrantyExpiry && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Warranty Expiry</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(equipment.warrantyExpiry).toLocaleDateString()}
                  </p>
                </div>
              )}

              {equipment.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-lg text-gray-900">{equipment.department.name}</p>
                </div>
              )}

              {equipment.maintenanceTeam && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Maintenance Team</label>
                  <p className="mt-1 text-lg text-gray-900">{equipment.maintenanceTeam.name}</p>
                </div>
              )}

              {equipment.assignedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Assigned User</label>
                  <p className="mt-1 text-lg text-gray-900">{equipment.assignedUser.name}</p>
                </div>
              )}
            </div>

            {equipment.requests && equipment.requests.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance Requests</h2>
                <div className="space-y-2">
                  {equipment.requests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/requests/${request.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{request.subject}</p>
                          <p className="text-sm text-gray-500">{request.status}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

