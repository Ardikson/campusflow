import { useEffect, useState } from "react";
import RequestForm from "./RequestForm";
import type { NewRequestData } from "./RequestForm";
import "./App.css";

type RequestStatus = "New" | "In progress" | "Resolved";

type DormRequest = {
  id: number;
  title: string;
  category: string;
  room: string;
  student: string;
  status: RequestStatus;
};

const initialRequests: DormRequest[] = [
  {
    id: 1001,
    title: "Wi-Fi connection keeps dropping",
    category: "Internet",
    room: "204",
    student: "Alex Morgan",
    status: "New",
  },
  {
    id: 1002,
    title: "Desk lamp is not working",
    category: "Maintenance",
    room: "118",
    student: "Sam Taylor",
    status: "In progress",
  },
  {
    id: 1003,
    title: "Question about room transfer",
    category: "Housing",
    room: "305",
    student: "Jamie Lee",
    status: "New",
  },
  {
    id: 1004,
    title: "Wardrobe door repaired",
    category: "Maintenance",
    room: "212",
    student: "Robin Parker",
    status: "Resolved",
  },
];

const statusOptions: RequestStatus[] = [
  "New",
  "In progress",
  "Resolved",
];

function getStatusClass(status: RequestStatus) {
  if (status === "New") return "status-new";
  if (status === "In progress") return "status-progress";
  return "status-resolved";
}

const STORAGE_KEY = "campusflow.requests.v1";

function isDormRequest(value: unknown): value is DormRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;

  return (
    typeof request.id === "number" &&
    Number.isSafeInteger(request.id) &&
    request.id > 0 &&
    typeof request.title === "string" &&
    typeof request.student === "string" &&
    typeof request.room === "string" &&
    typeof request.category === "string" &&
    (request.status === "New" ||
      request.status === "In progress" ||
      request.status === "Resolved")
  );
}

function loadRequests(): DormRequest[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return initialRequests;
    }

    const parsed: unknown = JSON.parse(saved);

    if (Array.isArray(parsed) && parsed.every(isDormRequest)) {
      const ids = parsed.map((request) => request.id);

      if (new Set(ids).size === ids.length) {
        return parsed;
      }
    }

    console.warn("Saved requests are invalid. Using demo data.");
    return initialRequests;
  } catch (error) {
    console.warn("Could not load saved requests:", error);
    return initialRequests;
  }
}
function App() {
  const [requests, setRequests] = useState<DormRequest[]>(loadRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const [categoryFilter, setCategoryFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error("Could not save requests:", error);

    window.alert(
      "Your changes could not be saved in this browser. " +
        "They may disappear when you reload the page.",
    );
  }
}, [requests]);

  const statistics = [
    { label: "Total requests", value: requests.length },
    {
      label: "New",
      value: requests.filter((request) => request.status === "New").length,
    },
    {
      label: "In progress",
      value: requests.filter((request) => request.status === "In progress")
        .length,
    },
    {
      label: "Resolved",
      value: requests.filter((request) => request.status === "Resolved").length,
    },
  ];

  const query = search.trim().toLowerCase();

const filteredRequests = requests.filter((request) => {
  const matchesSearch = [
    request.title,
    request.category,
    request.room,
    request.student,
    String(request.id),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);

  const matchesStatus =
    statusFilter === "All" || request.status === statusFilter;

  const matchesCategory =
    categoryFilter === "All" || request.category === categoryFilter;

  return matchesSearch && matchesStatus && matchesCategory;
});

