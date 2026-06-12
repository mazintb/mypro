import { useState, useEffect } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, firebaseConfig } from './firebase';
import { Users, Plus, Shield, Eye, Trash2, CheckCircle2, XCircle, AlertCircle,
         RefreshCw, Crown, UserCheck, Mail, Lock, ChevronDown, Key } from 'lucide-react';

/* Creates a user in Firebase Auth without affecting the current session
   (uses a secondary app instance of the same project) */
async function createUserSafely(email, password) {
  const appName = `secondary-${Date.now()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return cred.user.uid;
  } finally {
    await deleteApp(secondaryApp);   // always clean up
  }
}

/* ─── Role definitions ─── */
const ROLES = {
  owner:     { label:'مالك',        labelEn:'Owner',     color:'#92400e', bg:'#fffbeb', border:'#fcd34d', icon:Crown },
  assistant: { label:'مساعد شخصي', labelEn:'Assistant', color:'#5b21b6', bg:'#f5f3ff', border:'#c4b5fd', icon:UserCheck },
  viewer:    { label:'مشاهد فقط',  labelEn:'Viewer',    color:'#374151', bg:'#f9fafb', border:'#d1d5db', icon:Eye },
};
const PERMS = {
  owner:     ['إضافة وتعديل وحذف', 'إدارة المستخدمين', 'التقارير الكاملة'],
  assistant: ['إضافة وتعديل', 'التقارير (بدون حذف أو إدارة)'],
  viewer:    ['مشاهدة فقط', 'تصدير التقارير'],
};

/* ─── Helpers ─── */
const Inp = ({ label, ...props }) => (
  <div style={{ marginBottom:'0.85rem' }}>
    {label && <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'700', color:'#475569', marginBottom:'5px' }}>{label}</label>}
    <input {...props} style={{
      width:'100%', boxSizing:'border-box', padding:'10px 13px',
      border:'1.5px solid #e2e8f0', borderRadius:'11px', fontSize:'0.88rem',
      background:'#f8fafc', color:'#1e293b', outline:'none',
      fontFamily:'inherit', direction:'rtl', transition:'border-color 0.2s',
      ...props.style,
    }}
    onFocus={e => e.target.style.borderColor='#6366f1'}
    onBlur={e => e.target.style.borderColor='#e2e8f0'}
    />
  </div>
);

const Sel = ({ label, children, ...props }) => (
  <div style={{ marginBottom:'0.85rem' }}>
    {label && <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'700', color:'#475569', marginBottom:'5px' }}>{label}</label>}
    <select {...props} style={{
      width:'100%', boxSizing:'border-box', padding:'10px 13px',
      border:'1.5px solid #e2e8f0', borderRadius:'11px', fontSize:'0.88rem',
      background:'#f8fafc', color:'#1e293b', outline:'none',
      fontFamily:'inherit', direction:'rtl', cursor:'pointer',
    }}>
      {children}
    </select>
  </div>
);

/* ─── Main component ─── */
export default function UserManagement({ lang, t, currentUser }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);   // null | 'add' | 'reset'
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);   // {type, text}
  const [resetTarget, setResetTarget] = useState(null);

  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'', role:'assistant',
  });
  const [formErr, setFormErr] = useState({});

  /* ── Load users ── */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id:d.id, ...d.data() })));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadUsers(); }, []);

  /* ── Toast helper ── */
  const toast = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4500);
  };

  /* ── Validate add-user form ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim())              errs.name = 'الاسم مطلوب';
    if (!form.email.trim())             errs.email = 'البريد مطلوب';
    if (form.password.length < 6)       errs.password = 'كلمة المرور 6 أحرف على الأقل';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'كلمتا المرور غير متطابقتان';
    return errs;
  };

  /* ── Add user (without signing out the owner) ── */
  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErr(errs); return; }
    setSaving(true);
    try {
      const newUid = await createUserSafely(form.email.trim().toLowerCase(), form.password);
      await setDoc(doc(db, 'users', newUid), {
        name:      form.name.trim(),
        email:     form.email.trim().toLowerCase(),
        role:      form.role,
        status:    'active',
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || '',
      });
      setModal(null);
      setForm({ name:'', email:'', password:'', confirmPassword:'', role:'assistant' });
      setFormErr({});
      toast('success', `✅ تم إنشاء حساب "${form.name.trim()}" بنجاح — يمكنه تسجيل الدخول الآن`);
      loadUsers();
    } catch(err) {
      const MSGS = {
        'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم مسبقاً',
        'auth/weak-password':        'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        'auth/invalid-email':        'البريد الإلكتروني غير صالح',
      };
      toast('error', MSGS[err.code] || `خطأ: ${err.message}`);
    } finally { setSaving(false); }
  };

  /* ── Send password-reset email ── */
  const handleResetPassword = async () => {
    if (!resetTarget) return;
    setSaving(true);
    try {
      await sendPasswordResetEmail(auth, resetTarget.email);
      toast('success', `📧 تم إرسال رابط إعادة التعيين إلى ${resetTarget.email}`);
      setModal(null);
      setResetTarget(null);
    } catch(err) {
      toast('error', 'فشل إرسال البريد — تأكد من صحة العنوان');
    } finally { setSaving(false); }
  };

  /* ── Change role ── */
  const changeRole = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(us => us.map(u => u.id===uid ? {...u, role:newRole} : u));
      toast('success', 'تم تحديث الصلاحية');
    } catch { toast('error', 'فشل التحديث'); }
  };

  /* ── Toggle active/inactive ── */
  const toggleStatus = async (uid, current) => {
    const next = current === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, 'users', uid), { status: next });
      setUsers(us => us.map(u => u.id===uid ? {...u, status:next} : u));
      toast('success', next==='active' ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب');
    } catch { toast('error', 'فشل التحديث'); }
  };

  /* ── Delete user from Firestore (Auth deletion requires Admin SDK) ── */
  const deleteUser = async (uid, name) => {
    if (!window.confirm(`هل تريد حذف حساب "${name}"؟ لا يمكن التراجع.`)) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(us => us.filter(u => u.id!==uid));
      toast('success', `تم حذف حساب "${name}"`);
    } catch { toast('error', 'فشل الحذف'); }
  };

  /* ════════════════════════════════ RENDER ════════════════════════════════ */
  return (
    <div style={{ direction:'rtl', fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif' }}>

      {/* ── Toast ── */}
      {msg && (
        <div style={{
          display:'flex', alignItems:'center', gap:'9px',
          padding:'12px 16px', borderRadius:'13px', marginBottom:'1rem',
          background: msg.type==='success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${msg.type==='success' ? '#86efac' : '#fca5a5'}`,
          color: msg.type==='success' ? '#15803d' : '#dc2626',
          fontSize:'0.85rem', fontWeight:'600',
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
        }}>
          {msg.type==='success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
          {msg.text}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <p style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>
          {users.length} {lang==='ar' ? 'مستخدم مسجّل' : 'registered users'}
        </p>
        <button onClick={() => { setForm({ name:'', email:'', password:'', confirmPassword:'', role:'assistant' }); setFormErr({}); setModal('add'); }}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px',
            background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff',
            border:'none', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'700',
            cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
          <Plus size={15}/>{lang==='ar' ? 'إضافة مستخدم' : 'Add User'}
        </button>
      </div>

      {/* ── Roles legend ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:'0.75rem', marginBottom:'1.25rem' }}>
        {Object.entries(ROLES).map(([key, r]) => (
          <div key={key} style={{ background:'#fff', borderRadius:'14px', padding:'14px', border:`1.5px solid ${r.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'9px', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <r.icon size={14} color={r.color}/>
              </div>
              <span style={{ fontWeight:'800', fontSize:'0.85rem', color:r.color }}>{r.label}</span>
            </div>
            {PERMS[key].map(p => (
              <div key={p} style={{ display:'flex', alignItems:'flex-start', gap:'5px', marginBottom:'3px', fontSize:'0.72rem', color:'#475569' }}>
                <CheckCircle2 size={10} color="#16a34a" style={{ marginTop:'2px', flexShrink:0 }}/>{p}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── How to login info box ── */}
      <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'13px', padding:'13px 16px', marginBottom:'1.25rem', fontSize:'0.82rem', color:'#1d4ed8', display:'flex', gap:'10px', alignItems:'flex-start' }}>
        <Shield size={16} style={{ flexShrink:0, marginTop:'1px' }}/>
        <div>
          <p style={{ margin:'0 0 3px', fontWeight:'700' }}>كيف يسجّل المستخدم الجديد دخوله؟</p>
          <p style={{ margin:0, color:'#3b82f6' }}>يفتح نفس رابط التطبيق ويدخل بالبريد الإلكتروني وكلمة المرور التي أنشأتها له — يرى بياناتك ولكن بصلاحيات محدودة حسب دوره.</p>
        </div>
      </div>

      {/* ── Users list ── */}
      <div style={{ background:'#fff', borderRadius:'18px', border:'1px solid #f1f5f9', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
            <RefreshCw size={22} style={{ animation:'spin 0.9s linear infinite', marginBottom:'10px' }}/><br/>جاري التحميل...
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.9rem' }}>لا يوجد مستخدمون مسجّلون</div>
        ) : (
          users.map((user, i) => {
            const roleInfo = ROLES[user.role] || ROLES.viewer;
            const isMe = user.id === auth.currentUser?.uid;
            const isActive = user.status === 'active';
            return (
              <div key={user.id} style={{
                display:'flex', alignItems:'center', gap:'12px',
                padding:'14px 16px',
                borderBottom: i < users.length-1 ? '1px solid #f8fafc' : 'none',
                flexWrap:'wrap', background: isMe ? '#fafbff' : 'transparent',
              }}>
                {/* Avatar */}
                <div style={{
                  width:'42px', height:'42px', borderRadius:'50%', flexShrink:0,
                  background: user.role==='owner' ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                            : user.role==='assistant' ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                            : 'linear-gradient(135deg,#6b7280,#4b5563)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontWeight:'800', fontSize:'1rem',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:'140px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                    <span style={{ fontWeight:'800', fontSize:'0.9rem', color:'#1e293b' }}>{user.name}</span>
                    {isMe && (
                      <span style={{ fontSize:'0.65rem', background:'#eff6ff', color:'#2563eb', padding:'2px 7px', borderRadius:'6px', fontWeight:'700' }}>أنت</span>
                    )}
                    <span style={{ fontSize:'0.68rem', padding:'2px 8px', borderRadius:'7px', fontWeight:'700', background:roleInfo.bg, color:roleInfo.color, border:`1px solid ${roleInfo.border}` }}>
                      {roleInfo.label}
                    </span>
                    <span style={{ fontSize:'0.65rem', padding:'2px 7px', borderRadius:'6px', fontWeight:'600',
                      background: isActive ? '#f0fdf4' : '#f8fafc',
                      color: isActive ? '#15803d' : '#9ca3af' }}>
                      {isActive ? '● نشط' : '○ معطل'}
                    </span>
                  </div>
                  <p style={{ margin:'2px 0 0', fontSize:'0.73rem', color:'#64748b' }}>{user.email}</p>
                </div>
                {/* Actions */}
                {!isMe && (
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
                    {/* Role selector */}
                    <select value={user.role} onChange={e => changeRole(user.id, e.target.value)}
                      style={{ padding:'6px 9px', borderRadius:'9px', border:'1.5px solid #e2e8f0', fontSize:'0.75rem', background:'#f8fafc', color:'#334155', cursor:'pointer', fontFamily:'inherit' }}>
                      {Object.entries(ROLES).map(([k,r]) => <option key={k} value={k}>{r.label}</option>)}
                    </select>
                    {/* Reset password */}
                    <button onClick={() => { setResetTarget(user); setModal('reset'); }}
                      title="إعادة تعيين كلمة المرور"
                      style={{ padding:'6px 9px', borderRadius:'9px', border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#6366f1', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontSize:'0.75rem' }}>
                      <Key size={13}/>
                    </button>
                    {/* Toggle status */}
                    <button onClick={() => toggleStatus(user.id, user.status)}
                      style={{ padding:'6px 9px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'4px',
                        background: isActive ? '#fef2f2' : '#f0fdf4',
                        color: isActive ? '#dc2626' : '#16a34a' }}>
                      {isActive ? <XCircle size={13}/> : <CheckCircle2 size={13}/>}
                      {isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteUser(user.id, user.name)}
                      title="حذف الحساب"
                      style={{ padding:'6px 9px', borderRadius:'9px', border:'none', background:'#fef2f2', color:'#dc2626', cursor:'pointer', display:'flex', alignItems:'center' }}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ════════ ADD USER MODAL ════════ */}
      {modal === 'add' && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)' }}>
          <div style={{ background:'#fff', borderRadius:'22px', width:'100%', maxWidth:'420px', overflow:'hidden', boxShadow:'0 30px 60px rgba(0,0,0,0.3)' }}>
            {/* Header */}
            <div style={{ padding:'1.1rem 1.4rem', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Users size={16} color="#fff"/>
                </div>
                <h3 style={{ color:'#fff', margin:0, fontWeight:'800', fontSize:'0.95rem' }}>إضافة مستخدم جديد</h3>
              </div>
              <button onClick={() => setModal(null)} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', cursor:'pointer', width:'28px', height:'28px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>✕</button>
            </div>

            <form onSubmit={handleAdd} style={{ padding:'1.4rem' }}>
              {/* Info note */}
              <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'10px 12px', marginBottom:'1rem', fontSize:'0.78rem', color:'#15803d', display:'flex', gap:'7px', alignItems:'flex-start' }}>
                <CheckCircle2 size={14} style={{ flexShrink:0, marginTop:'1px' }}/>
                <span>ستبقى أنت مسجّل الدخول — يتم إنشاء الحساب الجديد بشكل منفصل تماماً</span>
              </div>

              <Inp label="الاسم الكامل" placeholder="مثال: محمد العلي" value={form.name}
                onChange={e => { setForm(f=>({...f,name:e.target.value})); setFormErr(fe=>({...fe,name:''})); }}
                style={formErr.name ? { borderColor:'#f87171' } : {}}
              />
              {formErr.name && <p style={{ margin:'-10px 0 10px', fontSize:'0.72rem', color:'#ef4444' }}>{formErr.name}</p>}

              <Inp label="البريد الإلكتروني" type="email" placeholder="email@example.com"
                value={form.email}
                onChange={e => { setForm(f=>({...f,email:e.target.value})); setFormErr(fe=>({...fe,email:''})); }}
                style={formErr.email ? { borderColor:'#f87171' } : {}}
              />
              {formErr.email && <p style={{ margin:'-10px 0 10px', fontSize:'0.72rem', color:'#ef4444' }}>{formErr.email}</p>}

              <Inp label="كلمة المرور المؤقتة" type="password" placeholder="6 أحرف على الأقل"
                value={form.password}
                onChange={e => { setForm(f=>({...f,password:e.target.value})); setFormErr(fe=>({...fe,password:''})); }}
                style={formErr.password ? { borderColor:'#f87171' } : {}}
              />
              {formErr.password && <p style={{ margin:'-10px 0 10px', fontSize:'0.72rem', color:'#ef4444' }}>{formErr.password}</p>}

              <Inp label="تأكيد كلمة المرور" type="password" placeholder="أعد كتابة كلمة المرور"
                value={form.confirmPassword}
                onChange={e => { setForm(f=>({...f,confirmPassword:e.target.value})); setFormErr(fe=>({...fe,confirmPassword:''})); }}
                style={formErr.confirmPassword ? { borderColor:'#f87171' } : {}}
              />
              {formErr.confirmPassword && <p style={{ margin:'-10px 0 10px', fontSize:'0.72rem', color:'#ef4444' }}>{formErr.confirmPassword}</p>}

              <Sel label="الصلاحية" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
                {Object.entries(ROLES).map(([k,r]) => (
                  <option key={k} value={k}>{r.label} — {PERMS[k][0]}</option>
                ))}
              </Sel>

              <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
                <button type="submit" disabled={saving}
                  style={{ flex:1, padding:'12px', borderRadius:'13px',
                    background: saving ? '#a5b4fc' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    color:'#fff', border:'none', fontWeight:'800', fontSize:'0.9rem',
                    cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                    boxShadow: saving ? 'none' : '0 4px 14px rgba(79,70,229,0.4)' }}>
                  {saving ? <><RefreshCw size={14} style={{animation:'spin 0.9s linear infinite'}}/> جاري الإنشاء...</> : <><Plus size={14}/> إنشاء الحساب</>}
                </button>
                <button type="button" onClick={() => setModal(null)}
                  style={{ padding:'12px 20px', borderRadius:'13px', background:'#f1f5f9', color:'#64748b', border:'none', fontWeight:'600', fontSize:'0.88rem', cursor:'pointer', fontFamily:'inherit' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ RESET PASSWORD MODAL ════════ */}
      {modal === 'reset' && resetTarget && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)' }}>
          <div style={{ background:'#fff', borderRadius:'22px', width:'100%', maxWidth:'360px', overflow:'hidden', boxShadow:'0 30px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding:'1.1rem 1.4rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                <Key size={18} color="#fff"/>
                <h3 style={{ color:'#fff', margin:0, fontWeight:'800', fontSize:'0.95rem' }}>إعادة تعيين كلمة المرور</h3>
              </div>
              <button onClick={() => { setModal(null); setResetTarget(null); }} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', cursor:'pointer', width:'28px', height:'28px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'1.4rem' }}>
              <div style={{ background:'#f5f3ff', border:'1px solid #c4b5fd', borderRadius:'12px', padding:'14px', marginBottom:'1.2rem', textAlign:'center' }}>
                <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', color:'#fff', fontWeight:'800', fontSize:'1.1rem' }}>
                  {resetTarget.name?.charAt(0)?.toUpperCase()}
                </div>
                <p style={{ margin:0, fontWeight:'800', color:'#1e293b' }}>{resetTarget.name}</p>
                <p style={{ margin:'3px 0 0', fontSize:'0.8rem', color:'#6366f1' }}>{resetTarget.email}</p>
              </div>
              <p style={{ fontSize:'0.83rem', color:'#64748b', textAlign:'center', margin:'0 0 1.2rem' }}>
                سيتم إرسال رابط إعادة التعيين إلى بريده الإلكتروني — يمكنه تغيير كلمة المرور بنفسه
              </p>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button onClick={handleResetPassword} disabled={saving}
                  style={{ flex:1, padding:'12px', borderRadius:'13px',
                    background: saving ? '#c4b5fd' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    color:'#fff', border:'none', fontWeight:'800', fontSize:'0.88rem',
                    cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                    boxShadow:'0 4px 14px rgba(99,102,241,0.35)' }}>
                  {saving ? <><RefreshCw size={14} style={{animation:'spin 0.9s linear infinite'}}/> جاري الإرسال...</> : <><Mail size={14}/> إرسال رابط التعيين</>}
                </button>
                <button onClick={() => { setModal(null); setResetTarget(null); }}
                  style={{ padding:'12px 18px', borderRadius:'13px', background:'#f1f5f9', color:'#64748b', border:'none', fontWeight:'600', fontSize:'0.88rem', cursor:'pointer', fontFamily:'inherit' }}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
