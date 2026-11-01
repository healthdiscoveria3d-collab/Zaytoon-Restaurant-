import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ClipboardList, CalendarDays, MessageSquare, LogOut, ShieldCheck, RefreshCw, Utensils, LockKeyhole, BookOpen, Tags, Percent, Images, Settings, Plus, Save, Trash2, MoreVertical, Pencil } from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'reservations' | 'messages' | 'menu' | 'categories' | 'deals' | 'gallery' | 'settings';
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
  const [contentRows, setContentRows] = useState<any[]>([]);
  const [contentSelection, setContentSelection] = useState('main');
  const [contentJson, setContentJson] = useState('');
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);

  const contentCollections: Partial<Record<Tab, string>> = {
    menu: 'menu_items', categories: 'categories', deals: 'deals', gallery: 'gallery', settings: 'site_settings',
  };
  const contentTitles: Partial<Record<Tab, string>> = {
    menu: 'Menu Items', categories: 'Menu Categories', deals: 'Deals & Promotions', gallery: 'Gallery', settings: 'Site Settings',
  };

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

  useEffect(() => {
    const collection = contentCollections[tab];
    if (!authenticated || !collection) return;
    setBusy(true);
    request('/content/' + collection)
      .then((result) => {
        setContentRows(result.data || []);
        if (tab === 'settings') {
          setContentSelection('main');
          setContentJson(JSON.stringify(result.data?.[0] || {}, null, 2));
        } else {
          const first = result.data?.[0];
          setContentSelection(first?.id || '');
          setContentJson(first ? JSON.stringify(first, null, 2) : '');
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load content.'))
      .finally(() => setBusy(false));
  }, [authenticated, tab]);

  const chooseContent = (row: any) => {
    const id = tab === 'settings' ? 'main' : String(row.id);
    setContentSelection(id);
    setContentJson(JSON.stringify(row, null, 2));
  };

  const createContent = () => {
    const templates: Partial<Record<Tab, any>> = {
      menu: { id: 'item-new', name: 'New Menu Item', slug: 'new-menu-item', categoryId: 'cat-karahi', categoryName: 'Karahi & Handi', description: '', price: 0, image: '/images/food_pakistani_karahi_bbq.jpg', isAvailable: true, isFeatured: false, isDemoItem: false, preparationTime: '20 mins', spiciness: 'medium', tags: [] },
      categories: { id: 'cat-new', name: 'New Category', slug: 'new-category', description: '', displayOrder: contentRows.length + 1, image: '/images/food_pakistani_karahi_bbq.jpg', badge: '' },
      deals: { id: 'deal-new', title: 'New Deal', slug: 'new-deal', shortDescription: '', fullDescription: '', image: '/images/deal_special_family_platter.jpg', originalPrice: 0, offerPrice: 0, discountPercentage: 0, promoCode: '', includedItems: [], serves: '2 Persons', validUntil: '2026-12-31', isFeatured: false, isActive: true, terms: [], badge: '' },
      gallery: { id: 'gal-new', title: 'New Gallery Image', category: 'culinary', image: '/images/food_pakistani_karahi_bbq.jpg', caption: '' },
    };
    const template = templates[tab];
    if (!template) return;
    setContentSelection('__new__');
    setContentJson(JSON.stringify(template, null, 2));
  };

  const saveContent = async () => {
    const collection = contentCollections[tab];
    if (!collection) return;
    try {
      const data = JSON.parse(contentJson);
      const id = tab === 'settings' ? 'main' : String(data.id || '').trim();
      if (!id) throw new Error('Record ke andar id zaroor likhein.');
      await request('/content/' + collection + '/' + encodeURIComponent(id), {
        method: 'PUT', body: JSON.stringify({ data }),
      });
      setError('');
      const result = await request('/content/' + collection);
      setContentRows(result.data || []);
      setContentSelection(id);
      setContentJson(JSON.stringify(tab === 'settings' ? result.data?.[0] : result.data.find((item: any) => item.id === id), null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON or save failed.');
    }
  };

  const deleteContent = async () => {
    const collection = contentCollections[tab];
    if (!collection || tab === 'settings' || !contentSelection || contentSelection === '__new__') return;
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      await request('/content/' + collection + '/' + encodeURIComponent(contentSelection), { method: 'DELETE' });
      const result = await request('/content/' + collection);
      setContentRows(result.data || []);
      const first = result.data?.[0];
      setContentSelection(first?.id || '');
      setContentJson(first ? JSON.stringify(first, null, 2) : '');
    } catch (err) { setError(err instanceof Error ? err.message : 'Delete failed.'); }
  };

  const updateDraftField = (key: string, value: any) => {
    try {
      const draft = JSON.parse(contentJson || '{}');
      draft[key] = value;
      setContentJson(JSON.stringify(draft, null, 2));
    } catch { setError('Draft JSON is invalid. Re-select the record to reset it.'); }
  };

  const filteredOrders = orders.filter((item) => [item.reference, item.customerName, item.customerPhone, item.status].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReservations = reservations.filter((item) => [item.reference, item.fullName, item.phone, item.status].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMessages = messages.filter((item) => [item.fullName, item.phone, item.subject, item.message].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));

  let parsedContentDraft: Record<string, any> = {};
  try { parsedContentDraft = JSON.parse(contentJson || '{}'); } catch { parsedContentDraft = {}; }

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
    <div className="min-h-screen bg-[#19382d] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#315744]"><Utensils size={23}/></span><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#d5bd8b]">Zaytoon Restaurant</p><p className="text-sm text-white/55">Private management portal</p></div></div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><LockKeyhole size={20}/></span><div><h1 className="text-2xl font-black">Admin Login</h1><p className="mt-1 text-xs text-white/50">Authorized restaurant staff only</p></div></div>
          <form onSubmit={login} className="space-y-4">
            <label className="block text-xs font-bold text-white/75">Username<input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            <label className="block text-xs font-bold text-white/75">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-[#315744] px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50">{busy ? 'Please wait…' : 'Sign in securely'}</button>
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
    { id: 'menu', label: 'Menu Items', icon: <BookOpen size={17}/> },
    { id: 'categories', label: 'Categories', icon: <Tags size={17}/> },
    { id: 'deals', label: 'Deals', icon: <Percent size={17}/> },
    { id: 'gallery', label: 'Gallery', icon: <Images size={17}/> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={17}/> },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f0] text-[#171717] lg:flex">
      <aside className="bg-[#19382d] p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:p-5">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d5bd8b] text-lg font-black text-[#19382d] shadow-lg">Z</span><div><p className="text-sm font-black uppercase tracking-[.14em]">Zaytoon</p><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#d5bd8b]">Restaurant · Admin</p></div></div>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map(item=><button key={item.id} onClick={()=>{setTab(item.id);setSearchQuery('');setError('');}} className={'flex shrink-0 items-center gap-3 rounded-xl px-3 py-3.5 text-left text-xs font-semibold transition '+(tab===item.id?'bg-[#d5bd8b] text-[#19382d] shadow-md':'text-white/65 hover:bg-white/10 hover:text-white')}>{item.icon}{item.label}</button>)}
        </nav>
        <div className="mt-5 flex gap-2 lg:absolute lg:bottom-5 lg:left-5 lg:right-5">
          <button onClick={loadData} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-[10px] font-bold uppercase text-white/70"><RefreshCw size={14}/> Refresh</button>
          <button onClick={logout} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-3 text-[10px] font-bold uppercase text-white/70"><LogOut size={14}/> Logout</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 pb-12 sm:px-7 lg:px-9 lg:py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#9a8050]">Zaytoon · Management workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20372d]">{tab==='dashboard'?'Restaurant overview':nav.find(item=>item.id===tab)?.label}</h1><p className="mt-1 text-xs text-[#85877e]">Your restaurant operations, website content and customer activity.</p></div><span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-[10px] font-bold text-emerald-700 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Secure session active</span></div>
        {error && <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"><span>{error}</span><button onClick={()=>setError('')} className="font-black">×</button></div>}
        {tab==='dashboard' && <section>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              {label:'Total Orders',value:summary?.totalOrders??0,icon:<ClipboardList size={18}/>,hint:'All customer orders',tone:'bg-[#edf3ed] text-[#315744]'},
              {label:'Pending Orders',value:summary?.pendingOrders??0,icon:<RefreshCw size={18}/>,hint:'Awaiting action',tone:'bg-[#fbf2df] text-[#9a7232]'},
              {label:'Active Reservations',value:summary?.activeReservations??0,icon:<CalendarDays size={18}/>,hint:'Guest bookings',tone:'bg-[#edf2f7] text-[#4d6b88]'},
              {label:'Contact Messages',value:summary?.unreadMessages??0,icon:<MessageSquare size={18}/>,hint:'Customer enquiries',tone:'bg-[#f2edf7] text-[#795b91]'}
            ].map(card=><div key={card.label} className="rounded-2xl border border-[#e8e5dd] bg-white p-5 shadow-[0_8px_30px_rgba(35,39,31,0.04)]"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#85877e]">{card.label}</p><span className={'grid h-10 w-10 place-items-center rounded-xl '+card.tone}>{card.icon}</span></div><p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-[#20372d]">{card.value}</p><p className="mt-1 text-[10px] text-[#a0a197]">{card.hint}</p></div>)}
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4"><h2 className="mb-4 font-black">Recent Orders</h2>{summary?.recentOrders.length ? summary.recentOrders.map(order=><div key={order.reference} className="flex items-center justify-between gap-3 border-t border-gray-100 py-3"><div><p className="text-xs font-black">{order.reference} · {order.customerName}</p><p className="mt-1 text-[10px] text-gray-500">PKR {order.total.toLocaleString()} · {dateTime(order.createdAt)}</p></div><span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold">{pretty(order.status)}</span></div>) : <p className="text-xs text-gray-500">No orders received yet.</p>}</div>
            <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4"><h2 className="mb-4 font-black">Recent Reservations</h2>{summary?.recentReservations.length ? summary.recentReservations.map(item=><div key={item.reference} className="flex items-center justify-between gap-3 border-t border-gray-100 py-3"><div><p className="text-xs font-black">{item.fullName} · {item.guests} guests</p><p className="mt-1 text-[10px] text-gray-500">{item.date} at {item.timeSlot}</p></div><span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold">{pretty(item.status)}</span></div>) : <p className="text-xs text-gray-500">No reservations received yet.</p>}</div>
          </div>
        </section>}
        {tab==='orders' && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by order ID, customer or phone…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{filteredOrders.length ? filteredOrders.map(order=><article key={order.reference} className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{order.reference} · {order.customerName}</p><p className="mt-1 text-[10px] text-gray-500">{order.customerPhone} · {dateTime(order.createdAt)}</p></div><p className="text-lg font-black">PKR {order.total.toLocaleString()}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Type:</strong> {pretty(order.fulfilmentMethod)}</p><p><strong>Payment:</strong> {pretty(order.paymentMethod)}</p>{order.deliveryAddress && <p className="sm:col-span-2"><strong>Address:</strong> {order.deliveryAddress}</p>}<p className="sm:col-span-2"><strong>Items:</strong> {order.items.map(item=>item.quantity+' × '+item.itemName).join(', ')}</p>{order.instructions && <p className="sm:col-span-2"><strong>Notes:</strong> {order.instructions}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Order status</label><select value={order.status} onChange={e=>updateOrder(order.reference,e.target.value)} className="max-w-56 rounded-xl border border-[#e8e5dd] bg-[#fbfaf7] px-3 py-2 text-xs font-bold">{orderStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-8 text-center text-sm text-gray-500">No orders yet.</div>}</section>}
        {tab==='reservations' && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by guest, booking ID or phone…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{filteredReservations.length ? filteredReservations.map(item=><article key={item.reference} className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{item.fullName} · {item.reference}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-sm font-black">{item.date} · {item.timeSlot}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Guests:</strong> {item.guests}</p><p><strong>Seating:</strong> {pretty(item.seatingPreference)}</p>{item.specialRequest && <p className="sm:col-span-2"><strong>Request:</strong> {item.specialRequest}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Status</label><select value={item.status} onChange={e=>updateReservation(item.reference,e.target.value)} className="max-w-56 rounded-xl border border-[#e8e5dd] bg-[#fbfaf7] px-3 py-2 text-xs font-bold">{reservationStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-8 text-center text-sm text-gray-500">No reservations yet.</div>}</section>}
        {tab==='messages' && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search customer messages…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{filteredMessages.length ? filteredMessages.map(item=><article key={item.id} className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4 sm:p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-sm font-black">{item.fullName}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-[10px] text-gray-400">{dateTime(item.createdAt)}</p></div><p className="mt-3 text-xs font-bold">{item.subject}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">{item.message}</p></article>) : <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-8 text-center text-sm text-gray-500">No messages yet.</div>}</section>}
        {contentCollections[tab] && <section className="grid gap-4 xl:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.4fr)]">
          <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4">
            <div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-black">{contentTitles[tab]}</h2>{tab !== 'settings' && <button onClick={createContent} className="flex items-center gap-1 rounded-lg bg-[#315744] px-3 py-2 text-[10px] font-black text-white"><Plus size={13}/> New</button>}</div>
            <div className="max-h-[65vh] space-y-2 overflow-y-auto">
              {tab === 'settings' ? <button onClick={() => chooseContent(contentRows[0] || {})} className="w-full rounded-lg bg-gray-100 px-3 py-3 text-left text-xs font-bold">Main Website Settings</button> :
                contentRows.map((row) => <div key={row.id} className={'relative flex items-center gap-1 rounded-xl px-2 py-2 '+(contentSelection===row.id?'bg-[#edf3ed] ring-1 ring-[#cbd9ce]':'bg-gray-50 hover:bg-gray-100')}><button onClick={() => { chooseContent(row); setOpenRowMenu(null); }} className="min-w-0 flex-1 px-1 py-1 text-left text-xs font-bold text-[#263b30]">{row.name || row.title || row.id}<span className="mt-1 block truncate text-[10px] font-normal text-gray-500">{row.id}</span></button><button type="button" aria-label={'More actions for '+(row.name || row.title || row.id)} onClick={(event) => { event.stopPropagation(); setOpenRowMenu(openRowMenu===String(row.id)?null:String(row.id)); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-white hover:text-[#19382d]"><MoreVertical size={17}/></button>{openRowMenu===String(row.id) && <div className="absolute right-2 top-12 z-30 w-40 rounded-xl border border-[#e8e5dd] bg-white p-1.5 shadow-xl"><button onClick={() => { chooseContent(row); setOpenRowMenu(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#263b30] hover:bg-[#edf3ed]"><Pencil size={14}/> Edit record</button><button onClick={() => { chooseContent(row); setOpenRowMenu(null); void deleteContent(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 size={14}/> Delete record</button></div>}</div>)}
              {!contentRows.length && tab !== 'settings' && <p className="py-5 text-center text-xs text-gray-500">No records yet. Press New to add one.</p>}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e8e5dd] bg-white shadow-[0_8px_30px_rgba(35,39,31,0.04)] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-black">{tab === 'settings' ? 'Edit Website Settings' : contentSelection === '__new__' ? 'Create Record' : 'Edit Record'}</h2><p className="mt-1 text-[10px] text-gray-500">Edit the JSON fields, then save. Changes update the live website data after deployment.</p></div><div className="flex gap-2"><button onClick={saveContent} disabled={!contentJson.trim() || busy} className="flex items-center gap-2 rounded-xl bg-[#203e31] px-4 py-2 text-[10px] font-black text-white disabled:opacity-40"><Save size={14}/> Save</button>{tab !== 'settings' && contentSelection !== '__new__' && <button onClick={deleteContent} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-[10px] font-bold text-red-600"><Trash2 size={14}/> Delete</button>}</div></div>
            {contentJson && Object.keys(parsedContentDraft).length > 0 ? <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(parsedContentDraft).map(([key, value]) => <label key={key} className="block min-w-0 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {pretty(key)}
                {typeof value === 'boolean' ? <span className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-xs font-semibold normal-case text-gray-700"><input type="checkbox" checked={value} onChange={(e)=>updateDraftField(key,e.target.checked)} disabled={key==='id'}/> {value ? 'Enabled' : 'Disabled'}</span> :
                  Array.isArray(value) ? <textarea value={value.join('\n')} onChange={(e)=>updateDraftField(key,e.target.value.split('\n').map((v)=>v.trim()).filter(Boolean))} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#D71920]"/> :
                  typeof value === 'number' ? <input type="number" value={value} onChange={(e)=>updateDraftField(key,Number(e.target.value))} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#D71920]"/> :
                  (String(value).length > 110 || /description|caption|notice|history|address|message/i.test(key)) ? <textarea value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} rows={4} disabled={key==='id' && contentSelection!=='__new__'} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#D71920]"/> :
                  <input value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} disabled={key==='id' && contentSelection!=='__new__'} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#D71920]"/>
                }
              </label>)}
            </div> : <p className="rounded-lg bg-gray-50 p-6 text-center text-xs text-gray-500">Select a record or press New to start editing.</p>}
            <details className="mt-4"><summary className="cursor-pointer text-[10px] font-bold text-gray-500">Advanced: view / edit raw JSON</summary><textarea value={contentJson} onChange={(e)=>setContentJson(e.target.value)} spellCheck={false} className="mt-2 min-h-48 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 font-mono text-[10px] leading-5 outline-none focus:border-[#D71920]"/></details>
            <p className="mt-2 text-[10px] text-gray-400">List fields: enter one item per line. Image fields accept existing image paths or full image URLs.</p>
          </div>
        </section>}
        {busy && <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Refreshing data…</p>}
      </main>
    </div>
  );
};
