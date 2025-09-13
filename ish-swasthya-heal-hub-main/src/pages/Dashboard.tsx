import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = "https://yourbackend.com/api"; // replace with your backend

interface Vaccine {
  vaccine_name: string;
  date: string;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const Dashboard = ({ user }: { user: UserInfo }) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lang, setLang] = useState("en");
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchUserVaccines();
  }, []);

  const fetchUserVaccines = async () => {
    try {
      const res = await fetch(`${API_URL}/vaccine-schedule/${user.id}`);
      const data = await res.json();
      if (data.vaccines) setVaccines(data.vaccines);
    } catch (err) {
      console.error("Failed to fetch vaccines", err);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: inputMessage };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, lang, session_id: sessionId, user_context: `User: ${user.name}` }),
      });
      const data = await res.json();

      if (data.status === "success") {
        const botMsg: ChatMessage = { sender: "bot", text: data.reply.parts[0].text };
        setMessages(prev => [...prev, botMsg]);
        if (!sessionId) setSessionId(data.session_id);
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: "❌ Something went wrong. Try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Network error. Try later." }]);
    }

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome, {user.name}</h1>

      {/* Vaccines */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Upcoming Vaccines</h2>
        {vaccines.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {vaccines.map((v, idx) => (
              <Card key={idx} className="p-4 hover:scale-105 transition-transform">
                <p className="font-bold">{v.vaccine_name}</p>
                <p className="text-sm text-muted-foreground">Scheduled: {v.date}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p>No vaccines scheduled yet.</p>
        )}
      </section>

      {/* Health Chat */}
      <section className="flex-1 flex flex-col">
        <h2 className="text-2xl font-semibold mb-2">Health Chat</h2>
        <div className="flex gap-2 mb-2">
          <select value={lang} onChange={e => setLang(e.target.value)} className="p-2 rounded border">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg bg-white/70 backdrop-blur-md">
          {messages.map((msg, idx) => (
            <Card key={idx} className={`p-3 mb-2 max-w-xl ${msg.sender === "user" ? "ml-auto bg-primary/20" : "mr-auto bg-secondary/20"}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask a health question..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
