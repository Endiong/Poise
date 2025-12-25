import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { SendIcon, LoaderIcon, SparklesIcon, PoiséIcon } from '../icons/Icons';
import { ai } from '../../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FormattedText = ({ text }: { text: string }) => {
  // Helper to parse **bold** text within a string
  const processBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  // Split text by newlines to handle paragraphs and lists
  const blocks = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  blocks.forEach((line, index) => {
      const trimmed = line.trim();
      
      // If empty line, it might be a paragraph break. 
      // If we were building a list, flush it.
      if (!trimmed) {
          if (currentList.length > 0) {
              elements.push(<ul key={`list-${index}`} className="list-disc pl-5 mb-3 space-y-1">{currentList}</ul>);
              currentList = [];
          }
          return;
      }

      // Check for list items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
          const cleanText = trimmed.replace(/^[\*\-]\s|^\d+\.\s/, '');
          currentList.push(<li key={`li-${index}`}>{processBold(cleanText)}</li>);
      } else {
          // If we were building a list, flush it before adding this paragraph
          if (currentList.length > 0) {
              elements.push(<ul key={`list-${index}`} className="list-disc pl-5 mb-3 space-y-1">{currentList}</ul>);
              currentList = [];
          }
          elements.push(<p key={`p-${index}`} className="mb-3 last:mb-0 leading-relaxed">{processBold(trimmed)}</p>);
      }
  });

  // Flush any remaining list items
  if (currentList.length > 0) {
      elements.push(<ul key={`list-end`} className="list-disc pl-5 mb-3 space-y-1">{currentList}</ul>);
  }

  return <>{elements}</>;
};

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      const chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: 'You are "Atlas", an intelligent AI posture coach. You are supportive, knowledgeable, and professional but friendly. Your advice is actionable and concise. Use simple markdown formatting like **bold** for emphasis and bullet points for lists where appropriate.'
        }
      });
      setChat(chatSession);
      setMessages([
        { role: 'model', text: "Hi there! I'm Atlas. I'm here to help you maintain great posture and stay healthy. How can I assist you today?" }
      ]);
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { role: 'model', text: "Connection lost! Try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
        <div className="flex-grow bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'model' && (
                            <div className="w-10 h-10 rounded-2xl bg-black flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                                <PoiséIcon className="w-7 h-5" />
                            </div>
                        )}
                        <div className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-sm text-sm ${
                            message.role === 'user' 
                            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-br-none' // Ash color for User
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                        }`}>
                            <FormattedText text={message.text} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-black flex-shrink-0 flex items-center justify-center text-white">
                            <PoiséIcon className="w-7 h-5" />
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700">
                            <LoaderIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 pl-6 pr-14 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:border-transparent shadow-sm dark:text-white transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 p-2.5 text-white bg-black rounded-xl hover:bg-gray-800 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all active:scale-95 shadow-md"
                    >
                       <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;