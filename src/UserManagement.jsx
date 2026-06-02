import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Users, Plus, Shield, Eye, Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Crown, UserCheck } from 'lucide-react';

const ROLES = {
  owner:     { label:'مالك', labelEn:'Owner',     color:'#1d4ed8', bg:'#eff6ff', icon:Crown },
  assistant: { label:'مساعد شخصي', labelEn:'Assistant', color:'#7c3aed', bg:'#faf5ff', icon:UserCheck },
  viewer:    { label:'مشاهد فقط', labelEn:'Viewer',    color:'#64748b', bg:'#f8fafc', icon:Eye },
};

const PERMS = {
  owner:     ['إضافة', 'تعديل', 'حذف', 'إدارة المستخدمين', 'التقارير'],
  assistant: ['إضافة', 'تعديل', 'التقارير'],
  viewer:    ['مشاهدة فقط', 'التقارير'],
};

const inputStyle = {
  width:'100%', boxSizing:'border-box', padding:'9px 12px',
  border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'0.85rem',
  background:'#f8fafc', color:'#1e293b', outline:'none', fontFamily:'inherit',
  direction:'rtl'
};

export default function UserManagement({ lang, t, currentUser }) {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState(null); // {type:'success'|'error', text}
  const [form, setForm]         = useState({ name:'', email:'', password:'', role:'assistant' });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id:d.id, ...d.data() })));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save current user's token first
      const currentEmail    = auth.currentUser.email;
      const currentPassword = prompt('أدخل كلمة مرورك الحالية للتحقق:');
      if (!currentPassword) { setSaving(false); return; }

      // Create new user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      const newUid = cred.user.uid;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', newUid), {
        name:      form.name.trim(),
        email:     form.email.trim().toLowerCase(),
        role:      form.role,
        status:    'active',
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || '',
      });

      // Sign back in as the original owner
      await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

      setModal(false);
      setForm({ name:'', email:'', password:'', role:'assistant' });
      showMsg('success', `✅ تم إنشاء حساب "${form.name}" بنجاح`);
      loadUsers();
    } catch(err) {
      const msgs = {
        'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
        'auth/weak-password':         'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        'auth/wrong-password':        'كلمة مرورك غير صحيحة',
      };
      showMsg('error', msgs[err.code] || `خطأ: ${err.message}`);
    } finally { setSaving(false); }
  };

  const changeRole = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(us => us.map(u => u.id===uid ? {...u, role:newRole} : u));
      showMsg('success', 'تم تحديث الصلاحية');
    } catch(e) { showMsg('error', 'فشل التحديث'); }
  };

  const toggleStatus = async (uid, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      setUsers(us => us.map(u => u.id===uid ? {...u, status:newStatus} : u));
      showMsg('success', newStatus==='active' ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب');
    } catch(e) { showMsg('error', 'فشل التحديث'); }
  };

  return (
    <div style={{ direction: lang==='ar'?'rtl':'ltr' }}>
      {/* Message */}
      {msg && (
        <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background: msg.type==='success'?'#f0fdf4':'#fef2f2', border:`1px solid ${msg.type==='success'?'#bbf7d0':'#fecaca'}`, borderRadius:'10px', marginBottom:'1rem', color: msg.type==='success'?'#16a34a':'#dc2626', fontSize:'0.85rem' }}>
          {msg.type==='success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>} {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <p style={{ fontSize:'0.85rem', color:'#64748b', margin:0 }}>{users.length} {lang==='ar'?'مستخدم مسجل':'registered users'}</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'600', cursor:'pointer', fontFamily:'inherit' }}>
          <Plus size={15}/>{lang==='ar'?'إضافة مستخدم':'Add User'}
        </button>
      </div>

      {/* Permissions legend */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'0.75rem', marginBottom:'1.25rem' }}>
        {Object.entries(ROLES).map(([key, r]) => (
          <div key={key} style={{ background:'#fff', borderRadius:'14px', padding:'14px', border:`1px solid ${r.bg}`, boxShadow:'0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:r.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <r.icon size={14} color={r.color}/>
              </div>
              <span style={{ fontWeight:'700', fontSize:'0.85rem', color:r.color }}>{r.label}</span>
            </div>
            <div style={{ fontSize:'0.75rem', color:'#64748b' }}>
              {PERMS[key].map(p => <div key={p} style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'2px' }}><CheckCircle2 size={10} color="#16a34a"/>{p}</div>)}
            </div>
          </div>
        ))}
      </div>

      {/* Users list */}
      <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #f1f5f9', boxShadow:'0 1px 2px rgba(0,0,0,0.05)', overflow:'hidden' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8' }}>
            <RefreshCw size={24} style={{ animation:'spin 1s linear infinite', marginBottom:'8px' }}/><br/>
            {lang==='ar'?'جاري التحميل...':'Loading...'}
          </div>
        ) : users.length===0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#94a3b8', fontSize:'0.9rem' }}>لا يوجد مستخدمون</div>
        ) : (
          <div>
            {users.map((user, i) => {
              const role = ROLES[user.role] || ROLES.viewer;
              const isMe = user.id === auth.currentUser?.uid;
              return (
                <div key={user.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderBottom: i<users.length-1?'1px solid #f8fafc':'none', flexWrap:'wrap' }}>
                  {/* Avatar */}
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background: user.role==='owner'?'#1d4ed8':user.role==='assistant'?'#7c3aed':'#64748b', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'700', fontSize:'0.9rem', flexShrink:0 }}>
                    {user.name?.charAt(0) || '?'}
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:'140px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <p style={{ margin:0, fontWeight:'700', fontSize:'0.9rem', color:'#1e293b' }}>{user.name}</p>
                      {isMe && <span style={{ fontSize:'0.7rem', background:'#eff6ff', color:'#2563eb', padding:'1px 6px', borderRadius:'6px', fontWeight:'600' }}>أنت</span>}
                      <span style={{ fontSize:'0.7rem', padding:'2px 8px', borderRadius:'8px', fontWeight:'600', background:role.bg, color:role.color }}>{role.label}</span>
                    </div>
                    <p style={{ margin:0, fontSize:'0.75rem', color:'#64748b' }}>{user.email}</p>
                  </div>
                  {/* Status badge */}
                  <span style={{ fontSize:'0.75rem', padding:'3px 10px', borderRadius:'8px', fontWeight:'600', background: user.status==='active'?'#f0fdf4':'#f8fafc', color: user.status==='active'?'#16a34a':'#94a3b8' }}>
                    {user.status==='active' ? '● نشط' : '○ معطل'}
                  </span>
                  {/* Actions - only if not me */}
                  {!isMe && (
                    <div style={{ display:'flex', gap:'6px' }}>
                      <select value={user.role} onChange={e=>changeRole(user.id, e.target.value)}
                        style={{ padding:'5px 8px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'0.75rem', background:'#f8fafc', color:'#334155', cursor:'pointer', fontFamily:'inherit' }}>
                        {Object.entries(ROLES).map(([k,r])=><option key={k} value={k}>{r.label}</option>)}
                      </select>
                      <button onClick={()=>toggleStatus(user.id, user.status)} title={user.status==='active'?'تعطيل':'تفعيل'}
                        style={{ padding:'5px 10px', borderRadius:'8px', border:'none', background: user.status==='active'?'#fef2f2':'#f0fdf4', color: user.status==='active'?'#dc2626':'#16a34a', cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'4px' }}>
                        {user.status==='active' ? <XCircle size={13}/> : <CheckCircle2 size={13}/>}
                        {user.status==='active' ? 'تعطيل' : 'تفعيل'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
          <div style={{ background:'#fff', borderRadius:'20px', width:'100%', maxWidth:'440px', overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ color:'#fff', margin:0, fontWeight:'700', fontSize:'1rem' }}>إضافة مستخدم جديد</h3>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', padding:'4px' }}>✕</button>
            </div>
            <form onSubmit={handleAddUser} style={{ padding:'1.5rem' }}>
              <div style={{ background:'#fefce8', border:'1px solid #fef08a', borderRadius:'10px', padding:'10px 12px', marginBottom:'1rem', fontSize:'0.8rem', color:'#854d0e', display:'flex', gap:'8px' }}>
                <AlertCircle size={15} style={{flexShrink:0, marginTop:'1px'}}/>
                <span>سيُطلب منك إدخال كلمة مرورك الحالية لإنشاء الحساب الجديد</span>
              </div>
              <div style={{ marginBottom:'0.75rem' }}>
                <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'600', color:'#475569', marginBottom:'4px' }}>الاسم</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="اسم المستخدم" required style={inputStyle}/>
              </div>
              <div style={{ marginBottom:'0.75rem' }}>
                <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'600', color:'#475569', marginBottom:'4px' }}>البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" required style={inputStyle}/>
              </div>
              <div style={{ marginBottom:'0.75rem' }}>
                <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'600', color:'#475569', marginBottom:'4px' }}>كلمة المرور (6 أحرف على الأقل)</label>
                <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required minLength={6} style={inputStyle}/>
              </div>
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:'0.75rem', fontWeight:'600', color:'#475569', marginBottom:'4px' }}>الصلاحية</label>
                <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inputStyle}>
                  {Object.entries(ROLES).map(([k,r])=><option key={k} value={k}>{r.label} — {PERMS[k].join('، ')}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'11px', borderRadius:'12px', background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', color:'#fff', border:'none', fontWeight:'700', fontSize:'0.9rem', cursor:saving?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                  {saving ? <><RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/> جاري الإنشاء...</> : <><Plus size={14}/> إنشاء الحساب</>}
                </button>
                <button type="button" onClick={()=>setModal(false)} style={{ padding:'11px 20px', borderRadius:'12px', background:'#f1f5f9', color:'#475569', border:'none', fontWeight:'600', fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
