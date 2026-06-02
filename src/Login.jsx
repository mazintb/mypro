import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { Wallet, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const ERRORS = {
  'auth/user-not-found':      'البريد الإلكتروني غير مسجل',
  'auth/wrong-password':      'كلمة المرور غير صحيحة',
  'auth/invalid-email':       'البريد الإلكتروني غير صالح',
  'auth/too-many-requests':   'تم تجاوز عدد المحاولات، حاول لاحقاً',
  'auth/invalid-credential':  'البريد أو كلمة المرور غير صحيحة',
  'auth/network-request-failed': 'تحقق من اتصال الإنترنت',
};

function InputField({ icon: Icon, type, placeholder, value, onChange, rightEl }) {
  return (
    <div style={{ position:'relative', marginBottom:'1rem' }}>
      <div style={{ position:'absolute', top:'50%', right:'14px', transform:'translateY(-50%)', color:'#64748b', pointerEvents:'none', zIndex:1 }}>
        <Icon size={17}/>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{
          width:'100%', boxSizing:'border-box',
          padding:'12px 44px 12px 44px',
          border:'1.5px solid #e2e8f0', borderRadius:'12px',
          fontSize:'0.9rem', background:'#f8fafc', color:'#1e293b',
          outline:'none', fontFamily:'inherit', transition:'all 0.2s',
          direction:'rtl'
        }}
        onFocus={e=>{ e.target.style.borderColor='#3b82f6'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.1)'; }}
        onBlur={e=>{ e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; e.target.style.boxShadow='none'; }}
      />
      {rightEl && (
        <div style={{ position:'absolute', top:'50%', left:'14px', transform:'translateY(-50%)', cursor:'pointer', color:'#64748b' }}>
          {rightEl}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const [view, setView]         = useState('login'); // 'login' | 'forgot'
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
    } catch(err) {
      setError(ERRORS[err.code] || 'حدث خطأ، حاول مرة أخرى');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); reset(); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess('✅ تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
    } catch(err) {
      setError(ERRORS[err.code] || 'تأكد من صحة البريد الإلكتروني');
    } finally { setLoading(false); }
  };

  const btnStyle = {
    width:'100%', padding:'13px', borderRadius:'12px', border:'none',
    background: loading ? '#93c5fd' : 'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
    color:'#fff', fontWeight:'700', fontSize:'0.95rem', cursor: loading?'not-allowed':'pointer',
    fontFamily:'inherit', transition:'all 0.2s', marginTop:'0.25rem',
    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
      padding:'1rem', fontFamily:'Segoe UI, system-ui, sans-serif', direction:'rtl'
    }}>
      {/* Background pattern */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle at 20% 50%, rgba(29,78,216,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.1) 0%, transparent 50%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:1 }}>
        {/* Card */}
        <div style={{ background:'#fff', borderRadius:'24px', padding:'2.5rem 2rem', boxShadow:'0 25px 60px rgba(0,0,0,0.4)' }}>
          
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg,#1e3a8a,#3b82f6)', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <Wallet size={28} color="#fff"/>
            </div>
            <h1 style={{ fontSize:'1.3rem', fontWeight:'800', color:'#0f172a', margin:'0 0 4px' }}>
              {view === 'login' ? 'مرحباً بك' : 'إعادة تعيين كلمة المرور'}
            </h1>
            <p style={{ fontSize:'0.8rem', color:'#64748b', margin:0 }}>
              {view === 'login' ? 'منصة إدارة الأصول الشخصية' : 'سيصلك رابط التعيين على بريدك'}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'10px', marginBottom:'1rem', color:'#dc2626', fontSize:'0.85rem' }}>
              <AlertCircle size={16} style={{flexShrink:0}}/> {error}
            </div>
          )}
          {success && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', marginBottom:'1rem', color:'#16a34a', fontSize:'0.85rem' }}>
              <CheckCircle2 size={16} style={{flexShrink:0}}/> {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <InputField
                icon={Mail} type="email" placeholder="البريد الإلكتروني"
                value={email} onChange={e=>{ setEmail(e.target.value); reset(); }}
              />
              <InputField
                icon={Lock} type={showPw?'text':'password'} placeholder="كلمة المرور"
                value={password} onChange={e=>{ setPassword(e.target.value); reset(); }}
                rightEl={
                  <div onClick={()=>setShowPw(v=>!v)} style={{color:'#94a3b8',cursor:'pointer'}}>
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </div>
                }
              />
              <div style={{ textAlign:'left', marginBottom:'1.25rem', marginTop:'-0.5rem' }}>
                <button type="button" onClick={()=>{ setView('forgot'); reset(); }}
                  style={{ background:'none', border:'none', color:'#3b82f6', fontSize:'0.8rem', cursor:'pointer', fontFamily:'inherit', textDecoration:'underline' }}>
                  نسيت كلمة المرور؟
                </button>
              </div>
              <button type="submit" style={btnStyle} disabled={loading}>
                {loading ? <><RefreshCw size={16} style={{animation:'spin 1s linear infinite'}}/> جاري الدخول...</> : <>تسجيل الدخول <ArrowRight size={16}/></>}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot}>
              <InputField
                icon={Mail} type="email" placeholder="البريد الإلكتروني"
                value={email} onChange={e=>{ setEmail(e.target.value); reset(); }}
              />
              <button type="submit" style={btnStyle} disabled={loading}>
                {loading ? <><RefreshCw size={16} style={{animation:'spin 1s linear infinite'}}/> جاري الإرسال...</> : <>إرسال رابط التعيين <ArrowRight size={16}/></>}
              </button>
              <button type="button" onClick={()=>{ setView('login'); reset(); }}
                style={{ width:'100%', marginTop:'0.75rem', padding:'10px', background:'none', border:'1.5px solid #e2e8f0', borderRadius:'12px', color:'#64748b', fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' }}>
                ← العودة لتسجيل الدخول
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'0.75rem', marginTop:'1.5rem' }}>
          منصة إدارة الأصول الشخصية — جميع البيانات مشفرة وآمنة
        </p>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
