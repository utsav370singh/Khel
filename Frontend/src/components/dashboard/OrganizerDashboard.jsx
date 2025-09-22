// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";

/** =========================
 *  CONFIG
 *  ========================= */
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:8080"; // change if needed
const TOKEN_KEY = "token";

/** =========================
 *  Small UI helpers
 *  ========================= */
const Button = ({ className = "", ...props }) => (
  <button
    className={
      "px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 " +
      className
    }
    {...props}
  />
);

const Card = ({ children }) => (
  <div className="border p-4 rounded shadow-sm bg-white">{children}</div>
);

const Skeleton = () => (
  <div className="space-y-3">
    <div className="h-24 rounded bg-gray-100 animate-pulse" />
    <div className="h-24 rounded bg-gray-100 animate-pulse" />
    <div className="h-24 rounded bg-gray-100 animate-pulse" />
  </div>
);

const ErrorNote = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
    {message}
    {onRetry && (
      <Button className="ml-3 bg-red-600 hover:bg-red-700" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);

/** =========================
 *  Authenticated fetch (inline)
 *  Handles: token, CORS, {data:[]} vs [] shapes, errors, 401
 *  ========================= */
async function authFetch(path, opts = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    credentials: "include",
    ...opts,
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch (_) {
    /* ignore */
  }

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    throw new Error(payload?.message || "Unauthorized. Please log in again.");
  }
  if (!res.ok) {
    throw new Error(payload?.message || `Request failed (${res.status})`);
  }

  // Allow both [] and { data: [] }
  return Array.isArray(payload) ? payload : payload?.data ?? [];
}

/** =========================
 *  Organizer Section
 *  ========================= */
const OrganizerSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await authFetch("/api/v1/tournaments/my-tournaments");
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setItems(sorted);
    } catch (e) {
      setErr(e.message || "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">My Tournaments (Organizer)</h3>
        <a href="/create-tournament">
          <Button>Create Tournament</Button>
        </a>
      </div>

      {loading && <Skeleton />}
      {!loading && err && <ErrorNote message={err} onRetry={load} />}
      {!loading && !err && items.length === 0 && <p>No tournaments found.</p>}

      {!loading && !err && items.length > 0 && (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <li key={t._id}>
              <Card>
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg">{t.name}</h4>
                  {t.status && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                      {t.status}
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1">Sport: {t.sport || "-"}</p>
                <p className="text-sm">Teams: {t.totalTeams ?? "-"}</p>
                <p className="text-sm">
                  Prize: ₹{Number(t.prizeMoney || 0).toLocaleString("en-IN")}
                </p>
                {(t.startDate || t.endDate) && (
                  <p className="text-xs text-gray-600 mt-1">
                    {t.startDate ? `Start: ${new Date(t.startDate).toDateString()}` : ""}
                    {t.startDate && t.endDate ? " • " : ""}
                    {t.endDate ? `End: ${new Date(t.endDate).toDateString()}` : ""}
                  </p>
                )}
                <div className="flex gap-3 mt-3">
                  <a
                    href={`/tournament/${t._id}`}
                    className="text-purple-700 hover:underline text-sm"
                  >
                    View
                  </a>
                  <a
                    href={`/tournament/${t._id}/edit`}
                    className="text-purple-700 hover:underline text-sm"
                  >
                    Edit
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** =========================
 *  Player/User Section
 *  ========================= */
const PlayerSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // Change to your actual endpoint if named differently
      const data = await authFetch("/api/v1/tournaments/my-registrations");
      setItems(data);
    } catch (e) {
      setErr(e.message || "Something went wrong.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Participations (Player)</h3>

      {loading && <Skeleton />}
      {!loading && err && <ErrorNote message={err} onRetry={load} />}
      {!loading && !err && items.length === 0 && <p>No participations yet.</p>}

      {!loading && !err && items.length > 0 && (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => {
            const t = p.tournament || {};
            return (
              <li key={p._id}>
                <Card>
                  <h4 className="font-semibold text-lg">{t.name || "Tournament"}</h4>
                  <p className="text-sm mt-1">Sport: {t.sport || "-"}</p>
                  <p className="text-sm">Team: {p.teamName || "-"}</p>
                  <p className="text-sm">Status: {p.status || t.status || "-"}</p>
                  <div className="flex gap-3 mt-3">
                    {t._id && (
                      <a
                        href={`/tournament/${t._id}`}
                        className="text-purple-700 hover:underline text-sm"
                      >
                        View
                      </a>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/** =========================
 *  Combined Dashboard (tabs)
 *  ========================= */
const Dashboard = () => {
  const [tab, setTab] = useState("organizer"); // 'organizer' | 'player'

  // If you store user role in localStorage/session, you can default the tab:
  useEffect(() => {
    const role = localStorage.getItem("role"); // optional
    if (role === "player" || role === "user") setTab("player");
  }, []);

  const isAuthed = useMemo(() => !!localStorage.getItem(TOKEN_KEY), []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button
            className={tab === "organizer" ? "" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
            onClick={() => setTab("organizer")}
          >
            Organizer
          </Button>
          <Button
            className={tab === "player" ? "" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
            onClick={() => setTab("player")}
          >
            Player
          </Button>
        </div>
      </header>

      {!isAuthed && (
        <ErrorNote
          message="You are not logged in. Please log in to view your dashboard."
          onRetry={null}
        />
      )}

      {isAuthed && (
        <>
          {tab === "organizer" && <OrganizerSection />}
          {tab === "player" && <PlayerSection />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
