"use client"; // Add this line to mark the component as a Client Component

import React from 'react';
import Chatbot from '../components/chatbot/Chatbot'; // Adjust the path if necessary

const ChatPage: React.FC = () => {
    return (
        <div>
            <h1>Chat Page</h1>
            <Chatbot />
        </div>
    );
};

export default ChatPage;