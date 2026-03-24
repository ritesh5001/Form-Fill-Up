import { useEffect, useState } from 'react';
import { http } from '../api/http';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await http.get('/campaigns');
      setCampaigns(data);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Campaigns</h2>
      <div className="mt-4 overflow-auto rounded-lg border border-slate-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Sent</th>
              <th className="px-3 py-2">Failed</th>
              <th className="px-3 py-2">Delay</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-t border-slate-800">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.total}</td>
                <td className="px-3 py-2 text-emerald-300">{c.sent}</td>
                <td className="px-3 py-2 text-rose-300">{c.failed}</td>
                <td className="px-3 py-2">{c.delay}s</td>
                <td className="px-3 py-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
