import { useEffect, useState } from 'react';
import { http } from '../api/http';
import StatCard from '../components/StatCard';

export default function DashboardPage() {
  const [data, setData] = useState({ cards: {}, recentLogs: [] });

  useEffect(() => {
    const load = async () => {
      const res = await http.get('/dashboard');
      setData(res.data);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sent" value={data.cards.totalSent || 0} />
        <StatCard title="Total Failed" value={data.cards.totalFailed || 0} />
        <StatCard title="Campaigns" value={data.cards.campaigns || 0} />
        <StatCard title="Templates" value={data.cards.templates || 0} />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-slate-200">Recent Logs</h3>
      <div className="mt-3 overflow-auto rounded-lg border border-slate-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentLogs.map((log) => (
              <tr key={log._id} className="border-t border-slate-800">
                <td className="px-3 py-2">{log.to}</td>
                <td className="px-3 py-2">{log.subject}</td>
                <td className="px-3 py-2">
                  <span className={log.status === 'sent' ? 'text-emerald-400' : 'text-rose-400'}>{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
