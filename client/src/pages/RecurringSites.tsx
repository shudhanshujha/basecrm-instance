import React, { useState, useEffect } from 'react';
import { 
  Repeat, Calendar, ArrowRight, Plus, X,
  Search, Building, MapPin, ChevronRight, Check,
  IndianRupee, Clock, Loader2, AlertCircle, Trash2
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';

// ─── Wizard Modal ──────────────────────────────────────────────────────────────
const STEPS = ['Select Site', 'Lease Details', 'Billing', 'Confirm'];

const RecurringWizard: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [sites, setSites] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    siteId: '',
    site: null as any,
    clientId: '',
    leaseAmount: '',
    leaseStartDate: new Date().toISOString().split('T')[0],
    leaseEndDate: '',
    monthlyRate: '',
    billingDay: '1',
    notes: '',
  });

  useEffect(() => {
    Promise.all([api.get('/sites'), api.get('/clients')])
      .then(([s, c]) => {
        setSites(s.data.filter((x: any) => !x.isRecurring));
        setClients(c.data);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const selectSite = (site: any) => {
    setForm(f => ({ ...f, siteId: site.id, site, monthlyRate: String(site.monthlyRate || '') }));
    setStep(1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.put(`/sites/${form.siteId}`, {
        isRecurring: true,
        leaseAmount: parseFloat(form.leaseAmount) || 0,
        leaseStartDate: form.leaseStartDate ? new Date(form.leaseStartDate) : null,
        leaseEndDate: form.leaseEndDate ? new Date(form.leaseEndDate) : null,
        monthlyRate: parseFloat(form.monthlyRate) || 0,
        notes: form.notes || undefined,
      });
      toast.success(`${form.site?.siteName} is now a recurring subscription!`);
      onSuccess();
    } catch {
      toast.error('Failed to save recurring setup');
    } finally {
      setSaving(false);
    }
  };

  const filtered = sites.filter(s =>
    s.siteName.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const canProceed = () => {
    if (step === 1) return form.leaseStartDate;
    if (step === 2) return form.monthlyRate;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-black text-[14px] uppercase tracking-widest text-text-primary flex items-center gap-2">
              <Repeat size={16} className="text-accent-orange" /> Setup Recurring Subscription
            </h2>
            <p className="text-[10px] text-text-muted mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-surface-2 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 py-3 gap-2 border-b border-border shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-accent-orange text-white' : 'bg-bg-surface-2 text-text-muted border border-border'
              }`}>
                {i < step ? <Check size={10} /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${i === step ? 'text-accent-orange' : 'text-text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight size={12} className="text-border ml-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Select Site */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search available sites..."
                  className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] outline-none focus:border-accent-orange"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-text-muted"><Loader2 className="animate-spin mr-2" size={16} /> Loading sites...</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-text-muted italic text-[12px]">
                  {sites.length === 0 ? 'All sites are already recurring.' : 'No sites match your search.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(site => (
                    <button
                      key={site.id}
                      onClick={() => selectSite(site)}
                      className="w-full text-left p-4 bg-bg-surface-2 border border-border rounded-xl hover:border-accent-orange hover:bg-accent-orange/5 transition-all group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg-surface rounded-xl border border-border flex items-center justify-center text-accent-orange">
                          <Building size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-text-primary group-hover:text-accent-orange">{site.siteName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-text-muted flex items-center gap-1"><MapPin size={9} />{site.city}, {site.state}</span>
                            <span className="text-[10px] text-text-muted border-l border-border pl-2">{site.siteType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[13px] text-text-primary">₹{(site.monthlyRate || 0).toLocaleString()}</div>
                        <div className="text-[9px] text-text-muted uppercase">Monthly Rate</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Lease Details */}
          {step === 1 && form.site && (
            <div className="space-y-6">
              <div className="p-4 bg-accent-orange/5 border border-accent-orange/20 rounded-xl flex items-center gap-3">
                <Building size={20} className="text-accent-orange shrink-0" />
                <div>
                  <div className="font-black text-[13px] text-text-primary">{form.site.siteName}</div>
                  <div className="text-[10px] text-text-muted">{form.site.city}, {form.site.state} · {form.site.siteType}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Lease Start Date *</label>
                  <input type="date" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.leaseStartDate} onChange={e => set('leaseStartDate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Lease End Date</label>
                  <input type="date" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.leaseEndDate} onChange={e => set('leaseEndDate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Vendor Lease Amount (₹/mo)</label>
                  <input type="number" placeholder="0" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.leaseAmount} onChange={e => set('leaseAmount', e.target.value)} />
                  <p className="text-[9px] text-text-muted italic">Cost you pay to site vendor/owner</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Assign Client (Optional)</label>
                  <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.clientId} onChange={e => set('clientId', e.target.value)}>
                    <option value="">No client yet...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Notes</label>
                  <textarea rows={2} className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[12px] outline-none resize-none focus:border-accent-orange"
                    placeholder="Any special terms, renewal notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Billing */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-bg-surface-2 border border-border rounded-xl space-y-1">
                <div className="text-[10px] text-text-muted uppercase font-black">Site</div>
                <div className="font-bold text-[13px]">{form.site?.siteName}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Client Monthly Rate (₹) *</label>
                  <input type="number" className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.monthlyRate} onChange={e => set('monthlyRate', e.target.value)} />
                  <p className="text-[9px] text-text-muted italic">Amount billed to the client each month</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-muted uppercase">Billing Day of Month</label>
                  <select className="w-full bg-bg-surface-2 border border-border rounded-xl px-3 py-2 text-[13px] outline-none focus:border-accent-orange"
                    value={form.billingDay} onChange={e => set('billingDay', e.target.value)}>
                    {[1,5,10,15,20,25,28].map(d => <option key={d} value={d}>{d === 1 ? '1st' : d === 28 ? 'Last day' : `${d}th`}</option>)}
                  </select>
                </div>
              </div>
              {form.leaseAmount && form.monthlyRate && (
                <div className="p-4 bg-success/5 border border-success/20 rounded-xl space-y-2">
                  <div className="text-[10px] font-black text-success uppercase tracking-wider">Margin Analysis</div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <div className="text-[10px] text-text-muted uppercase">Lease Cost</div>
                      <div className="font-black text-text-primary">₹{parseFloat(form.leaseAmount).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-text-muted uppercase">Billing Rate</div>
                      <div className="font-black text-accent-orange">₹{parseFloat(form.monthlyRate).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-text-muted uppercase">Net Margin</div>
                      <div className={`font-black ${parseFloat(form.monthlyRate) - parseFloat(form.leaseAmount) > 0 ? 'text-success' : 'text-danger'}`}>
                        ₹{(parseFloat(form.monthlyRate) - parseFloat(form.leaseAmount)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-accent-orange/5 border border-accent-orange/30 rounded-xl">
                <div className="text-[11px] font-black text-accent-orange uppercase tracking-wider mb-3">Review Configuration</div>
                <div className="space-y-2">
                  {[
                    { label: 'Site', value: form.site?.siteName },
                    { label: 'Location', value: `${form.site?.city}, ${form.site?.state}` },
                    { label: 'Lease Start', value: form.leaseStartDate },
                    { label: 'Lease End', value: form.leaseEndDate || 'Open-ended' },
                    { label: 'Vendor Lease Cost', value: form.leaseAmount ? `₹${parseFloat(form.leaseAmount).toLocaleString()}/mo` : 'Not set' },
                    { label: 'Client Monthly Rate', value: form.monthlyRate ? `₹${parseFloat(form.monthlyRate).toLocaleString()}/mo` : '—' },
                    { label: 'Billing Day', value: `${form.billingDay}th of each month` },
                    { label: 'Assigned Client', value: clients.find(c => c.id === form.clientId)?.name || 'None' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-[12px]">
                      <span className="text-text-muted font-bold">{row.label}</span>
                      <span className="text-text-primary font-black">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-bg-surface-2 border border-border rounded-xl">
                <AlertCircle size={14} className="text-accent-orange mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-muted">This will mark the site as <strong className="text-text-primary">Recurring</strong> and update its monthly rate. You can edit it anytime from Site Details.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-accent-orange text-white px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 hover:bg-accent-orange/90 transition-all disabled:opacity-40"
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-success text-white px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 hover:bg-success/90 transition-all disabled:opacity-40"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Saving...' : 'Activate Recurring'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const RecurringSites: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => { fetchRecurringSites(); }, []);

  const fetchRecurringSites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sites');
      setSites(res.data.filter((s: any) => s.isRecurring === true));
    } catch {
      toast.error('Failed to load recurring sites');
    } finally {
      setLoading(false);
    }
  };

  const handleWizardSuccess = () => {
    setShowWizard(false);
    fetchRecurringSites();
  };

  const handleRemoveRecurring = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to stop recurring billing for ${name}?`)) {
      try {
        await api.put(`/sites/${id}`, { isRecurring: false });
        toast.success(`${name} removed from recurring billing`);
        fetchRecurringSites();
      } catch {
        toast.error('Failed to remove recurring status');
      }
    }
  };

  const filteredData = sites.filter(d =>
    d.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMonthly = sites.reduce((acc, s) => acc + (s.monthlyRate || 0), 0);
  const totalLeaseCost = sites.reduce((acc, s) => acc + (s.leaseAmount || 0), 0);

  if (loading) return <div className="p-8 text-center text-text-muted text-[12px]">Loading subscription data...</div>;

  return (
    <>
      {showWizard && <RecurringWizard onClose={() => setShowWizard(false)} onSuccess={handleWizardSuccess} />}

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Subscription Inventory</h1>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Recurring Leases · Long-term Automated Billing</p>
          </div>
          <div className="flex gap-2">
            <ExportButton data={filteredData} filename="drishtivision_recurring_sites" />
            <button
              onClick={() => setShowWizard(true)}
              className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30"
            >
              <Repeat size={16} /> Setup New Recurring
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Active Subscriptions</div>
            <div className="text-xl font-black text-text-primary mt-2">{sites.length}</div>
          </div>
          <div className="card flex flex-col justify-center border-border/40 text-accent-blue">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Monthly Billing</div>
            <div className="text-xl font-black mt-2">₹{totalMonthly.toLocaleString()}</div>
          </div>
          <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Lease Cost</div>
            <div className="text-xl font-black text-warning mt-2">₹{totalLeaseCost.toLocaleString()}</div>
          </div>
          <div className="card bg-success/5 border-success/20 flex flex-col justify-center">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Net Monthly Margin</div>
            <div className="text-xl font-black text-text-primary mt-2">₹{(totalMonthly - totalLeaseCost).toLocaleString()}</div>
          </div>
        </div>

        <div className="card">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="Search active subscriptions..."
              className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-bg-surface-2/30">
              <Repeat size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
              <p className="text-text-muted italic text-[12px]">No recurring sites yet.</p>
              <button onClick={() => setShowWizard(true)} className="mt-4 btn-primary text-[12px] py-1.5 inline-flex items-center gap-2">
                <Plus size={14} /> Setup First Recurring Site
              </button>
            </div>
          ) : filteredData.map((item) => (
            <div key={item.id} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50 shadow-md">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-bg-surface-2 rounded-2xl border border-border flex items-center justify-center text-accent-orange shadow-inner">
                  <Repeat size={20} className="group-hover:rotate-180 transition-all duration-1000" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{item.siteName}</h3>
                    <span className="status-tag bg-success">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase">
                      <MapPin size={10} className="text-danger" /> {item.city}, {item.state}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase border-l border-border pl-3">
                      <Building size={10} className="text-accent-blue" /> {item.siteType}
                    </div>
                    {item.leaseStartDate && (
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase border-l border-border pl-3">
                        <Clock size={10} className="text-warning" />
                        Since {new Date(item.leaseStartDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10 text-right pr-2">
                {item.leaseAmount > 0 && (
                  <div>
                    <div className="text-[13px] font-black text-warning">₹{item.leaseAmount.toLocaleString()}</div>
                    <div className="text-[9px] text-text-muted uppercase font-bold">Lease Cost</div>
                  </div>
                )}
                <div>
                  <div className="text-[15px] font-black text-text-primary">₹{(item.monthlyRate || 0).toLocaleString()}</div>
                  <div className="text-[9px] text-text-muted uppercase font-bold">Monthly Billing</div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar size={18} className="text-text-muted group-hover:text-accent-orange transition-colors" />
                  <button 
                    onClick={(e) => handleRemoveRecurring(e, item.id, item.siteName)}
                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20"
                    title="Stop Recurring Billing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecurringSites;
