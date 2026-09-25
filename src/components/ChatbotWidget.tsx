'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw, 
  Trash2, Copy, Check, GitFork, CheckCircle2, ChevronRight,
  Layers, ShieldAlert, Wrench, Lightbulb, Clock
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '📋 Step-by-Step Business Plan',
  '⏰ Daily Shop Routine Checklist',
  '💡 How to improve profit margin?',
  '🏛️ Which government schemes can I get?',
  '📊 Explain my feasibility score',
  '👥 How to get more customers locally'
];

export default function ChatbotWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Namaste! I am your **GrameenSathi Assistant**.\n\nYou can ask me about business planning, government loans & subsidies, daily shop routines, pricing, or local customer demand. How can I help you today?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userProfile, realityScores, schemes } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          context: {
            userProfile,
            realityScores,
            schemes
          }
        })
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Here is what I found for your business.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ I encountered an error connecting to the network. Please try again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (promptText: string) => {
    // Remove leading emoji for cleaner prompt
    const cleanPrompt = promptText.replace(/^[^\w\s]+/, '').trim();
    sendMessage(cleanPrompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '👋 Chat cleared. Ask me for a business workflow or any operational guidance!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Check if message content represents a structured business workflow
  const isWorkflowMessage = (content: string) => {
    return content.includes('Phase 1:') || content.includes('Phase 1') || content.includes('End-to-End Business Workflow') || content.includes('Operational Blueprint');
  };

  // Helper function to format rich markdown & workflow cards
  const formatMessage = (msg: Message) => {
    const text = msg.content;
    const isWorkflow = isWorkflowMessage(text);
    const lines = text.split('\n');

    return (
      <div style={{ position: 'relative' }}>
        {/* Header Action Bar for Workflows */}
        {isWorkflow && msg.role === 'assistant' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.5rem',
            marginBottom: '0.6rem',
            borderBottom: '1px solid rgba(5, 150, 105, 0.2)'
          }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Layers size={13} /> Operational Workflow Blueprint
            </span>
            <button
              onClick={() => copyToClipboard(text, msg.id)}
              title="Copy Workflow Checklist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                padding: '2px 7px',
                borderRadius: '6px',
                backgroundColor: copiedMessageId === msg.id ? '#10b981' : 'var(--primary-glow)',
                color: copiedMessageId === msg.id ? '#ffffff' : 'var(--primary)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {copiedMessageId === msg.id ? (
                <>
                  <Check size={12} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={12} /> Copy SOP
                </>
              )}
            </button>
          </div>
        )}

        {lines.map((line, lineIdx) => {
          // Process bold formatting **word**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const formattedParts = parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} style={{ fontWeight: 600, color: msg.role === 'user' ? '#ffffff' : 'var(--text-main)' }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          // Main Workflow / Section Title
          if (line.startsWith('📋 **') && line.endsWith('**')) {
            return (
              <div key={lineIdx} style={{
                margin: '0.4rem 0 0.8rem 0',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--primary-glow)',
                borderRadius: '8px',
                borderLeft: '4px solid var(--primary)',
                fontWeight: 700,
                color: 'var(--primary-dark)',
                fontSize: '0.92rem'
              }}>
                {formattedParts}
              </div>
            );
          }

          // Phase Header Card (e.g. 🏗️ **Phase 1: Setup & Licensing (Week 1–2)**)
          if (/^(🏗️|📦|⚙️|🏷️|🚚|📈|🎯|⚡)\s*\*\*Phase\s*\d+:?/.test(line)) {
            return (
              <div key={lineIdx} style={{
                marginTop: '0.85rem',
                marginBottom: '0.4rem',
                padding: '0.4rem 0.65rem',
                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(5, 150, 105, 0.18)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}>
                {formattedParts}
              </div>
            );
          }

          // Risk & Mitigation Card
          if (line.startsWith('⚠️ **Critical Risk')) {
            return (
              <div key={lineIdx} style={{
                marginTop: '0.75rem',
                marginBottom: '0.4rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#b91c1c',
                fontSize: '0.82rem',
                lineHeight: 1.4
              }}>
                {formattedParts}
              </div>
            );
          }

          // Mentor Tip Card
          if (line.startsWith('💡 **Grameen Mentor') || line.startsWith('💡 *Tip:') || line.startsWith('💡 *Action:')) {
            return (
              <div key={lineIdx} style={{
                marginTop: '0.75rem',
                marginBottom: '0.4rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#b45309',
                fontSize: '0.82rem',
                lineHeight: 1.4
              }}>
                {formattedParts}
              </div>
            );
          }

          // Equipment Checklist Header
          if (line.startsWith('🛠️ **Essential Equipment')) {
            return (
              <div key={lineIdx} style={{
                marginTop: '0.8rem',
                marginBottom: '0.35rem',
                padding: '0.35rem 0.6rem',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                borderRadius: '6px',
                borderLeft: '3px solid #3b82f6',
                fontWeight: 600,
                fontSize: '0.84rem',
                color: '#1d4ed8'
              }}>
                {formattedParts}
              </div>
            );
          }

          // Bullet Points (•, -, *)
          if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={lineIdx} style={{
                display: 'flex',
                gap: '0.45rem',
                margin: '0.22rem 0',
                paddingLeft: '0.35rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: msg.role === 'user' ? '#ffffff' : 'var(--primary)', fontWeight: 'bold' }}>•</span>
                <span>{formattedParts.slice(1)}</span>
              </div>
            );
          }

          // Numbered Lists (1., 2., etc.)
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={lineIdx} style={{
                display: 'flex',
                gap: '0.4rem',
                margin: '0.25rem 0',
                paddingLeft: '0.35rem',
                fontSize: '0.85rem'
              }}>
                <span>{formattedParts}</span>
              </div>
            );
          }

          return (
            <p key={lineIdx} style={{
              margin: line === '' ? '0.35rem 0' : '0.15rem 0',
              minHeight: line === '' ? '0.4rem' : 'auto',
              fontSize: '0.86rem'
            }}>
              {formattedParts}
            </p>
          );
        })}
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Business Mentor Chatbot"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.45)',
          cursor: 'pointer',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={28} />
        {/* Pulsing notification dot */}
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '14px',
          height: '14px',
          backgroundColor: '#10b981',
          border: '2px solid #ffffff',
          borderRadius: '50%',
          boxShadow: '0 0 8px #10b981'
        }} />
      </button>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '430px',
          maxWidth: 'calc(100vw - 2.5rem)',
          height: '640px',
          maxHeight: '86vh',
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'chatSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '0.85rem 1.1rem',
            backgroundColor: '#059669',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.2)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={22} color="#fff" />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#34d399',
                  borderRadius: '50%',
                  border: '1.5px solid #059669'
                }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  GrameenSathi Assistant
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} /> Rural Business & Schemes Guide
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button 
                onClick={clearChat}
                title="Clear Chat History"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#d1fae5',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {userProfile?.businessIdea && (
            <div style={{
              padding: '0.45rem 1rem',
              backgroundColor: 'var(--primary-glow)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 500
            }}>
              <span>📌 Focused on: <strong>{userProfile.businessIdea}</strong> ({userProfile.location || 'India'})</span>
              <span>₹{userProfile.capital ? Number(userProfile.capital).toLocaleString('en-IN') : '0'}</span>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.95rem',
            backgroundColor: 'var(--background)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.role === 'user' ? '85%' : '94%'
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-glow)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}>
                    <Bot size={15} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <div style={{
                    backgroundColor: msg.role === 'user' ? '#059669' : 'var(--surface)',
                    color: msg.role === 'user' ? '#ffffff' : 'var(--text-main)',
                    padding: '0.8rem 1rem',
                    borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                    lineHeight: 1.45,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    wordBreak: 'break-word',
                    width: '100%'
                  }}>
                    {formatMessage(msg)}
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '3px',
                    padding: '0 4px'
                  }}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-blue)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Bot size={15} />
                </div>
                <div style={{
                  backgroundColor: 'var(--surface)',
                  padding: '0.7rem 1rem',
                  borderRadius: '16px 16px 16px 2px',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Generating operational workflow blueprint...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div style={{
            padding: '0.45rem 0.75rem',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none'
          }}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isLoading}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  padding: '0.38rem 0.7rem',
                  borderRadius: '12px',
                  backgroundColor: prompt.includes('Workflow') ? 'var(--primary-glow)' : 'var(--background)',
                  color: prompt.includes('Workflow') ? 'var(--primary-dark)' : 'var(--text-main)',
                  border: prompt.includes('Workflow') ? '1px solid rgba(5, 150, 105, 0.35)' : '1px solid var(--border)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-glow)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.borderColor = prompt.includes('Workflow') ? 'rgba(5, 150, 105, 0.35)' : 'var(--border)';
                    e.currentTarget.style.backgroundColor = prompt.includes('Workflow') ? 'var(--primary-glow)' : 'var(--background)';
                  }
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Free-Text Input Area */}
          <form onSubmit={handleSend} style={{
            padding: '0.75rem 0.9rem',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for business workflow, SOP, or advice..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#059669'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              title="Send Message"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: input.trim() && !isLoading ? '#059669' : 'var(--surface-hover)',
                color: input.trim() && !isLoading ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
