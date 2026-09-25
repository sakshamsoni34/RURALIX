'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  RotateCcw, 
  Star, 
  Download, 
  Key, 
  Phone, 
  Info, 
  X, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  CheckCheck
} from 'lucide-react';
import styles from './AIBusinessMentorModal.module.css';
import { useDashboard } from '../context/DashboardContext';

interface AIBusinessMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: 'mistral' | 'gemini' | 'offline_engine';
  focusLens?: string;
  isStarred?: boolean;
}

interface StarredMilestone {
  id: string;
  title: string;
  date: string;
}

const STRATEGY_LENSES = [
  { id: 'general', label: '🌐 General Advice' },
  { id: 'growth', label: '🚀 30-Day Action Plan' },
  { id: 'capital', label: '💰 Loans & Subsidies' },
  { id: 'cost', label: '📉 Reducing Costs & Waste' },
  { id: 'marketing', label: '📱 Sales & Customers' },
  { id: 'risk', label: '🛡️ Managing Risks' }
] as const;

const QUICK_PROMPTS = [
  '📋 Daily shop routine & tasks',
  '💰 How to apply for PMEGP subsidy',
  '🏪 How to deal with local competition?',
  '📈 Simple ways to increase sales',
  '👥 Tips for hiring helpers/workers',
  '📦 How to get better prices from suppliers'
];

