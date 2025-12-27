"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest, updateRequest, getEquipments, getTeams } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";

export default function EditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    requestType: "CORRECTIVE",
    priority: "MEDIUM",
    status: "NEW",
    equipmentId: "",
    teamId: "",
    assignedToId: "",
    scheduledDate: "",
    durationHours: "",
  });
  const [equipments, setEquipments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [requestData, equipmentData, teamsData] = await Promise.all([
          getRequest(params.id),
          getEquipments(),
          getTeams(),
        ]);

        setEquipments(equipmentData);
        setTeams(teamsData);

        setForm({
          subject: requestData.subject || "",
          description: requestData.description || "",
          requestType: requestData.requestType || "CORRECTIVE",
          priority: requestData.priority || "MEDIUM",
          status: requestData.status || "NEW",
          equipmentId: requestData.equipmentId?.toString() || "",
          teamId: requestData.teamId?.toString() || "",
          assignedToId: requestData.assignedToId?.toString() || "",
          scheduledDate: requestData.scheduledDate
            ? new Date(requestData.scheduledDate).toISOString().slice(0, 16)
            : "",
          durationHours: requestData.durationHours?.toString() || "",
        });
      } catch (error) {
        toast.error("Failed to load request");
        console.error(error);
      } finally {
        setFetching(false);
      }
    }
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        ...form,
        equipmentId: parseInt(form.equipmentId),
        teamId: parseInt(form.teamId),
        assignedToId: form.assignedToId ? parseInt(form.assignedToId) : null,
        scheduledDate: form.scheduledDate || undefined,
        durationHours: form.durationHours ? parseFloat(form.durationHours) : undefined,
      };

      await updateRequest(params.id, requestData);
      toast.success("Request updated successfully!");
      router.push(`/requests/${params.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update request");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
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

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "TECHNICIAN"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Request</h1>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject *</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REPAIRED">Repaired</option>
                  <option value="SCRAP">Scrap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Request Type *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.requestType}
                  onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                >
                  <option value="CORRECTIVE">Corrective</option>
                  <option value="PREVENTIVE">Preventive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.equipmentId}
                  onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
                >
                  <option value="">Select equipment</option>
                  {equipments.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.name} - {equipment.serialNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Team *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.teamId}
                  onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned To (User ID)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.assignedToId}
                  onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                  placeholder="Leave empty to unassign"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.scheduledDate}
                  onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.durationHours}
                  onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Updating..." : "Update Request"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

