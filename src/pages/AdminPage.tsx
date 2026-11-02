import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ClipboardList, CalendarDays, MessageSquare, LogOut, ShieldCheck, Utensils, LockKeyhole, BookOpen, Tags, Percent, Images, Settings, Plus, Save, Trash2, Pencil, Menu, X, Leaf, Truck, BarChart3, ChefHat, ShoppingCart, Users, UserRound, TrendingUp } from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'completed' | 'reservations' | 'messages' | 'menu' | 'categories' | 'deals' | 'gallery' | 'staff' | 'settings';
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
  const [staffRows, setStaffRows] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [contentSelection, setContentSelection] = useState('main');
  const [contentJson, setContentJson] = useState('');
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [siteLogoUrl, setSiteLogoUrl] = useState('/images/zaytoon-logo.jpg');
  const [dashboardPeriod, setDashboardPeriod] = useState<'today' | 'week' | 'month'>('today');

  const contentCollections: Partial<Record<Tab, string>> = {
    menu: 'menu_items', categories: 'categories', deals: 'deals', gallery: 'gallery', staff: 'staff', settings: 'site_settings',
  };
  const contentTitles: Partial<Record<Tab, string>> = {
    menu: 'Menu Items', categories: 'Menu Categories', deals: 'Deals & Promotions', gallery: 'Gallery', staff: 'Staff & Salaries', settings: 'Site Settings',
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

  // Add one history guard on entry; Back from a subpage returns to Overview.
  useEffect(() => {
    window.history.pushState({ adminPanel: true }, '', window.location.pathname);
  }, []);
  useEffect(() => {
    const adminPath = window.location.pathname;
    const returnToOverview = () => {
      if (tab !== 'dashboard') {
        setMobileNavOpen(false);
        setTab('dashboard');
        setSearchQuery('');
        window.history.pushState({ adminPanel: true }, '', adminPath);
      }
    };
    window.addEventListener('popstate', returnToOverview);
    return () => window.removeEventListener('popstate', returnToOverview);
  }, [tab]);

  useEffect(() => {
    request('/me').then(() => setAuthenticated(true)).catch(() => setAuthenticated(false)).finally(() => setChecking(false));
  }, []);

  useEffect(() => { if (authenticated) loadData(); }, [authenticated]);

  // Keep the reservations screen fresh while the admin is monitoring incoming bookings.
  useEffect(() => {
    if (!authenticated || tab !== 'reservations') return;
    const refreshReservations = () => {
      request('/reservations').then(result => setReservations(result.data || [])).catch(err => setError(err instanceof Error ? err.message : 'Could not refresh reservations.'));
    };
    refreshReservations();
    const timer = window.setInterval(refreshReservations, 15000);
    return () => window.clearInterval(timer);
  }, [authenticated, tab]);

  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/v1/site-settings/public').then((response) => response.json()).then((result) => setSiteLogoUrl(String(result.data?.logoUrl || '/images/zaytoon-logo.jpg'))).catch(() => setSiteLogoUrl('/images/zaytoon-logo.jpg'));
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || tab !== 'menu') return;
    request('/content/categories').then((result) => setCategoryOptions(result.data || [])).catch(() => setCategoryOptions([]));
  }, [authenticated, tab]);

  useEffect(() => {
    if (!authenticated || tab !== 'dashboard') return;
    request('/content/menu_items').then(result => setContentRows(result.data || [])).catch(err => setError(err instanceof Error ? err.message : 'Could not load menu preview.'));
    request('/content/staff').then(result => setStaffRows(result.data || [])).catch(() => setStaffRows([]));
  }, [authenticated, tab]);

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
    setEditModalOpen(true);
  };

  const createContent = () => {
    const templates: Partial<Record<Tab, any>> = {
      menu: { id: 'item-new', name: 'New Menu Item', slug: 'new-menu-item', categoryId: 'cat-karahi', categoryName: 'Karahi & Handi', description: '', price: 0, image: '/images/food_pakistani_karahi_bbq.jpg', isAvailable: true, isFeatured: false, isDemoItem: false, preparationTime: '20 mins', spiciness: 'medium', tags: [] },
      categories: { id: 'cat-new', name: 'New Category', slug: 'new-category', description: '', displayOrder: contentRows.length + 1, image: '/images/food_pakistani_karahi_bbq.jpg', badge: '' },
      deals: { id: 'deal-new', title: 'New Deal', slug: 'new-deal', shortDescription: '', fullDescription: '', image: '/images/deal_special_family_platter.jpg', originalPrice: 0, offerPrice: 0, discountPercentage: 0, promoCode: '', includedItems: [], serves: '2 Persons', validUntil: '2026-12-31', isFeatured: false, isActive: true, terms: [], badge: '' },
      gallery: { id: 'gal-new', title: 'New Gallery Image', category: 'culinary', image: '/images/food_pakistani_karahi_bbq.jpg', caption: '' },
      staff: { id: 'staff-new', name: 'New Staff Member', role: 'Worker', phone: '', monthlySalary: 0, salaryPaid: false, joiningDate: new Date().toISOString().slice(0,10) },
    };
    const template = templates[tab];
    if (!template) return;
    template.id = `${tab}-${Date.now().toString(36)}`;
    setContentSelection('__new__');
    setContentJson(JSON.stringify(template, null, 2));
    setEditModalOpen(true);
  };

  const saveContent = async () => {
    const collection = contentCollections[tab];
    if (!collection) return;
    try {
      const data = JSON.parse(contentJson);
      // IDs and URL slugs are generated by the system; the restaurant owner only enters business details.
      const nameForSlug = String(data.name || data.title || '').trim();
      if (tab !== 'settings' && nameForSlug && ['menu','categories','deals','gallery'].includes(tab)) {
        data.slug = nameForSlug.toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      const id = tab === 'settings' ? 'main' : String(data.id || `${tab}-${Date.now().toString(36)}`).trim();
      data.id = id;
      await request('/content/' + collection + '/' + encodeURIComponent(id), {
        method: 'PUT', body: JSON.stringify({ data }),
      });
      setError('');
      const result = await request('/content/' + collection);
      setContentRows(result.data || []);
      setContentSelection(id);
      setContentJson(JSON.stringify(tab === 'settings' ? result.data?.[0] : result.data.find((item: any) => item.id === id), null, 2));
      setEditModalOpen(false);
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
      setEditModalOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : 'Delete failed.'); }
  };

  const updateDraftField = (key: string, value: any) => {
    try {
      const draft = JSON.parse(contentJson || '{}');
      draft[key] = value;
      setContentJson(JSON.stringify(draft, null, 2));
    } catch { setError('Draft JSON is invalid. Re-select the record to reset it.'); }
  };

  const filteredOrders = orders.filter((item) => !['completed','cancelled'].includes(item.status) && [item.reference, item.customerName, item.customerPhone, item.status].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
  const completedOrders = orders.filter((item) => item.status === 'completed' && [item.reference, item.customerName, item.customerPhone].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReservations = reservations.filter((item) => [item.reference, item.fullName, item.phone, item.status].join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
  const menuPreviewItems = contentRows;
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
        <div className="mb-8 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#d5bd8b]/40 bg-white text-[#006b45] shadow-lg"><Leaf size={25}/></span><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#d5bd8b]">Zaytoon Restaurant</p><p className="text-sm text-white/55">Private management portal</p></div></div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><LockKeyhole size={20}/></span><div><h1 className="text-2xl font-black">Admin Login</h1><p className="mt-1 text-xs text-white/50">Authorized restaurant staff only</p></div></div>
          <form onSubmit={login} className="space-y-4">
            <label className="block text-xs font-bold text-white/75">Username<input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            <label className="block text-xs font-bold text-white/75">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#F4C542]"/></label>
            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-[#315744] px-4 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#00583b] disabled:opacity-50">{busy ? 'Please wait…' : 'Sign in securely'}</button>
          </form>
          <p className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-white/40"><ShieldCheck size={14}/> Protected by a server-verified session. Credentials are never stored in the browser.</p>
        </div>
      </div>
    </div>
  );

  const nav: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={17}/> },
    { id: 'orders', label: 'Active Orders', icon: <ClipboardList size={17}/> },
    { id: 'completed', label: 'Completed Orders', icon: <ClipboardList size={17}/> },
    { id: 'reservations', label: 'Reservations', icon: <CalendarDays size={17}/> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={17}/> },
    { id: 'menu', label: 'Menu Items', icon: <BookOpen size={17}/> },
    { id: 'categories', label: 'Categories', icon: <Tags size={17}/> },
    { id: 'deals', label: 'Deals', icon: <Percent size={17}/> },
    { id: 'gallery', label: 'Gallery', icon: <Images size={17}/> },
    { id: 'staff', label: 'Staff & Salaries', icon: <Utensils size={17}/> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={17}/> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f7f5] text-[#18352b] lg:flex">
      <aside className="hidden bg-gradient-to-b from-[#006b45] via-[#08764e] to-[#00583b] p-4 text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:p-5">
        <div className="flex items-center gap-3">{siteLogoUrl ? <img src={siteLogoUrl} alt="Zaytoon logo" className="h-11 w-11 rounded-full bg-black object-contain p-0.5"/> : <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/30 bg-white text-[#006b45] shadow-lg"><Leaf size={25}/></span>}<div><p className="text-sm font-black uppercase tracking-[.14em]">Zaytoon</p><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#d5bd8b]">Restaurant · Admin</p></div></div>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map(item=><button key={item.id} onClick={()=>{setTab(item.id);setSearchQuery('');setError('');setMobileNavOpen(false);}} className={'flex shrink-0 items-center gap-3 rounded-xl border px-3 py-3.5 text-left text-xs font-semibold transition '+(tab===item.id?'border-white/20 bg-white text-[#006b45] shadow-lg':'border-transparent text-white/75 hover:border-white/10 hover:bg-white/10 hover:text-white')}>{item.icon}{item.label}</button>)}
        </nav>
        <div className="mt-5 flex gap-2 lg:absolute lg:bottom-5 lg:left-5 lg:right-5">
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#f4a261] px-3 py-3 text-[10px] font-black uppercase tracking-wider text-[#263449] shadow-md transition hover:brightness-105"><LogOut size={14}/> Logout</button>
        </div>
      </aside>
      {mobileNavOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" onClick={()=>setMobileNavOpen(false)} className="absolute inset-0 bg-black/50"/><div className="absolute inset-y-0 left-0 flex w-[ min(82vw,300px)] flex-col bg-[#006b45] p-5 text-white shadow-2xl"><div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3">{siteLogoUrl ? <img src={siteLogoUrl} alt="Zaytoon logo" className="h-10 w-10 rounded-full bg-black object-contain p-0.5"/> : <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-white text-[#006b45]"><Leaf size={23}/></span>}<div><p className="text-sm font-black uppercase tracking-wider">Zaytoon</p><p className="text-[9px] uppercase tracking-widest text-[#d5bd8b]">Restaurant · Admin</p></div></div><button onClick={()=>setMobileNavOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"><X size={19}/></button></div><nav className="flex flex-1 flex-col gap-1">{nav.map(item=><button key={item.id} onClick={()=>{setTab(item.id);setSearchQuery('');setError('');setMobileNavOpen(false);}} className={'flex items-center gap-3 rounded-xl border px-3 py-3.5 text-left text-xs font-semibold '+(tab===item.id?'border-white/20 bg-white text-[#006b45] shadow-lg':'border-transparent text-white/75 hover:bg-white/10')}>{item.icon}{item.label}</button>)}</nav><div className="mt-4"><button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#f4a261] px-3 py-3 text-[10px] font-black uppercase tracking-wider text-[#263449] shadow-md"><LogOut size={14}/> Logout</button></div></div></div>}
      <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-7 lg:px-8 lg:py-6">
        <header className="mb-5 rounded-2xl border border-[#e4ece7] bg-white p-4 shadow-[0_5px_22px_rgba(0,70,45,0.05)] sm:px-5">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileNavOpen(true)} aria-label="Open navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf6f1] text-[#006b45] lg:hidden"><Menu size={19}/></button>
            <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e3e9e5] bg-black shadow-sm">{siteLogoUrl ? <img src={siteLogoUrl} alt="Zaytoon Restaurant logo" className="h-full w-full rounded-full object-cover"/> : <span className="text-lg font-black text-white">Z</span>}</span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black uppercase leading-tight tracking-[.09em] text-[#08764e] sm:text-xl">ZAYTOON RESTAURANT</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[.18em] text-[#a18a5d]">Restaurant management</p>
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-full bg-[#edf6f1] px-3 py-2 sm:flex"><span className="h-2 w-2 rounded-full bg-[#20a36b]"/><span className="text-[10px] font-bold text-[#16835a]">Secure session</span></div>
          </div>
          <div className="mt-3 border-t border-[#edf2ef] pt-3">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-[#173d2d] sm:text-xl">{tab==='dashboard'?'Dashboard overview':nav.find(item=>item.id===tab)?.label}</h1>
            {tab==='dashboard' && <p className="mt-1 text-xs leading-5 text-[#7b8c82]">Manage orders, reservations and your restaurant website.</p>}
          </div>
        </header>
        {error && <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"><span>{error}</span><button onClick={()=>setError('')} className="font-black">×</button></div>}
        {tab==='dashboard' && <section className="space-y-5">
          {(() => {
            const now=new Date();
            const start=new Date(now);
            if(dashboardPeriod==='today') start.setHours(0,0,0,0);
            if(dashboardPeriod==='week'){start.setHours(0,0,0,0);start.setDate(start.getDate()-((start.getDay()+6)%7));}
            if(dashboardPeriod==='month'){start.setHours(0,0,0,0);start.setMonth(start.getMonth()-1);}
            const scoped=orders.filter(o=>new Date(o.createdAt)>=start&&o.status!=='cancelled');
            const done=scoped.filter(o=>o.status==='completed');
            const revenue=done.reduce((n,o)=>n+Number(o.total||0),0);
            const active=orders.filter(o=>!['completed','cancelled'].includes(o.status));
            const customers=new Set(orders.map(o=>o.customerPhone).filter(Boolean)).size;
            const activeCustomers=new Set(active.map(o=>o.customerPhone).filter(Boolean)).size;
            const daily=Array.from({length:7},(_,i)=>{
              const day=new Date(); day.setHours(0,0,0,0); day.setDate(day.getDate()-(6-i));
              const next=new Date(day); next.setDate(next.getDate()+1);
              return {label:day.toLocaleDateString(undefined,{weekday:'short'}),value:orders.filter(o=>new Date(o.createdAt)>=day&&new Date(o.createdAt)<next&&o.status!=='cancelled').length};
            });
            const max=Math.max(1,...daily.map(x=>x.value));
            const points=daily.map((d,i)=>`${24+i*82},${116-(d.value/max)*82}`).join(' ');
            return <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-sm font-semibold text-[#8a918d]">Hello,</p><h2 className="text-2xl font-black tracking-tight text-[#173d2d] sm:text-3xl">{username || 'Admin'}</h2><p className="mt-1 text-xs text-[#8a918d]">Here is your restaurant’s performance.</p></div>
                <select value={dashboardPeriod} onChange={e=>setDashboardPeriod(e.target.value as any)} className="rounded-full border border-[#e4e9e5] bg-white px-4 py-2.5 text-xs font-bold text-[#315744] shadow-sm"><option value="month">Last Month</option><option value="week">This Week</option><option value="today">Today</option></select>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {label:'Total Orders',value:scoped.length,sub:'Orders received',icon:<ShoppingCart size={21}/>,tone:'bg-[#edf4ee] text-[#52785d]'},
                  {label:'Total Revenue',value:'PKR '+revenue.toLocaleString(),sub:'Completed orders',icon:<span className="text-xl font-black">₨</span>,tone:'bg-[#edf4ee] text-[#52785d]'},
                  {label:'Total Customers',value:customers,sub:'Unique customers',icon:<Users size={21}/>,tone:'bg-[#edf4ee] text-[#52785d]'},
                  {label:'Active Customers',value:activeCustomers,sub:'With active orders',icon:<UserRound size={21}/>,tone:'bg-[#edf4ee] text-[#52785d]'}
                ].map(card=><article key={card.label} className="min-h-[142px] rounded-2xl border border-[#edf0ed] bg-white p-4 shadow-[0_5px_20px_rgba(22,55,38,.07)] sm:p-5">
                  <div className="flex items-start gap-3"><span className={'grid h-11 w-11 shrink-0 place-items-center rounded-full '+card.tone}>{card.icon}</span><div className="min-w-0"><p className="text-xs font-bold leading-5 text-[#414a44]">{card.label}</p><p className="mt-1 break-words text-xl font-black tracking-tight text-[#171d19] sm:text-2xl">{card.value}</p></div></div>
                  <p className="mt-4 flex items-center gap-1.5 text-[10px] text-[#8b968f]"><TrendingUp size={13}/> {card.sub}</p>
                </article>)}
              </div>
              <div className="rounded-2xl border border-[#edf0ed] bg-white p-4 shadow-[0_5px_20px_rgba(22,55,38,.06)] sm:p-5">
                <div className="mb-2"><h3 className="text-base font-bold text-[#202923]">Overall Performance</h3><p className="mt-1 text-[10px] text-[#9aa39d]">Daily order activity · Last 7 days</p></div>
                <div className="h-48 w-full">
                  <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Daily order activity chart">
                    <defs><linearGradient id="ordersArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5c896b" stopOpacity=".18"/><stop offset="100%" stopColor="#5c896b" stopOpacity="0"/></linearGradient></defs>
                    <polygon points={`24,150 ${points} 516,150`} fill="url(#ordersArea)"/>
                    <polyline points={points} fill="none" stroke="#6f9079" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="grid grid-cols-7 text-center">{daily.map(d=><div key={d.label}><p className="text-[10px] font-semibold text-[#849087]">{d.label}</p><p className="mt-1 text-[10px] text-[#a0aaa3]">{d.value}</p></div>)}</div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#edf0ed] bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Recent Orders</h3><button onClick={()=>setTab('orders')} className="text-xs font-bold text-[#08764e]">View all →</button></div>{active.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,4).map(o=><div key={o.reference} className="flex justify-between gap-3 border-t border-[#f0f2f0] py-3"><div><p className="text-xs font-bold">{o.customerName}</p><p className="mt-1 text-[10px] text-[#89948d]">{o.reference} · {pretty(o.status)}</p></div><p className="text-xs font-black text-[#08764e]">PKR {Number(o.total).toLocaleString()}</p></div>)}{!active.length&&<p className="py-4 text-center text-xs text-[#89948d]">No active orders.</p>}</div>
                <div className="rounded-2xl border border-[#edf0ed] bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Menu Items</h3><button onClick={()=>setTab('menu')} className="text-xs font-bold text-[#08764e]">Manage →</button></div><div className="grid grid-cols-2 gap-3">{menuPreviewItems.slice(0,4).map(p=><div key={p.id} className="overflow-hidden rounded-xl border border-[#edf0ed]"><img src={p.image} alt={p.name} className="h-20 w-full object-cover"/><div className="p-2"><p className="truncate text-[11px] font-bold">{p.name}</p><p className="mt-1 text-[11px] font-black text-[#08764e]">PKR {Number(p.price||0).toLocaleString()}</p></div></div>)}</div>{!menuPreviewItems.length&&<p className="py-4 text-center text-xs text-[#89948d]">Menu items loading or not added yet.</p>}</div>
              </div>
            </>;
          })()}
        </section>}
        {(tab==='orders' || tab==='completed') && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by order ID, customer or phone…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{(tab==='completed' ? completedOrders : filteredOrders).length ? (tab==='completed' ? completedOrders : filteredOrders).map(order=><article key={order.reference} className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{order.reference} · {order.customerName}</p><p className="mt-1 text-[10px] text-gray-500">{order.customerPhone} · {dateTime(order.createdAt)}</p></div><p className="text-lg font-black">PKR {order.total.toLocaleString()}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Type:</strong> {pretty(order.fulfilmentMethod)}</p><p><strong>Payment:</strong> {pretty(order.paymentMethod)}</p>{order.deliveryAddress && <p className="sm:col-span-2"><strong>Address:</strong> {order.deliveryAddress}</p>}<p className="sm:col-span-2"><strong>Items:</strong> {order.items.map(item=>item.quantity+' × '+item.itemName).join(', ')}</p>{order.instructions && <p className="sm:col-span-2"><strong>Notes:</strong> {order.instructions}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Order status</label><select value={order.status} onChange={e=>updateOrder(order.reference,e.target.value)} className="max-w-56 rounded-xl border border-[#e8e5dd] bg-[#fbfaf7] px-3 py-2 text-xs font-bold">{orderStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-8 text-center text-sm text-gray-500">{tab==='completed'?'No completed orders yet.':'No active orders yet.'}</div>}</section>}
        {tab==='reservations' && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by guest, booking ID or phone…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{filteredReservations.length ? filteredReservations.map(item=><article key={item.reference} className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black">{item.fullName} · {item.reference}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-sm font-black">{item.date} · {item.timeSlot}</p></div><div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2"><p><strong>Guests:</strong> {item.guests}</p><p><strong>Seating:</strong> {pretty(item.seatingPreference)}</p>{item.specialRequest && <p className="sm:col-span-2"><strong>Request:</strong> {item.specialRequest}</p>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-[10px] font-bold uppercase text-gray-500">Status</label><select value={item.status} onChange={e=>updateReservation(item.reference,e.target.value)} className="max-w-56 rounded-xl border border-[#e8e5dd] bg-[#fbfaf7] px-3 py-2 text-xs font-bold">{reservationStatuses.map(status=><option key={status} value={status}>{pretty(status)}</option>)}</select></div></article>) : <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-8 text-center text-sm text-gray-500">No reservations yet.</div>}</section>}
        {tab==='messages' && <section className="space-y-3"><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search customer messages…" className="w-full rounded-xl border border-[#e8e5dd] bg-white px-4 py-3 text-xs outline-none focus:border-[#9a8050] sm:max-w-sm"/>{filteredMessages.length ? filteredMessages.map(item=><article key={item.id} className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-4 sm:p-5"><div className="flex flex-wrap justify-between gap-2"><div><p className="text-sm font-black">{item.fullName}</p><p className="mt-1 text-[10px] text-gray-500">{item.phone}{item.email?' · '+item.email:''}</p></div><p className="text-[10px] text-gray-400">{dateTime(item.createdAt)}</p></div><p className="mt-3 text-xs font-bold">{item.subject}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">{item.message}</p></article>) : <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-8 text-center text-sm text-gray-500">No messages yet.</div>}</section>}
        {tab==='staff' && <section className="space-y-4"><div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-black text-[#173d2d]">Staff & payroll</h2><p className="mt-1 text-xs text-[#819188]">Track worker details and monthly salary payments.</p></div><button onClick={createContent} className="rounded-xl bg-[#006b45] px-4 py-2.5 text-xs font-bold text-white">+ Add staff</button></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{contentRows.map(p=><article key={p.id} className="rounded-2xl border border-[#e1ebe5] bg-white p-4 shadow-sm"><div className="flex justify-between gap-2"><div><h3 className="text-sm font-black">{p.name}</h3><p className="mt-1 text-xs text-[#819188]">{p.role||'Worker'} · {p.phone||'No phone'}</p></div><span className={'rounded-full px-2 py-1 text-[9px] font-bold '+(p.salaryPaid?'bg-[#e6f4ec] text-[#08764e]':'bg-amber-50 text-amber-700')}>{p.salaryPaid?'Paid':'Unpaid'}</span></div><p className="mt-5 text-xl font-black text-[#08764e]">PKR {Number(p.monthlySalary||0).toLocaleString()}<span className="text-[10px] font-medium text-[#819188]"> / month</span></p><div className="mt-4 flex gap-2"><button onClick={()=>chooseContent(p)} className="flex-1 rounded-lg border border-[#dce9e1] py-2 text-xs font-bold text-[#08764e]">Edit</button><button onClick={async()=>{const data={...p,salaryPaid:!p.salaryPaid};try{await request('/content/staff/'+encodeURIComponent(p.id),{method:'PUT',body:JSON.stringify({data})});const result=await request('/content/staff');setContentRows(result.data||[]);}catch(err){setError(err instanceof Error?err.message:'Salary update failed.');}}} className="flex-1 rounded-lg bg-[#edf6f1] py-2 text-xs font-bold text-[#08764e]">{p.salaryPaid?'Mark unpaid':'Mark paid'}</button></div></article>)}</div>{!contentRows.length&&<p className="rounded-xl border border-dashed border-[#dce9e1] p-8 text-center text-xs text-[#819188]">No workers added yet.</p>}</section>}
        {contentCollections[tab] && tab !== 'staff' && <section className="max-w-3xl">
          <div className="rounded-2xl border border-[#dce5dc] bg-[#fbfcf8] shadow-[0_10px_28px_rgba(25,56,45,0.07)] p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black text-[#173d2d]">{contentTitles[tab]}</h2><p className="mt-1 text-[11px] font-normal text-[#819188]">{tab==='menu'?'Add food, change prices, update photos or mark dishes unavailable.':tab==='categories'?'Organize the sections customers see on your menu.':tab==='deals'?'Create offers and discounts for your customers.':tab==='gallery'?'Manage the photos shown on your restaurant website.':tab==='staff'?'Add workers and keep track of monthly salary payments.':'Update your restaurant website details.'}</p></div>{tab !== 'settings' && <button onClick={createContent} className="flex items-center gap-2 rounded-xl bg-[#006b45] px-4 py-3 text-xs font-black text-white shadow-sm"><Plus size={15}/> {tab==='menu'?'Add food item':tab==='staff'?'Add worker':tab==='deals'?'Add new deal':'Add new'}</button>}</div>
            <div className="grid max-h-[72vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {tab === 'settings' ? <article className="col-span-full overflow-hidden rounded-2xl border border-[#e2ebe5] bg-white shadow-sm">
                <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#e5ece7] bg-[#f4f8f5]">{(contentRows[0]?.logoUrl || siteLogoUrl) ? <img src={contentRows[0]?.logoUrl || siteLogoUrl} alt="Zaytoon logo preview" className="h-full w-full object-contain"/> : <Leaf size={30} className="text-[#08764e]"/>}</div>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-black text-[#173d2d]">{contentRows[0]?.brandName || 'Zaytoon Restaurant'}</h3><p className="mt-1 text-xs text-[#819188]">Restaurant name, logo and website settings</p><p className="mt-2 text-[10px] font-semibold text-[#08764e]">{contentRows.length ? 'Settings record loaded' : 'Setup required'}</p></div>
                  <button onClick={() => chooseContent(contentRows[0] || { id: 'main', brandName: 'ZAYTOON RESTAURANT', logoUrl: siteLogoUrl || '/images/zaytoon-logo.jpg' })} className="w-full rounded-xl bg-[#006b45] px-4 py-3 text-xs font-bold text-white sm:w-auto"><Pencil size={13} className="mr-2 inline"/> Edit website settings</button>
                </div>
              </article> :
                contentRows.map((row) => <article key={row.id} className="overflow-hidden rounded-2xl border border-[#e2ebe5] bg-white shadow-[0_4px_16px_rgba(20,70,45,0.05)]"><div className="flex min-h-28 items-center justify-center overflow-hidden bg-[#f4f8f5]">{row.image ? <img src={row.image} alt={row.name || row.title || 'Content preview'} className="h-36 w-full object-cover"/> : <div className="flex flex-col items-center gap-2 py-6 text-[#91a99b]">{tab==='categories'?<Tags size={28}/>:tab==='deals'?<Percent size={28}/>:<Images size={28}/>}<span className="text-[10px] font-semibold uppercase tracking-wider">{pretty(tab)} preview</span></div>}</div><div className="p-3.5"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate text-sm font-black text-[#183c2d]">{row.name || row.title || row.id}</h3><p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-[#819188]">{row.description || row.shortDescription || row.caption || row.category || 'Manage this item on your restaurant website.'}</p></div>{tab==='menu'&&<span className="shrink-0 text-xs font-black text-[#08764e]">PKR {Number(row.price||0).toLocaleString()}</span>}{tab==='deals'&&<span className="shrink-0 text-xs font-black text-[#08764e]">PKR {Number(row.offerPrice||0).toLocaleString()}</span>}</div><div className="mt-3 flex items-center justify-between gap-2 border-t border-[#edf2ef] pt-3"><span className="text-[9px] font-semibold text-[#82958a]">{tab==='menu'?(row.isAvailable?'Available':'Unavailable'):tab==='deals'?(row.isActive?'Active deal':'Inactive'):tab==='gallery'?'Gallery image':tab==='categories'?'Menu category':'Website content'}</span><button onClick={()=>chooseContent(row)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#08764e] px-3 py-2 text-[10px] font-bold text-white"><Pencil size={12}/> Edit</button></div></div></article>)}
              {!contentRows.length && tab !== 'settings' && <p className="py-5 text-center text-xs text-gray-500">No items yet. Use the “Add” button above to create your first one.</p>}{tab === 'settings' && !contentRows.length && <div className="rounded-xl border border-dashed border-[#dce9e1] bg-white p-5 text-center"><p className="text-sm font-bold text-[#173d2d]">Website settings are not configured yet</p><p className="mt-1 text-xs text-[#819188]">Open the settings editor to add your restaurant name and logo.</p></div>}
            </div>
          </div>
          {editModalOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-3 sm:p-6"><div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#dce5ef] bg-white p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black">{tab === 'settings' ? 'Edit Website Settings' : contentSelection === '__new__' ? 'Create Record' : 'Edit Record'}</h2><p className="mt-1 text-[10px] text-gray-500">Fill in the details below. Fields are explained in simple words.</p></div><div className="flex items-center gap-2"><button onClick={saveContent} disabled={!contentJson.trim() || busy} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#203f58] to-[#287b72] px-4 py-2.5 text-[10px] font-black text-white disabled:opacity-40"><Save size={14}/> Save changes</button>{tab !== 'settings' && contentSelection !== '__new__' && <button onClick={deleteContent} className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-[10px] font-bold text-red-600"><Trash2 size={14}/> Delete</button>}<button onClick={()=>setEditModalOpen(false)} aria-label="Close editor" className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100"><X size={17}/></button></div></div>
            {contentJson && Object.keys(parsedContentDraft).length > 0 ? <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(parsedContentDraft).filter(([key]) => key !== 'id' && key !== 'slug' && key !== 'categoryId').map(([key, value]) => {
                const fieldLabels: Record<string, string> = {
                  name: tab === 'staff' ? 'Staff Member Name' : tab === 'menu' ? 'Food Item Name' : tab === 'categories' ? 'Category Name' : 'Name', title: tab === 'deals' ? 'Deal Name' : tab === 'gallery' ? 'Photo Title' : 'Title', role: 'Job Role', phone: 'Phone Number', monthlySalary: 'Monthly Salary (PKR)', salaryPaid: 'Salary Paid This Month', joiningDate: 'Joining Date',
                  description: tab === 'staff' ? 'Staff Notes (Optional)' : tab === 'menu' ? 'Food Description' : 'Description', price: 'Price (PKR)', image: tab === 'gallery' ? 'Gallery Photo' : 'Food Image URL',
                  preparationTime: 'Preparation Time', spiciness: 'Spice Level', tags: 'Tags / Search Keywords',
                  isDemoItem: 'Demo Content', isFeatured: 'Featured on Website',
                  isAvailable: 'Available for Ordering', categoryName: 'Menu Category',
                  categoryId: 'Category Reference', logoUrl: 'Restaurant Logo URL', reservationTimeSlots: 'Reservation Time Slots', reservationMaxTablesPerSlot: 'Tables Available Per Time Slot', reservationMaxGuests: 'Maximum Guests Per Booking', reservationSeatingOptions: 'Available Seating Areas',
                };
                const fieldHelp: Record<string, string> = {
                  name: tab === 'staff' ? 'Worker ka poora naam likhein. Example: Ali Ahmed.' : tab === 'menu' ? 'Customer ko menu mein yahi dish ka naam nazar aayega. Example: Chicken Malai Handi.' : tab === 'categories' ? 'Menu section ka naam likhein. Example: BBQ, Karahi & Handi.' : 'Is item ka naam likhein.',
                  
                  description: tab === 'staff' ? 'Optional note about this staff member.' : 'Dish ya item ke baare mein 1–2 simple lines likhein.',
                  price: 'Sirf number likhein, currency PKR automatically show hoti hai. Example: 1850.',
                  image: 'Photo ka direct public image URL paste karein. Example: https://example.com/photo.jpg',
                  preparationTime: 'Order tayyar hone ka estimated time. Example: 25 mins.',
                  spiciness: 'mild, medium ya hot select karein.',
                  tags: 'Har keyword alag line mein likhein. Example: Boneless, Popular, BBQ.',
                  isDemoItem: 'Sample/demo product ho to ON rakhein; real menu item ke liye OFF.',
                  isFeatured: 'ON karne se product website ke featured section mein highlight ho sakta hai.',
                  isAvailable: 'ON = customer order kar sakta hai. OFF = product unavailable hoga.',
                  categoryName: 'Woh menu section choose karein jahan product show hona chahiye.',
                  reservationTimeSlots: 'Har time alag line par HH:MM format mein likhein. Example: 18:30',
                  reservationMaxTablesPerSlot: 'Har time slot par maximum kitni table bookings accept hongi.',
                  reservationMaxGuests: 'Ek reservation mein maximum guests ki tadaad.',
                  reservationSeatingOptions: 'Har seating option alag line par. IDs: indoor_family_hall, outdoor_riverside, executive_lounge, any.',
                  logoUrl: 'Paste a direct image URL here. Save to update the website header, footer and admin sidebar.',
                };
                const fieldPlaceholders: Record<string, string> = {
                  name: tab === 'staff' ? 'e.g. Ali Ahmed' : tab === 'menu' ? 'e.g. Chicken Malai Handi' : tab === 'categories' ? 'e.g. BBQ' : 'Enter a name',
                  description: 'Describe the dish in 1–2 lines…',
                  price: 'e.g. 1850',
                  image: 'https://example.com/food-photo.jpg',
                  preparationTime: 'e.g. 25 mins',
                };
                const isMenuSwitch = ['isDemoItem', 'isFeatured', 'isAvailable', 'salaryPaid'].includes(key);
                return <label key={key} className="block min-w-0 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  {fieldLabels[key] || pretty(key)}
                  {fieldHelp[key] && <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-gray-400">{fieldHelp[key]}</span>}
                  {isMenuSwitch ? <button type="button" role="switch" aria-checked={Boolean(value)} onClick={()=>updateDraftField(key,!value)} className={'mt-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left normal-case transition '+(value?'border-[#c9d9ce] bg-[#edf4ef]':'border-gray-200 bg-[#fafafa]')}>
                    <span><span className="block text-xs font-bold text-[#263b30]">{key==='salaryPaid'?(value?'Salary paid':'Salary unpaid'):key==='isDemoItem'?(value?'Demo item':'Regular menu item'):key==='isFeatured'?(value?'Featured item':'Not featured'):value?'Available to order':'Currently unavailable'}</span><span className="mt-1 block text-[10px] font-normal text-gray-500">{key==='salaryPaid'?'Mark whether this month’s salary has been paid.':key==='isDemoItem'?'Controls whether this is marked as sample content.':key==='isFeatured'?'Controls featured placement on the website.':'Controls customer ordering availability.'}</span></span>
                    <span className={'relative h-6 w-11 shrink-0 rounded-full transition '+(value?'bg-[#315744]':'bg-gray-300')}><span className={'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition '+(value?'left-6':'left-1')}/></span>
                  </button> :
                  key === 'image' ? <><input value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} placeholder="/images/dish.jpg or https://..." className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-3 py-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/>{String(value || '').trim() && <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-2"><img src={String(value)} alt="Product preview" className="h-44 w-full rounded-lg object-cover"/><p className="mt-2 text-[10px] font-medium normal-case text-gray-500">Live product image preview</p></div>}</> :
                  key === 'logoUrl' ? <><input value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} placeholder="/images/zaytoon-logo.jpg or https://..." className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-3 py-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/>{String(value || '').trim() && <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"><img src={String(value)} alt="Logo preview" className="h-14 w-14 rounded-lg object-contain"/><span className="text-[10px] font-medium normal-case text-gray-500">Logo preview</span></div>}</> :
                  key === 'categoryName' ? <select value={String(value ?? '')} onChange={(e)=>{const selected=categoryOptions.find((item:any)=>item.name===e.target.value);updateDraftField('categoryName',e.target.value);if(selected?.id)updateDraftField('categoryId',selected.id);}} className="mt-2 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-3 py-3 text-xs font-semibold normal-case text-gray-800 outline-none focus:border-[#9a8050]">
                    <option value="">Select a category</option>{categoryOptions.map((item:any)=><option key={item.id} value={item.name}>{item.name}</option>)}
                    {!categoryOptions.some((item:any)=>item.name===value) && value ? <option value={String(value)}>{String(value)}</option> : null}
                  </select> :
                  typeof value === 'boolean' ? <span className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-xs font-semibold normal-case text-gray-700"><input type="checkbox" checked={value} onChange={(e)=>updateDraftField(key,e.target.checked)} disabled={key==='id'}/> {value ? 'Enabled' : 'Disabled'}</span> :
                  Array.isArray(value) ? <textarea value={value.join('\n')} onChange={(e)=>updateDraftField(key,e.target.value.split('\n').map((v)=>v.trim()).filter(Boolean))} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/> :
                  typeof value === 'number' ? <input type="number" min="0" value={value} onChange={(e)=>updateDraftField(key,Number(e.target.value))} placeholder={fieldPlaceholders[key] || ''} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/> :
                  (String(value).length > 110 || /description|caption|notice|history|address|message/i.test(key)) ? <textarea value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} rows={4} disabled={key==='id' && contentSelection!=='__new__'} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/> :
                  <input value={String(value ?? '')} onChange={(e)=>updateDraftField(key,e.target.value)} disabled={key==='id'} placeholder={fieldPlaceholders[key] || ''} className="mt-2 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 text-xs font-normal normal-case text-gray-800 outline-none focus:border-[#9a8050]"/>
                  }
                </label>;
              })}
            </div> : <p className="rounded-lg bg-gray-50 p-6 text-center text-xs text-gray-500">Select a record or press New to start editing.</p>}
            <details className="mt-4"><summary className="cursor-pointer text-[10px] font-bold text-gray-500">Advanced: view / edit raw JSON</summary><textarea value={contentJson} onChange={(e)=>setContentJson(e.target.value)} spellCheck={false} className="mt-2 min-h-48 w-full rounded-lg border border-gray-200 bg-[#fafafa] p-3 font-mono text-[10px] leading-5 outline-none focus:border-[#D71920]"/></details>
            <p className="mt-2 text-[10px] text-gray-400">Tip: Only change the details you understand. Leave other fields as they are. You can close this window without saving to cancel.</p>
          </div></div>}
        </section>}
        {busy && <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Refreshing data…</p>}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-[#edf0ed] bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-5px_22px_rgba(20,50,35,.08)] backdrop-blur lg:hidden">
        {[{id:'dashboard' as Tab,label:'Dashboard',icon:<LayoutDashboard size={21}/>},{id:'orders' as Tab,label:'Orders',icon:<ClipboardList size={21}/>},{id:'menu' as Tab,label:'Items',icon:<Utensils size={21}/>},{id:'settings' as Tab,label:'Profile',icon:<UserRound size={21}/>}].map(item=><button key={item.id} onClick={()=>{setTab(item.id);setSearchQuery('');setError('');window.scrollTo({top:0,behavior:'smooth'});}} className={'flex flex-col items-center gap-1 py-1 text-[10px] font-semibold '+(tab===item.id?'text-[#315744]':'text-[#8d9690]')}>{item.icon}{item.label}</button>)}
      </nav>
    </div>
  );
};
