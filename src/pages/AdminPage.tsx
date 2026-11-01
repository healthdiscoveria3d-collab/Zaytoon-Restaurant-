import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ClipboardList, CalendarDays, MessageSquare, LogOut, ShieldCheck, RefreshCw, Utensils, LockKeyhole } from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'reservations' | 'messages';
type Order = {
  reference: string; customerName: string; customerPhone: string; customerEmail?: string;
  fulfilmentMethod: string; deliveryAddress?: string; pickupTime?: string;
  items: { itemName: string; quantity: number; subtotal: number }[];
  total: number; status: string; paymentMethod: string; createdAt: string; instructions?: string;
};
type Reservation = {
  reference: string; fullName: string; phone: string; email?: string; date: string; timeSlot: string;
  guests: number; seatingPreference: string; specialRequest?: string; status: string; createdAt: string;
};
type Inquiry = { id: string; fullName: string; phone: string; email?: string; subject: string; message: string; createdAt: string };
type Summary = { totalOrders: number; pendingOrders: number; activeReservations: number; unreadMessages: number; recentOrders: Order[]; recentReservations: Reservation[] };

const API = '/api/admin';
const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
const reservationStatuses = ['received', 'confirmed', 'declined', 'cancelled'];
const pretty = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateTime = (value: string) => new Date(value).toLocaleString();

