import { useEffect, useState } from 'react';
import { http } from '../api/http';

export default function SendMailPage() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ to: '', subject: '', message: '', fromEmail: '', templateId: '' });
  const [result, setResult] = useState('');

  useEffect(() => {
    const loadTemplates = async () => {
      const { data } = await http.get('/templates');
      setTemplates(data);
    };
    loadTemplates();
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onTemplate = (id) => {
    const template = templates.find((t) => t._id === id);
    if (!template) return;
    setForm((p) => ({ ...p, templateId: id, subject: template.subject, message: template.body }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await http.post('/email/send', form);
      setResult('Email sent successfully');
    } catch (err) {
      setResult(err.response?.data?.message || 'Send failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Send Single Mail</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="To email" name="to" value={form.to} onChange={onChange} required />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Subject" name="subject" value={form.subject} onChange={onChange} required />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="From email (optional)" name="fromEmail" value={form.fromEmail} onChange={onChange} />
        <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" value={form.templateId} onChange={(e) => onTemplate(e.target.value)}>
          <option value="">Select template (optional)</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <textarea className="min-h-40 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Message" name="message" value={form.message} onChange={onChange} required />
        <button className="w-fit rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900">Send Mail</button>
      </form>
      {result && <p className="mt-3 text-sm text-slate-300">{result}</p>}
    </div>
  );
}
