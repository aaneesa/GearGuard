"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEquipment, updateEquipment, getTeams } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import toast from "react-hot-toast";

export default function EditEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    category: "",
    location: "",
    purchaseDate: "",
    warrantyExpiry: "",
    departmentId: "",
    maintenanceTeamId: "",
    assignedUserId: "",
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [equipmentData, teamsData] = await Promise.all([
          getEquipment(params.id),
          getTeams(),
        ]);

        setTeams(teamsData);
        setForm({
          name: equipmentData.name || "",
          serialNumber: equipmentData.serialNumber || "",
          category: equipmentData.category || "",
          location: equipmentData.location || "",
          purchaseDate: equipmentData.purchaseDate
            ? new Date(equipmentData.purchaseDate).toISOString().split("T")[0]
            : "",
          warrantyExpiry: equipmentData.warrantyExpiry
            ? new Date(equipmentData.warrantyExpiry).toISOString().split("T")[0]
            : "",
          departmentId: equipmentData.departmentId?.toString() || "",
          maintenanceTeamId: equipmentData.maintenanceTeamId?.toString() || "",
          assignedUserId: equipmentData.assignedUserId?.toString() || "",
        });
      } catch (error) {
        toast.error("Failed to load equipment");
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
      const equipmentData = {
        ...form,
        departmentId: form.departmentId ? parseInt(form.departmentId) : undefined,
        maintenanceTeamId: form.maintenanceTeamId ? parseInt(form.maintenanceTeamId) : undefined,
        assignedUserId: form.assignedUserId ? parseInt(form.assignedUserId) : null,
        purchaseDate: form.purchaseDate || undefined,
        warrantyExpiry: form.warrantyExpiry || undefined,
      };

      await updateEquipment(params.id, equipmentData);
      toast.success("Equipment updated successfully!");
      router.push(`/equipments/${params.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update equipment");
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Equipment</h1>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Serial Number *</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.serialNumber}
                  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.purchaseDate}
                  onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Warranty Expiry</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.warrantyExpiry}
                  onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department ID *</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Team *</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.maintenanceTeamId}
                  onChange={(e) => setForm({ ...form, maintenanceTeamId: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700">Assigned User ID</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  value={form.assignedUserId}
                  onChange={(e) => setForm({ ...form, assignedUserId: e.target.value })}
                  placeholder="Leave empty to unassign"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "Updating..." : "Update Equipment"}
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

