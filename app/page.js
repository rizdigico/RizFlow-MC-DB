'use client'
import { useState, useEffect } from 'react'

const AGENTS = [
  { name: 'RizFlow', icon: '⚡', caps: 'SEO + Content', price: '$75', dept: 'AI Building' },
  { name: 'RizFlow Data', icon: '🔍', caps: 'Web Scraping', price: '$35', dept: 'AI Building' },
  { name: 'RizFlow Shield', icon: '🛡️', caps: 'Security Audit', price: '$50', dept: 'AI Building' },
  { name: 'RizFlow Bot', icon: '🤖', caps: 'Chatbot', price: '$45', dept: 'AI Building' },
  { name: 'RizFlow Support', icon: '💬', caps: 'Customer Support', price: '$30', dept: 'AI Building' },
]

const DEPARTMENTS = [
  {
    name: 'AI Building', icon: '🏗️', agents: 6,
    workflows: [
      { name: 'Client Research', steps: ['Intake', 'Research', 'Profile', 'Done'], progress: 0 },
      { name: 'System Architecture', steps: ['Blueprint', 'Config', 'Deploy', 'Verify'], progress: 0 },
      { name: 'Performance Monitor', steps: ['Watching', 'Metrics', 'Alert', 'Report'], progress: 0 },
    ]
  },
  {
    name: 'Social & Marketing', icon: '📱', agents: 7,
    workflows: [
      { name: 'Content Pipeline', steps: ['Trend Scan', 'Calendar', 'Draft', 'Review', 'Publish'], progress: 0 },
      { name: 'Engagement Monitor', steps: ['Scan', 'Respond', 'Flag Leads', 'Report'], progress: 0 },
      { name: 'Analytics', steps: ['Collect', 'Analyze', 'Dashboard', 'Recommend'], progress: 0 },
    ]
  },
  {
    name: 'Ops & Legal', icon: '📋', agents: 6,
    workflows: [
      { name: 'Client Onboarding', steps: ['Contract', 'Welcome', 'Setup', 'Kickoff'], progress: 0 },
      { name: 'Invoicing Cycle', steps: ['Generate', 'Send', 'Track', 'Remind', 'Collect'], progress: 0 },
      { name: 'Compliance Check', steps: ['Scan', 'Review', 'Alert', 'Update'], progress: 0 },
    ]
  },
  {
    name: 'Lead & Outreach', icon: '🎯', agents: 6,
    workflows: [
      { name: 'Prospect Pipeline', steps: ['Scout', 'Enrich', 'Score', 'Outreach', 'Nurture'], progress: 0 },
      { name: 'Campaign Execution', steps: ['Research', 'Draft', 'Send', 'Track', 'Follow-up'], progress: 0 },
      { name: 'Conversion Tracking', steps: ['Monitor', 'Qualify', 'Proposal', 'Close'], progress: 0 },
    ]
  },
]

