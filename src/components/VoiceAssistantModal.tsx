'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mic, BrainCircuit, CheckCircle2 } from 'lucide-react';
import styles from './VoiceAssistantModal.module.css';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtractedData {
  capital: string;
  businessType: string;
  location: string;
  experience: string;
  requirements: string;
}

interface AIResult {
  extracted: ExtractedData;
  plan: string[];
}

export default function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [step, setStep] = useState<'record' | 'loading' | 'result'>('record');
  const [result, setResult] = useState<AIResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        // Set to autodetect or specifically hi-IN for Hindi/Hinglish priority
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Works well for Hindi & Hinglish

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setMicError(event.error === 'not-allowed' ? 'Microphone access denied. You can type your request below.' : 'Speech recognition failed. You can type your request below.');
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setMicError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const processAudio = async () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (!transcript.trim()) return;

    setStep('loading');

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) throw new Error('Failed to process voice');

      const data = await response.json();
      setResult(data);
      setStep('result');
    } catch (error) {
      setStep('record');
      alert('Failed to process. Please try again.');
    }
  };

  const handleClose = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setStep('record');
    setTranscript('');
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Mic className={styles.icon} size={24} color="var(--primary)" />
            Voice-First Assistant
          </h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {step === 'record' && (
            <>
              <p className={styles.statusText}>
                {isListening ? "Listening... speak in Hindi or English" : "Tap the mic and tell us your business idea"}
              </p>
              
              <div className={styles.micContainer}>
                {isListening && <div className={styles.ripple}></div>}
                <button 
                  className={`${styles.micBtn} ${isListening ? styles.listening : ''}`}
                  onClick={toggleListening}
                >
                  <Mic size={36} />
                </button>
              </div>

              {micError && (
                <div style={{color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center'}}>
                  {micError}
                </div>
              )}
              
              <textarea 
                className={styles.transcriptBox}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Mere paas 1 lakh rupaye hain aur mere gaon mein dairy kholna chahta hoon... (You can also type here if mic fails)"
                style={{ resize: 'vertical' }}
              />

              <button 
                className={styles.submitBtn} 
                onClick={processAudio}
                disabled={!transcript.trim()}
              >
                <BrainCircuit size={20} />
                Generate Plan
              </button>
            </>
          )}

          {step === 'loading' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3 style={{color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.25rem'}}>
                Analyzing Voice Input...
              </h3>
              <p className={styles.loadingText}>
                Extracting business details and formulating a plan...
              </p>
            </div>
          )}

          {step === 'result' && result && (
            <div className={styles.resultContainer}>
              <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>AI Extracted Details</h3>
              <div className={styles.dataGrid}>
                <div className={styles.dataItem}>
                  <div className={styles.dataLabel}>Capital</div>
                  <div className={styles.dataValue}>{result.extracted.capital}</div>
                </div>
                <div className={styles.dataItem}>
                  <div className={styles.dataLabel}>Business Type</div>
                  <div className={styles.dataValue}>{result.extracted.businessType}</div>
                </div>
                <div className={styles.dataItem}>
                  <div className={styles.dataLabel}>Location</div>
                  <div className={styles.dataValue}>{result.extracted.location}</div>
                </div>
                <div className={styles.dataItem}>
                  <div className={styles.dataLabel}>Experience</div>
                  <div className={styles.dataValue}>{result.extracted.experience}</div>
                </div>
                <div className={`${styles.dataItem} ${styles.dataItemFull}`}>
                  <div className={styles.dataLabel}>Specific Requirements</div>
                  <div className={styles.dataValue}>{result.extracted.requirements}</div>
                </div>
              </div>

              <div className={styles.planBox}>
                <h4><CheckCircle2 size={20} /> Preliminary Business Plan</h4>
                <ul className={styles.planList}>
                  {result.plan.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleClose} 
                className={styles.submitBtn} 
                style={{marginTop: '2rem'}}
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
