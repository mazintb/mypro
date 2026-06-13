import { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { DARK } from '../theme';

export function Field({label,children,error,T}){
  return(
    <div style={{marginBottom:'14px'}}>
      <label style={{display:'block',fontSize:'0.68rem',fontWeight:'700',color:T?T.textMuted:'#888',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.6px'}}>{label}</label>
      {children}
      {error&&(
        <div style={{display:'flex',alignItems:'center',gap:'4px',marginTop:'5px'}}>
          <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#FF3B30',flexShrink:0,display:'inline-block'}}/>
          <p style={{margin:0,fontSize:'0.7rem',color:'#FF3B30'}}>{error}</p>
        </div>
      )}
    </div>
  );
}

export function Inp({value,onChange,type='text',placeholder='',T=DARK,error}){
  const [focused,setFocused]=useState(false);
  return(
    <>
      <input type={type} value={value||''} onChange={onChange} placeholder={placeholder}
        style={{background:focused?T.surface:T.inputBg,border:`1.5px solid ${focused?T.gold:(error?'#FF3B30':T.border)}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',transition:'all 0.18s',boxShadow:focused?`0 0 0 3px ${T.gold}20`:'none'}}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
      <style>{`input::placeholder{color:${T.textDim||'#3a5478'}!important}`}</style>
    </>
  );
}

export function Sel({value,onChange,children,T=DARK}){
  const [focused,setFocused]=useState(false);
  return(
    <select value={value||''} onChange={onChange}
      style={{background:T.inputBg,border:`1.5px solid ${focused?T.gold:T.border}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',cursor:'pointer',transition:'all 0.18s',boxShadow:focused?`0 0 0 3px ${T.gold}20`:'none'}}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
      {children}
    </select>
  );
}

export function Ta({value,onChange,rows=2,T=DARK}){
  const [focused,setFocused]=useState(false);
  return(
    <textarea value={value||''} onChange={onChange} rows={rows}
      style={{background:T.inputBg,border:`1.5px solid ${focused?T.gold:T.border}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',resize:'vertical',transition:'all 0.18s',boxShadow:focused?`0 0 0 3px ${T.gold}20`:'none'}}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
  );
}

export function Modal({title,onClose,children,T}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'flex-end',justifyContent:'center',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
      <div style={{background:T.surface,borderRadius:'28px 28px 0 0',width:'100%',maxWidth:'600px',maxHeight:'93vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 -16px 60px rgba(0,0,0,0.35)',border:`1px solid ${T.border}`,borderBottom:'none',animation:'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)'}}>
        <div style={{width:'40px',height:'5px',background:T.border,borderRadius:'3px',margin:'14px auto 0'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px 14px',borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{color:T.text,margin:0,fontWeight:'700',fontSize:'1rem',letterSpacing:'-0.3px'}}>{title}</h3>
          <button onClick={onClose} style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.textMuted,cursor:'pointer',borderRadius:'50%',display:'flex',width:'30px',height:'30px',alignItems:'center',justifyContent:'center'}}><X size={14}/></button>
        </div>
        <div style={{overflowY:'auto',flex:1,padding:'20px 20px 32px'}}>{children}</div>
      </div>
    </div>
  );
}

export function Confirm({t,onConfirm,onCancel,T}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem',background:'rgba(0,0,0,0.65)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
      <div style={{background:T.surface,borderRadius:'24px',padding:'2rem 1.75rem',maxWidth:'300px',width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.4)',border:`1px solid ${T.border}`,animation:'fadeIn 0.2s ease'}}>
        <div style={{width:'56px',height:'56px',background:`${T.danger}18`,borderRadius:'18px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',border:`1px solid ${T.danger}30`}}><Trash2 size={24} color={T.danger}/></div>
        <p style={{color:T.text,fontWeight:'700',fontSize:'1rem',marginBottom:'6px'}}>{t.confirmDelete}</p>
        <p style={{color:T.textMuted,fontSize:'0.8rem',marginBottom:'1.5rem',lineHeight:'1.5'}}>لا يمكن التراجع عن هذا الإجراء</p>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={onCancel} style={{flex:1,padding:'13px',borderRadius:'14px',border:`1.5px solid ${T.border}`,background:'transparent',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.9rem'}}>{t.no}</button>
          <button onClick={onConfirm} style={{flex:1,padding:'13px',borderRadius:'14px',border:'none',background:T.danger,color:'#fff',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',boxShadow:`0 4px 16px ${T.danger}44`}}>{t.yes}</button>
        </div>
      </div>
    </div>
  );
}

export function Badge({color,children}){
  return(
    <span style={{fontSize:'0.68rem',padding:'3px 8px',borderRadius:'6px',fontWeight:'700',color,background:color+'1a',whiteSpace:'nowrap',letterSpacing:'0.1px'}}>
      {children}
    </span>
  );
}

export function StatCard({label,value,icon:Icon,iconText,color,T}){
  return(
    <div style={{background:T.surface,borderRadius:'18px',padding:'15px',boxShadow:T.cardShadow,display:'flex',alignItems:'flex-start',gap:'12px',border:`1px solid ${T.border}`,position:'relative',overflow:'hidden'}}>
      <div aria-hidden style={{position:'absolute',inset:0,background:`radial-gradient(120% 90% at 100% 0%, ${color}0e, transparent 55%)`,pointerEvents:'none'}}/>
      <div style={{width:'42px',height:'42px',borderRadius:'13px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${color}24`,position:'relative'}}>
        {iconText?<span style={{fontSize:'1rem',fontWeight:'800',color}}>{iconText}</span>:<Icon size={19} color={color}/>}
      </div>
      <div style={{minWidth:0,flex:1,position:'relative'}}>
        <p style={{margin:0,fontSize:'0.64rem',color:T.textMuted,fontWeight:'600',letterSpacing:'0.4px',textTransform:'uppercase'}}>{label}</p>
        <p style={{margin:'4px 0 0',fontSize:'clamp(0.74rem,2.8vw,0.9rem)',fontWeight:'700',color:T.text,whiteSpace:'nowrap',letterSpacing:'-0.4px',lineHeight:'1.25',fontVariantNumeric:'tabular-nums'}}>{value}</p>
      </div>
    </div>
  );
}

export function SaveBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{width:'100%',padding:'15px',borderRadius:'14px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontWeight:'800',fontSize:'0.95rem',cursor:'pointer',fontFamily:'inherit',marginTop:'10px',boxShadow:`0 4px 20px ${T.gold}40`,letterSpacing:'-0.2px'}}>
      {label}
    </button>
  );
}

export function CancelBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{width:'100%',padding:'13px',borderRadius:'14px',border:`1.5px solid ${T.border}`,background:'transparent',color:T.textMuted,fontWeight:'600',fontSize:'0.88rem',cursor:'pointer',fontFamily:'inherit',marginTop:'8px'}}>
      {label}
    </button>
  );
}

export function AddBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:'5px',padding:'10px 16px',borderRadius:'12px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontWeight:'700',fontSize:'0.82rem',cursor:'pointer',fontFamily:'inherit',boxShadow:`0 3px 12px ${T.gold}35`}}>
      <Plus size={14}/>{label}
    </button>
  );
}

