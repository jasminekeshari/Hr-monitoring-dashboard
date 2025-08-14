import React, { useEffect, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import SummaryCards from './components/SummaryCards'
import TrendChart from './components/TrendChart'
import LogsTable from './components/LogsTable'
import AddLogForm from './components/AddLogForm'
import AdvancedFiltersDialog from './components/AdvancedFiltersDialog'
import { fetchSummary, connectSSE } from './lib/api'
import { useFilters } from './store/useFilters'
import { Toaster } from 'react-hot-toast'

export default function App(){
  const { preset, customFrom, customTo } = useFilters()
  const [summary, setSummary] = useState({ summary: { SUCCESS:0, FAILURE:0, PENDING:0 }, trend: [] })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(()=> {
    let mounted = true
    async function load() {
      try {
        const data = await fetchSummary({ preset: preset || undefined, from: customFrom || undefined, to: customTo || undefined })
        if (mounted && data) setSummary(data)
      } catch (e) {
        console.error('fetchSummary error', e)
      }
    }
    load()
    return ()=> mounted = false
  }, [preset, customFrom, customTo])

  function sseConnect(onMsg) {
    return connectSSE(onMsg)
  }

  return (
    <div className="app-shell">
      <HeaderBar />
      <div style={{height:12}} />
      <SummaryCards summary={summary.summary} />
      <TrendChart trend={summary.trend} />
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
        <h3 style={{margin:0}}>Live Interface Logs</h3>
        <div>
          <button className="btn btn-primary" onClick={()=>setDialogOpen(true)}>Advanced Filters</button>
        </div>
      </div>
        <AddLogForm />
      <LogsTable sseConnect={sseConnect} />
      <AdvancedFiltersDialog open={dialogOpen} onClose={()=>setDialogOpen(false)} />
      <Toaster position="top-right" />
      <div className="footer">Built with ❤️ — HR Integrations Dashboard</div>
    </div>
  )
}
