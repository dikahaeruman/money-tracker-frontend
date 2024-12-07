"use client"; // Ensure this is a Client Component

import React, { useState } from 'react';
import './Chatbot.css'; // Assuming you will create a CSS file for styles

const Chatbot: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [name, setName] = useState('');

    const handleIntroSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert('Nama wajib diisi');
        setIsIntroVisible(false);
    };

    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return; // Prevent sending empty messages
    
        setMessages([...messages, `You: ${input}`]);
    
        try {
            const url = process.env.NEXT_PUBLIC_BASE_AI_URL + '/api/v1/chat';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setMessages((prevMessages) => [...prevMessages, `Money Tracker Assistant: ${data.response.content}`]);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessages((prevMessages) => [...prevMessages, `Error: ${error.message}`]);
        }
        setInput('');
    };
    
    return (
        <div className="chatbot-container">
            <button onClick={() => setIsChatVisible(!isChatVisible)} className="toggle-chat-button">
                {isChatVisible ? 'Close Chat' : 'Open Chat'}
            </button>

            {isChatVisible && (
                <div className="chat-window">
                    {isIntroVisible ? (
                        <div className="intro-modal">
                            <h2 className="intro-title">Hai, kenalan dulu dong</h2>
                            <form onSubmit={handleIntroSubmit} className="intro-form">
                                <label htmlFor="name-input" className="intro-label">Nama*</label>
                                <input
                                    id="name-input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="wajib diisi"
                                    className="name-input"
                                />
                                <div className="intro-buttons">
                                    <button type="button" onClick={() => setIsChatVisible(false)} className="cancel-button">Batal</button>
                                    <button type="submit" className="start-button">Mulai</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={msg.startsWith('You:') ? 'user-message' : 'bot-message'}
                                    >
                                        {msg}
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleMessageSubmit} className="chat-form">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="chat-input"
                                />
                                <button type="submit" className="send-button">Send</button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
