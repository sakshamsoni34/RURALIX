import { useState } from 'react';
import { X, BrainCircuit, History, ArrowRight, MessageSquare } from 'lucide-react';
import styles from './AIBusinessMentorModal.module.css';

interface AIBusinessMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

interface MentorInteraction {
  id: string;
  date: string;
  context: string;
  aiResponse: string;
  type: 'past' | 'current';
}

export default function AIBusinessMentorModal({ isOpen, onClose, inline = false }: AIBusinessMentorModalProps) {
  const [interactions, setInteractions] = useState<MentorInteraction[]>([
    {
      id: '1',
      date: 'Last Month',
      context: 'Sales were stagnant. Asked for pricing advice.',
      aiResponse: 'Recommended increasing product price from ₹50 → ₹55 to improve margins without significant drop in volume.',
      type: 'past'
    },
    {
      id: '2',
      date: 'This Month',
      context: 'Overall sales revenue increased by 8% after price change.',
      aiResponse: 'The previous pricing recommendation successfully improved your gross margin without losing customer volume. I suggest maintaining this price point for the upcoming quarter and focusing on up-selling.',
      type: 'current'
    }
  ]);
  const [newContext, setNewContext] = useState('');
  const [isTyping, setIsTyping] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContext.trim()) return;

    setIsTyping(true);
    
    // Simulate AI thinking and responding contextually
    setTimeout(() => {
      setInteractions([...interactions, {
        id: Date.now().toString(),
        date: 'Just Now',
        context: newContext,
        aiResponse: `Based on your recent pricing success and new update: "${newContext}", I recommend launching a loyalty program next. Since customers absorbed the ₹5 price increase, giving them a small loyalty reward will ensure retention while maintaining high margins.`,
        type: 'current'
      }]);
      setNewContext('');
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen && !inline) return null;

  const content = (
    <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BrainCircuit className={styles.icon} size={24} color="var(--primary)" />
          Continuous AI Business Mentor
        </h2>
        {!inline && (
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        )}
      </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <p>Your AI Mentor remembers your past decisions and tracks their impact to provide continuous, context-aware advice.</p>
          </div>

          <div className={styles.timeline}>
            <h3 className={styles.timelineTitle}><History size={18} /> Business History & Impact</h3>
            
            <div className={styles.timelineItems}>
              {interactions.map((interaction, index) => (
                <div key={interaction.id} className={`${styles.timelineItem} ${interaction.type === 'current' ? styles.currentItem : ''}`}>
                  <div className={styles.timelineNode}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{interaction.date}</div>
                    <div className={styles.timelineContext}>
                      <strong>You:</strong> {interaction.context}
                    </div>
                    <div className={styles.timelineAi}>
                      <BrainCircuit size={16} />
                      <p>{interaction.aiResponse}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.timelineItem} ${styles.currentItem}`}>
                  <div className={styles.timelineNode}></div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineAi}>
                      <BrainCircuit size={16} />
                      <div className={styles.typingIndicator}>
                        <span>.</span><span>.</span><span>.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <h4 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)'}}>
              <MessageSquare size={16} /> Update Mentor
            </h4>
            <div className={styles.inputWrapper}>
              <textarea 
                className={styles.textarea} 
                placeholder="E.g., Competitor opened a new shop nearby..." 
                value={newContext}
                onChange={(e) => setNewContext(e.target.value)}
                rows={3}
              />
              <button type="submit" className={styles.submitBtn} disabled={!newContext.trim() || isTyping}>
                Ask Mentor <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
  );

  if (inline) return content;

  return (
    <div className={styles.overlay}>
      {content}
    </div>
  );
}
