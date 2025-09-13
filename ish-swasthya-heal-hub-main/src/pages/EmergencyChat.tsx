import { useState, useEffect } from "react";
import { Button, Select } from "@/components/ui";
import { toast } from "sonner";

const API_URL = "https://backkkkkkk-aqkn.onrender.com/doctor";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
}

const specialties = [
  "General",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "ENT",
  "Other"
];

const EmergencyChat = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("General");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);

  const getDoctor = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/get-doctor?specialty=${selectedSpecialty}`);
      const data = await res.json();
      if (res.ok) {
        setDoctor(data.doctor);
      } else {
        toast.error(data.error || "No doctors available for this specialty.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch doctor. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactDoctor = () => {
    if (!doctor) return;
    // WhatsApp link
    const phone = doctor.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hello Dr. ${doctor.name}, I need urgent consultation regarding my health.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card/70 backdrop-blur-md rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Emergency Health Assistance</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Specialty:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <Button onClick={getDoctor} disabled={loading} className="w-full mb-4">
        {loading ? "Fetching Doctor..." : "Find Doctor"}
      </Button>

      {doctor && (
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="font-semibold">{doctor.name}</p>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          <Button onClick={contactDoctor} className="mt-2 w-full">
            Contact via WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmergencyChat;
