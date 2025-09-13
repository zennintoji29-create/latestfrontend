import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = "https://backkkkkkk-aqkn.onrender.com/vaccine";

interface Vaccine {
  id: string;
  vaccine_name: string;
  date: string;
}

const VaccineForm = () => {
  const [userId, setUserId] = useState("user_123"); // replace dynamically if login implemented
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");
  const [status, setStatus] = useState("");
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);

  const fetchVaccines = async () => {
    try {
      const res = await fetch(`${API_URL}/get-vaccines/${userId}`);
      const data = await res.json();
      if (data.status === "success") setVaccines(data.vaccines);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleSubmit = async () => {
    if (!vaccineName || !vaccineDate) return alert("Fill all fields");
    try {
      const res = await fetch(`${API_URL}/register-vaccine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, vaccine_name: vaccineName, date: vaccineDate }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus(`✅ ${data.message}`);
        setVaccineName("");
        setVaccineDate("");
        fetchVaccines();
      } else setStatus("❌ Failed to schedule vaccine");
    } catch (err) {
      console.error(err);
      setStatus("❌ Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card/70 backdrop-blur-md rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Vaccine Scheduler</h2>
      <Input placeholder="Vaccine Name" value={vaccineName} onChange={e => setVaccineName(e.target.value)} />
      <Input type="date" value={vaccineDate} onChange={e => setVaccineDate(e.target.value)} />
      <Button onClick={handleSubmit} className="w-full">Schedule Vaccine</Button>
      {status && <p className="text-green-500 font-medium">{status}</p>}

      <h3 className="text-xl font-semibold mt-4">Upcoming Vaccines</h3>
      {vaccines.length === 0 && <p>No vaccines scheduled yet.</p>}
      {vaccines.map(v => (
        <Card key={v.id} className="p-3 mb-2 flex justify-between items-center">
          <span>{v.vaccine_name}</span>
          <span>{v.date}</span>
        </Card>
      ))}
    </div>
  );
};

export default VaccineForm;
