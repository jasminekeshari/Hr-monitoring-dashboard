import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'

export default function TrendChart({ trend }) {
  console.log('TrendChart received trend:', trend);

  const data = Array.isArray(trend)
    ? trend.map(r => {
        const time = r._id;
        const d = { time };
        (r.buckets || []).forEach(b => { d[b.status] = b.count });
        return d;
      })
    : [];

  return (
    <div className="card chart-card" style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Execution Trend (hourly)</div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleString()} />
            <YAxis allowDecimals={false} />
            <Tooltip labelFormatter={t => new Date(t).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="SUCCESS" stroke="#059669" />
            <Line type="monotone" dataKey="FAILURE" stroke="#dc2626" />
            <Line type="monotone" dataKey="PENDING" stroke="#d97706" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
