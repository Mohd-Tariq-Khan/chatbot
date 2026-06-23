import { useState, useEffect, useRef } from "react";
import faqData from "./faqData";
import "./style.css";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat-history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: crypto.randomUUID(),
            sender: "bot",
            text: "👋 Welcome to AI FAQ Chatbot. Ask me about React, JavaScript, Git, Docker, AI, MERN and more."
          }
        ];
  });

  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      "chat-history",
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isTyping]);

  const findAnswer = (question) => {
    const query = question.toLowerCase();

    for (const key in faqData) {
      if (query.includes(key)) {
        return faqData[key];
      }
    }

    return {
      answer:
        "Sorry, I don't have information about that topic yet.",
      related: ["React", "JavaScript", "Git", "Docker"]
    };
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    if (input.toLowerCase() === "cls") {
      clearChat();
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    setTimeout(() => {
      const result = findAnswer(input);

      const botMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: `${result.answer}

Related:
${result.related.join(", ")}`,
        time: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);

    setInput("");
  };

  const clearChat = () => {
    const welcome = [
      {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "👋 Chat cleared. Ask me anything.",
        time: new Date().toLocaleTimeString()
      }
    ];

    setMessages(welcome);
    localStorage.removeItem("chat-history");
  };

  const exportChat = () => {
    const content = messages
      .map(
        (msg) =>
          `[${msg.time}] ${msg.sender.toUpperCase()}: ${msg.text}`
      )
      .join("\n");

    const blob = new Blob([content], {
      type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "chat-history.txt";
    link.click();
  };

  const suggestions = [
    "What is React?",
    "Explain JavaScript",
    "What is Git?",
    "What is Docker?",
    "Explain AI",
    "What is MERN Stack?"
  ];

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <div>
          <h1> AI FAQ Chatbot</h1>
          <p>
            React • JavaScript • Git • Docker • AI
          </p>
        </div>

        <div className="header-buttons">
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button onClick={exportChat}>
            📤
          </button>

          <button onClick={clearChat}>
            🗑️
          </button>
        </div>
      </header>

      <div className="suggestions">
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => setInput(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        className="chat-container"
        ref={chatRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender}`}
          >
            <div className="message-text">
              {msg.text}
            </div>

            <span className="time">
              {msg.time}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Ask a programming question..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
