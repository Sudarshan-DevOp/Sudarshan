'use client';

import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || '';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error('Failed to connect');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "My backend brain is currently waking up! 😴 This usually takes about 50 seconds. Please try again in a minute." 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the brain. Please try again later." }]);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window box-card">
          <div className="chat-header">
            <h3><i className="fa-solid fa-robot"></i> Sudarshan's AI</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="ai-message bubble">
                Hi! I'm Sudarshan's AI assistant. Ask me anything about his projects, skills, or experience!
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.role}-message bubble`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-message bubble loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={isLoading}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      <button
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close Chat" : "Chat with Sudarshan's Bot"}
      >
        <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-comment-dots"}></i>
        {!isOpen && <span className="notification-dot"></span>}
      </button>
    </div>
  );
};

export default ChatWidget;
