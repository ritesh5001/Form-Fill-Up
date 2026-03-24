import { useState } from 'react';
import { http } from '../api/http';

export default function BulkMailPage() {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    message: '',
    delay: 1,
    emailsText: '',
  });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('subject', form.subject);
      payload.append('message', form.message);
      payload.append('delay', String(form.delay));
      payload.append('emailsText', form.emailsText);
      if (file) payload.append('file', file);

      const { data } = await http.post('/bulk/send', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(`Campaign queued: ${data.campaignId}`);
    } catch (err) {
      setResult(err.response?.data?.message || 'Bulk send failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Bulk Mail Campaign</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Campaign name" name="name" value={form.name} onChange={onChange} required />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Subject" name="subject" value={form.subject} onChange={onChange} required />
        <textarea className="min-h-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Message body" name="message" value={form.message} onChange={onChange} required />
        <textarea className="min-h-28 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Paste emails separated by comma/new line" name="emailsText" value={form.emailsText} onChange={onChange} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" name="delay" value={form.delay} onChange={onChange}>
            <option value={1}>1 sec delay</option>
            <option value={3}>3 sec delay</option>
            <option value={5}>5 sec delay</option>
            <option value={10}>10 sec delay</option>
          </select>
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" />
        </div>
        <button className="w-fit rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900">Queue Bulk Campaign</button>
      </form>
      {result && <p className="mt-3 text-sm text-slate-300">{result}</p>}
    </div>
  );
}