export default function Dashboard() {
  const [data, setData] = useState({ total: 0, thisWeek: 0, audits: 0, pipeline: { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }, recent: [] })
  const [activeTab, setActiveTab] = useState('overview')
  const [clock, setClock] = useState('')
  const [agentStatuses, setAgentStatuses] = useState(AGENTS.map(a => ({ ...a, status: 'idle', jobs: 0, earned: '$0.00' })))

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const r = await fetch('/api/leads')
        const d = await r.json()
        setData(d)
      } catch {}
    }
    fetchLeads()
    const i = setInterval(fetchLeads, 30000)
    return () => clearInterval(i)
  }, [])

  const total = Object.values(data.pipeline).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>⚡ RizFlow</h1>
          <p>Mission Control</p>
        </div>
        <nav>
          {[
            { section: 'Operations', items: [
              { id: 'overview', icon: '📊', label: 'Overview' },
              { id: 'leads', icon: '🎯', label: 'Leads', badge: data.total },
              { id: 'pipeline', icon: '🔄', label: 'Pipeline' },
              { id: 'clients', icon: '👥', label: 'Clients' },
            ]},
            { section: 'Revenue', items: [
              { id: 'invoices', icon: '💳', label: 'Invoices' },
              { id: 'hyrve', icon: '🐝', label: 'HYRVE Agents' },
              { id: 'earnings', icon: '💰', label: 'Earnings' },
            ]},
            { section: 'Departments', items: [
              { id: 'departments', icon: '🏢', label: 'All Departments' },
              { id: 'agents', icon: '🤖', label: 'Agent Workflows' },
            ]},
            { section: 'Content', items: [
              { id: 'social', icon: '📱', label: 'Social Media' },
              { id: 'content', icon: '✍️', label: 'Content Calendar' },
            ]},
            { section: 'System', items: [
              { id: 'activity', icon: '📋', label: 'Activity Log' },
              { id: 'settings', icon: '⚙️', label: 'Settings' },
            ]},
          ].map(s => (
            <div className="nav-section" key={s.section}>
              <div className="nav-section-title">{s.section}</div>
              {s.items.map(item => (
                <a className={`nav-item ${activeTab === item.id ? 'active' : ''}`} key={item.id} onClick={() => setActiveTab(item.id)}>
                  <span className="nav-icon">{item.icon}</span> {item.label}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="status-dot"></span> SYSTEM ONLINE
            </div>
            <div>{clock} SGT</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75em', color: 'var(--text-muted)' }}>
            <span className="status-dot"></span> All systems operational
          </div>
        </div>

        {activeTab === 'overview' && <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total Leads</div><div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{data.total}</div><div className="stat-sub">This week: {data.thisWeek}</div></div>
            <div className="stat-card"><div className="stat-label">Active Clients</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>0</div><div className="stat-sub">Monthly retainers</div></div>
            <div className="stat-card"><div className="stat-label">HYRVE Earnings</div><div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>$0</div><div className="stat-sub">5 agents active</div></div>
            <div className="stat-card"><div className="stat-label">Departments</div><div className="stat-value" style={{ color: 'var(--accent-purple)' }}>4</div><div className="stat-sub">25 agents total</div></div>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-header"><div className="card-title">Sales Pipeline</div></div>
              <div className="pipeline">
                {Object.entries(data.pipeline).map(([s, c]) => (
                  <div className="pipeline-stage" key={s}>
                    <div className="pipeline-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                    <div className="pipeline-bar"><div className="pipeline-fill" style={{ width: `${(c / total) * 100}%`, background: `var(--accent-${s === 'new' ? 'green' : s === 'contacted' ? 'blue' : s === 'qualified' ? 'yellow' : s === 'proposal' ? 'orange' : 'purple'})` }}></div></div>
                    <div className="pipeline-count">{c}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">HYRVE Agents</div></div>
              <div className="agent-grid">
                {agentStatuses.map(a => (
                  <div className="agent-card" key={a.name}>
                    <div className="agent-icon">{a.icon}</div>
                    <div className="agent-name">{a.name}</div>
                    <div className={`agent-status ${a.status}`}>{a.status === 'idle' ? '○ Idle' : '● Online'}</div>
                    <div style={{ fontSize: '0.65em', color: 'var(--text-muted)' }}>{a.price}/task</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header"><div className="card-title">Recent Leads</div></div>
            {data.recent.length > 0 ? data.recent.slice(0, 5).map(l => (
              <div className="lead-item" key={l.receivedAt}>
                <div className="lead-header"><span className="lead-name">{l.name}</span><span className={`badge badge-${l.type}`}>{l.type}</span></div>
                <div className="lead-meta"><span className="lead-email">{l.email}</span><span>{l.company || l.agency || ''}</span></div>
                <div className="lead-time">{new Date(l.receivedAt).toLocaleString()}</div>
              </div>
            )) : <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No leads yet. Waiting for form submissions...</div>}
          </div>
        </>}

        {activeTab === 'departments' && <>
          {DEPARTMENTS.map(dept => (
            <div className="card" key={dept.name} style={{ marginBottom: 16 }}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.3em' }}>{dept.icon}</span>
                  <div><div style={{ fontWeight: 600 }}>{dept.name}</div><div style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>{dept.agents} agents</div></div>
                </div>
                <span className="badge badge-active">Active</span>
              </div>
              {dept.workflows.map(wf => (
                <div className="workflow-card" key={wf.name}>
                  <div className="workflow-header">
                    <div className="workflow-name">{wf.name}</div>
                    <span className="badge badge-idle">Idle</span>
                  </div>
                  <div className="workflow-steps">
                    {wf.steps.map((step, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div className={`workflow-step ${i < wf.progress ? 'done' : i === wf.progress ? 'active' : 'pending'}`}></div>
                        <div style={{ fontSize: '0.6em', color: 'var(--text-muted)', marginTop: 4 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>}

        {activeTab === 'agents' && <>
          <div className="card">
            <div className="card-header"><div className="card-title">All 25 Agents by Department</div></div>
            <table className="table">
              <thead><tr><th>Agent</th><th>Department</th><th>Capability</th><th>Price</th><th>Jobs</th><th>Status</th></tr></thead>
              <tbody>
                {agentStatuses.map(a => (
                  <tr key={a.name}>
                    <td style={{ fontWeight: 600 }}>{a.icon} {a.name}</td>
                    <td>{a.dept}</td>
                    <td>{a.caps}</td>
                    <td style={{ fontFamily: 'monospace' }}>{a.price}</td>
                    <td style={{ fontFamily: 'monospace' }}>{a.jobs}</td>
                    <td><span className={`badge badge-${a.status === 'idle' ? 'idle' : 'active'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {activeTab === 'leads' && <>
          <div className="card">
            <div className="card-header"><div className="card-title">All Leads</div></div>
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recent.length > 0 ? data.recent.map(l => (
                  <tr key={l.receivedAt}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td style={{ color: 'var(--accent-blue)' }}>{l.email}</td>
                    <td>{l.company || l.agency || '-'}</td>
                    <td><span className={`badge badge-${l.type}`}>{l.type}</span></td>
                    <td><span className={`badge badge-${l.status || 'new'}`}>{l.status || 'new'}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(l.receivedAt).toLocaleDateString()}</td>
                  </tr>
                )) : <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>No leads yet</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {activeTab === 'pipeline' && (
          <div className="grid-3">
            {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'].map(s => (
              <div className="card" key={s}>
                <div className="card-header"><div className="card-title">{s}</div><span className="nav-badge">{data.pipeline[s.toLowerCase()]}</span></div>
                {data.recent.filter(l => (l.status || 'new') === s.toLowerCase()).map(l => (
                  <div className="lead-item" key={l.receivedAt}><div className="lead-name">{l.name}</div><div style={{ fontSize: '0.75em', color: 'var(--text-muted)' }}>{l.email}</div></div>
                ))}
                {data.pipeline[s.toLowerCase()] === 0 && <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-muted)', fontSize: '0.8em' }}>No leads</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hyrve' && <>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Agents Listed</div><div className="stat-value" style={{ color: 'var(--accent-blue)' }}>5</div></div>
            <div className="stat-card"><div className="stat-label">Jobs Completed</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>0</div></div>
            <div className="stat-card"><div className="stat-label">Total Earned</div><div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>$0</div></div>
            <div className="stat-card"><div className="stat-label">Auto-Accept</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>ON</div></div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Agent Status</div></div>
            <table className="table">
              <thead><tr><th>Agent</th><th>Capabilities</th><th>Price</th><th>Jobs</th><th>Earned</th><th>Status</th></tr></thead>
              <tbody>{agentStatuses.map(a => <tr key={a.name}><td style={{ fontWeight: 600 }}>{a.icon} {a.name}</td><td>{a.caps}</td><td style={{ fontFamily: 'monospace' }}>{a.price}</td><td style={{ fontFamily: 'monospace' }}>{a.jobs}</td><td style={{ fontFamily: 'monospace' }}>{a.earned}</td><td><span className="badge badge-idle">{a.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </>}

        {['clients', 'invoices', 'earnings', 'social', 'content', 'activity', 'settings'].includes(activeTab) && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '2.5em', marginBottom: 12 }}>
              {activeTab === 'clients' ? '👥' : activeTab === 'invoices' ? '💳' : activeTab === 'earnings' ? '💰' : activeTab === 'social' ? '📱' : activeTab === 'content' ? '✍️' : activeTab === 'activity' ? '📋' : '⚙️'}
            </div>
            <h3 style={{ marginBottom: 6 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>Coming soon — will be connected to your business tools</p>
          </div>
        )}
      </main>
    </div>
  )
}
