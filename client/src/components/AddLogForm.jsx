import React, { useState } from 'react'
import { createLog } from '../lib/api'
import toast from 'react-hot-toast'

export default function AddLogForm() {
  const [interfaceName, setInterfaceName] = useState('')
  const [integrationKey, setIntegrationKey] = useState('')
  const [status, setStatus] = useState('SUCCESS')
  const [severity, setSeverity] = useState('LOW')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!interfaceName || !integrationKey || !message) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      await createLog({ interfaceName, integrationKey, status, severity, message })
      toast.success('Log created successfully')
      // clear form
      setInterfaceName('')
      setIntegrationKey('')
      setStatus('SUCCESS')
      setSeverity('LOW')
      setMessage('')
    } catch (err) {
      console.error(err)
      toast.error('Failed to create log')
    }
    setLoading(false)
  }

  return (
    <div className="card" style={{ marginTop: 12, padding: 12 }}>
      <h3>Create New Log</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <input
          className="input"
          placeholder="Interface Name"
          value={interfaceName}
          onChange={e => setInterfaceName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Integration Key"
          value={integrationKey}
          onChange={e => setIntegrationKey(e.target.value)}
          required
        />
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILURE">FAILURE</option>
          <option value="PENDING">PENDING</option>
        </select>
        <select className="input" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <input
          className="input"
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Log'}
        </button>
      </form>
    </div>
  )
}