function resetDemoData() {
  const confirmed = window.confirm(
    "Reset the demo? All current requests and status changes " +
      "will be replaced with the original four demo requests.",
  );

  if (!confirmed) {
    return;
  }

  setRequests(initialRequests.map((request) => ({ ...request })));
  setSearch("");
  setStatusFilter("All");
  setCategoryFilter("All");
  setIsFormOpen(false);
  setSuccessMessage("Demo data has been reset.");
} 
function createRequest(data: NewRequestData) {
  setRequests((currentRequests) => {
    const nextId =
      Math.max(1000, ...currentRequests.map((request) => request.id)) + 1;

    const newRequest: DormRequest = {
      id: nextId,
      ...data,
      status: "New",
    };

    return [newRequest, ...currentRequests];
  });

setSearch("");
setStatusFilter("All");
setCategoryFilter("All");
setIsFormOpen(false);
setSuccessMessage("Request created successfully.");
}
  function updateStatus(id: number, status: RequestStatus) {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="CampusFlow home">
          <span className="brand-icon">CF</span>
          <span>CampusFlow</span>
        </a>

        <p className="sidebar-label">WORKSPACE</p>

        <nav aria-label="Main navigation">
          <a className="nav-link active" href="#dashboard">
            Dashboard
          </a>
          <a className="nav-link" href="#requests">
            Requests
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">DU</span>
          <div>
            <strong>Demo user</strong>
            <p>Frontend preview</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">STUDENT HOUSING MANAGEMENT</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              A clearer view of everyday campus requests.
            </p>
          </div>

          <div className="header-actions">
  <span className="demo-badge">Demo workspace</span>
  <button
  className="secondary-button"
  type="button"
  onClick={resetDemoData}
>
  Reset demo data
</button>

  <button
    className="primary-button"
    type="button"
    aria-expanded={isFormOpen}
    aria-controls="request-form-container"
    onClick={() => {
      setIsFormOpen((current) => !current);
      setSuccessMessage("");
    }}
  >
    {isFormOpen ? "Close form" : "+ New request"}
  </button>
</div>
        </header>

        <section className="stats-grid" aria-label="Request statistics">
          {statistics.map((statistic) => (
            <article className="stat-card" key={statistic.label}>
              <p>{statistic.label}</p>
              <h2>{statistic.value}</h2>
              <span>Across the demo workspace</span>
            </article>
          ))}
        </section>

        {successMessage && (
  <p className="success-message" role="status">
    {successMessage}
  </p>
)}

<div id="request-form-container">
  {isFormOpen && (
    <RequestForm
      onCreate={createRequest}
      onCancel={() => setIsFormOpen(false)}
    />
  )}
</div>
        <section className="requests-panel" id="requests">
          <div className="panel-heading">
            <div>
              <h2>Student requests</h2>
              <p>Review requests and keep their status up to date.</p>
            </div>

            <span className="request-count">
              {filteredRequests.length} shown
            </span>
          </div>

          <div className="filters-toolbar">
  <div className="filter-field filter-search">
    <label htmlFor="request-search">Search requests</label>
    <input
      id="request-search"
      type="search"
      placeholder="Title, student, room or ID..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  </div>

  <div className="filter-field">
    <label htmlFor="status-filter">Status</label>
    <select
      id="status-filter"
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      <option value="All">All statuses</option>
      <option value="New">New</option>
      <option value="In progress">In progress</option>
      <option value="Resolved">Resolved</option>
    </select>
  </div>

  <div className="filter-field">
    <label htmlFor="category-filter">Category</label>
    <select
      id="category-filter"
      value={categoryFilter}
      onChange={(event) => setCategoryFilter(event.target.value)}
    >
      <option value="All">All categories</option>
      <option value="Maintenance">Maintenance</option>
      <option value="Internet">Internet</option>
      <option value="Housing">Housing</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <button
    className="secondary-button clear-filters-button"
    type="button"
    onClick={() => {
      setSearch("");
      setStatusFilter("All");
      setCategoryFilter("All");
    }}
    disabled={
      search === "" &&
      statusFilter === "All" &&
      categoryFilter === "All"
    }
  >
    Clear filters
  </button>
</div>

          <div className="table-wrapper">
            <table>
              <caption className="sr-only">
                Demonstration student requests with editable statuses
              </caption>
              <thead>
                <tr>
                  <th scope="col">Request</th>
                  <th scope="col">Student</th>
                  <th scope="col">Room</th>
                  <th scope="col">Category</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className="request-id">#{request.id}</span>
                      <strong className="request-title">
                        {request.title}
                      </strong>
                    </td>
                    <td>{request.student}</td>
                    <td>{request.room}</td>
                    <td>{request.category}</td>
                    <td>
                      <select
                        className={`status-select ${getStatusClass(
                          request.status,
                        )}`}
                        aria-label={`Status for request ${request.id}`}
                        value={request.status}
                        onChange={(event) =>
                          updateStatus(
                            request.id,
                            event.target.value as RequestStatus,
                          )
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td className="empty-state" colSpan={5}>
                      No requests found. Try a different search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

<p className="demo-note">
  Fictional demonstration data only. Requests are saved in this
  browser when storage is available. No server sync or authentication
  is implemented yet.
</p>
      </main>
    </div>
  );
}

export default App;