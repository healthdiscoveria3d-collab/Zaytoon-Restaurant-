import React, { useState } from 'react';
import { UserRound, LockKeyhole, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { TrackOrderPage } from './TrackOrderPage.tsx';

interface AccountPageProps { navigate: (path: string) => void; initialRef?: string; }

export const AccountPage: React.FC<AccountPageProps> = ({ navigate, initialRef }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
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
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#D71920] to-[#a90f18] text-white shadow-lg shadow-red-900/15"><UserRound size={22}/></span>
            <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-[#b18a43]">Zaytoon customer portal</p><p className="mt-1 text-xs font-medium text-[#777064]">One place for your account and orders</p></div>
          </div>
          <h1 className="relative mt-6 text-3xl font-black uppercase tracking-tight text-[#20372d] sm:text-5xl">My Account<span className="text-[#D71920]">.</span></h1>
          <p className="relative mt-3 max-w-xl text-sm leading-6 text-[#746f65]">Sign in or create an account, then manage and track your Zaytoon orders here.</p>
          <div className="relative mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#D71920] to-[#F4C542]"/>
        </section>

        <section className="mx-auto mt-7 max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50 p-1.5">
            <button type="button" onClick={() => setActiveTab('login')} className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${activeTab === 'login' ? 'bg-[#D71920] text-white shadow-sm' : 'text-gray-500 hover:text-[#171717]'}`}>Login</button>
            <button type="button" onClick={() => setActiveTab('signup')} className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${activeTab === 'signup' ? 'bg-[#D71920] text-white shadow-sm' : 'text-gray-500 hover:text-[#171717]'}`}>Create Account</button>
          </div>
          <div className="p-6 sm:p-8">
            {activeTab === 'login' ? (
              <>
                <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#D71920]"><LockKeyhole size={19}/></span><div><h2 className="font-black">Welcome back</h2><p className="text-xs text-gray-500">Login to your Zaytoon account</p></div></div>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <label className="block text-xs font-semibold text-gray-600">Email address<input type="email" autoComplete="email" placeholder="you@example.com" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]" /></label>
                  <label className="block text-xs font-semibold text-gray-600">Password<input type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]" /></label>
                  <button type="button" disabled className="w-full rounded-full bg-gray-300 px-5 py-3 text-xs font-black uppercase tracking-wide text-gray-600">Login activation pending</button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#D71920]"><UserPlus size={19}/></span><div><h2 className="font-black">Join Zaytoon</h2><p className="text-xs text-gray-500">Create your customer account</p></div></div>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <label className="block text-xs font-semibold text-gray-600">Full name<input type="text" autoComplete="name" placeholder="Your full name" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]" /></label>
                  <label className="block text-xs font-semibold text-gray-600">Email address<input type="email" autoComplete="email" placeholder="you@example.com" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]" /></label>
                  <label className="block text-xs font-semibold text-gray-600">Password<input type="password" autoComplete="new-password" placeholder="Create a password" className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#D71920]" /></label>
                  <button type="button" disabled className="w-full rounded-full bg-gray-300 px-5 py-3 text-xs font-black uppercase tracking-wide text-gray-600">Sign up activation pending</button>
                </form>
              </>
            )}
          </div>
        </section>

        <div className="mx-auto mt-5 flex max-w-xl items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
          <ShieldCheck size={18} className="mt-0.5 shrink-0"/>
          <p><strong>Account setup is not active yet.</strong> Secure login and sign-up need a persistent database connection. The forms are shown here, but they will not accept credentials until that backend is connected.</p>
        </div>

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