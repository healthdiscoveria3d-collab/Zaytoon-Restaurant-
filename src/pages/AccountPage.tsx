import React, { useEffect, useState } from 'react';
import { UserRound, LockKeyhole, UserPlus, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { TrackOrderPage } from './TrackOrderPage.tsx';

interface AccountPageProps { navigate: (path: string) => void; initialRef?: string; }
type Customer = { fullName: string; email: string; createdAt: string };

export const AccountPage: React.FC<AccountPageProps> = ({ navigate, initialRef }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const request = async (path: string, body?: unknown) => {
    const response = await fetch('/api/v1/customer/' + path, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed.');
    return result;
  };

  useEffect(() => {
    request('me').then(result => setCustomer(result.data)).catch(() => setCustomer(null));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const result = activeTab === 'login'
        ? await request('login', { email, password })
        : await request('signup', { fullName, email, password });
      setCustomer(result.data);
      setPassword('');
      setMessage(activeTab === 'login' ? 'You are now logged in.' : 'Your Zaytoon account has been created.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account request failed.');
    } finally { setBusy(false); }
  };

  const logout = async () => {
    try { await request('logout', {}); setCustomer(null); setMessage('You have been logged out.'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Logout failed.'); }
  };

  return (
    <div className="min-h-[75vh] bg-[#f6f6f6] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-[#D71920]">Home</button>
          <span>/</span><span className="text-[#D71920]">My Account</span>
        </div>
        <section className="relative isolate overflow-hidden rounded-[28px] border border-[#eadfce] bg-gradient-to-br from-[#fffdf8] via-[#fff8ed] to-[#f8eee0] px-6 py-8 shadow-[0_18px_45px_rgba(91,63,35,0.08)] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[34px] border-[#D71920]/[0.045]"/>
          <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#F4C542]/[0.12] blur-2xl"/>
          <div className="relative flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#D71920] to-[#a90f18] text-white shadow-lg"><UserRound size={22}/></span>
            <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-[#b18a43]">Zaytoon customer portal</p><p className="mt-1 text-xs font-medium text-[#777064]">Your account and orders</p></div>
          </div>
          <h1 className="relative mt-6 text-3xl font-black uppercase tracking-tight text-[#20372d] sm:text-5xl">My Account<span className="text-[#D71920]">.</span></h1>
          <p className="relative mt-3 max-w-xl text-sm leading-6 text-[#746f65]">Sign in or create an account to manage your Zaytoon visits and orders.</p>
          <div className="relative mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#D71920] to-[#F4C542]"/>
        </section>

        <section className="mx-auto mt-7 max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {customer ? (
            <div className="p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={19}/></span><div><h2 className="font-black">You are signed in</h2><p className="text-xs text-gray-500">Your customer account is active.</p></div></div>
              <p className="text-sm font-bold text-gray-800">{customer.fullName}</p><p className="mt-1 text-xs text-gray-500">{customer.email}</p>
              <button onClick={logout} className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-xs font-black uppercase text-gray-700"><LogOut size={15}/> Log out</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50 p-1.5">
                <button type="button" onClick={() => {setActiveTab('login');setError('');}} className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${activeTab === 'login' ? 'bg-[#D71920] text-white shadow-sm' : 'text-gray-500 hover:text-[#171717]'}`}>Login</button>
                <button type="button" onClick={() => {setActiveTab('signup');setError('');}} className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${activeTab === 'signup' ? 'bg-[#D71920] text-white shadow-sm' : 'text-gray-500 hover:text-[#171717]'}`}>Create Account</button>
              </div>
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#D71920]">{activeTab === 'login' ? <LockKeyhole size={19}/> : <UserPlus size={19}/>}</span><div><h2 className="font-black">{activeTab === 'login' ? 'Welcome back' : 'Join Zaytoon'}</h2><p className="text-xs text-gray-500">{activeTab === 'login' ? 'Login to your Zaytoon account' : 'Create your customer account'}</p></div></div>
                {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
                {message && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">{message}</p>}
                <form className="space-y-3" onSubmit={submit}>
                  {activeTab === 'signup' && <label className="block text-xs font-semibold text-gray-600">Full name<input required minLength={2} value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" placeholder="Your full name" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]"/></label>}
                  <label className="block text-xs font-semibold text-gray-600">Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]"/></label>
                  <label className="block text-xs font-semibold text-gray-600">Password<input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]"/></label>
                  <button type="submit" disabled={busy} className="w-full rounded-full bg-[#D71920] px-5 py-3 text-xs font-black uppercase tracking-wide text-white disabled:opacity-50">{busy ? 'Please wait…' : activeTab === 'login' ? 'Login' : 'Create Account'}</button>
                </form>
                <p className="mt-3 text-[10px] leading-5 text-gray-400">Passwords are stored as salted hashes. Use at least 8 characters.</p>
              </div>
            </>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2">
            <div><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#D71920]">Orders</p><h2 className="mt-1 text-2xl font-black uppercase">Track Your Order</h2></div>
            <span className="rounded-full bg-gray-100 px-3 py-2 text-[9px] font-bold uppercase text-gray-500">Inside My Account</span>
          </div>
          <TrackOrderPage initialRef={initialRef} navigate={navigate}/>
        </section>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#171717] p-5 text-white">
          <div><p className="text-sm font-black">Want to order something?</p><p className="mt-1 text-xs text-white/60">Explore the Zaytoon menu.</p></div>
          <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 rounded-full bg-[#D71920] px-5 py-3 text-[10px] font-black uppercase">Browse Menu <ArrowRight size={14}/></button>
        </div>
      </div>
    </div>
  );
};
