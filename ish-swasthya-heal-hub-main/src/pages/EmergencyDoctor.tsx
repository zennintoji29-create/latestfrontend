import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";

const API_URL = "https://backkkkkkk-aqkn.onrender.com";

const EmergencyDoctor = () => {
  const [specialization, setSpecialization] = useState("");
  const [doctorContact, setDoctorContact] = useState("");

  const handleLookup = async () => {
    if (!specialization) {
      toast({
        title: "Missing field",
        description: "Please enter a specialization",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/emergency-doctor/${specialization}`);
      const data = await res.json();

      if (res.ok && data.doctor_contact) {
        setDoctorContact(data.doctor_contact);
        toast({
          title: "Doctor Found ✅",
          description: `Contact: ${data.doctor_contact}`,
          variant: "default",
        });
      } else {
        setDoctorContact("");
        toast({
          title: "❌ Not Found",
          description: "No doctor available for this specialization",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Network Error",
        description: "Unable to connect to the server",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <Card className="p-8 max-w-md w-full shadow-xl rounded-2xl bg-white/80 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Emergency Doctor Lookup
        </h1>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter Specialization (e.g., Cardiologist)"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <Button
            onClick={handleLookup}
            className="mt-2 w-full bg-gradient-to-r from-primary to-secondary text-white py-3 hover:scale-105 transition-transform"
          >
            Find Doctor
          </Button>
        </div>

        {doctorContact && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">Doctor Contact:</p>
            <p className="text-xl text-primary font-bold">{doctorContact}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmergencyDoctor;
