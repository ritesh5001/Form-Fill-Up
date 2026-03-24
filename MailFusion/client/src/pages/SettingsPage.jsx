import { useEffect, useState } from 'react';
import { http } from '../api/http';

const defaultSettings = {
  mailProvider: 'nodemailer',
  fromEmail: '',
  delay: 1,
  resendApiKey: '',
  sendgridApiKey: '',
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await http.get('/settings');
      setSettings({ ...defaultSettings, ...data });
    };
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    await http.put('/settings', settings);
    setMessage('Settings saved');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-cyan-200">Settings</h2>
      <form onSubmit={onSave} className="mt-4 grid gap-3">
        <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" name="mailProvider" value={settings.mailProvider} onChange={onChange}>
          <option value="resend">Resend</option>
          <option value="sendgrid">Sendgrid</option>
          <option value="smtp">SMTP</option>
          <option value="nodemailer">Nodemailer</option>
        </select>

        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Default from email" name="fromEmail" value={settings.fromEmail} onChange={onChange} />
        <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" name="delay" value={settings.delay} onChange={onChange}>
          <option value={1}>1 sec</option>
          <option value={3}>3 sec</option>
          <option value={5}>5 sec</option>
          <option value={10}>10 sec</option>
        </select>

        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Resend API key" name="resendApiKey" value={settings.resendApiKey} onChange={onChange} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Sendgrid API key" name="sendgridApiKey" value={settings.sendgridApiKey} onChange={onChange} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="SMTP host" name="smtpHost" value={settings.smtpHost} onChange={onChange} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="SMTP port" type="number" name="smtpPort" value={settings.smtpPort} onChange={onChange} />
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="smtpSecure" checked={settings.smtpSecure} onChange={onChange} /> Secure SMTP
        </label>
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="SMTP user" name="smtpUser" value={settings.smtpUser} onChange={onChange} />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="SMTP pass" name="smtpPass" value={settings.smtpPass} onChange={onChange} />

        <button className="w-fit rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900">Save Settings</button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
