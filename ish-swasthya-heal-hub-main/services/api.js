// frontend/services/api.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// -------------------- Chat --------------------
export async function sendChat(message: string, lang = "en", session_id?: string, user_context?: string) {
  try {
    const res = await axios.post(`${BASE_URL}/chat/chat`, {
      message,
      lang,
      session_id,
      user_context,
    });
    return res.data;
  } catch (err: any) {
    console.error("Chat API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- MythBuster --------------------
export async function askMyth(question: string, lang = "en") {
  try {
    const res = await axios.post(`${BASE_URL}/chat/mythbuster`, {
      question,
      lang,
    });
    return res.data;
  } catch (err: any) {
    console.error("MythBuster API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- AI Quiz --------------------
export async function getAIQuiz(lang = "en", session_id?: string) {
  try {
    const res = await axios.get(`${BASE_URL}/chat/ai-quiz`, {
      params: { lang, session_id },
    });
    return res.data;
  } catch (err: any) {
    console.error("AI Quiz API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- Image Analysis --------------------
export async function analyzeImage(file: File, message = "Analyze this medical image", lang = "en") {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", message);
    formData.append("lang", lang);

    const res = await axios.post(`${BASE_URL}/image/analyze-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error("Image Analysis API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- Vaccine Scheduler --------------------
export async function registerVaccine(name: string, phone: string, date: string) {
  try {
    const res = await axios.post(`${BASE_URL}/vaccine/register-vaccine`, {
      name,
      phone,
      date,
    });
    return res.data;
  } catch (err: any) {
    console.error("Vaccine API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- Emergency Doctor --------------------
export async function getDoctorContact(specialty: string) {
  try {
    const res = await axios.get(`${BASE_URL}/doctor/emergency-doctor`, {
      params: { specialty },
    });
    return res.data;
  } catch (err: any) {
    console.error("Doctor API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// -------------------- Auth --------------------
export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return res.data;
  } catch (err: any) {
    console.error("Login API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function registerUser(email: string, password: string, name: string) {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register-user`, { email, password, name });
    return res.data;
  } catch (err: any) {
    console.error("Register API error:", err);
    return { error: err.message || "Something went wrong" };
  }
}
