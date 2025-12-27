"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { addTeamMember, getTeam } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/authContext";

export default function AddTeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await getTeam(params.id);
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
        toast.error("Failed to load team");
      } finally {
        setFetching(false);
      }
    }
    if (params.id) {
      fetchTeam();
    }
  }, [params.id]);

  async function handleJoin() {
    if (!confirm(`Join ${team?.name}?`)) return;

    setLoading(true);
    try {
      await addTeamMember({ teamId: parseInt(params.id) });
      toast.success("Successfully joined team!");
      router.push(`/teams/${params.id}`);
    } catch (error) {
      toast.error(error.message || "Failed to join team");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
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
    <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Team</h1>
            {team && (
              <>
                <p className="text-gray-600 mb-6">
                  You are about to join <strong>{team.name}</strong> as a team member.
                </p>
                {team.description && (
                  <p className="text-gray-500 mb-6">{team.description}</p>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? "Joining..." : "Join Team"}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