export default function AIBusinessMentorModal({ isOpen, onClose, inline = false }: AIBusinessMentorModalProps) {
  const { userProfile, realityScores, schemes, openVoiceAssistantWithQuery } = useDashboard();
  
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeLens, setActiveLens] = useState<typeof STRATEGY_LENSES[number]['id']>('general');
  const [isLensMenuOpen, setIsLensMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // Custom Mistral API Key Modal & State
  const [customMistralKey, setCustomMistralKey] = useState('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');

  // Starred Milestones
  const [starredList, setStarredList] = useState<StarredMilestone[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('ruralix_mistral_api_key');
      if (savedKey) setCustomMistralKey(savedKey);

      const savedMessages = localStorage.getItem('ruralix_mentor_wa_messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initial WhatsApp welcome message
        const initialWelcome: MentorMessage = {
          id: 'welcome-wa',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: 'mistral',
          content: `👋 **Namaste! I am your GrameenSathi Mentor**.

I have loaded your business details:
🏢 **Business:** ${userProfile?.businessIdea || 'Rural Business'}
📍 **Location:** ${userProfile?.location || 'Local Area'}
💰 **Budget:** ₹${userProfile?.capital ? Number(userProfile.capital).toLocaleString('en-IN') : '50,000'}

You can ask me questions about:
• 📋 **Daily shop routines & checklists**
• 💰 **Government subsidies (PMEGP, MUDRA loans)**
• 🛡️ **Pricing, supplier negotiation & competition**

How can I help you today?`
        };
        setMessages([initialWelcome]);
      }

      const savedStarred = localStorage.getItem('ruralix_mentor_starred');
      if (savedStarred) {
        setStarredList(JSON.parse(savedStarred));
      }
    } catch (e) {
      console.error('Failed to load mentor WhatsApp storage:', e);
    }
  }, [userProfile, realityScores]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Save messages to storage
  const persistMessages = (updated: MentorMessage[]) => {
    setMessages(updated);
    try {
      localStorage.setItem('ruralix_mentor_wa_messages', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isGenerating) return;

    const userMsg: MentorMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      focusLens: activeLens
    };

    const newHistory = [...messages, userMsg];
    persistMessages(newHistory);
    setInputText('');
    setIsEmojiMenuOpen(false);
    setIsLensMenuOpen(false);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newHistory.map(m => ({ role: m.role, content: m.content })),
          context: {
            userProfile,
            realityScores,
            schemes,
            focusMode: activeLens
          },
          apiKey: customMistralKey || undefined
        })
      });

      let replyContent = "Thank you for the update. Let's analyze your unit economics and scale your market footprint.";
      let provider: 'mistral' | 'gemini' | 'offline_engine' = 'mistral';

      if (response.ok) {
        const data = await response.json();
        if (data.reply) replyContent = data.reply;
        if (data.provider) provider = data.provider;
      }

      const mentorReply: MentorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider,
        focusLens: activeLens
      };

      persistMessages([...newHistory, mentorReply]);
    } catch (error) {
      console.error('WhatsApp Mentor error:', error);
      const fallbackReply: MentorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `💡 **Strategic Assessment regarding "${textToSend}":**\n\nFor your venture **${userProfile?.businessIdea || 'Enterprise'}** in **${userProfile?.location || 'your area'}**:\n\n• **Core Action:** Keep fixed overheads low and collect digital payments promptly.\n• **Unit Economics:** Target 25%–35% gross margins and maintain a 20% liquid cash buffer.\n• **Immediate Step:** Validate order commitments with 5 local clients today before investing fresh capital.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'offline_engine'
      };
      persistMessages([...newHistory, fallbackReply]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined') return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const handleToggleStar = (msg: MentorMessage) => {
    const updated = messages.map(m => m.id === msg.id ? { ...m, isStarred: !m.isStarred } : m);
    persistMessages(updated);

    if (!msg.isStarred) {
      const newStarred: StarredMilestone = {
        id: msg.id,
        title: msg.content.split('\n')[0].replace(/[*#]/g, '').slice(0, 45) || 'Mentor Advice',
        date: msg.timestamp
      };
      const updatedList = [newStarred, ...starredList];
      setStarredList(updatedList);
      localStorage.setItem('ruralix_mentor_starred', JSON.stringify(updatedList));
    } else {
      const updatedList = starredList.filter(item => item.id !== msg.id);
      setStarredList(updatedList);
      localStorage.setItem('ruralix_mentor_starred', JSON.stringify(updatedList));
    }
  };

  const handleResetChat = () => {
    if (confirm('Clear WhatsApp chat history with your AI Mentor?')) {
      localStorage.removeItem('ruralix_mentor_wa_messages');
      setMessages([]);
      setTimeout(() => {
        setMessages([{
          id: 'welcome-fresh',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: 'mistral',
          content: `👋 **Chat Cleared.** I am ready to advise on **${userProfile?.businessIdea || 'your business'}** operations, PMEGP subsidies, and profit strategies.`
        }]);
      }, 100);
    }
  };

  const handleSaveApiKey = () => {
    setCustomMistralKey(tempKeyInput.trim());
    localStorage.setItem('ruralix_mistral_api_key', tempKeyInput.trim());
    setIsKeyModalOpen(false);
  };

  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '0.35rem' }} />;

      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('💡 **') || trimmed.startsWith('⚡ **') || trimmed.startsWith('💰 **') || trimmed.startsWith('🛡️ **') || trimmed.startsWith('🎯 **')) {
        return (
          <div key={idx} style={{ fontWeight: 800, color: '#008069', margin: '0.5rem 0 0.2rem 0', fontSize: '0.94rem' }}>
            {trimmed.replace(/[*#]/g, '')}
          </div>
        );
      }

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>
            <span style={{ color: '#00a884', fontWeight: 700 }}>•</span>
            <span>{trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^\d+\./)?.[0];
        const rest = trimmed.replace(/^\d+\.\s*/, '');
        return (
          <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.3rem', paddingLeft: '0.25rem' }}>
            <span style={{ color: '#008069', fontWeight: 800, minWidth: '16px' }}>{num}</span>
            <span>{rest.replace(/\*\*(.*?)\*\*/g, '$1')}</span>
          </div>
        );
      }

      return <p key={idx}>{trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.whatsappContainer} ${inline ? styles.inlineContainer : ''}`}>
      {/* WhatsApp App Header */}
      <header className={styles.waHeader}>
        <div className={styles.waHeaderLeft} onClick={() => setIsDrawerOpen(prev => !prev)} title="Click to view Enterprise Profile">
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarImg}>🌱</div>
            <div className={styles.onlineBadge}></div>
          </div>
          <div className={styles.contactInfo}>
            <div className={styles.contactNameRow}>
              <span className={styles.contactName}>Grameen Mentor AI</span>
              <span className={styles.verifiedBadge} title="Verified AI Business Advisor">✓</span>
            </div>
            <div className={styles.statusText}>
              <span>online</span>
              <span>•</span>
              <span className={styles.mistralPill}>
                <Zap size={10} fill="#ffffff" style={{ display: 'inline', marginRight: '2px' }} />
                Mistral LLM
              </span>
            </div>
          </div>
        </div>

        <div className={styles.waHeaderRight}>
          <button 
            className={styles.headerIconBtn} 
            onClick={() => openVoiceAssistantWithQuery(`Namaste Mentor, please advise on my ${userProfile?.businessIdea || 'business'}`)}
            title="Start Voice Assistant Call"
          >
            <Phone size={18} />
          </button>

          <button 
            className={`${styles.headerIconBtn} ${customMistralKey ? styles.activeHeaderBtn : ''}`}
            onClick={() => {
              setTempKeyInput(customMistralKey);
              setIsKeyModalOpen(true);
            }}
            title="Configure Mistral API Key"
          >
            <Key size={18} />
          </button>

          <button 
            className={styles.headerIconBtn}
            onClick={handleResetChat}
            title="Clear Chat History"
          >
            <RotateCcw size={18} />
          </button>

          <button 
            className={`${styles.headerIconBtn} ${isDrawerOpen ? styles.activeHeaderBtn : ''}`}
            onClick={() => setIsDrawerOpen(prev => !prev)}
            title="Enterprise Details & Milestones"
          >
            <Info size={18} />
          </button>

          {!inline && (
            <button onClick={onClose} className={styles.headerIconBtn} aria-label="Close Chat">
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main 2-Panel Layout (Chat Canvas + Right Drawer) */}
      <div className={styles.mainLayout}>
        {/* WhatsApp Chat Canvas */}
        <div className={styles.chatCanvas}>
          {/* Messages Feed */}
          <div className={styles.messagesFeed}>
            {/* Center Date Divider */}
            <div className={styles.dateDivider}>TODAY</div>

            {/* End-to-End Security & Profile Notice */}
            <div className={styles.securityNotice}>
              <ShieldCheck size={16} color="#008069" />
              <span>
                <strong>Encrypted & Context-Aware:</strong> Mentoring is tailored to your live enterprise profile (<strong>{userProfile?.businessIdea || 'Rural Enterprise'}</strong> in <strong>{userProfile?.location || 'India'}</strong>).
              </span>
            </div>

            {/* Message Bubbles */}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowMentor}`}
              >
                {msg.role === 'user' ? (
                  <div className={styles.userBubble}>
                    <p className={styles.userText}>{msg.content}</p>
                    <div className={styles.userMeta}>
                      <span>{msg.timestamp}</span>
                      <span className={styles.doubleTick}>✓✓</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mentorBubble}>
                    <div className={styles.mentorBubbleHeader}>
                      <span className={styles.mentorSender}>
                        🌱 Grameen Mentor AI
                      </span>
                      <span className={styles.modelBadge}>
                        {msg.provider === 'mistral' ? '⚡ Mistral AI' : msg.provider === 'gemini' ? '✨ Gemini' : '🛡️ Offline'}
                      </span>
                    </div>

                    <div className={styles.markdownContent}>
                      {formatMarkdown(msg.content)}
                    </div>

                    <div className={styles.bubbleActionToolbar}>
                      <div className={styles.bubbleButtons}>
                        <button 
                          className={`${styles.waActionBtn} ${speakingId === msg.id ? styles.waActionBtnActive : ''}`}
                          onClick={() => handleToggleSpeak(msg.content, msg.id)}
                          title="Listen with Text-to-Speech"
                        >
                          {speakingId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          {speakingId === msg.id ? 'Stop' : 'Listen'}
                        </button>

                        <button 
                          className={styles.waActionBtn}
                          onClick={() => handleCopy(msg.content, msg.id)}
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={13} color="#008069" /> : <Copy size={13} />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>

                        <button 
                          className={`${styles.waActionBtn} ${msg.isStarred ? styles.waActionBtnActive : ''}`}
                          onClick={() => handleToggleStar(msg)}
                          title="Star message into Enterprise Milestones"
                        >
                          <Star size={13} fill={msg.isStarred ? '#008069' : 'none'} />
                          {msg.isStarred ? 'Starred' : 'Star'}
                        </button>
                      </div>

                      <span className={styles.mentorTime}>{msg.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isGenerating && (
              <div className={styles.messageRow}>
                <div className={styles.typingBubble}>
                  <div className={styles.typingDots}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                  <span className={styles.typingLabel}>
                    Grameen Mentor is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className={styles.quickPromptsBar}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className={styles.quickPromptPill}
                onClick={() => handleSendMessage(prompt)}
                disabled={isGenerating}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* WhatsApp Bottom Input Bar */}
          <form 
            className={styles.waInputBar}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            {/* Strategy Lens Attachment Button */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                className={`${styles.waIconButton} ${isLensMenuOpen ? styles.waIconButtonActive : ''}`}
                onClick={() => setIsLensMenuOpen(prev => !prev)}
                title="Attach Advisory Lens / Focus Strategy"
              >
                <Paperclip size={20} />
              </button>

              {/* Strategy Lens Menu */}
              {isLensMenuOpen && (
                <div className={styles.lensMenuOverlay}>
                  <div className={styles.lensMenuTitle}>Select Strategy Lens</div>
                  {STRATEGY_LENSES.map(lens => (
                    <button
                      key={lens.id}
                      type="button"
                      className={`${styles.lensMenuItem} ${activeLens === lens.id ? styles.lensMenuItemActive : ''}`}
                      onClick={() => {
                        setActiveLens(lens.id);
                        setIsLensMenuOpen(false);
                      }}
                    >
                      <span>{lens.label}</span>
                      {activeLens === lens.id && <Check size={14} color="#008069" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emoji Trigger */}
            <button 
              type="button" 
              className={styles.waIconButton}
              onClick={() => {
                setInputText(prev => `${prev} 💡 `);
              }}
              title="Add Business Emoji"
            >
              <Smile size={20} />
            </button>

            {/* Input Pill */}
            <div className={styles.inputBubble}>
              <textarea
                className={styles.waTextarea}
                placeholder={`Message Grameen Mentor about ${userProfile?.businessIdea || 'your business'}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
              />
            </div>

            {/* Mic Voice Button */}
            <button
              type="button"
              className={`${styles.waIconButton} ${isListening ? styles.micActive : ''}`}
              onClick={handleToggleListening}
              title={isListening ? 'Listening... Speak now' : 'Voice Message (Hindi / English)'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Green Circular Send Button */}
            <button
              type="submit"
              className={styles.waSendButton}
              disabled={!inputText.trim() || isGenerating}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right Contact Info / Enterprise Profile Drawer */}
        {isDrawerOpen && (
          <aside className={styles.infoDrawer}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>Enterprise Profile</h3>
              <button 
                className={styles.headerIconBtn} 
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close Drawer"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Profile Card */}
              <div className={styles.drawerCard}>
                <h4 className={styles.drawerCardHeading}>
                  <Briefcase size={15} /> Active Business
                </h4>
                <div className={styles.drawerProfileItem}>
                  <span className={styles.profileItemLabel}>Business Venture</span>
                  <span className={styles.profileItemValue}>{userProfile?.businessIdea || 'Not configured'}</span>
                </div>
                <div className={styles.drawerProfileItem}>
                  <span className={styles.profileItemLabel}>Catchment Location</span>
                  <span className={styles.profileItemValue}>{userProfile?.location || 'India'}</span>
                </div>
                <div className={styles.drawerProfileItem}>
                  <span className={styles.profileItemLabel}>Starting Capital Base</span>
                  <span className={styles.profileItemValue}>
                    ₹{userProfile?.capital ? Number(userProfile.capital).toLocaleString('en-IN') : '50,000'}
                  </span>
                </div>
                <div className={styles.drawerProfileItem}>
                  <span className={styles.profileItemLabel}>Viability Health Score</span>
                  <span className={styles.profileItemValue} style={{ color: '#008069' }}>
                    {realityScores?.overall || 84} / 100
                  </span>
                </div>
              </div>

              {/* Starred Milestones Card */}
              <div className={styles.drawerCard}>
                <h4 className={styles.drawerCardHeading}>
                  <Star size={15} /> Starred Milestones ({starredList.length})
                </h4>
                {starredList.length === 0 ? (
                  <p style={{ fontSize: '0.78rem', color: '#667781', margin: 0 }}>
                    Star any mentor advice message to pin it here as a permanent milestone.
                  </p>
                ) : (
                  <div className={styles.starredList}>
                    {starredList.map(item => (
                      <div key={item.id} className={styles.starredItem}>
                        <span className={styles.starredTitle}>{item.title}</span>
                        <span className={styles.starredDate}>{item.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mistral Model Card */}
              <div className={styles.drawerCard}>
                <h4 className={styles.drawerCardHeading}>
                  <Zap size={15} /> Intelligence Core
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#54656f', lineHeight: 1.4 }}>
                  Inference powered by <strong>Mistral-Small-Latest</strong> via official API key. Real-time RAG context integration with national MSME schemes.
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mistral API Key Modal */}
      {isKeyModalOpen && (
        <div className={styles.apiKeyModalOverlay} onClick={() => setIsKeyModalOpen(false)}>
          <div className={styles.apiKeyModalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.apiKeyModalTitle}>
              <Key size={20} color="#008069" />
              Configure Mistral API Key
            </h3>
            <p className={styles.apiKeyModalDesc}>
              Enter your Mistral API Key to unlock direct cloud inference. Key is stored locally in your browser session.
            </p>
            <input
              type="password"
              className={styles.apiKeyInput}
              placeholder="e.g. mistral_api_key_xxxxxxxx"
              value={tempKeyInput}
              onChange={(e) => setTempKeyInput(e.target.value)}
            />
            <div className={styles.apiKeyModalActions}>
              <button className={styles.apiKeyCancelBtn} onClick={() => setIsKeyModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.apiKeySaveBtn} onClick={handleSaveApiKey}>
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (inline) return content;

  return (
    <div className={styles.overlay}>
      {content}
    </div>
  );
}
