'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lightbulb, 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Mail, 
  Lock, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPane}>
        <div className={styles.leftHeader}>
          <Sprout className={styles.leafIcon} size={28} />
          <span>Empowering Rural<br/>Entrepreneurs</span>
        </div>

        <div className={styles.leftContent}>
          <h1 className={styles.headline}>
            Big Dreams<br />
            for <span className={styles.highlight}>Brighter Villages</span>
          </h1>
          <p className={styles.subHeadline}>
            Practical business guidance, government schemes & loans, and financial planning.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <Lightbulb size={24} />
              </div>
              <span className={styles.featureText}>Personalized<br/>Business Advice</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <IndianRupee size={24} />
              </div>
              <span className={styles.featureText}>Budget &<br/>Planning</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <TrendingUp size={24} />
              </div>
              <span className={styles.featureText}>Growth<br/>Opportunities</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrapper}>
                <Users size={24} />
              </div>
              <span className={styles.featureText}>Stronger<br/>Rural Communities</span>
            </div>
          </div>


        </div>

        <div className={styles.leftFooter}>
          SUSTAINABLE BUSINESSES<br />
          PROSPEROUS RURAL INDIA
        </div>
      </div>

      <div className={styles.rightPane}>
        <div className={styles.rightHeader}>
          Don't have an account? <a href="#" className={styles.signUpLink}>Sign Up</a>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.brandLogo}>
            <Sprout size={36} className={styles.leafIcon} color="#115e3b" />
            Grameen<span>Sathi</span>
          </div>
          <p className={styles.brandSubtext}>
            Simple business planning, government schemes, and financial guidance for rural entrepreneurs
          </p>

          <h2 className={styles.welcomeHeading}>Welcome Back</h2>
          <p className={styles.welcomeSubheading}>Login to continue your journey towards a stronger business.</p>

          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={20} />
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Email address or Mobile number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input 
                type="password" 
                className={styles.input} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeOff className={styles.eyeIcon} size={20} />
            </div>

            <a href="#" className={styles.forgotPassword}>Forgot Password?</a>

            <button type="submit" className={styles.loginBtn}>
              Login <ArrowRight size={20} />
            </button>
          </form>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.googleBtn} onClick={() => router.push('/onboarding')}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className={styles.rightFooter}>
          <div className={styles.footerItem}>
            <ShieldCheck size={18} color="#999" /> Secure
          </div>
          <div className={styles.footerItem}>
            <Sprout size={18} color="#999" /> Rural Focused
          </div>
          <div className={styles.footerItem}>
            <Users size={18} color="#999" /> People First
          </div>
        </div>
      </div>
    </div>
  );
}
