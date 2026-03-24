import { useEffect, useState } from 'react';
import { http } from '../api/http';

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ status: '', fromDate: '', toDate: '' });

  const load = async () => {
    const { data } = await http.get('/history', { params: filters });
    setLogs(data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Email History</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
          <option value="">All status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
        <input type="date" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" value={filters.fromDate} onChange={(e) => setFilters((p) => ({ ...p, fromDate: e.target.value }))} />
        <input type="date" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" value={filters.toDate} onChange={(e) => setFilters((p) => ({ ...p, toDate: e.target.value }))} />
        <button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900" onClick={load}>Apply</button>
      </div>

      <div className="mt-4 overflow-auto rounded-lg border border-slate-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Error</th>
              <th className="px-3 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t border-slate-800">
                <td className="px-3 py-2">{log.to}</td>
                <td className="px-3 py-2">{log.subject}</td>
                <td className="px-3 py-2">{log.status}</td>
                <td className="px-3 py-2">{log.error || '-'}</td>
                <td className="px-3 py-2">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