export function SmBtn({onClick,label,icon:Icon,color,T}){
  return(
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:'4px',padding:'7px 11px',borderRadius:'9px',border:`1px solid ${color}30`,background:color+'0f',color,fontWeight:'600',fontSize:'0.73rem',cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s'}}>
      {Icon&&<Icon size={12}/>}{label}
    </button>
  );
}

export function EmptyState({icon,title,subtitle,T}){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1rem',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:'12px',opacity:0.5}}>{icon}</div>
      <p style={{margin:0,fontSize:'0.95rem',fontWeight:'700',color:T.textMuted}}>{title}</p>
      {subtitle&&<p style={{margin:'6px 0 0',fontSize:'0.8rem',color:T.textDim}}>{subtitle}</p>}
    </div>
  );
}

export function SectionHeader({title,T}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'20px 0 10px'}}>
      <span style={{fontSize:'0.67rem',fontWeight:'700',color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.8px'}}>{title}</span>
      <div style={{flex:1,height:'1px',background:T.border}}/>
    </div>
  );
}

export function SubTabs({tabs,active,onChange,T}){
  return(
    <div style={{display:'flex',gap:'0',background:T.surface2,borderRadius:'12px',padding:'3px',marginBottom:'14px',overflow:'hidden',border:`1px solid ${T.border}`}}>
      {tabs.map(tab=>(
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{flex:1,padding:'8px 6px',borderRadius:'10px',border:'none',background:active===tab.id?T.surface:'transparent',color:active===tab.id?T.text:T.textMuted,fontSize:'0.78rem',fontWeight:active===tab.id?'700':'500',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',transition:'all 0.2s',boxShadow:active===tab.id?T.cardShadow||'0 1px 4px rgba(0,0,0,0.15)':'none'}}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
