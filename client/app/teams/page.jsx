"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTeams, deleteTeam } from "../lib/api";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      toast.error("Failed to load teams");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      await deleteTeam(id);
      toast.success("Team deleted");
      fetchTeams();
    } catch (error) {
      toast.error(error.message || "Failed to delete team");
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Teams</h1>
            <Link
              href="/teams/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Team
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No teams found.</p>
              <Link
                href="/teams/new"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  {team.description && (
                    <p className="text-gray-600 mb-4">{team.description}</p>
                  )}
                  <div className="text-sm text-gray-500 mb-4">
                    Members: {team.members?.length || 0}
                  </div>
                  <Link
                    href={`/teams/${team.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

