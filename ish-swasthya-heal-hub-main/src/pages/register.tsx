import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const API_URL = "https://backkkkkkk-aqkn.onrender.com";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`❌ Registration failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="p-8 shadow-lg rounded-xl w-full max-w-md backdrop-blur-md bg-white/80">
        <h2 className="text-2xl font-bold mb-6 text-center">User Registration</h2>
        <div className="flex flex-col gap-4">
          <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleRegister} className="mt-2 w-full">Register</Button>
        </div>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </Card>
    </div>
  );
};

export default Register;
