'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Mic, BrainCircuit, CheckCircle2, Volume2, VolumeX, 
  RotateCcw, Play, Pause, Sparkles, TrendingUp, IndianRupee, 
  Clock, Award, ArrowRight, Save, Check, HelpCircle, Layers
} from 'lucide-react';
import styles from './VoiceAssistantModal.module.css';
import { useDashboard } from '../context/DashboardContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtractedData {
  capital?: string | null;
  businessType?: string | null;
  location?: string | null;
  experience?: string | null;
  requirements?: string | null;
}

interface MetricsData {
  estimatedMargin?: string;
  investmentRequired?: string;
  breakevenTimeline?: string;
  subsidy?: string;
}

interface AIResult {
  spokenText: string;
  headline: string;
  directAnswer: string;
  keyPoints: string[];
  actionSteps: string[];
  metrics?: MetricsData;
  extracted?: ExtractedData;
  suggestedFollowUps: string[];
}

const QUICK_VOICE_PROMPTS = [
  { label: '🐄 Dairy Profit & Setup', query: 'Dairy business mein 1 lakh rupaye mein kitna munafa hoga?' },
  { label: '🏛️ PMEGP & Mudra Subsidy', query: 'Which government schemes provide subsidy for rural businesses?' },
  { label: '🐔 Poultry Farming Cycle', query: 'Poultry farming ka setup aur 45 day cycle kaise chalayein?' },
  { label: '🌱 Vermicompost Low Capex', query: 'Kenchua khaad ya vermicompost unit kaise shuru karein?' },
  { label: '🛢️ Cold Press Oil Mill', query: 'Cold press oil mill aur chakki setup cost aur margins kya hain?' }
];

