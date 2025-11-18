import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export default function BookingDrawer({ open, onClose, club, umbrella, date, slot, onConfirm }) {
  const [services, setServices] = useState([]);
  const [guests, setGuests] = useState(2);
  const [quote, setQuote] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open || !umbrella) return;
    // Reset
    setServices([]);
    setGuests(2);
    setName("");
    setEmail("");
  }, [open, umbrella]);

  useEffect(() => {
    if (!umbrella) return;
    const fetchQuote = async () => {
      const base = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${base}/api/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ umbrella_id: umbrella._id, slot, services }),
      });
      const data = await res.json();
      setQuote(data);
    };
    fetchQuote();
  }, [umbrella, slot, services]);

  const toggleService = (key) => {
    setServices((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-slate-500">Umbrella</div>
            <div className="text-lg font-semibold">#{umbrella?.number}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="p-2 rounded-lg bg-slate-50 border">Date: {date}</div>
          <div className="p-2 rounded-lg bg-slate-50 border">Slot: {slot}</div>
          <div className="p-2 rounded-lg bg-slate-50 border">Sunbeds: {umbrella?.sunbeds_included}</div>
          <div className="p-2 rounded-lg bg-slate-50 border">Guests: 
            <select className="ml-1" value={guests} onChange={(e)=>setGuests(parseInt(e.target.value))}>
              {[1,2,3,4,5,6,7,8].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <div className="font-medium mb-2">Extras</div>
          <div className="flex gap-2 flex-wrap">
            {(club?.services||[]).map((s)=> (
              <button key={s.key} onClick={()=>toggleService(s.key)}
                className={`px-3 py-2 border rounded-full text-sm ${services.includes(s.key)?'bg-slate-900 text-white border-slate-900':'bg-white'}`}>
                {s.name} • {s.price.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="w-full border rounded-lg px-3 py-2" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="text-slate-500">Total</div>
            <div className="text-xl font-semibold">{quote? quote.total.toFixed(2): '—'} EUR</div>
          </div>
          <button
            onClick={() => onConfirm && onConfirm({ services, guests, name, email, quote })}
            className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold active:scale-95"
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
