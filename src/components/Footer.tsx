import React from 'react';
import { MapPin, Phone, Mail, ArrowRight, UserRound } from 'lucide-react';
interface FooterProps { navigate: (path: string) => void; }
export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [logoUrl, setLogoUrl] = React.useState('');
  React.useEffect(() => { fetch('/api/v1/site-settings/public').then(r => r.json()).then(result => setLogoUrl(String(result.data?.logoUrl || ''))).catch(() => setLogoUrl('')); }, []);
  const go=(path:string)=>{navigate(path);window.scrollTo({top:0,behavior:'smooth'});};
  return <footer className="bg-[#171717] text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
      <div className="sm:col-span-2"><div className="flex items-center gap-3">{settings.logoUrl ? <img src={settings.logoUrl} alt="Zaytoon logo" className="h-11 w-11 rounded-full object-contain"/> : <span className="grid h-11 w-11 place-items-center rounded-full bg-[#D71920] text-xl font-black italic">Z</span>}<span className="text-2xl font-black uppercase">{settings.brandName}</span></div><p className="mt-5 max-w-md text-sm leading-7 text-white/65">Good food brings people together. Explore the menu, discover current deals and plan your next visit.</p><button onClick={()=>go('/menu')} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#D71920] px-5 py-3 text-xs font-black uppercase">Explore menu <ArrowRight size={15}/></button></div>
      <div><h3 className="mb-5 text-xs font-black uppercase tracking-widest text-[#F4C542]">Explore</h3><div className="space-y-3 text-sm text-white/70">{[['Home','/'],['Menu','/menu'],['Deals','/deals'],['About','/about'],['Gallery','/gallery']].map(([label,path])=><button key={path} onClick={()=>go(path)} className="block hover:text-white">{label}</button>)}</div></div>
      <div><h3 className="mb-5 text-xs font-black uppercase tracking-widest text-[#F4C542]">Customer & contact</h3><div className="space-y-4 text-sm text-white/70"><button onClick={()=>go('/account')} className="flex items-center gap-3 hover:text-white"><UserRound size={17} className="text-[#F4C542]"/>My Account</button><p className="flex items-start gap-3"><MapPin size={17} className="shrink-0 text-[#F4C542]"/>{settings.address}</p><a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-white"><Phone size={17} className="text-[#F4C542]"/>{settings.phone}</a><a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-white"><Mail size={17} className="text-[#F4C542]"/>Email us</a></div></div>
    </div><div className="border-t border-white/10 px-5 py-5 text-center text-[10px] font-bold uppercase tracking-widest text-white/40">© {new Date().getFullYear()} Zaytoon Restaurant. All rights reserved.</div>
  </footer>;
};