export const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<Inquiry[]>([]);
  const [busy, setBusy] = useState(false);

  const request = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(API + path, {
      ...init, credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed.');
    return result;
  };

  const loadData = async () => {
    setBusy(true);
    try {
      const [dashboard, orderData, reservationData, messageData] = await Promise.all([
        request('/dashboard'), request('/orders'), request('/reservations'), request('/messages'),
      ]);
      setSummary(dashboard.data);
      setOrders(orderData.data);
      setReservations(reservationData.data);
      setMessages(messageData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load admin data.');
    } finally { setBusy(false); }
  };

  useEffect(() => {
    request('/me').then(() => setAuthenticated(true)).catch(() => setAuthenticated(false)).finally(() => setChecking(false));
  }, []);

  useEffect(() => { if (authenticated) loadData(); }, [authenticated]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await request('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      setPassword(''); setAuthenticated(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed.'); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    try { await request('/logout', { method: 'POST' }); } finally { setAuthenticated(false); setSummary(null); setOrders([]); setReservations([]); setMessages([]); }
  };

  const updateOrder = async (reference: string, status: string) => {
    setError('');
    try { await request('/orders/' + encodeURIComponent(reference) + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update order.'); }
  };

  const updateReservation = async (reference: string, status: string) => {
    setError('');
    try { await request('/reservations/' + encodeURIComponent(reference) + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update reservation.'); }
  };

  if (checking) return <div className="min-h-screen grid place-items-center bg-[#111] text-white">Checking secure admin session…</div>;

  if (!authenticated) return (
    <div className="min-h-screen bg-[#101010] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#D71920]"><Utensils size={23}/></span><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#F4C542]">Zaytoon Restaurant</p><p className="text-sm text-white/55">Private management portal</p></div></div>
        <div className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><LockKeyhole size={20}/></span><div><h1 className="text-2xl font-black">Admin Login</h1><p className="mt-1 text-xs text-white/50">Authorized restaurant staff only</p></div></div>
          <form onSubmit={login} className="space-y-4">
            <label className="block text-xs font-bold text-white/75">Username<input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            <label className="block text-xs font-bold text-white/75">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-[#D71920] px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50">{busy ? 'Please wait…' : 'Sign in securely'}</button>
          </form>
          <p className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-white/40"><ShieldCheck size={14}/> Protected by a server-verified session. Credentials are never stored in the browser.</p>
        </div>
      </div>
    </div>
  );

  const nav: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={17}/> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList size={17}/> },
    { id: 'reservations', label: 'Reservations', icon: <CalendarDays size={17}/> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={17}/> },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#171717] lg:flex">
      <aside className="bg-[#151515] p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:p-5">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#D71920] font-black">Z</span><div><p className="text-sm font-black uppercase tracking-wide">Zaytoon</p><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#F4C542]">Admin Console</p></div></div>
        <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
          {nav.map(item=><button key={item.id} onClick={()=>setTab(item.id)} className={'flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-bold '+(tab===item.id?'bg-[#D71920] text-white':'text-white/65 hover:bg-white/10 hover:text-white')}>{item.icon}{item.label}</button>)}
        </nav>
        <div className="mt-5 flex gap-2 lg:absolute lg:bottom-5 lg:left-5 lg:right-5">
          <button onClick={loadData} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-[10px] font-bold uppercase text-white/70"><RefreshCw size={14}/> Refresh</button>
          <button onClick={logout} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-[10px] font-bold uppercase text-white/70"><LogOut size={14}/> Logout</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 pb-12 sm:px-7 lg:px-9 lg:py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#D71920]">Restaurant management</p><h1 className="mt-1 text-3xl font-black">{nav.find(item=>item.id===tab)?.label}</h1><p className="mt-1 text-xs text-gray-500">Manage restaurant activity from one place.</p></div><span className="rounded-full border border-green-200 bg-green-50 px-3 py-2 text-[10px] font-bold text-green-700">Secure session active</span></div>
        {error && <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"><span>{error}</span><button onClick={()=>setError('')} className="font-black">×</button></div>}
        {tab==='dashboard' && <section>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[['Total Orders',summary?.totalOrders ?? 0],['Pending Orders',summary?.pendingOrders ?? 0],['Active Reservations',summary?.activeReservations ?? 0],['Contact Messages',summary?.unreadMessages ?? 0]].map(([label,value])=><div key={label} className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-3 text-3xl font-black tabular-nums">{value}</p></div>)}
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4"><h2 className="mb-4 font-black">Recent Orders</h2>{summary?.recentOrders.length ? summary.recentOrders.map(order=><div key={order.reference} className="flex items-center justify-between gap-3 border-t border-gray-100 py-3"><div><p className="text-xs font-black">{order.reference} · {order.customerName}</p><p className="mt-1 text-[10px] text-gray-500">PKR {order.total.toLocaleString()} · {dateTime(order.createdAt)}</p></div><span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold">{pretty(order.status)}</span></div>) : <p className="text-xs text-gray-500">No orders received yet.</p>}</div>
            <div className="rounded-xl border border-gray-200 bg-white p-4"><h2 className="mb-4 font-black">Recent Reservations</h2>{summary?.recentReservations.length ? summary.recentReservations.map(item=><div key={item.reference} className="flex items-center justify-between gap-3 border-t border-gray-100 py-3"><div><p className="text-xs font-black">{item.fullName} · {item.guests} guests</p><p className="mt-1 text-[10px] text-gray-500">{item.date} at {item.timeSlot}</p></div><span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold">{pretty(item.status)}</span></div>) : <p className="text-xs text-gray-500">No reservations received yet.</p>}</div>
          </div>
        </section>}
        {tab==='orders' && <section className="space-y-3">{orders.length ? orders.map(order=><article key={order.reference} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{order.reference} · {order.customerName}</p><p className="mt-1 text-[10px] text-gray-500">{order.customerPhone} · {dateTime(order.createdAt)}</p></div><p className="text-lg font-black">PKR {order.total.toLocaleString()}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Type:</strong> {pretty(order.fulfilmentMethod)}</p><p><strong>Payment:</strong> {pretty(order.paymentMethod)}</p>{order.deliveryAddress && <p className="sm:col-span-2"><strong>Address:</strong> {order.deliveryAddress}</p>}<p className="sm:col-span-2"><strong>Items:</strong> {order.items.map(item=>item.quantity+' × '+item.itemName).join(', ')}</p>{order.instructions && <p className="sm:col-span-2"><strong>Notes:</strong> {order.instructions}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Order status</label><select value={order.status} onChange={e=>updateOrder(order.reference,e.target.value)} className="max-w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold">{orderStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">No orders yet.</div>}</section>}
        {tab==='reservations' && <section className="space-y-3">{reservations.length ? reservations.map(item=><article key={item.reference} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{item.fullName} · {item.reference}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-sm font-black">{item.date} · {item.timeSlot}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Guests:</strong> {item.guests}</p><p><strong>Seating:</strong> {pretty(item.seatingPreference)}</p>{item.specialRequest && <p className="sm:col-span-2"><strong>Request:</strong> {item.specialRequest}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Status</label><select value={item.status} onChange={e=>updateReservation(item.reference,e.target.value)} className="max-w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold">{reservationStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">No reservations yet.</div>}</section>}
        {tab==='messages' && <section className="space-y-3">{messages.length ? messages.map(item=><article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-sm font-black">{item.fullName}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-[10px] text-gray-400">{dateTime(item.createdAt)}</p></div><p className="mt-3 text-xs font-bold">{item.subject}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">{item.message}</p></article>) : <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">No messages yet.</div>}</section>}
        {busy && <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Refreshing data…</p>}
      </main>
    </div>
  );
};
