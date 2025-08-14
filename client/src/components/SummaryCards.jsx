import React from 'react'

export default function SummaryCards({ summary }) {
  const s = summary || { SUCCESS:0, FAILURE:0, PENDING:0 }
  return (
    <div className="grid-3">
      <div className="card">
        <div className="small">Success</div>
        <div style={{fontSize:28, fontWeight:700, marginTop:8}}>{(s.SUCCESS||0).toLocaleString()}</div>
        <div style={{marginTop:10}}><span className="badge badge-success">Healthy</span></div>
      </div>

      <div className="card">
        <div className="small">Failure</div>
        <div style={{fontSize:28, fontWeight:700, marginTop:8}}>{(s.FAILURE||0).toLocaleString()}</div>
        <div style={{marginTop:10}}><span className="badge badge-fail">Investigate</span></div>
      </div>

      <div className="card">
        <div className="small">Pending</div>
        <div style={{fontSize:28, fontWeight:700, marginTop:8}}>{(s.PENDING||0).toLocaleString()}</div>
        <div style={{marginTop:10}}><span className="badge badge-pending">In Progress</span></div>
      </div>
    </div>
  )
}
