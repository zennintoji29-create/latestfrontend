import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";

const API_URL = "https://backkkkkkk-aqkn.onrender.com";

const DoctorRegistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !specialization || !phone || !email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctor-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, specialization, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Success",
          description: "Doctor registered successfully!",
          variant: "default",
        });
        setName("");
        setEmail("");
        setSpecialization("");
        setPhone("");
      } else {
        toast({
          title: "❌ Registration failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Network Error",
        description: "Unable to connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <Card className="p-8 max-w-md w-full shadow-xl rounded-2xl bg-white/80 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Doctor Registration
        </h1>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Specialization (e.g., Cardiologist)"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <Input
            placeholder="WhatsApp / Phone number (e.g., 919876543210)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            onClick={handleRegister}
            className="mt-2 w-full bg-gradient-to-r from-primary to-secondary text-white py-3 hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Doctor"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorRegistration;
