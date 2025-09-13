import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = "https://yourbackend.com/api"; // replace with your backend

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const HealthChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lang, setLang] = useState("en");
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMsg: ChatMessage = { sender: "user", text: inputMessage };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          lang,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        const botText = data.reply.parts[0].text;
        const botMsg: ChatMessage = { sender: "bot", text: botText };
        setMessages(prev => [...prev, botMsg]);

        // Update session ID if first message
        if (!sessionId) setSessionId(data.session_id);
      } else {
        const botMsg: ChatMessage = {
          sender: "bot",
          text: "❌ Something went wrong. Try again.",
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      const botMsg: ChatMessage = {
        sender: "bot",
        text: "❌ Network error. Try again later.",
      };
      setMessages(prev => [...prev, botMsg]);
    }

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 flex flex-col">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">ISH Health Chat</h1>

      {/* Language Selector */}
      <div className="flex justify-center mb-4 gap-4">
        <select value={lang} onChange={e => setLang(e.target.value)} className="p-2 rounded border">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg bg-white/70 backdrop-blur-md">
        {messages.map((msg, idx) => (
          <Card
            key={idx}
            className={`p-3 mb-2 max-w-xl ${
              msg.sender === "user" ? "ml-auto bg-primary/20" : "mr-auto bg-secondary/20"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          placeholder="Type your health question..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default HealthChat;
