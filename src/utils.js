export const genId=()=>`${Date.now()}_${Math.random().toString(36).substr(2,6)}`;
export const todayStr=()=>new Date().toISOString().split('T')[0];
export const daysUntil=d=>{if(!d)return null;const dt=new Date(d);if(isNaN(dt.getTime()))return null;return Math.ceil((dt-new Date())/86400000);};
const toWestern=s=>String(s).replace(/[٠-٩]/g,d=>d.charCodeAt(0)-0x660+'').replace(/[۰-۹]/g,d=>d.charCodeAt(0)-0x6F0+'');
export const num=v=>{const n=typeof v==='number'?v:parseFloat(toWestern(v));return Number.isFinite(n)?n:0;};
export const fmt=n=>Math.round(num(n)).toLocaleString('en-US');
export const fmtC=(n,lang)=>`${fmt(n)} ${lang==='ar'?'ريال':'SAR'}`;
export const fmtDate=(d,lang,cal='gregory')=>{
  if(!d)return '—';
  const dt=new Date(d);
  if(isNaN(dt.getTime()))return '—';
  const calId=cal==='hijri'?'islamic-umalqura':'gregory';
  const loc=(lang==='ar'?'ar-SA':'en-US')+'-u-ca-'+calId;
  return dt.toLocaleDateString(loc,{year:'numeric',month:'2-digit',day:'2-digit'});
};
export const pct=(a,b)=>b?((a/b)*100).toFixed(1):'0.0';
export const MONTHS_AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
export const MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const PROP_T={ar:{apartment:'شقة',villa:'فيلا',shop:'محل',warehouse:'مستودع',land:'أرض',building:'عمارة',chalet:'شاليه',hotel:'فندق'},en:{apartment:'Apartment',villa:'Villa',shop:'Shop',warehouse:'Warehouse',land:'Land',building:'Building',chalet:'Chalet',hotel:'Hotel'}};
export const INV_T={ar:{stocks:'أسهم',gold:'ذهب',currencies:'عملات',funds:'ريت',crypto:'عملات رقمية',startup:'مشاريع ناشئة',other:'أخرى'},en:{stocks:'Stocks',gold:'Gold',currencies:'Currencies',funds:'REITs',crypto:'Crypto',startup:'Startups',other:'Other'}};
export const OP_T={ar:{maintenance:'صيانة',invoice:'فاتورة',subscription:'اشتراك',installment:'قسط',other:'أخرى'},en:{maintenance:'Maintenance',invoice:'Invoice',subscription:'Subscription',installment:'Installment',other:'Other'}};
export const FREQ_T={ar:{once:'مرة واحدة',monthly:'شهري',quarterly:'ربع سنوي',yearly:'سنوي'},en:{once:'Once',monthly:'Monthly',quarterly:'Quarterly',yearly:'Yearly'}};
export const PIE_COLORS=['#c9a84c','#3b82f6','#22c55e','#a855f7','#ef4444','#06b6d4','#f59e0b'];

export function validate(fields,t){
  const errors={};
  fields.forEach(([key,val,opts])=>{
    const o=opts||{};
    const empty=val===undefined||val===null||String(val).trim()==='';
    if(empty){ if(o.optional!==true) errors[key]=t.fieldRequired; return; }
    if(o.number||o.positive||o.nonNegative){
      const n=parseFloat(val);
      if(!Number.isFinite(n)){ errors[key]=t.invalidNumber; return; }
      if(o.positive&&n<=0){ errors[key]=t.mustBePositive; return; }
      if(o.nonNegative&&n<0){ errors[key]=t.mustBePositive; return; }
    }
  });
  return errors;
}

export function dateOrderError(start,end,t){
  if(!start||!end)return null;
  const s=new Date(start),e=new Date(end);
  if(isNaN(s.getTime())||isNaN(e.getTime()))return null;
  return e<s?t.endBeforeStart:null;
}

export function calculateInstallmentStatus(financing){
  if(!financing)return null;
  if(financing.payments&&Array.isArray(financing.payments)&&financing.payments.length>0){
    const payments=financing.payments;
    const paid=payments.filter(p=>p.status==='paid'||p.status==='partial').reduce((s,p)=>s+num(p.paidAmount),0);
    const pending=payments.filter(p=>p.status==='partial').reduce((s,p)=>s+num(p.pendingAmount),0);
    const overdue=payments.filter(p=>p.status==='late').reduce((s,p)=>s+num(p.pendingAmount),0);
    const remaining=num(financing.balanceToInstall)-paid;
    const monthsCompleted=payments.filter(p=>p.status==='paid'||p.status==='partial').length;
    const monthsRemaining=num(financing.totalMonths)-monthsCompleted;
    const monthlyObligation=num(financing.monthlyInstallment);
    return{totalBalance:num(financing.balanceToInstall),totalPaid:paid+num(financing.downPayment),remaining,pending,overdue,monthsCompleted,monthsRemaining,monthlyObligation,totalMonths:num(financing.totalMonths),progress:Math.round((monthsCompleted/(num(financing.totalMonths)||1))*100),downPayment:num(financing.downPayment)};
  }
  if(num(financing.monthlyInstallment)>0||num(financing.balanceToInstall)>0){
    const dp=num(financing.downPayment);
    const inst=num(financing.monthlyInstallment);
    const total=num(financing.totalMonths);
    const rem=Math.max(0,Math.min(num(financing.remainingMonths||0),total||0));
    const hasLoan=inst>0||rem>0||dp>0;
    const paidMonths=total>0?Math.max(0,total-rem):0;
    const remainingAmount=rem*inst;
    const paidAmount=dp+paidMonths*inst;
    const totalCost=dp+total*inst;
    const progress=total>0?Math.round((paidMonths/total)*100):0;
    return{hasLoan,inst,total,rem,dp,paidMonths,remainingAmount,paidAmount,totalCost,progress};
  }
  return null;
}
