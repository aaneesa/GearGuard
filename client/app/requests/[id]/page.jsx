"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest } from "../../lib/api";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useAuth } from "../../context/authContext";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const canEdit =
    user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "TECHNICIAN";

  useEffect(() => {
    async function fetchRequest() {
      try {
        const data = await getRequest(params.id);
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchRequest();
    }
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "REPAIRED":
        return "bg-green-100 text-green-800";
      case "SCRAP":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!request) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Request not found</div>
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
            <Link href="/requests" className="text-blue-600 hover:text-blue-800">
              ← Back to Requests
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{request.subject}</h1>
              {canEdit && (
                <Link
                  href={`/requests/${request.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Priority</label>
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    request.priority
                  )}`}
                >
                  {request.priority}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Request Type</label>
                <p className="mt-1 text-lg text-gray-900">{request.requestType}</p>
              </div>

              {request.equipment && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Equipment</label>
                  <Link
                    href={`/equipments/${request.equipment.id}`}
                    className="mt-1 text-lg text-blue-600 hover:text-blue-800"
                  >
                    {request.equipment.name} ({request.equipment.serialNumber})
                  </Link>
                </div>
              )}

              {request.team && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Maintenance Team</label>
                  <p className="mt-1 text-lg text-gray-900">{request.team.name}</p>
                </div>
              )}

              {request.createdBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created By</label>
                  <p className="mt-1 text-lg text-gray-900">{request.createdBy.name}</p>
                </div>
              )}

              {request.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Assigned To</label>
                  <p className="mt-1 text-lg text-gray-900">{request.assignedTo.name}</p>
                </div>
              )}

              {request.scheduledDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Scheduled Date</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(request.scheduledDate).toLocaleString()}
                  </p>
                </div>
              )}

              {request.durationHours && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Duration</label>
                  <p className="mt-1 text-lg text-gray-900">{request.durationHours} hours</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Updated At</label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(request.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