export default function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantModalProps) {
  const { userProfile, setUserProfile } = useDashboard();

  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [step, setStep] = useState<'record' | 'loading' | 'result'>('record');
  const [result, setResult] = useState<AIResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop any active SpeechSynthesis
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  // Speak text out loud (TTS)
  const speakText = useCallback((text: string, lang: 'hi' | 'en' = language, rate: number = speechRate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();

    // Clean markdown stars/formatting for speech
    const cleanSpoken = text
      .replace(/[*_~`#]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();

    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      utterance.lang = 'en-IN';
      const englishVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('indian') || v.lang.includes('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language, speechRate]);

  // Initialize Web Speech API Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setMicError('Microphone access denied. You can also type your question below.');
          } else if (event.error === 'no-speech') {
            // normal silence
          } else {
            setMicError('Speech recognition encountered an issue. You can type or tap again.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  // Load voices early
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [stopSpeech, isListening]);

  const toggleListening = () => {
    stopSpeech();

    if (!recognitionRef.current) {
      alert('Your browser does not support Web Speech Recognition. Please use Google Chrome or Microsoft Edge, or type your query in the box.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setMicError(null);
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  const processQuery = async (queryText: string) => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const textToProcess = queryText.trim() || transcript.trim();
    if (!textToProcess) return;

    setLastQuery(textToProcess);
    setStep('loading');
    stopSpeech();
    setIsSynced(false);

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToProcess,
          userProfile,
          language
        }),
      });

      if (!response.ok) throw new Error('Failed to process voice query');

      const data: AIResult = await response.json();
      setResult(data);
      setStep('result');

      // Speak response aloud ("tell accordingly")
      if (autoSpeak && data.spokenText) {
        setTimeout(() => {
          speakText(data.spokenText, language, speechRate);
        }, 300);
      }
    } catch (error) {
      console.error('Error in voice assistant:', error);
      setStep('record');
      alert('Failed to process voice query. Please try again.');
    }
  };

  const handleToggleSpeechPlayback = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !result?.spokenText) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      speakText(result.spokenText, language, speechRate);
    }
  };

  const handleReplaySpeech = () => {
    if (result?.spokenText) {
      speakText(result.spokenText, language, speechRate);
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && result?.spokenText) {
      speakText(result.spokenText, language, newRate);
    }
  };

  const handleSyncProfile = () => {
    if (!result?.extracted) return;
    const { capital, businessType, location, experience, requirements } = result.extracted;

    setUserProfile(prev => ({
      ...prev,
      businessIdea: businessType && businessType !== 'null' ? businessType : prev.businessIdea,
      location: location && location !== 'null' ? location : prev.location,
      capital: capital && capital !== 'null' ? capital : prev.capital,
      experience: experience && experience !== 'null' ? experience : prev.experience,
      infrastructure: requirements && requirements !== 'null' ? requirements : prev.infrastructure,
      hasBusiness: true
    }));

    setIsSynced(true);
    setTimeout(() => setIsSynced(false), 4000);
  };

  const handleClose = () => {
    stopSpeech();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setStep('record');
    setTranscript('');
    setResult(null);
    onClose();
  };

  const handleStartNewQuery = () => {
    stopSpeech();
    setStep('record');
    setTranscript('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>
              <Mic size={22} color="var(--primary)" />
              Voice-First Assistant
            </h2>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot}></span>
              AI Responsive
            </span>
          </div>

          <div className={styles.headerActions}>
            {/* Language Switcher */}
            <div className={styles.langSwitch}>
              <button 
                className={`${styles.langBtn} ${language === 'hi' ? styles.activeLang : ''}`}
                onClick={() => setLanguage('hi')}
                title="Hindi / Hinglish Voice"
              >
                🇮🇳 हिन्दी
              </button>
              <button 
                className={`${styles.langBtn} ${language === 'en' ? styles.activeLang : ''}`}
                onClick={() => setLanguage('en')}
                title="English Voice"
              >
                🌐 English
              </button>
            </div>

            <button onClick={handleClose} className={styles.closeBtn} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          
          {/* STEP 1: RECORD / QUERY INPUT */}
          {step === 'record' && (
            <>
              <div className={styles.micSection}>
                <p className={styles.statusText}>
                  {isListening 
                    ? (language === 'hi' ? "सुन रहा हूँ... बोलिए!" : "Listening... speak your question!")
                    : (language === 'hi' ? "माइक दबाकर अपना सवाल या बिजनेस आइडिया बोलें" : "Tap the mic and ask any business question")}
                </p>
                <p className={styles.subStatusText}>
                  {language === 'hi' 
                    ? "मुनाफ़ा, लोन, सब्सिडी, डेली वर्कफ़्लो या मार्केट डिमांड के बारे में पूछें"
                    : "Ask about profit margins, govt subsidies, daily operations, or setup costs"}
                </p>

                <div className={styles.micContainer}>
                  {isListening && (
                    <>
                      <div className={styles.rippleRing}></div>
                      <div className={styles.rippleRing2}></div>
                    </>
                  )}
                  <button 
                    className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                    onClick={toggleListening}
                    aria-label={isListening ? "Stop listening" : "Start speaking"}
                  >
                    <Mic size={38} />
                  </button>
                </div>

                {isListening && (
                  <div className={styles.waveContainer}>
                    <div className={styles.waveBar}></div>
                    <div className={styles.waveBar}></div>
                    <div className={styles.waveBar}></div>
                    <div className={styles.waveBar}></div>
                    <div className={styles.waveBar}></div>
                    <div className={styles.waveBar}></div>
                  </div>
                )}
              </div>

              {micError && (
                <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.88rem', textAlign: 'center' }}>
                  {micError}
                </div>
              )}

              {/* Transcript & Text Input */}
              <div className={styles.transcriptWrapper}>
                <textarea 
                  className={styles.transcriptBox}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={language === 'hi'
                    ? "उदा: 'डेयरी फार्मिंग में 1 लाख में कितना मुनाफा होगा?' या 'PMEGP योजना में 35% सब्सिडी कैसे मिलेगी?'"
                    : "e.g. 'What is the profit margin in cold press oil business?' or 'How to apply for PMEGP subsidy?'"}
                  rows={3}
                />
              </div>

              <div className={styles.transcriptActions}>
                {transcript && (
                  <button 
                    className={styles.clearBtn}
                    onClick={() => setTranscript('')}
                  >
                    Clear
                  </button>
                )}
                <button 
                  className={styles.submitBtn} 
                  onClick={() => processQuery(transcript)}
                  disabled={!transcript.trim()}
                >
                  <BrainCircuit size={20} />
                  Get AI Voice Answer
                </button>
              </div>

              {/* Quick Prompts */}
              <div className={styles.quickPromptsSection}>
                <div className={styles.quickPromptsTitle}>
                  <Sparkles size={14} color="var(--primary)" />
                  Suggested Voice Queries:
                </div>
                <div className={styles.quickPromptsGrid}>
                  {QUICK_VOICE_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      className={styles.promptChip}
                      onClick={() => {
                        setTranscript(qp.query);
                        processQuery(qp.query);
                      }}
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2: LOADING */}
          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                Analyzing Voice Query...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                "{lastQuery}"
              </p>
              <div className={styles.waveContainer} style={{ marginTop: '1.5rem' }}>
                <div className={styles.waveBar}></div>
                <div className={styles.waveBar}></div>
                <div className={styles.waveBar}></div>
                <div className={styles.waveBar}></div>
                <div className={styles.waveBar}></div>
                <div className={styles.waveBar}></div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT & VOICE AUDIO PLAYBACK */}
          {step === 'result' && result && (
            <div className={styles.resultContainer}>
              
              {/* Audio Speech Player Bar */}
              <div className={styles.speechPlayerBar}>
                <div className={styles.speakingIndicator}>
                  {isSpeaking ? (
                    <>
                      <Volume2 size={20} color="var(--primary)" />
                      <span>{isPaused ? "Voice Paused" : "Speaking Answer..."}</span>
                      <div className={styles.waveContainer} style={{ height: '18px', gap: '3px' }}>
                        <div className={styles.waveBar} style={{ width: '3px' }}></div>
                        <div className={styles.waveBar} style={{ width: '3px' }}></div>
                        <div className={styles.waveBar} style={{ width: '3px' }}></div>
                        <div className={styles.waveBar} style={{ width: '3px' }}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Volume2 size={20} color="var(--text-muted)" />
                      <span>Voice Assistant Ready</span>
                    </>
                  )}
                </div>

                <div className={styles.audioControls}>
                  <button 
                    className={`${styles.audioBtn} ${isSpeaking && !isPaused ? styles.activeAudio : ''}`}
                    onClick={handleToggleSpeechPlayback}
                    title={isSpeaking ? (isPaused ? "Resume Speech" : "Pause Speech") : "Play Voice Answer"}
                  >
                    {isSpeaking && !isPaused ? <Pause size={15} /> : <Play size={15} />}
                    {isSpeaking ? (isPaused ? "Resume" : "Pause") : "Listen"}
                  </button>

                  <button 
                    className={styles.audioBtn}
                    onClick={handleReplaySpeech}
                    title="Replay from start"
                  >
                    <RotateCcw size={14} />
                    Replay
                  </button>

                  <select 
                    className={styles.speedSelect}
                    value={speechRate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    title="Speech Speed"
                  >
                    <option value="0.8">0.8x</option>
                    <option value="1.0">1.0x</option>
                    <option value="1.2">1.2x</option>
                  </select>
                </div>
              </div>

              {/* User Query Card */}
              {lastQuery && (
                <div className={styles.userBubble}>
                  <strong>Query:</strong> "{lastQuery}"
                </div>
              )}

              {/* Headline & Direct Answer */}
              <div className={styles.headlineCard}>
                <h3 className={styles.headlineTitle}>{result.headline}</h3>
                <div className={styles.directAnswerText}>
                  {result.directAnswer}
                </div>
              </div>

              {/* Metrics Grid */}
              {result.metrics && (
                <div className={styles.metricsGrid}>
                  {result.metrics.estimatedMargin && (
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Profit Margin</span>
                      <span className={styles.metricValue}>
                        <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {result.metrics.estimatedMargin}
                      </span>
                    </div>
                  )}
                  {result.metrics.investmentRequired && (
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Capex / Budget</span>
                      <span className={styles.metricValue}>
                        <IndianRupee size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {result.metrics.investmentRequired}
                      </span>
                    </div>
                  )}
                  {result.metrics.breakevenTimeline && (
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Break-Even</span>
                      <span className={styles.metricValue}>
                        <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {result.metrics.breakevenTimeline}
                      </span>
                    </div>
                  )}
                  {result.metrics.subsidy && (
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Govt Scheme</span>
                      <span className={styles.metricValue} style={{ fontSize: '0.92rem' }}>
                        <Award size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {result.metrics.subsidy}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Key Points */}
              {Array.isArray(result?.keyPoints) && result.keyPoints.length > 0 && (
                <div className={styles.pointsCard}>
                  <div className={styles.sectionHeader}>
                    <Sparkles size={18} color="var(--primary)" />
                    Key Insights & Economics
                  </div>
                  <div>
                    {result.keyPoints.map((point, idx) => (
                      <div key={idx} className={styles.pointItem}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Steps */}
              {Array.isArray(result?.actionSteps) && result.actionSteps.length > 0 && (
                <div className={styles.pointsCard}>
                  <div className={styles.sectionHeader}>
                    <Layers size={18} color="var(--primary)" />
                    Step-by-Step Action Steps
                  </div>
                  <div>
                    {result.actionSteps.map((stepItem, idx) => (
                      <div key={idx} className={styles.pointItem}>
                        <span style={{ 
                          width: '20px', height: '20px', borderRadius: '50%', 
                          background: 'var(--primary)', color: 'white', fontSize: '0.75rem', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          flexShrink: 0, fontWeight: 'bold' 
                        }}>
                          {idx + 1}
                        </span>
                        <span>{stepItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Details & Sync Option */}
              {result?.extracted && (result.extracted.businessType || result.extracted.capital) && (
                <div className={styles.extractedCard}>
                  <div className={styles.sectionHeader} style={{ color: '#2563eb' }}>
                    <Save size={18} color="#2563eb" />
                    Extracted Business Parameters
                  </div>
                  <div className={styles.extractedGrid}>
                    {result.extracted.businessType && (
                      <div className={styles.extractedItem}>
                        <div className={styles.extractedLabel}>Business Type</div>
                        <div className={styles.extractedVal}>{result.extracted.businessType}</div>
                      </div>
                    )}
                    {result.extracted.capital && (
                      <div className={styles.extractedItem}>
                        <div className={styles.extractedLabel}>Capital</div>
                        <div className={styles.extractedVal}>{result.extracted.capital}</div>
                      </div>
                    )}
                    {result.extracted.location && (
                      <div className={styles.extractedItem}>
                        <div className={styles.extractedLabel}>Location</div>
                        <div className={styles.extractedVal}>{result.extracted.location}</div>
                      </div>
                    )}
                    {result.extracted.requirements && (
                      <div className={styles.extractedItem}>
                        <div className={styles.extractedLabel}>Requirements</div>
                        <div className={styles.extractedVal}>{result.extracted.requirements}</div>
                      </div>
                    )}
                  </div>

                  {isSynced ? (
                    <div className={styles.syncedBadge}>
                      <Check size={16} /> Saved to your Dashboard Profile!
                    </div>
                  ) : (
                    <button onClick={handleSyncProfile} className={styles.syncBtn}>
                      <Save size={16} />
                      Sync Details to My Dashboard
                    </button>
                  )}
                </div>
              )}

              {/* Follow-up Voice Queries */}
              {Array.isArray(result?.suggestedFollowUps) && result.suggestedFollowUps.length > 0 && (
                <div className={styles.followUpSection}>
                  <div className={styles.followUpTitle}>
                    <HelpCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
                    Ask Follow-up Voice Query:
                  </div>
                  <div className={styles.followUpChips}>
                    {result.suggestedFollowUps.map((fu, idx) => (
                      <button
                        key={idx}
                        className={styles.followUpChip}
                        onClick={() => processQuery(fu)}
                      >
                        <span>"{fu}"</span>
                        <ArrowRight size={14} color="var(--primary)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className={styles.resultFooterActions}>
                <button onClick={handleStartNewQuery} className={styles.askAgainBtn}>
                  <Mic size={18} />
                  Ask Another Voice Query
                </button>
                <button onClick={handleClose} className={styles.doneBtn}>
                  Done
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
