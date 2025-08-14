import React from 'react'
import { useFilters } from '../store/useFilters'

export default function HeaderBar() {
  const { preset, setPreset, setCustomRange } = useFilters()

  function onCustom(){
    const from = prompt('Enter FROM (ISO) e.g. 2025-08-01T00:00:00Z')
    const to = prompt('Enter TO (ISO) e.g. 2025-08-14T23:59:59Z')
    if (from && to) setCustomRange(from, to)
  }

  return (
    <div className="header" style={{ backgroundColor: 'darkgrey' }}>
      <div className="brand">
        <div>
          <div className="title">Interface Monitoring</div>
          <div style={{ color: 'black' }} className="small">HR Integrations — SuccessFactors → ECP / 3rd-party</div>
        </div>
      </div>

      <div className="controls">
        <button className={preset==='lastHour' ? 'btn btn-primary' : 'btn btn-outline'} onClick={()=>setPreset('lastHour')}>Last Hour</button>
        <button className={preset==='last24h' ? 'btn btn-primary' : 'btn btn-outline'} onClick={()=>setPreset('last24h')}>Last 24h</button>
        <button className={preset==='lastWeek' ? 'btn btn-primary' : 'btn btn-outline'} onClick={()=>setPreset('lastWeek')}>Last Week</button>
        <button className="btn btn-primary" onClick={onCustom}>Custom Range</button>
      </div>
    </div>
  )
}
