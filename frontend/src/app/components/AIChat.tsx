import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, AlertTriangle, Stethoscope, Activity, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

const SeverityBanner = ({ severity }: { severity: string }) => {
  const colors = {
    critical: 'bg-gradient-to-r from-red-600 to-red-800',
    high: 'bg-gradient-to-r from-orange-500 to-red-600',
    medium: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    low: 'bg-gradient-to-r from-green-500 to-emerald-600',
    normal: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  const colorClass = colors[severity?.toLowerCase() as keyof typeof colors] || colors.normal;

  return (
    <div className={`${colorClass} p-3 rounded-lg mb-3 flex items-center justify-center gap-2 shadow-lg`}>
      <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
      <span className="text-white font-bold uppercase tracking-wider">
        Severity Level: {severity || 'UNKNOWN'}
      </span>
    </div>
  );
};

const MedicalResponseCard = ({ metadata, content }: { metadata: any, content: string }) => {
  if (!metadata || metadata.mode !== 'medical') return <p className="text-white/90 text-sm whitespace-pre-wrap">{content}</p>;

  return (
    <div className="w-full">
      <SeverityBanner severity={metadata.risk} />

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
          <Stethoscope className="w-5 h-5 text-[#6464ff]" />
          <h3 className="text-lg font-semibold text-white">Doctor Recommendation</h3>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">Detected Symptoms</span>
            <div className="flex flex-wrap gap-2">
              {metadata.symptoms?.map((s: string, i: number) => (
                <span key={i} className="px-2 py-1 rounded bg-white/10 text-white/90 text-sm border border-white/5">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">Recommended Specialist</span>
            <div className="flex items-center gap-2 text-[#00ffc8] font-medium">
              <Activity className="w-4 h-4" />
              {metadata.doctor}
            </div>
          </div>

          <div>
            <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">Medical Advice</span>
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-[#6464ff]/50 bg-white/5 p-2 rounded-r-lg">
              {content}
            </div>
          </div>

          {['high', 'critical'].includes(metadata.risk?.toLowerCase()) && (
            <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-200 text-xs">
                This may be an emergency. Seek medical help immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


interface AIChatProps {
  onAnalysisUpdate?: (data: { symptoms: string[]; risk: string }) => void;
}

export function AIChat({ onAnalysisUpdate }: AIChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI medical assistant. I can help analyze patient symptoms, recommend specialists, and provide medical insights. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    let currentContent = '';
    let metadata: any = null;

    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      await api.triageStream(
        userMessage.content,
        (data) => {
          if (data.type === 'metadata') {
            metadata = data.data;
            setMessages(prev => prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, metadata: metadata, content: currentContent } : msg
            ));

            // Notify parent component about analysis results
            if (onAnalysisUpdate && metadata) {
              onAnalysisUpdate({
                symptoms: metadata.symptoms || [],
                risk: metadata.risk || 'low'
              });
            }

          } else if (data.type === 'chunk') {
            currentContent += data.content;
            setMessages(prev => prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, content: currentContent } : msg
            ));
          }
        },
        user?.id
      );

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId ? { ...msg, content: "I'm sorry, I'm having trouble connecting to the server." } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100, 100, 255, 0.2)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6464ff] to-[#00ffc8] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white">AI Medical Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ffc8] animate-pulse" />
              <span className="text-xs text-white/60">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                  ? 'bg-gradient-to-br from-[#ff0064] to-[#ff6400]'
                  : 'bg-gradient-to-br from-[#6464ff] to-[#00ffc8]'
                  }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-xl p-0 overflow-hidden ${message.role === 'user'
                  ? 'bg-gradient-to-br from-[#ff0064]/20 to-[#ff6400]/20 border border-[#ff0064]/30 p-3'
                  : 'bg-transparent'
                  }`}
              >
                {/* Check if it has metadata to render the card */}
                {message.role === 'assistant' && message.metadata ? (
                  <MedicalResponseCard metadata={message.metadata} content={message.content} />
                ) : (
                  <p className={`text-white/90 text-sm ${message.role === 'assistant' ? 'bg-white/5 border border-white/10 p-3 rounded-xl' : ''}`}>
                    {message.content}
                  </p>
                )}

                <p className={`text-white/40 text-xs mt-1 ${message.role === 'assistant' && message.metadata ? 'pl-1' : ''}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6464ff] to-[#00ffc8] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00ffc8]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00ffc8]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#00ffc8]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about symptoms, diagnosis, or treatment..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00ffc8]/50"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6464ff] to-[#00ffc8] text-white hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
