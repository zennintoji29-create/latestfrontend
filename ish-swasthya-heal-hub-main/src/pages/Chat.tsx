import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, UploadCloud } from "lucide-react";

const API_URL = "https://backkkkkkk-aqkn.onrender.com";

interface Message {
  id: string;
  text: string;
  type: "user" | "bot";
  imageUrl?: string;
}

const HealthChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ---------------- Send Text Message ----------------
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), text: inputMessage, type: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, lang: selectedLanguage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: data.reply.parts[0].text, type: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), text: "Error connecting to server.", type: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ---------------- Image Upload ----------------
  const sendImage = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("lang", selectedLanguage);

    setMessages(prev => [...prev, { id: Date.now().toString(), text: "[Image uploaded]", type: "user" }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: data.advice, type: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), text: "Error analyzing image.", type: "bot" }]);
    } finally {
      setIsTyping(false);
      setImageFile(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col health-container py-8 gap-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center logo-glow mb-6">ISH Health Chat</h1>

      {/* Language Selector */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
          <option value="kn">Kannada</option>
          <option value="or">Odia</option>
        </select>
      </div>

      {/* Chat Box */}
      <Card className="flex-1 p-4 overflow-y-auto h-[60vh] glass flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 rounded-lg shadow-md break-words ${msg.type === "user" ? "bg-green-200 text-right" : "bg-white text-left"}`}>
              {msg.text}
              {msg.imageUrl && <img src={msg.imageUrl} alt="uploaded" className="mt-2 rounded-md" />}
            </div>
          </div>
        ))}
        {isTyping && <p className="text-sm text-gray-500 animate-pulse">Bot is typing...</p>}
        <div ref={chatEndRef} />
      </Card>

      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-2 mt-2 items-center">
        <Input
          placeholder="Type your question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
        />
        <Button onClick={sendMessage} className="bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <Play className="w-5 h-5" /> Send
        </Button>
      </div>

      {/* Image Upload Section */}
      <div className="flex gap-2 flex-wrap items-center">
        <Input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        <Button onClick={sendImage} className="bg-gradient-to-r from-secondary to-primary text-white flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <UploadCloud className="w-5 h-5" /> Analyze Image
        </Button>
      </div>
    </div>
  );
};

export default HealthChat;
