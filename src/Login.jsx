import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const ERRORS = {
  'auth/user-not-found':          'البريد الإلكتروني غير مسجل',
  'auth/wrong-password':          'كلمة المرور غير صحيحة',
  'auth/invalid-email':           'البريد الإلكتروني غير صالح',
  'auth/too-many-requests':       'تم تجاوز عدد المحاولات، حاول لاحقاً',
  'auth/invalid-credential':      'البريد أو كلمة المرور غير صحيحة',
  'auth/network-request-failed':  'تحقق من اتصال الإنترنت',
};

const EYE_OPEN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EYE_CLOSED = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const MAIL_ICON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LOCK_ICON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}svg{animation:spin 0.8s linear infinite}`}</style>
    </svg>
  );
}

function IosInput({ icon, type, placeholder, value, onChange, rightEl }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div style={{
        position: 'absolute', top: '50%', right: '15px',
        transform: 'translateY(-50%)', color: focused ? '#fff' : 'rgba(255,255,255,0.35)',
        pointerEvents: 'none', zIndex: 1, transition: 'color 0.2s'
      }}>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '15px 46px 15px 46px',
          background: focused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
          border: `1.5px solid ${focused ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '14px', color: '#fff',
          fontSize: '0.95rem', fontFamily: 'inherit',
          outline: 'none', direction: 'rtl',
          transition: 'all 0.2s',
          WebkitTextFillColor: '#fff',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {rightEl && (
        <div style={{
          position: 'absolute', top: '50%', left: '15px',
          transform: 'translateY(-50%)', cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center'
        }}>
          {rightEl}
        </div>
      )}
      <style>{`input::placeholder{color:rgba(255,255,255,0.35)!important}`}</style>
    </div>
  );
}

export default function Login() {
  const [view, setView]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const reset = () => { setError(''); setSuccess(''); };

  const handleLogin = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(ERRORS[err.code] || 'حدث خطأ، حاول مرة أخرى');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
    } catch (err) {
      setError(ERRORS[err.code] || 'تأكد من صحة البريد الإلكتروني');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1f3c 40%, #0a1628 100%)',
      padding: '1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      direction: 'rtl', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,160,70,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
      </div>

      <div style={{ width: '100%', maxWidth: '390px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '76px', height: '76px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #b8860b, #d4a017, #c9a84c)',
            borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(196,160,70,0.35)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="3" ry="3"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {view === 'login' ? 'مرحباً بك' : 'إعادة تعيين كلمة المرور'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {view === 'login' ? 'منصة إدارة الأصول الشخصية' : 'سيصلك رابط التعيين على بريدك'}
          </p>
        </div>

        {/* Glass Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px',
          padding: '28px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 14px', background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
              marginBottom: '16px', color: '#fca5a5', fontSize: '0.85rem'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {/* Success */}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 14px', background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px',
              marginBottom: '16px', color: '#86efac', fontSize: '0.85rem'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
              {success}
            </div>
          )}

          {/* LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <IosInput icon={MAIL_ICON} type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => { setEmail(e.target.value); reset(); }}/>
              <IosInput icon={LOCK_ICON} type={showPw ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={e => { setPassword(e.target.value); reset(); }}
                rightEl={<div onClick={() => setShowPw(v => !v)}>{showPw ? EYE_CLOSED : EYE_OPEN}</div>}
              />
              <div style={{ textAlign: 'left', marginBottom: '20px', marginTop: '-4px' }}>
                <button type="button" onClick={() => { setView('forgot'); reset(); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(196,160,70,0.9)', fontSize: '0.83rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  نسيت كلمة المرور؟
                </button>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                background: loading ? 'rgba(196,160,70,0.5)' : 'linear-gradient(135deg, #b8860b, #d4a017)',
                color: '#fff', fontWeight: '700', fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(196,160,70,0.4)',
                transition: 'all 0.2s',
              }}>
                {loading ? <><Spinner /> جاري الدخول...</> : 'تسجيل الدخول'}
              </button>
            </form>
          )}

          {/* FORGOT */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot}>
              <IosInput icon={MAIL_ICON} type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => { setEmail(e.target.value); reset(); }}/>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                background: loading ? 'rgba(196,160,70,0.5)' : 'linear-gradient(135deg, #b8860b, #d4a017)',
                color: '#fff', fontWeight: '700', fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(196,160,70,0.3)', transition: 'all 0.2s',
              }}>
                {loading ? <><Spinner /> جاري الإرسال...</> : 'إرسال رابط التعيين'}
              </button>
              <button type="button" onClick={() => { setView('login'); reset(); }}
                style={{
                  width: '100%', marginTop: '10px', padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px',
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                العودة لتسجيل الدخول
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '20px' }}>
          جميع البيانات مشفرة وآمنة
        </p>
      </div>
    </div>
  );
}
