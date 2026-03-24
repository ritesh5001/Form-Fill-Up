import { useEffect, useState } from 'react';
import { http } from '../api/http';

const emptyTemplate = { name: '', subject: '', body: '', variables: '' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyTemplate);

  const load = async () => {
    const { data } = await http.get('/templates');
    setTemplates(data);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await http.post('/templates', {
      name: form.name,
      subject: form.subject,
      body: form.body,
      variables: form.variables.split(',').map((v) => v.trim()).filter(Boolean),
    });
    setForm(emptyTemplate);
    load();
  };

  const onDelete = async (id) => {
    await http.delete(`/templates/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Templates</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Template name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
        <textarea className="min-h-32 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Body (e.g. Hello {{name}})" value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} required />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Variables comma separated (name,email)" value={form.variables} onChange={(e) => setForm((p) => ({ ...p, variables: e.target.value }))} />
        <button className="w-fit rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900">Save Template</button>
      </form>

      <div className="mt-6 space-y-2">
        {templates.map((t) => (
          <div key={t._id} className="rounded-lg border border-slate-700 bg-slate-800 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-100">{t.name}</p>
                <p className="text-sm text-slate-400">{t.subject}</p>
              </div>
              <button className="rounded bg-rose-500 px-2 py-1 text-sm" onClick={() => onDelete(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
