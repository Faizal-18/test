
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { createChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { LeafIcon, SparklesIcon } from '../constants';
import Spinner from './common/Spinner';

const AIAssistant: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { author: MessageAuthor.AI, text: "Hi! I'm Sprout, your friendly AI gardening assistant. How can I help you cultivate your rooftop oasis today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(createChat());
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const newUserMessage: ChatMessage = { author: MessageAuthor.USER, text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        
        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
            let currentAiMessage = '';
            setMessages(prev => [...prev, { author: MessageAuthor.AI, text: '' }]);

            for await (const chunk of stream) {
                currentAiMessage += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { author: MessageAuthor.AI, text: currentAiMessage };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { author: MessageAuthor.AI, text: "Oops! Something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading, chat]);

    return (
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto mt-8 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-light rounded-full">
                        <SparklesIcon className="w-6 h-6 text-primary-dark" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Ask Sprout</h2>
                        <p className="text-sm text-gray-500">Your AI Gardening Expert</p>
                    </div>
                </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : ''}`}>
                        {msg.author === MessageAuthor.AI && (
                            <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                                <LeafIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className={`max-w-md p-4 rounded-2xl ${msg.author === MessageAuthor.USER 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1].author === MessageAuthor.USER && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                             <LeafIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="max-w-md p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <Spinner />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about plants, soil, or anything gardening..."
                        disabled={isLoading}
                        className="flex-1 w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:outline-none transition"
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-primary rounded-full text-white hover:bg-primary-dark disabled:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAssistant;
