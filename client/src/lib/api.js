import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE,
  timeout: 15000
});

// GET summary -> expects: { range:{start,end}, summary:{SUCCESS,FAILURE,PENDING}, trend: [...] }
export async function fetchSummary(params) {
  try {
    const res = await api.get('/api/logs/summary', { params });
    return res.data;
  } catch (err) {
    console.error('fetchSummary error:', err);
    throw err;
  }
}

// GET logs -> expects: { page, limit, total, items: [...] }
export async function fetchLogs(params) {
  try {
    const res = await api.get('/api/logs', { params });
    return res.data;
  } catch (err) {
    console.error('fetchLogs error:', err);
    throw err;
  }
}

// POST log
export async function createLog(payload) {
  try {
    const res = await api.post('/api/logs', payload);
    return res.data;
  } catch (err) {
    console.error('createLog error:', err);
    throw err;
  }
}

// SSE connect to /api/stream
export function connectSSE(onMessage) {
  try {
    const url = `${BASE}/api/stream`;
    const es = new EventSource(url);

    es.onmessage = (e) => {
      if (!e.data) return;
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch (err) {
        console.warn('SSE parse error:', err);
      }
    };

    es.onerror = (err) => {
      console.warn('SSE connection error:', err);
      // Optional: you could try to reconnect here
      // es.close();
    };

    return () => es.close(); // cleanup function
  } catch (e) {
    console.warn('SSE failed to initialize:', e);
    return () => {};
  }
}
