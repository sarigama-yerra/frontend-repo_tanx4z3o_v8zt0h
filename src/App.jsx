import { useEffect, useMemo, useState } from "react";
import BeachHeader from "./components/BeachHeader";
import BeachMap from "./components/BeachMap";
import BookingDrawer from "./components/BookingDrawer";

function formatDate(d){
  const pad=(n)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function App() {
  const base = import.meta.env.VITE_BACKEND_URL;
  const [club, setClub] = useState(null);
  const [umbrellas, setUmbrellas] = useState([]);
  const [availability, setAvailability] = useState({});
  const [date, setDate] = useState(formatDate(new Date()));
  const [slot, setSlot] = useState("Full Day");

  const [drawer, setDrawer] = useState({ open: false, umbrella: null });

  useEffect(()=>{
    const load = async () => {
      const c = await fetch(`${base}/api/club`).then(r=>r.json());
      setClub(c);
      const map = await fetch(`${base}/api/map`).then(r=>r.json());
      setUmbrellas(map.umbrellas || []);
    };
    load();
  },[]);

  useEffect(()=>{
    const load = async () => {
      const res = await fetch(`${base}/api/availability?booking_date=${date}&slot=${encodeURIComponent(slot)}`).then(r=>r.json());
      const dict = {};
      (res.availability||[]).forEach(a=>{dict[a.umbrella_id]=a.status});
      setAvailability(dict);
    }
    if(date && slot) load();
  },[date, slot]);

  const onBook = async ({ services, guests, name, email }) => {
    const payload = {
      umbrella_id: drawer.umbrella._id,
      umbrella_number: drawer.umbrella.number,
      booking_date: date,
      slot,
      guests,
      services,
      customer_name: name,
      customer_email: email,
    };
    const res = await fetch(`${base}/api/book`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json();
    if(data?.status === 'confirmed'){
      alert('Booking confirmed!');
      setDrawer({open:false, umbrella:null});
      // refresh availability
      const res2 = await fetch(`${base}/api/availability?booking_date=${date}&slot=${encodeURIComponent(slot)}`).then(r=>r.json());
      const dict = {};
      (res2.availability||[]).forEach(a=>{dict[a.umbrella_id]=a.status});
      setAvailability(dict);
    } else {
      alert(data?.detail || 'Booking failed');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4 space-y-4">
        <BeachHeader club={club} />

        {/* date & slot */}
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="flex-1 border rounded-xl px-3 py-2" />
          <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="flex-1 border rounded-xl px-3 py-2">
            {(club?.default_timeslots || ["Full Day"]).map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <BeachMap
          umbrellas={umbrellas}
          availability={availability}
          onSelect={(u)=> setDrawer({ open:true, umbrella:u })}
        />
      </div>

      <BookingDrawer
        open={drawer.open}
        onClose={()=> setDrawer({open:false, umbrella:null})}
        club={club}
        umbrella={drawer.umbrella}
        date={date}
        slot={slot}
        onConfirm={onBook}
      />
    </div>
  )
}

export default App
