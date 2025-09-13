import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = "https://backkkkkkk-aqkn.onrender.com/doctor";

const DoctorForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [fetchSpecialization, setFetchSpecialization] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [status, setStatus] = useState("");

  // ---------------- Register Doctor ----------------
  const handleRegister = async () => {
    if (!name || !email || !specialization || !phone) return alert("Please fill all fields");
    try {
      const res = await fetch(`${API_URL}-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, specialization, phone }),
      });
      const data = await res.json();
      if (data.status === "success") setStatus(`✅ Doctor registered successfully! ID: ${data.doctor_id}`);
      else setStatus(`❌ ${data.error || "Error registering doctor"}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Network error.");
    }
  };

  // ---------------- Fetch Emergency Doctor ----------------
  const fetchDoctor = async () => {
    if (!fetchSpecialization) return alert("Enter specialization");
    try {
      const res = await fetch(`${API_URL}/emergency-doctor/${fetchSpecialization}`);
      const data = await res.json();
      if (data.status === "success") setDoctorInfo(data);
      else setDoctorInfo(null);
      setStatus(data.error || "");
    } catch (err) {
      console.error(err);
      setStatus("❌ Network error.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-card/70 backdrop-blur-md rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Doctor Management</h2>

      {/* Register Doctor */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Register a New Doctor</h3>
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <Button className="w-full mt-2" onClick={handleRegister}>Register Doctor</Button>
      </Card>

      {/* Fetch Emergency Doctor */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold">Emergency Doctor</h3>
        <Input placeholder="Specialization" value={fetchSpecialization} onChange={e => setFetchSpecialization(e.target.value)} />
        <Button className="w-full mt-2" onClick={fetchDoctor}>Fetch Doctor</Button>

        {doctorInfo && (
          <div className="mt-3 p-2 bg-green-100 rounded">
            <p><strong>Name:</strong> {doctorInfo.doctor_name}</p>
            <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
            <p><strong>Phone:</strong> {doctorInfo.doctor_contact}</p>
          </div>
        )}
      </Card>

      {status && <p className="text-center text-sm text-red-600">{status}</p>}
    </div>
  );
};

export default DoctorForm;
