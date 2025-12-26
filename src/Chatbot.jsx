import { useState } from "react";

const predefinedQA = [
  {
    q: "what does shnoor international llc do",
    a: "Shnoor International LLC specializes in international trading, logistics solutions, and global business services."
  },
  {
    q: "where is shnoor international llc located",
    a: "Shnoor International LLC operates internationally with partners across multiple regions."
  },
  {
    q: "what services does the company offer",
    a: "The company offers international trade services, supply chain management, sourcing, and business consulting."
  },
  {
    q: "how can i contact shnoor international llc",
    a: "You can contact Shnoor International LLC through official company email or phone channels."
  },
  {
    q: "what is this chatbot used for",
    a: "This chatbot provides quick and accurate information about Shnoor International LLC using AI."
  }
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello 👋 I’m the AI assistant for Shnoor International LLC. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);

    // Predefined answers first
    const normalized = userText.toLowerCase();
    const matched = predefinedQA.find(item =>
      normalized.includes(item.q)
    );

    if (matched) {
      setMessages(prev => [...prev, { role: "bot", text: matched.a }]);
      return;
    }

    // Gemini fallback (POC)
    try {
      setLoading(true);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are an AI assistant for Shnoor International LLC.
Answer professionally and clearly.

Question: ${userText}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 200
            }
          })
        }
      );

      const data = await res.json();

      let botReply = "Currently unable to generate a response.";
      if (Array.isArray(data?.candidates)) {
        const text = data.candidates[0]?.content?.parts?.[0]?.text;
        if (text) botReply = text;
      }

      setMessages(prev => [...prev, { role: "bot", text: botReply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Error connecting to AI service." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        background: darkMode ? "#020617" : "#eef2f7"
      }}
    >
      <div
        style={{
          ...styles.chatContainer,
          background: darkMode ? "#020617" : "#ffffff"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            ...styles.header,
            background: darkMode ? "#0f172a" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000"
          }}
        >
          <div style={styles.headerLeft}>
            <img src="/logo.png" alt="Logo" style={styles.logo} />
            <span>Shnoor International LLC – AI Chatbot</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={styles.toggleBtn}
            title="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(m.role === "user"
                  ? styles.user
                  : {
                      ...styles.bot,
                      background: darkMode ? "#0f172a" : "#f1f5f9",
                      color: darkMode ? "#ffffff" : "#000000"
                    })
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, ...styles.bot }}>Typing…</div>
          )}
        </div>

        {/* INPUT */}
        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px"
  },
  chatContainer: {
    width: "100%",
    maxWidth: "640px",
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)"
  },
  header: {
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600"
  },
  logo: {
    width: "28px",
    height: "28px",
    objectFit: "contain"
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer"
  },
  messages: {
    flex: 1,
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  message: {
    maxWidth: "85%",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordBreak: "break-word"
  },
  user: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "#ffffff"
  },
  bot: {
    alignSelf: "flex-start",
    background: "#f1f5f9"
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    borderTop: "1px solid #e5e7eb"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer"
  }
};
