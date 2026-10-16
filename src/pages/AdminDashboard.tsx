import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Enquiry, Booking, PortfolioProject, IntegrationStatus, NotificationLog, AuditLog, EnquiryStatus } from '../types';
import {
  Users,
  Inbox,
  Calendar,
  Layers,
  Settings,
  Activity,
  LogOut,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Shield,
  MessageSquare,
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'bookings' | 'portfolio' | 'integrations' | 'logs'>('overview');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus | null>(null);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');

  // Project creation modal state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    titleHi: '',
    category: 'web' as 'web' | 'voice' | 'automation',
    description: '',
    descriptionHi: '',
    image: '/src/assets/images/demo_website_preview_1792125901773.jpg',
    isDemoConcept: true,
    capabilities: 'Fast Performance, Mobile Optimized, Instant WhatsApp Routing',
  });

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [enqRes, bkRes, portRes, intRes, notifRes, audRes] = await Promise.all([
        fetch('/api/enquiries', { headers }),
        fetch('/api/bookings', { headers }),
        fetch('/api/portfolio/all', { headers }),
        fetch('/api/integrations/status'),
        fetch('/api/notification-logs', { headers }),
        fetch('/api/audit-logs', { headers }),
      ]);

      if (enqRes.ok) {
        const d = await enqRes.json();
        setEnquiries(d.enquiries || []);
      }
      if (bkRes.ok) {
        const d = await bkRes.json();
        setBookings(d.bookings || []);
      }
      if (portRes.ok) {
        const d = await portRes.json();
        setPortfolio(d.projects || []);
      }
      if (intRes.ok) {
        const d = await intRes.json();
        setIntegrations(d);
      }
      if (notifRes.ok) {
        const d = await notifRes.json();
        setNotificationLogs(d.notificationLogs || []);
      }
      if (audRes.ok) {
        const d = await audRes.json();
        setAuditLogs(d.auditLogs || []);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdateEnquiryStatus = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? data.enquiry : e)));
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(data.enquiry);
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddInternalNote = async (enquiryId: string) => {
    if (!internalNoteInput.trim()) return;
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internalNote: internalNoteInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? data.enquiry : e)));
        setSelectedEnquiry(data.enquiry);
        setInternalNoteInput('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProject,
          capabilities: newProject.capabilities.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio((prev) => [...prev, data.project]);
        setShowAddProjectModal(false);
        setNewProject({
          title: '',
          titleHi: '',
          category: 'web',
          description: '',
          descriptionHi: '',
          image: '/src/assets/images/demo_website_preview_1792125901773.jpg',
          isDemoConcept: true,
          capabilities: 'Fast Performance, Mobile Optimized, Instant WhatsApp Routing',
        });
      }
    } catch (err) {
      console.error('Failed to add project', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/portfolio/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPortfolio((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const handleTogglePublishProject = async (project: PortfolioProject) => {
    try {
      const res = await fetch(`/api/portfolio/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !project.published }),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio((prev) => prev.map((p) => (p.id === project.id ? data.project : p)));
      }
    } catch (err) {
      console.error('Failed to update project', err);
    }
  };

  // Export Enquiries as CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Full Name', 'Business', 'Email', 'Phone', 'Service', 'Budget', 'Status'];
    const rows = enquiries.map((e) => [
      e.id,
      e.createdAt,
      `"${e.fullName.replace(/"/g, '""')}"`,
      `"${(e.businessName || '').replace(/"/g, '""')}"`,
      e.email || '',
      e.phone || '',
      e.serviceRequired,
      e.budgetRange || '',
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_enquiries_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.businessName && e.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.phone && e.phone.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      {/* Admin Top Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BEF264]" />
            <span className="font-bold text-stone-900 text-sm sm:text-base">Nexora Control Console</span>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium capitalize">
              Role: {user?.role}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('home')}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium hidden sm:inline-block"
            >
              View Public Website
            </button>
            <button
              onClick={() => {
                logout();
                navigate('admin-login');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-rose-600 transition-colors flex items-center gap-1.5 rounded-md border border-stone-200 hover:bg-stone-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: Inbox },
            { id: 'bookings', label: `Consultations (${bookings.length})`, icon: Calendar },
            { id: 'portfolio', label: `Portfolio CMS (${portfolio.length})`, icon: Layers },
            { id: 'integrations', label: 'Integrations & Status', icon: Settings },
            { id: 'logs', label: 'Audit & Logs', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards calculated strictly from genuine records */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-medium text-stone-500">Total Inbound Enquiries</div>
                <div className="text-2xl font-bold text-stone-900 tabular-nums">{enquiries.length}</div>
                <div className="text-[11px] text-stone-400">Recorded in Firestore / Store</div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-medium text-stone-500">New / Uncontacted Enquiries</div>
                <div className="text-2xl font-bold text-amber-600 tabular-nums">
                  {enquiries.filter((e) => e.status === 'new').length}
                </div>
                <div className="text-[11px] text-stone-400">Action required by staff</div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-medium text-stone-500">Upcoming Consultations</div>
                <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </div>
                <div className="text-[11px] text-stone-400">Google Calendar slots locked</div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1">
                <div className="text-xs font-medium text-stone-500">Active Portfolio Prototypes</div>
                <div className="text-2xl font-bold text-stone-900 tabular-nums">{portfolio.length}</div>
                <div className="text-[11px] text-stone-400">Transparent Demo Concepts</div>
              </div>
            </div>

            {/* Integration Summary Grid */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900">Live Integration Connection Status</h3>
                <button
                  onClick={fetchData}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Status</span>
                </button>
              </div>

              {integrations && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Google Calendar API', data: integrations.googleCalendar },
                    { name: 'Cloud Firestore', data: integrations.firebase },
                    { name: 'Transactional Email', data: integrations.email },
                    { name: 'WhatsApp Cloud API', data: integrations.whatsapp },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-800">{item.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            item.data.status === 'connected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.data.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-2">{item.data.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Recent Activity */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Recent Inquiries</h3>
              {enquiries.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-500">
                  No inquiries recorded yet. Submit the public enquiry form to test ingestion.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {enquiries.slice(0, 5).map((e) => (
                    <div key={e.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-900">{e.fullName}</span>
                        {e.businessName && <span className="text-stone-500"> · {e.businessName}</span>}
                        <span className="text-stone-400 text-[11px] block">{e.serviceRequired.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="capitalize px-2 py-0.5 bg-stone-100 text-stone-700 rounded-sm font-medium text-[11px]">
                          {e.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedEnquiry(e);
                            setActiveTab('enquiries');
                          }}
                          className="text-stone-800 font-semibold hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, business, email or phone..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-hidden focus:border-stone-900"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold bg-white border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
              {filteredEnquiries.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500">
                  No enquiries match the current filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Client & Business</th>
                        <th className="p-3.5">Contact Details</th>
                        <th className="p-3.5">Service & Budget</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Received</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="p-3.5">
                            <div className="font-semibold text-stone-900">{enq.fullName}</div>
                            {enq.businessName && <div className="text-stone-500">{enq.businessName}</div>}
                          </td>
                          <td className="p-3.5 space-y-0.5">
                            {enq.email && <div className="text-stone-700">{enq.email}</div>}
                            {enq.phone && <div className="font-mono text-stone-600">{enq.phone}</div>}
                          </td>
                          <td className="p-3.5">
                            <div className="capitalize font-medium text-stone-800">
                              {enq.serviceRequired.replace(/_/g, ' ')}
                            </div>
                            {enq.budgetRange && <div className="text-stone-500">{enq.budgetRange}</div>}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                              className="px-2 py-1 text-xs border border-stone-200 rounded-md bg-stone-50 font-medium"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="proposal_sent">Proposal Sent</option>
                              <option value="won">Won</option>
                              <option value="lost">Lost</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-stone-500 font-mono text-[11px]">
                            {enq.createdAt.substring(0, 10)}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedEnquiry(enq)}
                              className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-md transition-colors"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Details Modal / Drawer */}
            {selectedEnquiry && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{selectedEnquiry.fullName}</h3>
                      <div className="text-xs text-stone-500">ID: {selectedEnquiry.id}</div>
                    </div>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="text-stone-400 hover:text-stone-700 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl">
                      <div>
                        <span className="text-stone-500">Business:</span>
                        <div className="font-semibold text-stone-800">{selectedEnquiry.businessName || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-stone-500">Preferred Channel:</span>
                        <div className="font-semibold text-stone-800 capitalize">{selectedEnquiry.preferredContact}</div>
                      </div>
                      <div>
                        <span className="text-stone-500">Email:</span>
                        <div className="font-semibold text-stone-800">{selectedEnquiry.email || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-stone-500">Phone:</span>
                        <div className="font-semibold text-stone-800">{selectedEnquiry.phone || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-stone-800">Project Requirements / Message:</span>
                      <p className="p-3 bg-stone-50 rounded-xl text-stone-700 leading-relaxed border border-stone-200">
                        {selectedEnquiry.requirements}
                      </p>
                    </div>

                    {/* Internal Notes */}
                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <span className="font-semibold text-stone-800">Internal Team Notes:</span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {selectedEnquiry.internalNotes && selectedEnquiry.internalNotes.length > 0 ? (
                          selectedEnquiry.internalNotes.map((note, i) => (
                            <div key={i} className="p-2 bg-stone-100 rounded-md text-[11px] text-stone-700">
                              {note}
                            </div>
                          ))
                        ) : (
                          <div className="text-stone-400 text-[11px]">No internal notes yet.</div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={internalNoteInput}
                          onChange={(e) => setInternalNoteInput(e.target.value)}
                          placeholder="Add team note (e.g. Called client, shared quote via WhatsApp)..."
                          className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-md"
                        />
                        <button
                          onClick={() => handleAddInternalNote(selectedEnquiry.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-md hover:bg-stone-800"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Google Calendar Consultations</h3>
              <div className="text-xs text-stone-500">
                Total Bookings: <span className="font-semibold text-stone-900">{bookings.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500">
                  No consultation meetings scheduled yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Attendee</th>
                        <th className="p-3.5">Date & Time (IST)</th>
                        <th className="p-3.5">Topic / Scope</th>
                        <th className="p-3.5">Cancellation Code</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-stone-50/70">
                          <td className="p-3.5">
                            <div className="font-semibold text-stone-900">{bk.customerName}</div>
                            <div className="text-stone-500">{bk.email}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-stone-800">{bk.date}</div>
                            <div className="text-stone-500 font-mono text-[11px]">
                              {bk.startTime} – {bk.endTime}
                            </div>
                          </td>
                          <td className="p-3.5 text-stone-700 max-w-xs truncate">{bk.topic}</td>
                          <td className="p-3.5 font-mono text-stone-800 font-bold bg-stone-50 px-2 rounded-xs">
                            {bk.cancellationToken}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                                bk.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {bk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO CMS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Portfolio & Demo Concepts CMS</h3>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Portfolio Entry</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-stone-500">
                          {item.category}
                        </span>
                        {item.isDemoConcept && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm font-semibold">
                            Demo Concept
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">{item.title}</h4>
                      <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePublishProject(item)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        item.published ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft / Hidden'}
                    </button>

                    {user?.role === 'owner' && (
                      <button
                        onClick={() => handleDeleteProject(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Modal */}
            {showAddProjectModal && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-base font-bold text-stone-900">Add Portfolio Project / Concept</h3>
                    <button
                      onClick={() => setShowAddProjectModal(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddProject} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Project Title (English)</label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Specialty Dental Booking & Voice Desk"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                      >
                        <option value="web">Website Development</option>
                        <option value="voice">AI Voice Agents</option>
                        <option value="automation">Business Automation</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-stone-800">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Key capabilities and workflow details..."
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDemo"
                        checked={newProject.isDemoConcept}
                        onChange={(e) => setNewProject({ ...newProject, isDemoConcept: e.target.checked })}
                      />
                      <label htmlFor="isDemo" className="font-medium text-stone-800 cursor-pointer">
                        Mark as "Demo Concept" (Mandatory for prototype demonstrations)
                      </label>
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProjectModal(false)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Third-Party Service Integrations</h3>
              <p className="text-xs text-stone-600">
                Transparent health indicators for Google Calendar, Firebase, Email, and WhatsApp.
              </p>
            </div>

            <div className="space-y-4">
              {/* Google Calendar */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-stone-900">Google Calendar OAuth & API</div>
                    <p className="text-xs text-stone-600">
                      Syncs consultation slots with owner account (anjaneykumarraianjaneykumarrai@gmail.com).
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integrations?.googleCalendar.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {integrations?.googleCalendar.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl text-xs space-y-2 border border-stone-200">
                  <div className="font-semibold text-stone-800">Setup Instructions for Owner:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-stone-600">
                    <li>Create OAuth 2.0 Credentials in Google Cloud Console.</li>
                    <li>Add authorized redirect URI: <code>/api/calendar/oauth/callback</code></li>
                    <li>Set <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_REFRESH_TOKEN</code> in .env.</li>
                  </ol>
                </div>
              </div>

              {/* WhatsApp Cloud API */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-stone-900">WhatsApp Business Cloud API</div>
                    <p className="text-xs text-stone-600">
                      Official contact numbers: +91 9838775359 and +91 7985859410.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integrations?.whatsapp.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {integrations?.whatsapp.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl text-xs space-y-2 border border-stone-200">
                  <div className="font-semibold text-stone-800">Operational Notice:</div>
                  <p className="text-stone-600 leading-relaxed">
                    Click-to-chat links with prefilled messages are 100% active on the public site. Server automated template dispatch requires registering a Meta WhatsApp Business Account for the authorized numbers.
                  </p>
                </div>
              </div>

              {/* Transactional Email */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-stone-900">Transactional Email (Resend / SMTP)</div>
                    <p className="text-xs text-stone-600">
                      Recipient for lead notifications: anjaneykumarraianjaneykumarrai@gmail.com.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integrations?.email.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {integrations?.email.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT & LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">Security Audit Trail & Notification Logs</h3>
              <p className="text-xs text-stone-600">
                Transparent log of admin actions and notification transmission attempts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Audit logs */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Administrative Audit Trail</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.length === 0 ? (
                    <div className="text-xs text-stone-400">No actions recorded yet.</div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-stone-50 rounded-lg text-xs space-y-0.5 border border-stone-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-stone-900">{log.action}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{log.timestamp.substring(11, 19)}</span>
                        </div>
                        <div className="text-stone-600">{log.userEmail} · {log.target}</div>
                        {log.details && <div className="text-stone-500 text-[11px]">{log.details}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notification logs */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Notification Dispatch Attempts</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notificationLogs.length === 0 ? (
                    <div className="text-xs text-stone-400">No notification attempts logged yet.</div>
                  ) : (
                    notificationLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-stone-50 rounded-lg text-xs space-y-0.5 border border-stone-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-stone-900 capitalize">{log.type} Alert</span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                              log.status === 'sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <div className="text-stone-600">To: {log.recipient}</div>
                        {log.errorDetails && (
                          <div className="text-stone-500 text-[11px]">{log.errorDetails}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
