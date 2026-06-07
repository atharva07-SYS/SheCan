import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail, MessageSquare, Users, Handshake, LogOut, Search, Download, Eye, Trash2,
  ChevronLeft, ChevronRight, Activity, Clock, Filter, RefreshCw
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const CHART_COLORS = ['#7C3AED', '#E11D48', '#F59E0B', '#64748B']

function StatCard({ icon: Icon, label, value, color, highlight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-light rounded-2xl p-6 ${highlight ? 'border-l-4 border-blue-500' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value ?? '—'}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Stats
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Charts
  const [chartData, setChartData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [chartsLoading, setChartsLoading] = useState(true)

  // Messages
  const [messages, setMessages] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal
  const [viewMessage, setViewMessage] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Activity logs
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/stats')
        setStats(res.data.data || res.data)
      } catch {
        toast.error('Failed to load stats')
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Fetch charts
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await api.get('/analytics/chart')
        const d = res.data.data || res.data
        setChartData(d.timeline || d.monthlyData || [])
        setCategoryData(d.categoryDistribution || d.categories || [])
      } catch {
        toast.error('Failed to load chart data')
      } finally {
        setChartsLoading(false)
      }
    }
    fetchCharts()
  }, [])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/contact', { params })
      setMessages(res.data.data || [])
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 })
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setMessagesLoading(false)
    }
  }, [page, search, categoryFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => fetchMessages(), 300)
    return () => clearTimeout(timer)
  }, [fetchMessages])

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/analytics/logs')
        setLogs(res.data.data || [])
      } catch {
        /* Activity logs are optional */
      } finally {
        setLogsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status })
      toast.success('Status updated')
      fetchMessages()
    } catch {
      toast.error('Failed to update status')
    }
  }

  // Delete message
  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/contact/${deleteId}`)
      toast.success('Message deleted')
      setDeleteId(null)
      fetchMessages()
    } catch {
      toast.error('Failed to delete')
    }
  }

  // Export CSV
  const exportCSV = async () => {
    try {
      const params = {}
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/contact/export/csv', { params, responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV exported')
    } catch {
      toast.error('Failed to export CSV')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="glass-light rounded-2xl p-6 flex items-center justify-center h-[100px]">
                <Spinner />
              </div>
            ))
          ) : (
            <>
              <StatCard icon={Mail} label="Total Submissions" value={stats?.totalMessages} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600" />
              <StatCard icon={MessageSquare} label="New Messages" value={stats?.newMessages} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600" highlight />
              <StatCard icon={Users} label="Volunteer Requests" value={stats?.volunteerRequests} color="bg-rose-100 dark:bg-rose-900/30 text-rose-600" />
              <StatCard icon={Handshake} label="Partnerships" value={stats?.partnershipRequests} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600" />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Submissions Over Time</h3>
            {chartsLoading ? (
              <div className="h-[300px] flex items-center justify-center"><Spinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
            {chartsLoading ? (
              <div className="h-[300px] flex items-center justify-center"><Spinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Messages Table */}
        <div className="glass-light rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Submissions</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="pl-10 pr-4 py-2 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white cursor-pointer outline-none"
              >
                <option value="">All Categories</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Donation">Donation</option>
                <option value="Partnership">Partnership</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white cursor-pointer outline-none"
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Archived">Archived</option>
              </select>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={fetchMessages}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {messagesLoading ? (
            <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No submissions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">Inquiry ID</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4 hidden md:table-cell">Email</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">Category</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4 hidden sm:table-cell">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="p-4 text-sm font-mono text-purple-600 dark:text-purple-400">{msg.inquiryId}</td>
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{msg.fullName}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{msg.email}</td>
                        <td className="p-4"><Badge variant={msg.category}>{msg.category}</Badge></td>
                        <td className="p-4">
                          <select
                            value={msg.status}
                            onChange={(e) => updateStatus(msg._id, e.target.value)}
                            className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer outline-none"
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="p-4 text-sm text-gray-500 hidden sm:table-cell">{formatDate(msg.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewMessage(msg)}
                              className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-600 transition-colors cursor-pointer"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(msg._id)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{page}</span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Activity Log */}
        <div className="glass-light rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" /> Recent Activity
          </h3>
          {logsLoading ? (
            <div className="flex items-center justify-center py-8"><Spinner /></div>
          ) : logs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No activity logs yet</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log, i) => (
                <div key={log._id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {log.action}{log.targetMessage ? ` — ${log.targetMessage}` : ''}
                    </p>
                    {log.details && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.details}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {timeAgo(log.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Message Modal */}
      <Modal isOpen={!!viewMessage} onClose={() => setViewMessage(null)} title="Message Details" size="lg">
        {viewMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Inquiry ID</p>
                <p className="font-mono font-bold text-purple-600 dark:text-purple-400">{viewMessage.inquiryId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-gray-900 dark:text-white">{formatDate(viewMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{viewMessage.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-gray-900 dark:text-white">{viewMessage.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-gray-900 dark:text-white">{viewMessage.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-gray-900 dark:text-white">{viewMessage.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                <Badge variant={viewMessage.category}>{viewMessage.category}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <Badge variant={viewMessage.status}>{viewMessage.status}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {viewMessage.message}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
              <select
                value={viewMessage.status}
                onChange={(e) => {
                  updateStatus(viewMessage._id, e.target.value)
                  setViewMessage({ ...viewMessage, status: e.target.value })
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer outline-none"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
