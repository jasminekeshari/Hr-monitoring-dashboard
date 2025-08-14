import React, { useEffect, useRef, useState } from 'react'
import { fetchLogs } from '../lib/api'
import { useFilters } from '../store/useFilters'
import toast from 'react-hot-toast'

export default function LogsTable({ sseConnect }) {
  const { preset, customFrom, customTo, tableFilters, setTableFilter } = useFilters()
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false)

  // Load logs
  async function load(p=1, append=false) {
    if (loadingRef.current) return
    loadingRef.current = true
    const params = {
      page: p,
      limit: 50,
      sortBy: 'createdAt',
      sortDir: 'desc',
      preset: preset || undefined,
      from: customFrom || undefined,
      to: customTo || undefined,
      ...tableFilters
    }
    try {
      const data = await fetchLogs(params)
      setHasMore(data.page * data.limit < data.total)
      setPage(data.page)
      setRows(prev => append ? [...prev, ...data.items] : data.items)
    } catch (e) {
      console.error(e)
      toast.error('Failed to load logs')
    }
    loadingRef.current = false
  }

  useEffect(() => { load(1, false) }, [preset, customFrom, customTo, tableFilters])

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 && hasMore && !loadingRef.current) {
        load(page + 1, true)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [page, hasMore])

  // SSE subscription
  useEffect(() => {
    if (!sseConnect) return
    const unsub = sseConnect(doc => {
      // Optional filter by status
      if (tableFilters.status && doc.status !== tableFilters.status) return

      setRows(prev => [doc, ...prev])
      if (doc.status === 'FAILURE') {
        toast.error(`Failure: ${doc.interfaceName} (${doc.integrationKey})`)
      }
    })
    return () => unsub && unsub()
    // Only run once on mount
  }, [sseConnect])

  return (
    <div className="card table-card" style={{marginTop:12}}>
      <div className="toolbar">
        <input className="input" placeholder="Interface name" value={tableFilters.interfaceName} onChange={e => setTableFilter('interfaceName', e.target.value)}/>
        <input className="input" placeholder="Integration key" value={tableFilters.integrationKey} onChange={e => setTableFilter('integrationKey', e.target.value)}/>
        <select className="input" value={tableFilters.status} onChange={e => setTableFilter('status', e.target.value)}>
          <option value=''>All status</option>
          <option value='SUCCESS'>SUCCESS</option>
          <option value='FAILURE'>FAILURE</option>
          <option value='PENDING'>PENDING</option>
        </select>
        <select className="input" value={tableFilters.severity} onChange={e => setTableFilter('severity', e.target.value)}>
          <option value=''>All severity</option>
          <option value='LOW'>LOW</option>
          <option value='MEDIUM'>MEDIUM</option>
          <option value='HIGH'>HIGH</option>
        </select>
        <input className="input" style={{flex:1}} placeholder="Search message/name/key" value={tableFilters.search} onChange={e => setTableFilter('search', e.target.value)}/>
      </div>

      <div style={{overflowX:'auto'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Interface</th>
              <th>Integration Key</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row._id || `${row.integrationKey}-${new Date(row.createdAt).getTime()}`}>
                <td>{new Date(row.createdAt || row.timestamp).toLocaleString()}</td>
                <td>{row.interfaceName}</td>
                <td>{row.integrationKey}</td>
                <td>
                  <span className={`badge ${row.status==='SUCCESS' ? 'badge-success' : row.status==='FAILURE' ? 'badge-fail' : 'badge-pending'}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <span style={{
                    display:'inline-block',
                    padding:'6px 8px',
                    borderRadius:999,
                    fontSize:12,
                    fontWeight:700,
                    background: row.severity === 'HIGH' ? '#fee2e2' : row.severity === 'MEDIUM' ? '#fff7ed' : '#eef2ff',
                    color: row.severity === 'HIGH' ? '#b91c1c' : row.severity === 'MEDIUM' ? '#c2410c' : '#1e40af'
                  }}>
                    {row.severity}
                  </span>
                </td>
                <td title={row.message}>{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && <div style={{textAlign:'center', marginTop:10, color:'#6b7280', fontSize:13}}>Scroll to load more...</div>}
    </div>
  )
}
