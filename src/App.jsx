import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Login from "./Login";
import UserManagement from "./UserManagement";
import {
  LayoutDashboard, Building2, Car, TrendingUp, Receipt, Users, BarChart2,
  Bell, X, Plus, Pencil, Trash2, AlertTriangle, Download, Activity,
  Briefcase, DollarSign, ArrowUpCircle, ArrowDownCircle, Globe,
  CheckCircle2, LogOut, Wallet, BarChart3, Wrench, HandCoins, Lightbulb,
  ChevronRight, ChevronDown, FileText, Award, Moon, Sun, Home,
  MoreHorizontal, TrendingDown, Filter, Eye, ShieldCheck, Calendar
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";

// ═══ THEMES ═══
const DARK = {
  bg:'#040a16', surface:'#0a1628', surface2:'#0f2038',
  border:'#1c3458', borderGold:'#c9a84c2e',
  gold:'#cbac57', goldLight:'#ead591', goldDark:'#8a6520',
  text:'#eaf2ff', textMuted:'#6b8bba', textDim:'#33507a',
  success:'#34d667', danger:'#ff5247', warning:'#ffcf2e', info:'#2a93ff',
  tabBar:'rgba(10,22,40,0.82)', inputBg:'#0d1c34',
  cardShadow:'0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(2,8,20,0.9)',
  glassCard:'rgba(255,255,255,0.045)', glassBorder:'rgba(255,255,255,0.08)',
};
const LIGHT = {
  bg:'#EBEDF1', surface:'#FFFFFF', surface2:'#F4F5F8',
  border:'#DCDEE4', borderGold:'#9A6E0D55',
  gold:'#9A6E0D', goldLight:'#C4860E', goldDark:'#6b4a08',
  text:'#16181D', textMuted:'#5C6270', textDim:'#A6AAB5',
  success:'#1E8A3C', danger:'#D7261A', warning:'#B85C00', info:'#0060CE',
  tabBar:'rgba(248,248,252,0.85)', inputBg:'#F1F2F6',
  cardShadow:'0 1px 0 rgba(255,255,255,0.7) inset, 0 6px 18px -10px rgba(20,28,48,0.22), 0 0 0 1px rgba(20,28,48,0.05)',
  glassCard:'rgba(255,255,255,0.96)', glassBorder:'rgba(20,28,48,0.08)',
};

const TR = {
  ar:{
    dashboard:'الرئيسية', assets:'الأصول', operationsTab:'العمليات',
    financeTab:'المالية', more:'المزيد',
    realEstate:'العقارات', companies:'الشركات', vehicles:'المركبات',
    investments:'الاستثمارات', operations:'العمليات', loansGiven:'القروض المُعطاة',
    financial:'الذكاء المالي', expenses:'المصاريف', transactions:'المعاملات',
    activityLog:'سجل النشاط', reports:'التقارير', userManagement:'إدارة المستخدمين',
    netWorth:'صافي الثروة', totalAssets:'إجمالي الأصول',
    monthlyIncome:'الدخل الشهري', monthlyExpenses:'المصاريف الشهرية',
    alerts:'التنبيهات', add:'إضافة', edit:'تعديل', delete:'حذف',
    save:'حفظ', cancel:'إلغاء', name:'الاسم', type:'النوع',
    value:'القيمة', amount:'المبلغ', date:'التاريخ', notes:'ملاحظات',
    status:'الحالة', occupied:'مشغول', vacant:'شاغر', personal:'استخدام شخصي',
    rent:'الإيجار', tenant:'المستأجر', contract:'العقد',
    paid:'مدفوع', sar:'ريال', addedBy:'بواسطة',
    income:'دخل', expense:'مصروف', location:'الموقع',
    startDate:'بداية العقد', endDate:'نهاية العقد',
    phone:'الهاتف', ownership:'الملكية%', capital:'رأس المال',
    revenue:'الإيرادات', profit:'صافي الربح', employees:'الموظفون',
    salary:'الراتب', plateNumber:'رقم اللوحة', year:'سنة الصنع',
    insurance:'التأمين', registration:'التسجيل', installment:'القسط',
    remainingMonths:'الأشهر المتبقية', purchasePrice:'سعر الشراء',
    currentValue:'القيمة الحالية', profitLoss:'ربح/خسارة',
    category:'الفئة', description:'الوصف', search:'بحث...',
    noData:'لا توجد بيانات', confirmDelete:'تأكيد الحذف النهائي؟',
    yes:'نعم، احذف', no:'إلغاء', exportCSV:'تصدير CSV',
    recentTransactions:'آخر المعاملات', assetDistribution:'توزيع الأصول',
    incomeVsExpense:'الدخل مقابل المصاريف', rentDue:'إيجار مستحق',
    contractExpiring:'عقد ينتهي', insuranceExpiring:'تأمين ينتهي',
    days:'يوم', markPaid:'تحديد كمدفوع', frequency:'الدورية',
    companyType:'نوع النشاط', addEmployee:'إضافة موظف', vehicleType:'نوع المركبة',
    loanAmount:'مبلغ القرض', totalIncome:'إجمالي الدخل',
    totalExpenses:'إجمالي المصاريف', balance:'الرصيد',
    units:'الوحدات', addUnit:'إضافة وحدة', unitNumber:'رقم الوحدة', floor:'الطابق',
    opType:'نوع العملية', maintenance:'صيانة', invoice:'فاتورة',
    subscription:'اشتراك', borrower:'المقترض', loanDate:'تاريخ القرض',
    durationMonths:'المدة (أشهر)', returnDate:'تاريخ الإرجاع',
    recordPayment:'تسجيل دفعة', active:'نشط', completed:'منتهي', late:'متأخر',
    recommendations:'توصيات', customCategories:'فئاتي المخصصة',
    nextDue:'الاستحقاق القادم', lastPaid:'آخر دفعة',
    insExpiry:'انتهاء التأمين', regExpiry:'انتهاء التسجيل',
    downPayment:'الدفعة الأولى', totalInstallments:'إجمالي الأقساط', paidInstallments:'الأقساط المدفوعة',
    installmentSummary:'ملخص الأقساط', totalCost:'التكلفة الإجمالية', remainingAmount:'المبلغ المتبقي',
    paidAmount:'المبلغ المدفوع', vehicleDetails:'تفاصيل المركبة', annualPremium:'القسط السنوي', annualFee:'الرسوم السنوية',
    liabilities:'الأقساط والالتزامات', monthlyObligations:'الالتزامات الشهرية', totalRemainingDebt:'إجمالي المتبقي',
    viewDetails:'عرض التفاصيل', totalSalaries:'إجمالي الرواتب', noInstallment:'لا يوجد قسط',
    totalRent:'إيرادات الإيجار', addTransaction:'إضافة معاملة',
    addedAction:'أضاف', editedAction:'عدّل', deletedAction:'حذف', paidAction:'دفع',
    investmentType:'نوع الاستثمار', purchaseDate:'تاريخ الشراء', all:'الكل',
    activeCompany:'شركة حيّة', underConstruction:'قيد الإنشاء',
    fieldRequired:'هذا الحقل إلزامي', selectType:'اختر النوع...',
    selectStatus:'اختر الحالة...', once:'مرة واحدة',
    monthly:'شهري', quarterly:'ربع سنوي', yearly:'سنوي',
    linkedName:'اسم الأصل المرتبط',
  },
  en:{
    dashboard:'Home', assets:'Assets', operationsTab:'Operations',
    financeTab:'Finance', more:'More',
    realEstate:'Real Estate', companies:'Companies', vehicles:'Vehicles',
    investments:'Investments', operations:'Operations', loansGiven:'Loans Given',
    financial:'Financial Intel', expenses:'Expenses', transactions:'Transactions',
    activityLog:'Activity Log', reports:'Reports', userManagement:'Users',
    netWorth:'Net Worth', totalAssets:'Total Assets',
    monthlyIncome:'Monthly Income', monthlyExpenses:'Monthly Expenses',
    alerts:'Alerts', add:'Add', edit:'Edit', delete:'Delete',
    save:'Save', cancel:'Cancel', name:'Name', type:'Type',
    value:'Value', amount:'Amount', date:'Date', notes:'Notes',
    status:'Status', occupied:'Occupied', vacant:'Vacant', personal:'Personal Use',
    rent:'Rent', tenant:'Tenant', contract:'Contract',
    paid:'Paid', sar:'SAR', addedBy:'By',
    income:'Income', expense:'Expense', location:'Location',
    startDate:'Start Date', endDate:'End Date',
    phone:'Phone', ownership:'Ownership%', capital:'Capital',
    revenue:'Revenue', profit:'Net Profit', employees:'Employees',
    salary:'Salary', plateNumber:'Plate', year:'Year',
    insurance:'Insurance', registration:'Registration', installment:'Installment',
    remainingMonths:'Remaining Mo.', purchasePrice:'Purchase Price',
    currentValue:'Current Value', profitLoss:'P&L',
    category:'Category', description:'Description', search:'Search...',
    noData:'No data', confirmDelete:'Confirm delete?',
    yes:'Yes, Delete', no:'Cancel', exportCSV:'Export CSV',
    recentTransactions:'Recent Transactions', assetDistribution:'Asset Mix',
    incomeVsExpense:'Income vs Expenses', rentDue:'Rent Due',
    contractExpiring:'Contract Expiring', insuranceExpiring:'Insurance Expiring',
    days:'days', markPaid:'Mark Paid', frequency:'Frequency',
    companyType:'Business Type', addEmployee:'Add Employee', vehicleType:'Vehicle Type',
    loanAmount:'Loan Amount', totalIncome:'Total Income',
    totalExpenses:'Total Expenses', balance:'Balance',
    units:'Units', addUnit:'Add Unit', unitNumber:'Unit No.', floor:'Floor',
    opType:'Operation Type', maintenance:'Maintenance', invoice:'Invoice',
    subscription:'Subscription', borrower:'Borrower', loanDate:'Loan Date',
    durationMonths:'Duration (mo.)', returnDate:'Return Date',
    recordPayment:'Record Payment', active:'Active', completed:'Done', late:'Late',
    recommendations:'Insights', customCategories:'My Categories',
    nextDue:'Next Due', lastPaid:'Last Paid',
    insExpiry:'Ins. Expiry', regExpiry:'Reg. Expiry',
    downPayment:'Down Payment', totalInstallments:'Total Installments', paidInstallments:'Paid Installments',
    installmentSummary:'Installment Summary', totalCost:'Total Cost', remainingAmount:'Remaining Amount',
    paidAmount:'Paid Amount', vehicleDetails:'Vehicle Details', annualPremium:'Annual Premium', annualFee:'Annual Fee',
    liabilities:'Installments & Liabilities', monthlyObligations:'Monthly Obligations', totalRemainingDebt:'Total Remaining',
    viewDetails:'View Details', totalSalaries:'Total Salaries', noInstallment:'No installment',
    totalRent:'Total Rent', addTransaction:'Add Transaction',
    addedAction:'added', editedAction:'edited', deletedAction:'deleted', paidAction:'paid',
    investmentType:'Investment Type', purchaseDate:'Purchase Date', all:'All',
    activeCompany:'Active', underConstruction:'Under Construction',
    fieldRequired:'This field is required', selectType:'Select type...',
    selectStatus:'Select status...', once:'Once',
    monthly:'Monthly', quarterly:'Quarterly', yearly:'Yearly',
    linkedName:'Asset Name',
  }
};

const genId=()=>`${Date.now()}_${Math.random().toString(36).substr(2,6)}`;
const todayStr=()=>new Date().toISOString().split('T')[0];
const daysUntil=d=>{if(!d)return null;const dt=new Date(d);if(isNaN(dt.getTime()))return null;return Math.ceil((dt-new Date())/86400000);};
// Safe numeric coercion — strings, '', null, NaN all collapse to 0 so reduces never concatenate or produce NaN
const num=v=>{const n=typeof v==='number'?v:parseFloat(v);return Number.isFinite(n)?n:0;};
const fmt=n=>Math.round(num(n)).toLocaleString('ar-SA');
const fmtC=(n,lang)=>`${fmt(n)} ${lang==='ar'?'ريال':'SAR'}`;
let DATE_CAL='gregory';   // 'gregory' | 'hijri' — set from App settings during render
const fmtDate=(d,lang)=>{
  if(!d)return '—';
  const dt=new Date(d);
  if(isNaN(dt.getTime()))return '—';
  const calId=DATE_CAL==='hijri'?'islamic-umalqura':'gregory';
  const loc=(lang==='ar'?'ar-SA':'en-US')+'-u-ca-'+calId;
  return dt.toLocaleDateString(loc,{year:'numeric',month:'2-digit',day:'2-digit'});
};
const pct=(a,b)=>b?((a/b)*100).toFixed(1):'0.0';
const MONTHS_AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PROP_T={ar:{apartment:'شقة',villa:'فيلا',shop:'محل',warehouse:'مستودع',land:'أرض',building:'عمارة',chalet:'شاليه',hotel:'فندق'},en:{apartment:'Apartment',villa:'Villa',shop:'Shop',warehouse:'Warehouse',land:'Land',building:'Building',chalet:'Chalet',hotel:'Hotel'}};
const INV_T={ar:{stocks:'أسهم',gold:'ذهب',currencies:'عملات',funds:'ريت',crypto:'عملات رقمية',startup:'مشاريع ناشئة',other:'أخرى'},en:{stocks:'Stocks',gold:'Gold',currencies:'Currencies',funds:'REITs',crypto:'Crypto',startup:'Startups',other:'Other'}};
const OP_T={ar:{maintenance:'صيانة',invoice:'فاتورة',subscription:'اشتراك',installment:'قسط',other:'أخرى'},en:{maintenance:'Maintenance',invoice:'Invoice',subscription:'Subscription',installment:'Installment',other:'Other'}};
const FREQ_T={ar:{once:'مرة واحدة',monthly:'شهري',quarterly:'ربع سنوي',yearly:'سنوي'},en:{once:'Once',monthly:'Monthly',quarterly:'Quarterly',yearly:'Yearly'}};
const PIE_COLORS=['#c9a84c','#3b82f6','#22c55e','#a855f7','#ef4444','#06b6d4','#f59e0b'];
const DEF_CATS_AR=['صيانة','فواتير','رواتب','تأمين','ضرائب وزكاة','مصاريف خيرية','سفر وتمثيل','بروتوكول','مصاريف تشغيل','أخرى'];

function buildSampleData(){
  return{
    realEstate:[
      {id:genId(),name:'عمارة الروضة',type:'building',location:'الرياض - الروضة',value:3500000,status:'occupied',hasUnits:true,units:[
        {id:genId(),number:'1',floor:'1',type:'apartment',status:'occupied',tenant:{name:'أحمد محمد',phone:'0501234567'},rent:{amount:30000,frequency:'yearly',nextDue:'2025-08-01',lastPaid:'2025-01-15'},contract:{startDate:'2024-08-01',endDate:'2025-08-01'}},
        {id:genId(),number:'2',floor:'1',type:'apartment',status:'occupied',tenant:{name:'خالد عبدالله',phone:'0556789012'},rent:{amount:32000,frequency:'yearly',nextDue:'2025-09-01',lastPaid:'2025-02-01'},contract:{startDate:'2024-09-01',endDate:'2025-09-01'}},
        {id:genId(),number:'3',floor:'2',type:'apartment',status:'vacant',tenant:{name:'',phone:''},rent:{amount:0,frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''}},
      ],tenant:{name:'',phone:''},rent:{amount:0,frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''},notes:''},
      {id:genId(),name:'محل الملز',type:'shop',location:'الرياض - الملز',value:1200000,status:'occupied',hasUnits:false,units:[],tenant:{name:'شركة النور',phone:'0556789012'},rent:{amount:60000,frequency:'yearly',nextDue:'2025-06-15',lastPaid:'2024-12-15'},contract:{startDate:'2023-06-15',endDate:'2026-06-15'},notes:''},
    ],
    companies:[
      {id:genId(),name:'شركة الأفق للتجارة',type:'تجارة عامة',companyStatus:'active',ownership:100,capital:500000,monthlyRevenue:85000,monthlyExpense:62000,employees:[{id:genId(),name:'محمد علي',salary:8000}],notes:''},
      {id:genId(),name:'مشروع المجمع التجاري',type:'عقارات',companyStatus:'underConstruction',ownership:60,capital:2000000,monthlyRevenue:0,monthlyExpense:45000,employees:[],notes:'يتوقع الانتهاء 2026'},
    ],
    vehicles:[
      {id:genId(),name:'تويوتا لاند كروزر 2022',type:'SUV',plateNumber:'أ ب ج 1234',year:2022,value:280000,insurance:{company:'التعاونية',expiryDate:'2025-09-15',amount:4500},registration:{expiryDate:'2025-11-30',amount:900},loan:{downPayment:0,monthlyInstallment:0,totalMonths:0,remainingMonths:0,nextDue:''},notes:''},
      {id:genId(),name:'مرسيدس E-Class 2023',type:'Sedan',plateNumber:'د هـ و 5678',year:2023,value:320000,insurance:{company:'ولاء',expiryDate:'2026-03-20',amount:6200},registration:{expiryDate:'2026-03-20',amount:1100},loan:{downPayment:60000,monthlyInstallment:5500,totalMonths:48,remainingMonths:28,nextDue:'2025-06-05'},notes:''},
    ],
    investments:[
      {id:genId(),name:'محفظة تداول السعودية',type:'stocks',purchasePrice:150000,currentValue:178000,purchaseDate:'2023-01-15',notes:''},
      {id:genId(),name:'ذهب مسبوكات',type:'gold',purchasePrice:80000,currentValue:95000,purchaseDate:'2022-06-01',notes:''},
      {id:genId(),name:'Bitcoin & Ethereum',type:'crypto',purchasePrice:50000,currentValue:72000,purchaseDate:'2024-01-10',notes:''},
    ],
    operations:[
      {id:genId(),date:'2025-05-01',type:'maintenance',description:'صيانة سباكة عمارة الروضة',amount:2500,frequency:'once',linkedName:'عمارة الروضة',status:'paid',addedBy:'المالك'},
      {id:genId(),date:'2025-06-10',type:'installment',description:'قسط أرض مخطط النرجس',amount:8000,frequency:'monthly',nextDue:'2025-07-10',linkedName:'أرض النرجس',totalMonths:36,remainingMonths:22,status:'pending',addedBy:'المالك'},
    ],
    loansGiven:[
      {id:genId(),borrowerName:'عبدالرحمن الشمري',borrowerPhone:'0501111222',amount:50000,loanDate:'2024-10-01',durationMonths:12,returnDate:'2025-10-01',status:'active',payments:[{id:genId(),date:'2025-02-01',amount:10000}],notes:''},
    ],
    expenses:[
      {id:genId(),date:'2025-05-01',amount:5000,category:'صيانة',description:'صيانة عامة',addedBy:'المالك'},
      {id:genId(),date:'2025-05-10',amount:1200,category:'فواتير',description:'فاتورة كهرباء',addedBy:'المساعد'},
    ],
    transactions:[
      {id:genId(),date:'2025-05-01',type:'income',amount:5000,category:'إيجار',description:'إيجار محل الملز',addedBy:'المالك'},
      {id:genId(),date:'2025-05-05',type:'income',amount:23000,category:'أرباح شركة',description:'أرباح شركة الأفق',addedBy:'المالك'},
      {id:genId(),date:'2025-05-08',type:'expense',amount:5500,category:'قسط سيارة',description:'قسط مرسيدس',addedBy:'المالك'},
      {id:genId(),date:'2025-04-01',type:'income',amount:22000,category:'أرباح شركة',description:'أرباح مارس',addedBy:'المالك'},
      {id:genId(),date:'2025-03-01',type:'income',amount:20000,category:'أرباح شركة',description:'أرباح فبراير',addedBy:'المالك'},
    ],
    customCategories:[...DEF_CATS_AR],
    activityLog:[{id:genId(),timestamp:new Date().toISOString(),userId:'system',userName:'النظام',action:'أضاف',module:'النظام',description:'تم إنشاء المنصة'}]
  };
}
// ═══ UI COMPONENTS (iOS style, theme-aware) ═══
function useTheme(isDark){ return isDark?DARK:LIGHT; }

function Field({label,children,error,T}){
  return(
    <div style={{marginBottom:'14px'}}>
      <label style={{display:'block',fontSize:'0.68rem',fontWeight:'700',color: T ? T.textMuted : '#888',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.6px'}}>{label}</label>
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
function Inp({value,onChange,type='text',placeholder='',T=DARK,error}){
  const [focused,setFocused]=useState(false);
  return(
    <>
      <input type={type} value={value||''} onChange={onChange} placeholder={placeholder}
        style={{
          background: focused ? T.surface : T.inputBg,
          border:`1.5px solid ${focused ? T.gold : (error ? '#FF3B30' : T.border)}`,
          borderRadius:'12px', color:T.text, padding:'12px 14px',
          fontSize:'0.9rem', width:'100%', boxSizing:'border-box',
          fontFamily:'inherit', outline:'none',
          transition:'all 0.18s',
          boxShadow: focused ? `0 0 0 3px ${T.gold}20` : 'none',
        }}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
      <style>{`input::placeholder{color:${T.textDim || '#3a5478'}!important}`}</style>
    </>
  );
}
function Sel({value,onChange,children,T=DARK}){
  const [focused,setFocused]=useState(false);
  return(
    <select value={value||''} onChange={onChange}
      style={{
        background:T.inputBg, border:`1.5px solid ${focused ? T.gold : T.border}`,
        borderRadius:'12px', color:T.text, padding:'12px 14px',
        fontSize:'0.9rem', width:'100%', boxSizing:'border-box',
        fontFamily:'inherit', outline:'none', cursor:'pointer',
        transition:'all 0.18s',
        boxShadow: focused ? `0 0 0 3px ${T.gold}20` : 'none',
      }}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
      {children}
    </select>
  );
}
function Ta({value,onChange,rows=2,T=DARK}){
  const [focused,setFocused]=useState(false);
  return(
    <textarea value={value||''} onChange={onChange} rows={rows}
      style={{
        background:T.inputBg, border:`1.5px solid ${focused ? T.gold : T.border}`,
        borderRadius:'12px', color:T.text, padding:'12px 14px',
        fontSize:'0.9rem', width:'100%', boxSizing:'border-box',
        fontFamily:'inherit', outline:'none', resize:'vertical',
        transition:'all 0.18s',
        boxShadow: focused ? `0 0 0 3px ${T.gold}20` : 'none',
      }}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
  );
}

function Modal({title,onClose,children,T}){
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

function Confirm({t,onConfirm,onCancel,T}){
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

function Badge({color,children}){
  return(
    <span style={{
      fontSize:'0.68rem', padding:'3px 8px', borderRadius:'6px',
      fontWeight:'700', color, background:color+'1a',
      whiteSpace:'nowrap', letterSpacing:'0.1px',
    }}>
      {children}
    </span>
  );
}

function StatCard({label,value,icon:Icon,iconText,color,T}){
  return(
    <div style={{
      background:T.surface, borderRadius:'18px', padding:'15px',
      boxShadow:T.cardShadow, display:'flex', alignItems:'flex-start', gap:'12px',
      border:`1px solid ${T.border}`, position:'relative', overflow:'hidden',
    }}>
      <div aria-hidden style={{position:'absolute',inset:0,background:`radial-gradient(120% 90% at 100% 0%, ${color}0e, transparent 55%)`,pointerEvents:'none'}}/>
      <div style={{width:'42px',height:'42px',borderRadius:'13px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${color}24`,position:'relative'}}>
        {iconText
          ? <span style={{fontSize:'1rem',fontWeight:'800',color}}>{iconText}</span>
          : <Icon size={19} color={color}/>
        }
      </div>
      <div style={{minWidth:0,flex:1,position:'relative'}}>
        <p style={{margin:0,fontSize:'0.64rem',color:T.textMuted,fontWeight:'600',letterSpacing:'0.4px',textTransform:'uppercase'}}>{label}</p>
        <p style={{margin:'4px 0 0',fontSize:'clamp(0.74rem,2.8vw,0.9rem)',fontWeight:'700',color:T.text,whiteSpace:'nowrap',letterSpacing:'-0.4px',lineHeight:'1.25',fontVariantNumeric:'tabular-nums'}}>{value}</p>
      </div>
    </div>
  );
}

function SaveBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{
      width:'100%', padding:'15px', borderRadius:'14px', border:'none',
      background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
      color:'#fff', fontWeight:'800', fontSize:'0.95rem',
      cursor:'pointer', fontFamily:'inherit', marginTop:'10px',
      boxShadow:`0 4px 20px ${T.gold}40`,
      letterSpacing:'-0.2px',
    }}>
      {label}
    </button>
  );
}
function CancelBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{
      width:'100%', padding:'13px', borderRadius:'14px',
      border:`1.5px solid ${T.border}`, background:'transparent',
      color:T.textMuted, fontWeight:'600', fontSize:'0.88rem',
      cursor:'pointer', fontFamily:'inherit', marginTop:'8px',
    }}>
      {label}
    </button>
  );
}
function AddBtn({onClick,label,T}){
  return(
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:'5px',
      padding:'10px 16px', borderRadius:'12px', border:'none',
      background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,
      color:'#fff', fontWeight:'700', fontSize:'0.82rem',
      cursor:'pointer', fontFamily:'inherit',
      boxShadow:`0 3px 12px ${T.gold}35`,
    }}>
      <Plus size={14}/>{label}
    </button>
  );
}
function SmBtn({onClick,label,icon:Icon,color,T}){
  return(
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:'4px',
      padding:'7px 11px', borderRadius:'9px',
      border:`1px solid ${color}30`, background:color+'0f',
      color, fontWeight:'600', fontSize:'0.73rem',
      cursor:'pointer', fontFamily:'inherit',
      transition:'all 0.15s',
    }}>
      {Icon&&<Icon size={12}/>}{label}
    </button>
  );
}

// Empty state
function EmptyState({icon,title,subtitle,T}){
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem 1rem',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:'12px',opacity:0.5}}>{icon}</div>
      <p style={{margin:0,fontSize:'0.95rem',fontWeight:'700',color:T.textMuted}}>{title}</p>
      {subtitle&&<p style={{margin:'6px 0 0',fontSize:'0.8rem',color:T.textDim}}>{subtitle}</p>}
    </div>
  );
}

// validate helper
function validate(fields,t){
  const errors={};
  fields.forEach(([key,val])=>{ if(!val||String(val).trim()==='')errors[key]=t.fieldRequired; });
  return errors;
}

// Section header (iOS style)
function SectionHeader({title,T}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',margin:'20px 0 10px'}}>
      <span style={{fontSize:'0.67rem',fontWeight:'700',color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.8px'}}>{title}</span>
      <div style={{flex:1,height:'1px',background:T.border}}/>
    </div>
  );
}

// Sub tab bar — iOS segmented-style
function SubTabs({tabs,active,onChange,T}){
  return(
    <div style={{
      display:'flex', gap:'0', background:T.surface2,
      borderRadius:'12px', padding:'3px',
      marginBottom:'14px', overflow:'hidden',
      border:`1px solid ${T.border}`,
    }}>
      {tabs.map(tab=>(
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{
          flex:1, padding:'8px 6px', borderRadius:'10px', border:'none',
          background: active===tab.id ? T.surface : 'transparent',
          color: active===tab.id ? T.text : T.textMuted,
          fontSize:'0.78rem', fontWeight: active===tab.id ? '700' : '500',
          cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
          transition:'all 0.2s',
          boxShadow: active===tab.id ? T.cardShadow || '0 1px 4px rgba(0,0,0,0.15)' : 'none',
        }}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
// ═══ DASHBOARD ═══
function Dashboard({data,lang,t,T}){
  const re=data.realEstate||[],co=data.companies||[],ve=data.vehicles||[],iv=data.investments||[],tr=data.transactions||[];
  const totalAssets=re.reduce((s,p)=>s+num(p.value),0)+co.reduce((s,c)=>s+num(c.capital),0)+ve.reduce((s,v)=>s+num(v.value),0)+iv.reduce((s,i)=>s+num(i.currentValue),0);

  // Monthly income: sum from active companies + normalized rent from properties
  const rentNormalize=(amt,freq)=>{const a=num(amt);if(!a)return 0;if(freq==='quarterly')return a/3;if(freq==='yearly')return a/12;return a;};
  const rentIncome=re.reduce((s,p)=>{if(p.hasUnits)return s+(p.units||[]).filter(u=>u.status==='occupied').reduce((su,u)=>su+rentNormalize(u.rent?.amount,u.rent?.frequency),0);if(p.status==='occupied')return s+rentNormalize(p.rent?.amount,p.rent?.frequency);return s;},0);
  const companyIncome=co.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+num(c.monthlyRevenue),0);
  const mInc=rentIncome+companyIncome;

  // Monthly expenses: company costs + vehicle installments + recurring operations
  const companyExp=co.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+num(c.monthlyExpense),0);
  const loanExp=ve.reduce((s,v)=>s+num(v.loan?.monthlyInstallment),0);
  const recurringOps=(data.operations||[]).filter(o=>o.frequency==='monthly'&&o.status!=='paid').reduce((s,o)=>s+num(o.amount),0);
  const mExp=companyExp+loanExp+recurringOps;
  const alerts=[];
  re.forEach(p=>{
    const units=p.hasUnits?p.units:(p.status==='occupied'?[p]:[]);
    units.filter(u=>u.status==='occupied').forEach(u=>{
      const d=daysUntil(u.rent?.nextDue);if(d!==null&&d<=30)alerts.push({label:t.rentDue,name:p.name+(p.hasUnits?' - وحدة '+u.number:''),days:d,color:d<=7?T.danger:T.warning});
      const dc=daysUntil(u.contract?.endDate);if(dc!==null&&dc>=0&&dc<=60)alerts.push({label:t.contractExpiring,name:p.name,days:dc,color:dc<=14?T.danger:T.warning});
    });
  });
  ve.forEach(v=>{const di=daysUntil(v.insurance?.expiryDate);if(di!==null&&di<=30)alerts.push({label:t.insuranceExpiring,name:v.name,days:di,color:di<=7?T.danger:T.warning});});
  (data.operations||[]).filter(o=>o.status==='pending').forEach(o=>{const d=daysUntil(o.nextDue||o.date);if(d!==null&&d<=7)alerts.push({label:(lang==='ar'?OP_T.ar:OP_T.en)[o.type]||o.type,name:o.description,days:d,color:d<=2?T.danger:T.warning});});
  (data.loansGiven||[]).filter(l=>l.status==='active').forEach(l=>{const d=daysUntil(l.returnDate);if(d!==null&&d<=30)alerts.push({label:lang==='ar'?'قرض مُعطى':'Loan due',name:l.borrowerName,days:d,color:d<=7?T.danger:T.warning});});
  alerts.sort((a,b)=>a.days-b.days);
  // Build chart from months that have actual data, fallback to last 6 calendar months
  const allMonths=[...new Set(tr.map(tx=>tx.date?.substring(0,7)).filter(Boolean))].sort();
  const chartMonths=allMonths.length>=2
    ? allMonths.slice(-6)
    : Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;});
  const chartData=chartMonths.map(ym=>{
    const [y,m]=ym.split('-').map(Number);
    const mn=lang==='ar'?MONTHS_AR[m-1]:MONTHS_EN[m-1];
    const inc=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='income'&&td.getMonth()===m-1&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);
    const expTr=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='expense'&&td.getMonth()===m-1&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);
    const expManual=(data.expenses||[]).filter(ex=>{const td=new Date(ex.date);return td.getMonth()===m-1&&td.getFullYear()===y;}).reduce((s,ex)=>s+ex.amount,0);
    return{name:mn,دخل:inc,مصاريف:expTr+expManual};
  });
  // Aggregated installment liabilities (vehicles + installment-type operations)
  const vehLoans=ve.map(v=>loanSummary(v.loan)).filter(L=>L.hasLoan);
  const opInst=(data.operations||[]).filter(o=>o.type==='installment');
  const liabMonthly=vehLoans.reduce((s,L)=>s+L.inst,0)+opInst.filter(o=>o.frequency==='monthly').reduce((s,o)=>s+num(o.amount),0);
  const liabRemaining=vehLoans.reduce((s,L)=>s+L.remainingAmount,0)+opInst.reduce((s,o)=>s+num(o.remainingMonths)*num(o.amount),0);
  const liabCount=vehLoans.length+opInst.length;
  // True net worth = assets minus outstanding obligations
  const netWorth=totalAssets-liabRemaining;
  const pieData=[{name:lang==='ar'?'عقارات':'Real Estate',value:re.reduce((s,p)=>s+num(p.value),0)},{name:lang==='ar'?'شركات':'Companies',value:co.reduce((s,c)=>s+num(c.capital),0)},{name:lang==='ar'?'مركبات':'Vehicles',value:ve.reduce((s,v)=>s+num(v.value),0)},{name:lang==='ar'?'استثمارات':'Investments',value:iv.reduce((s,i)=>s+num(i.currentValue),0)}].filter(d=>d.value>0);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      {/* Hero */}
      {(()=>{
        const savingRate=mInc>0?Math.round(((mInc-mExp)/mInc)*100):0;
        const rateColor=savingRate>=30?'#4ade80':savingRate>=15?'#fde68a':'#fca5a5';
        const rateLabel=savingRate>=30?(lang==='ar'?'ممتاز':'Excellent'):savingRate>=15?(lang==='ar'?'جيد':'Good'):(lang==='ar'?'تحت المستوى':'Below avg');
        return(
          <div style={{
            background:`linear-gradient(145deg,${T.goldDark} 0%,${T.gold} 55%,#e8c96a 100%)`,
            borderRadius:'24px',padding:'24px',textAlign:'center',
            position:'relative',overflow:'hidden',
            boxShadow:`0 8px 32px ${T.gold}40`,
          }}>
            <div style={{position:'absolute',top:'-30%',right:'-10%',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,255,255,0.08)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',bottom:'-20%',left:'-5%',width:'120px',height:'120px',borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}}/>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.72rem',margin:'0 0 6px',fontWeight:'700',letterSpacing:'0.8px',textTransform:'uppercase'}}>{t.netWorth}</p>
            <p style={{color:'#fff',fontSize:'2.5rem',fontWeight:'900',margin:'0 0 2px',letterSpacing:'-1.5px',textShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>{fmt(netWorth)}</p>
            <p style={{color:'rgba(255,255,255,0.6)',fontSize:'0.72rem',margin:'0 0 10px',fontWeight:'500'}}>{lang==='ar'?'ريال سعودي':'Saudi Riyal'}</p>
            {liabRemaining>0&&(
              <div style={{display:'flex',justifyContent:'center',gap:'14px',margin:'0 0 12px',flexWrap:'wrap'}}>
                <span style={{color:'rgba(255,255,255,0.88)',fontSize:'0.7rem',fontWeight:'600'}}>{t.totalAssets}: <strong>{fmt(totalAssets)}</strong></span>
                <span style={{color:'rgba(255,255,255,0.88)',fontSize:'0.7rem',fontWeight:'600'}}>− {t.liabilities}: <strong>{fmt(liabRemaining)}</strong></span>
              </div>
            )}
            {/* Asset Summary Pills */}
            {(re.length+co.length+ve.length+iv.length)>0&&(
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'6px',marginBottom:'14px'}}>
                {re.length>0&&<span style={{background:'rgba(255,255,255,0.18)',color:'rgba(255,255,255,0.92)',fontSize:'0.68rem',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',backdropFilter:'blur(4px)'}}>{re.length} {lang==='ar'?'عقار':'Properties'}</span>}
                {co.length>0&&<span style={{background:'rgba(255,255,255,0.18)',color:'rgba(255,255,255,0.92)',fontSize:'0.68rem',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',backdropFilter:'blur(4px)'}}>{co.length} {lang==='ar'?'شركة':'Companies'}</span>}
                {ve.length>0&&<span style={{background:'rgba(255,255,255,0.18)',color:'rgba(255,255,255,0.92)',fontSize:'0.68rem',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',backdropFilter:'blur(4px)'}}>{ve.length} {lang==='ar'?'مركبة':'Vehicles'}</span>}
                {iv.length>0&&<span style={{background:'rgba(255,255,255,0.18)',color:'rgba(255,255,255,0.92)',fontSize:'0.68rem',fontWeight:'700',padding:'3px 10px',borderRadius:'20px',backdropFilter:'blur(4px)'}}>{iv.length} {lang==='ar'?'استثمار':'Investments'}</span>}
              </div>
            )}
            {/* Savings Rate Bar */}
            {mInc>0&&(
              <div style={{background:'rgba(0,0,0,0.15)',borderRadius:'12px',padding:'10px 14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.7rem',fontWeight:'600'}}>{lang==='ar'?'معدل التوفير الشهري':'Monthly Savings Rate'}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                    <span style={{color:rateColor,fontSize:'0.85rem',fontWeight:'900'}}>{savingRate}%</span>
                    <span style={{background:'rgba(255,255,255,0.15)',color:rateColor,fontSize:'0.62rem',fontWeight:'700',padding:'1px 6px',borderRadius:'6px'}}>{rateLabel}</span>
                  </div>
                </div>
                <div style={{height:'5px',background:'rgba(255,255,255,0.15)',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(Math.max(savingRate,0),100)}%`,background:rateColor,borderRadius:'3px',transition:'width 0.6s ease'}}/>
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <StatCard label={lang==='ar'?'الدخل الشهري':'Monthly Income'} value={fmtC(mInc,lang)} icon={TrendingUp} color={T.success} T={T}/>
        <StatCard label={lang==='ar'?'المصاريف الشهرية':'Monthly Expenses'} value={fmtC(mExp,lang)} icon={TrendingDown} color={T.danger} T={T}/>
        <StatCard label={lang==='ar'?'صافي شهري':'Net Monthly'} value={fmtC(mInc-mExp,lang)} iconText='ر' color={mInc>=mExp?T.success:T.danger} T={T}/>
        <StatCard label={t.totalAssets} value={fmtC(totalAssets,lang)} icon={Briefcase} color={T.gold} T={T}/>
      </div>
      {/* Installments & Liabilities */}
      {liabCount>0&&(
        <div style={{background:T.surface,borderRadius:'20px',padding:'16px',boxShadow:T.cardShadow,border:`1px solid ${T.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'8px',background:T.gold+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><ShieldCheck size={14} color={T.gold}/></div>
            <span style={{color:T.text,fontWeight:'700',fontSize:'0.88rem',flex:1}}>{t.liabilities}</span>
            <span style={{background:T.gold,color:'#fff',borderRadius:'10px',padding:'2px 8px',fontSize:'0.65rem',fontWeight:'800'}}>{liabCount}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <div style={{background:T.surface2,borderRadius:'12px',padding:'12px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{t.monthlyObligations}</p><p style={{margin:'2px 0 0',fontWeight:'800',fontSize:'0.95rem',color:T.danger}}>{fmtC(liabMonthly,lang)}</p></div>
            <div style={{background:T.surface2,borderRadius:'12px',padding:'12px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{t.totalRemainingDebt}</p><p style={{margin:'2px 0 0',fontWeight:'800',fontSize:'0.95rem',color:T.warning}}>{fmtC(liabRemaining,lang)}</p></div>
          </div>
          <div style={{marginTop:'10px',display:'flex',flexDirection:'column',gap:'6px'}}>
            {ve.filter(v=>loanSummary(v.loan).hasLoan).map(v=>{const L=loanSummary(v.loan);return(
              <div key={v.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'0.74rem',padding:'6px 10px',background:T.surface2,borderRadius:'10px'}}>
                <span style={{color:T.text}}>🚗 {v.name}</span>
                <span style={{color:T.textMuted}}>{L.rem}{L.total>0?`/${L.total}`:''} • <span style={{color:T.danger,fontWeight:'700'}}>{fmtC(L.remainingAmount,lang)}</span></span>
              </div>
            );})}
            {opInst.map(o=>(
              <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'0.74rem',padding:'6px 10px',background:T.surface2,borderRadius:'10px'}}>
                <span style={{color:T.text}}>💳 {o.description}</span>
                <span style={{color:T.textMuted}}>{o.remainingMonths?`${o.remainingMonths} • `:''}<span style={{color:T.danger,fontWeight:'700'}}>{fmtC((o.remainingMonths||0)*o.amount||o.amount,lang)}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Alerts */}
      {alerts.length>0&&(
        <div style={{background:T.surface,borderRadius:'20px',padding:'16px',boxShadow:T.cardShadow,border:`1px solid ${T.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'8px',background:T.danger+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><Bell size={13} color={T.danger}/></div>
            <span style={{color:T.text,fontWeight:'700',fontSize:'0.88rem',flex:1}}>{t.alerts}</span>
            <span style={{background:T.danger,color:'#fff',borderRadius:'10px',padding:'2px 8px',fontSize:'0.65rem',fontWeight:'800'}}>{alerts.length}</span>
          </div>
          {alerts.map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 12px',borderRadius:'14px',background:a.color+'0e',border:`1px solid ${a.color}28`,marginBottom:'6px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'10px',background:a.color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><AlertTriangle size={14} color={a.color}/></div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:'0.82rem',fontWeight:'600',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</p>
                <p style={{margin:0,fontSize:'0.7rem',color:T.textMuted,marginTop:'1px'}}>{a.label}</p>
              </div>
              <span style={{fontSize:'0.73rem',fontWeight:'800',color:a.color,whiteSpace:'nowrap',background:a.color+'15',padding:'3px 8px',borderRadius:'8px'}}>{a.days<=0?'اليوم!':a.days===1?'غداً':`${a.days} ${t.days}`}</span>
            </div>
          ))}
        </div>
      )}
      {/* Chart */}
      <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <p style={{color:T.text,fontWeight:'700',fontSize:'0.85rem',margin:'0 0 12px',display:'flex',alignItems:'center',gap:'6px'}}><BarChart3 size={14} color={T.gold}/>{t.incomeVsExpense}</p>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={chartData} margin={{top:0,right:0,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.success} stopOpacity={0.3}/><stop offset="95%" stopColor={T.success} stopOpacity={0}/></linearGradient>
              <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.danger} stopOpacity={0.3}/><stop offset="95%" stopColor={T.danger} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="name" tick={{fontSize:10,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/>
            <Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'12px',color:T.text,fontSize:'0.8rem'}}/>
            <Area type="monotone" dataKey="دخل" stroke={T.success} fill="url(#ig)" strokeWidth={2}/>
            <Area type="monotone" dataKey="مصاريف" stroke={T.danger} fill="url(#eg)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Pie + Recent */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <p style={{color:T.text,fontWeight:'700',fontSize:'0.78rem',margin:'0 0 8px'}}>{t.assetDistribution}</p>
          {pieData.length>0?(<><ResponsiveContainer width="100%" height={110}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={3} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text,fontSize:'0.75rem'}}/></PieChart></ResponsiveContainer>
          <div>{pieData.map((d,i)=>(<div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',marginBottom:'2px'}}><div style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'7px',height:'7px',borderRadius:'50%',background:PIE_COLORS[i%PIE_COLORS.length],display:'inline-block'}}/><span style={{color:T.textMuted}}>{d.name}</span></div><span style={{color:T.text,fontWeight:'700'}}>{pct(d.value,totalAssets)}%</span></div>))}</div></>):<p style={{color:T.textMuted,textAlign:'center',fontSize:'0.78rem',padding:'1rem'}}>{t.noData}</p>}
        </div>
        <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <p style={{color:T.text,fontWeight:'700',fontSize:'0.78rem',margin:'0 0 8px'}}>{t.recentTransactions}</p>
          {(data.transactions||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4).map((tx,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <div style={{width:'26px',height:'26px',borderRadius:'8px',background:tx.type==='income'?T.success+'22':T.danger+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{tx.type==='income'?<ArrowUpCircle size={11} color={T.success}/>:<ArrowDownCircle size={11} color={T.danger}/>}</div>
              <div style={{flex:1,minWidth:0}}><p style={{margin:0,fontSize:'0.7rem',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tx.description}</p><p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{fmtDate(tx.date,lang)}</p></div>
              <span style={{fontSize:'0.7rem',fontWeight:'700',color:tx.type==='income'?T.success:T.danger,whiteSpace:'nowrap'}}>{tx.type==='income'?'+':'-'}{fmt(tx.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ REAL ESTATE ═══
function RealEstatePage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[unitModal,setUnitModal]=useState(null);
  const [expandedId,setExpandedId]=useState(null),[search,setSearch]=useState('');
  const [form,setForm]=useState({}),[unitForm,setUnitForm]=useState({}),[errors,setErrors]=useState({});
  const [paidFlash,setPaidFlash]=useState(null);
  const items=data.realEstate||[];const pt=lang==='ar'?PROP_T.ar:PROP_T.en;const ft=lang==='ar'?FREQ_T.ar:FREQ_T.en;
  const openAdd=()=>{setForm({name:'',type:'',location:'',value:'',status:'',hasUnits:false,units:[],tenant:{name:'',phone:''},rent:{amount:'',frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''},notes:''});setErrors({});setModal('add');};
  const openEdit=item=>{setForm({...item,value:String(item.value),rent:{...item.rent,amount:String(item.rent?.amount||'')}});setErrors({});setModal({edit:item});};
  const save=()=>{
    const errs=validate([['name',form.name],['type',form.type],['value',form.value],['status',form.status]],t);
    if(Object.keys(errs).length){setErrors(errs);return;}
    const entry={...form,id:modal==='add'?genId():form.id,value:Number(form.value)||0,rent:{...form.rent,amount:Number(form.rent?.amount)||0}};
    setData(d=>({...d,realEstate:modal==='add'?[...(d.realEstate||[]),entry]:(d.realEstate||[]).map(x=>x.id===entry.id?entry:x)}));
    logActivity(modal==='add'?t.addedAction:t.editedAction,t.realEstate,`"${entry.name}"`);setModal(null);
  };
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,realEstate:d.realEstate.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.realEstate,`"${item?.name}"`);setConfirm(null);};
  const markPaid=(pid,uid)=>{
    setData(d=>({...d,realEstate:d.realEstate.map(p=>{if(p.id!==pid)return p;if(uid&&p.hasUnits)return{...p,units:p.units.map(u=>u.id===uid?{...u,rent:{...u.rent,lastPaid:todayStr()}}:u)};return{...p,rent:{...p.rent,lastPaid:todayStr()}};})}));
    logActivity(t.paidAction,t.realEstate,`إيجار "${items.find(p=>p.id===pid)?.name}"`);
    setPaidFlash(uid||pid);setTimeout(()=>setPaidFlash(null),1800);
  };;
  const openAddUnit=pid=>{setUnitForm({id:'',number:'',floor:'',type:'',status:'',tenant:{name:'',phone:''},rent:{amount:'',frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''}});setErrors({});setUnitModal({pid,isNew:true});};
  const openEditUnit=(pid,u)=>{setUnitForm({...u,rent:{...u.rent,amount:String(u.rent?.amount||'')}});setErrors({});setUnitModal({pid,isNew:false});};
  const saveUnit=()=>{
    const errs=validate([['number',unitForm.number],['type',unitForm.type],['status',unitForm.status]],t);
    if(Object.keys(errs).length){setErrors(errs);return;}
    const entry={...unitForm,id:unitModal.isNew?genId():unitForm.id,rent:{...unitForm.rent,amount:Number(unitForm.rent?.amount)||0}};
    setData(d=>({...d,realEstate:d.realEstate.map(p=>p.id===unitModal.pid?{...p,units:unitModal.isNew?[...(p.units||[]),entry]:(p.units||[]).map(u=>u.id===entry.id?entry:u)}:p)}));setUnitModal(null);
  };
  const delUnit=(pid,uid)=>setData(d=>({...d,realEstate:d.realEstate.map(p=>p.id===pid?{...p,units:p.units.filter(u=>u.id!==uid)}:p)}));
  const filtered=items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.location?.toLowerCase().includes(search.toLowerCase()));
  const goldGrad=`linear-gradient(135deg,${T.goldDark},${T.gold})`;
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{flex:1,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:'12px',padding:'10px 14px',color:T.text,fontSize:'0.85rem',fontFamily:'inherit',outline:'none'}}/>
        <AddBtn onClick={openAdd} label={t.add} T={T}/>
      </div>
      {filtered.length===0&&<EmptyState icon="🏠" title={lang==='ar'?'لا توجد عقارات':'No properties yet'} subtitle={lang==='ar'?'اضغط إضافة لتسجيل أول عقار':'Tap Add to register your first property'} T={T}/>}
      {filtered.map(item=>{const isEx=expandedId===item.id;const du=!item.hasUnits&&daysUntil(item.rent?.nextDue);const ce=!item.hasUnits&&daysUntil(item.contract?.endDate);const statColor=item.status==='occupied'?T.success:item.status==='personal'?T.info:T.warning;const statLabel=item.status==='occupied'?t.occupied:item.status==='personal'?t.personal:t.vacant;const isFlashing=paidFlash===item.id||(item.units||[]).some(u=>paidFlash===u.id);return(
        <div key={item.id} style={{background:isFlashing?T.success+'18':T.surface,borderRadius:'20px',boxShadow:T.cardShadow,overflow:'hidden',border:`1.5px solid ${isFlashing?T.success:T.border}`,transition:'all 0.4s ease'}}>
          <div style={{padding:'14px',cursor:'pointer'}} onClick={()=>setExpandedId(isEx?null:item.id)}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap',marginBottom:'4px'}}>
                  <h4 style={{margin:0,color:T.text,fontWeight:'700',fontSize:'0.95rem'}}>{item.name}</h4>
                  {item.hasUnits&&<Badge color={T.info}>{item.units?.length||0} {t.units}</Badge>}
                  {!item.hasUnits&&<Badge color={statColor}>{statLabel}</Badge>}
                </div>
                <p style={{margin:0,fontSize:'0.74rem',color:T.textMuted}}>{item.location} • {pt[item.type]||item.type} • {fmtC(item.value,lang)}</p>
                {!item.hasUnits&&item.status==='occupied'&&<div style={{display:'flex',gap:'6px',marginTop:'4px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.7rem',color:T.textMuted}}>{item.tenant?.name}</span>
                  {du!==null&&du<=30&&<Badge color={T.warning}>⚠️ {du} {t.days}</Badge>}
                  {ce!==null&&ce>=0&&ce<=60&&<Badge color={T.danger}>⚠️ {t.contractExpiring}</Badge>}
                </div>}
              </div>
              <ChevronDown size={16} color={T.textMuted} style={{transform:isEx?'rotate(0deg)':'rotate(-90deg)',transition:'transform 0.2s',flexShrink:0}}/>
            </div>
          </div>
          {isEx&&<div style={{borderTop:`1px solid ${T.border}`,padding:'12px 14px'}}>
            {item.hasUnits?(<>{(item.units||[]).map(u=>(
              <div key={u.id} style={{background:T.surface2,borderRadius:'12px',padding:'10px',marginBottom:'6px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'0.8rem',fontWeight:'700',color:T.gold}}>وحدة {u.number}</span>
                  {u.floor&&<span style={{fontSize:'0.7rem',color:T.textMuted}}>ط{u.floor}</span>}
                  <Badge color={u.status==='occupied'?T.success:u.status==='personal'?T.info:T.warning}>{u.status==='occupied'?t.occupied:u.status==='personal'?t.personal:t.vacant}</Badge>
                  {u.status==='occupied'&&u.tenant?.name&&<span style={{fontSize:'0.72rem',color:T.text}}>— {u.tenant.name}</span>}
                  <div style={{marginRight:'auto',display:'flex',gap:'4px'}}>
                    {u.status==='occupied'&&<SmBtn onClick={()=>markPaid(item.id,u.id)} label={t.markPaid} icon={CheckCircle2} color={T.success} T={T}/>}
                    <SmBtn onClick={()=>openEditUnit(item.id,u)} label="" icon={Pencil} color={T.info} T={T}/>
                    {canDelete&&<SmBtn onClick={()=>delUnit(item.id,u.id)} label="" icon={Trash2} color={T.danger} T={T}/>}
                  </div>
                </div>
                {u.status==='occupied'&&<div style={{display:'flex',gap:'10px',marginTop:'6px',fontSize:'0.72rem',color:T.textMuted,flexWrap:'wrap'}}>
                  <span>{fmtC(u.rent?.amount,lang)} / {ft[u.rent?.frequency]}</span>
                  {daysUntil(u.rent?.nextDue)!==null&&daysUntil(u.rent?.nextDue)<=30&&<span style={{color:T.warning}}>⚠️ {daysUntil(u.rent?.nextDue)} {t.days}</span>}
                </div>}
              </div>
            ))}<button onClick={()=>openAddUnit(item.id)} style={{width:'100%',padding:'10px',borderRadius:'12px',border:`1.5px dashed ${T.border}`,background:'transparent',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:'0.8rem',marginTop:'4px'}}>+ {t.addUnit}</button></>
            ):item.status==='occupied'&&(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
                {[{l:t.startDate,v:fmtDate(item.contract?.startDate,lang)},{l:t.endDate,v:fmtDate(item.contract?.endDate,lang)},{l:t.lastPaid,v:fmtDate(item.rent?.lastPaid,lang)},{l:t.phone,v:item.tenant?.phone}].map((f,i)=>(
                  <div key={i} style={{background:T.surface2,borderRadius:'10px',padding:'8px'}}><p style={{margin:0,fontSize:'0.65rem',color:T.textMuted}}>{f.l}</p><p style={{margin:0,fontSize:'0.78rem',color:T.text,fontWeight:'600'}}>{f.v||'—'}</p></div>
                ))}
              </div>
            )}
            {item.notes&&<p style={{fontSize:'0.73rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 10px'}}>"{item.notes}"</p>}
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
              {!item.hasUnits&&item.status==='occupied'&&<SmBtn onClick={()=>markPaid(item.id,null)} label={t.markPaid} icon={CheckCircle2} color={T.success} T={T}/>}
              <SmBtn onClick={()=>openEdit(item)} label={t.edit} icon={Pencil} color={T.info} T={T}/>
              {canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label={t.delete} icon={Trash2} color={T.danger} T={T}/>}
            </div>
          </div>}
        </div>
      );})}
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.realEstate}`:t.edit} onClose={()=>setModal(null)} T={T}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name} error={errors.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} T={T} error={errors.name}/></Field>
          <Field label={t.type} error={errors.type}><Sel value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} T={T}><option value="">{t.selectType}</option>{Object.entries(pt).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          <Field label={t.location}><Inp value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} T={T}/></Field>
          <Field label={`${t.value} (${t.sar})`} error={errors.value}><Inp type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} T={T} error={errors.value}/></Field>
          <div style={{gridColumn:'1/-1'}}>
            <Field label={t.status} error={errors.status}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
                {[['occupied',t.occupied,T.success],['vacant',t.vacant,T.warning],['personal',t.personal,T.info]].map(([v,l,c])=>(
                  <button key={v} onClick={()=>setForm(f=>({...f,status:v}))} style={{padding:'10px',borderRadius:'12px',border:`1.5px solid ${form.status===v?c:T.border}`,background:form.status===v?c+'22':'transparent',color:form.status===v?c:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.8rem',transition:'all 0.15s'}}>{l}</button>
                ))}
              </div>
              {errors.status&&<p style={{margin:'4px 0 0',fontSize:'0.7rem',color:T.danger}}>{errors.status}</p>}
            </Field>
          </div>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',color:T.text,fontSize:'0.85rem'}}><input type="checkbox" checked={form.hasUnits||false} onChange={e=>setForm(f=>({...f,hasUnits:e.target.checked}))} style={{width:'16px',height:'16px',accentColor:T.gold}}/>{lang==='ar'?'يحتوي على وحدات متعددة':'Has multiple units'}</label></div>
        </div>
        {!form.hasUnits&&form.status==='occupied'&&<>
          <SectionHeader title={t.tenant} T={T}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.name} T={T}><Inp value={form.tenant?.name} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}})) } T={T}/></Field>
            <Field label={t.phone} T={T}><Inp value={form.tenant?.phone} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}})) } T={T}/></Field>
          </div>
          <SectionHeader title={t.rent} T={T}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
            <Field label={t.amount} T={T}><Inp type="number" value={form.rent?.amount} onChange={e=>setForm(f=>({...f,rent:{...f.rent,amount:e.target.value}})) } T={T}/></Field>
            <Field label={t.frequency} T={T}><Sel value={form.rent?.frequency} onChange={e=>setForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}})) } T={T}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
            <Field label={t.nextDue} T={T}><Inp type="date" value={form.rent?.nextDue} onChange={e=>setForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}})) } T={T}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.startDate} T={T}><Inp type="date" value={form.contract?.startDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}})) } T={T}/></Field>
            <Field label={t.endDate} T={T}><Inp type="date" value={form.contract?.endDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}})) } T={T}/></Field>
          </div>
        </>}
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/>
        <CancelBtn onClick={()=>setModal(null)} label={t.cancel} T={T}/>
      </Modal>}
      {unitModal&&<Modal title={unitModal.isNew?t.addUnit:t.edit} onClose={()=>setUnitModal(null)} T={T}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.unitNumber} error={errors.number}><Inp value={unitForm.number} onChange={e=>setUnitForm(f=>({...f,number:e.target.value}))} T={T} error={errors.number}/></Field>
          <Field label={t.floor}><Inp value={unitForm.floor} onChange={e=>setUnitForm(f=>({...f,floor:e.target.value}))} T={T}/></Field>
          <Field label={t.type} error={errors.type}><Sel value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))} T={T}><option value="">{t.selectType}</option>{Object.entries(pt).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          <Field label={t.status} error={errors.status}>
            <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
              {[['occupied',t.occupied,T.success],['vacant',t.vacant,T.warning],['personal',t.personal,T.info]].map(([v,l,c])=>(
                <button key={v} onClick={()=>setUnitForm(f=>({...f,status:v}))} style={{padding:'8px 12px',borderRadius:'10px',border:`1.5px solid ${unitForm.status===v?c:T.border}`,background:unitForm.status===v?c+'22':'transparent',color:unitForm.status===v?c:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.78rem'}}>{l}</button>
              ))}
            </div>
          </Field>
        </div>
        {unitForm.status==='occupied'&&<>
          <SectionHeader title={t.tenant} T={T}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.name} T={T}><Inp value={unitForm.tenant?.name} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}})) } T={T}/></Field>
            <Field label={t.phone} T={T}><Inp value={unitForm.tenant?.phone} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}})) } T={T}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
            <Field label={t.amount} T={T}><Inp type="number" value={unitForm.rent?.amount} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,amount:e.target.value}})) } T={T}/></Field>
            <Field label={t.frequency} T={T}><Sel value={unitForm.rent?.frequency} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}})) } T={T}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
            <Field label={t.nextDue} T={T}><Inp type="date" value={unitForm.rent?.nextDue} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}})) } T={T}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.startDate} T={T}><Inp type="date" value={unitForm.contract?.startDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}})) } T={T}/></Field>
            <Field label={t.endDate} T={T}><Inp type="date" value={unitForm.contract?.endDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}})) } T={T}/></Field>
          </div>
        </>}
        <SaveBtn onClick={saveUnit} label={t.save} T={T}/>
        <CancelBtn onClick={()=>setUnitModal(null)} label={t.cancel} T={T}/>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}
function CompaniesPage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({});
  const items=data.companies||[];
  const openAdd=()=>{setForm({name:'',type:'',companyStatus:'active',ownership:100,capital:'',monthlyRevenue:'',monthlyExpense:'',employees:[],notes:''});setErrors({});setModal('add');};
  const openEdit=item=>{setForm({...item,capital:String(item.capital),monthlyRevenue:String(item.monthlyRevenue),monthlyExpense:String(item.monthlyExpense)});setErrors({});setModal({edit:item});};
  const save=()=>{const errs=validate([['name',form.name],['capital',form.capital]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:modal==='add'?genId():form.id,capital:Number(form.capital)||0,monthlyRevenue:Number(form.monthlyRevenue)||0,monthlyExpense:Number(form.monthlyExpense)||0,ownership:Number(form.ownership)||0,employees:(form.employees||[]).map(e=>({...e,salary:Number(e.salary)||0}))};setData(d=>({...d,companies:modal==='add'?[...(d.companies||[]),entry]:(d.companies||[]).map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.companies,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,companies:d.companies.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.companies,`"${item?.name}"`);setConfirm(null);};
  const addEmp=()=>setForm(f=>({...f,employees:[...(f.employees||[]),{id:genId(),name:'',salary:''}]}));
  const remEmp=eid=>setForm(f=>({...f,employees:f.employees.filter(e=>e.id!==eid)}));
  const editEmp=(eid,field,val)=>setForm(f=>({...f,employees:f.employees.map(e=>e.id===eid?{...e,[field]:val}:e)}));
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <p style={{margin:0,fontSize:'0.78rem',color:T.textMuted}}>{lang==='ar'?'صافي شهري:':'Net/mo:'} <strong style={{color:T.success}}>{fmtC(items.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+c.monthlyRevenue-c.monthlyExpense,0),lang)}</strong></p>
        <AddBtn onClick={openAdd} label={t.add} T={T}/>
      </div>
      {items.length===0&&<EmptyState icon="🏢" title={lang==='ar'?'لا توجد شركات':'No companies yet'} subtitle={lang==='ar'?'أضف شركاتك ومشاريعك هنا':'Add your companies and projects here'} T={T}/>}
      {items.map(item=>{const profit=item.monthlyRevenue-item.monthlyExpense;const isActive=item.companyStatus==='active';return(
        <div key={item.id} style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px',flexWrap:'wrap',gap:'4px'}}>
            <div><div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.name}</h4><Badge color={isActive?T.success:T.warning}>{isActive?t.activeCompany:t.underConstruction}</Badge></div><p style={{margin:'2px 0 0',fontSize:'0.73rem',color:T.textMuted}}>{item.type} • {item.ownership}% {t.ownership}</p></div>
            {isActive&&<div style={{textAlign:'end'}}><p style={{margin:0,fontSize:'0.9rem',fontWeight:'800',color:profit>=0?T.success:T.danger}}>{profit>=0?'+':''}{fmtC(profit,lang)}</p><p style={{margin:0,fontSize:'0.65rem',color:T.textMuted}}>{lang==='ar'?'شهرياً':'monthly'}</p></div>}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'10px'}}>
            {[{l:t.capital,v:fmtC(item.capital,lang)},{l:t.revenue,v:fmtC(item.monthlyRevenue,lang)},{l:t.profit,v:fmtC(profit,lang),c:profit>=0?T.success:T.danger}].map((s,i)=>(
              <div key={i} style={{background:T.surface2,borderRadius:'10px',padding:'8px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.63rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontSize:'0.76rem',fontWeight:'700',color:s.c||T.text}}>{s.v}</p></div>
            ))}
          </div>
          {item.employees?.length>0&&<div style={{marginBottom:'8px'}}><div style={{display:'flex',justifyContent:'space-between',margin:'0 0 4px'}}><p style={{margin:0,fontSize:'0.68rem',color:T.textMuted}}>{t.employees} ({item.employees.length})</p><p style={{margin:0,fontSize:'0.68rem',color:T.textMuted}}>{t.totalSalaries}: <strong style={{color:T.gold}}>{fmtC(item.employees.reduce((s,e)=>s+(Number(e.salary)||0),0),lang)}</strong></p></div>{item.employees.map(e=>(<div key={e.id} style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem',padding:'5px 10px',background:T.surface2,borderRadius:'8px',marginBottom:'2px'}}><span style={{color:T.text}}>{e.name}</span><span style={{color:T.gold,fontWeight:'600'}}>{fmtC(Number(e.salary)||0,lang)}</span></div>))}</div>}
          {item.notes&&<p style={{fontSize:'0.7rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 8px'}}>"{item.notes}"</p>}
          <div style={{display:'flex',gap:'6px'}}><SmBtn onClick={()=>openEdit(item)} label={t.edit} icon={Pencil} color={T.info} T={T}/>{canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label={t.delete} icon={Trash2} color={T.danger} T={T}/>}</div>
        </div>
      );})}
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.companies}`:t.edit} onClose={()=>setModal(null)} T={T}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name} error={errors.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} T={T} error={errors.name}/></Field>
          <Field label={t.companyType}><Inp value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} T={T}/></Field>
          <Field label={t.status}><div style={{display:'flex',gap:'4px'}}>{[['active',t.activeCompany,T.success],['underConstruction',t.underConstruction,T.warning]].map(([v,l,c])=>(<button key={v} onClick={()=>setForm(f=>({...f,companyStatus:v}))} style={{flex:1,padding:'10px',borderRadius:'12px',border:`1.5px solid ${form.companyStatus===v?c:T.border}`,background:form.companyStatus===v?c+'22':'transparent',color:form.companyStatus===v?c:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.8rem'}}>{l}</button>))}</div></Field>
          <Field label={`${t.ownership}%`}><Inp type="number" value={form.ownership} onChange={e=>setForm(f=>({...f,ownership:e.target.value}))} T={T}/></Field>
          <Field label={t.capital} error={errors.capital}><Inp type="number" value={form.capital} onChange={e=>setForm(f=>({...f,capital:e.target.value}))} T={T} error={errors.capital}/></Field>
          <Field label={lang==='ar'?'الإيرادات الشهرية':'Monthly Revenue'}><Inp type="number" value={form.monthlyRevenue} onChange={e=>setForm(f=>({...f,monthlyRevenue:e.target.value}))} T={T}/></Field>
          <Field label={lang==='ar'?'المصاريف الشهرية':'Monthly Expenses'}><Inp type="number" value={form.monthlyExpense} onChange={e=>setForm(f=>({...f,monthlyExpense:e.target.value}))} T={T}/></Field>
        </div>
        <SectionHeader title={t.employees} T={T}/>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'8px'}}><SmBtn onClick={addEmp} label={t.addEmployee} icon={Plus} color={T.gold} T={T}/></div>
        {(form.employees||[]).map(e=>(<div key={e.id} style={{display:'flex',gap:'6px',marginBottom:'6px',alignItems:'center'}}><input placeholder={lang==='ar'?'الاسم':'Name'} value={e.name} onChange={ev=>editEmp(e.id,'name',ev.target.value)} style={{flex:2,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:'10px',padding:'10px',color:T.text,fontSize:'0.85rem',fontFamily:'inherit',outline:'none'}}/><input placeholder={t.salary} type="number" value={e.salary} onChange={ev=>editEmp(e.id,'salary',ev.target.value)} style={{flex:1,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:'10px',padding:'10px',color:T.text,fontSize:'0.85rem',fontFamily:'inherit',outline:'none'}}/><button onClick={()=>remEmp(e.id)} style={{background:'none',border:'none',color:T.danger,cursor:'pointer',flexShrink:0}}><X size={14}/></button></div>))}
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(null)} label={t.cancel} T={T}/>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}

function loanSummary(loan){
  const inst=loan?.monthlyInstallment||0, total=loan?.totalMonths||0, dp=loan?.downPayment||0;
  const rem=Math.max(0,Math.min(loan?.remainingMonths||0, total>0?total:(loan?.remainingMonths||0)));
  const hasLoan=inst>0||rem>0||dp>0;
  const paidMonths=total>0?Math.max(0,total-rem):0;
  const remainingAmount=rem*inst;
  const paidAmount=dp+paidMonths*inst;
  const totalCost=dp+total*inst;
  const progress=total>0?Math.round((paidMonths/total)*100):0;
  return {hasLoan,inst,total,rem,dp,paidMonths,remainingAmount,paidAmount,totalCost,progress};
}
function VehiclesPage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({}),[details,setDetails]=useState(null);
  const items=data.vehicles||[];
  const openAdd=()=>{setForm({name:'',type:'',plateNumber:'',year:new Date().getFullYear(),value:'',insurance:{company:'',expiryDate:'',amount:''},registration:{expiryDate:'',amount:''},loan:{downPayment:'',monthlyInstallment:'',totalMonths:'',remainingMonths:'',nextDue:''},notes:''});setErrors({});setModal('add');};
  const openEdit=item=>{setForm({...item,value:String(item.value)});setErrors({});setModal({edit:item});};
  const save=()=>{const errs=validate([['name',form.name],['type',form.type],['value',form.value]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:modal==='add'?genId():form.id,value:Number(form.value)||0,insurance:{...form.insurance,amount:Number(form.insurance?.amount)||0},registration:{...form.registration,amount:Number(form.registration?.amount)||0},loan:{...form.loan,downPayment:Number(form.loan?.downPayment)||0,monthlyInstallment:Number(form.loan?.monthlyInstallment)||0,totalMonths:Number(form.loan?.totalMonths)||0,remainingMonths:Number(form.loan?.remainingMonths)||0}};setData(d=>({...d,vehicles:modal==='add'?[...(d.vehicles||[]),entry]:(d.vehicles||[]).map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.vehicles,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,vehicles:d.vehicles.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.vehicles,`"${item?.name}"`);setConfirm(null);};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><p style={{margin:0,fontSize:'0.78rem',color:T.textMuted}}>{fmtC(items.reduce((s,v)=>s+v.value,0),lang)}</p><AddBtn onClick={openAdd} label={t.add} T={T}/></div>
      {items.length===0&&<EmptyState icon="🚗" title={lang==='ar'?'لا توجد مركبات':'No vehicles yet'} subtitle={lang==='ar'?'سجّل سياراتك لمتابعة التأمين والأقساط':'Register vehicles to track insurance and installments'} T={T}/>}
      {items.map(item=>{const di=daysUntil(item.insurance?.expiryDate);const L=loanSummary(item.loan);const dl=L.hasLoan?daysUntil(item.loan?.nextDue):null;return(
        <div key={item.id} style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.name}</h4><p style={{margin:'2px 0 0',fontSize:'0.73rem',color:T.textMuted}}>{item.type} • {item.year} • {item.plateNumber}</p></div><Badge color={T.gold}>{fmtC(item.value,lang)}</Badge></div>
          <div style={{background:T.surface2,borderRadius:'12px',padding:'10px',marginBottom:'10px',display:'flex',flexDirection:'column',gap:'5px'}}>
            {L.hasLoan?(<>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.installment}</span><span style={{color:T.danger,fontWeight:'700'}}>{fmtC(L.inst,lang)} / {lang==='ar'?'شهر':'mo'}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.remainingMonths}</span><span style={{color:T.text,fontWeight:'600'}}>{L.rem}{L.total>0?` / ${L.total}`:''} {lang==='ar'?'قسط':''}</span></div>
              {L.total>0&&<div style={{height:'6px',borderRadius:'3px',background:T.border,overflow:'hidden',marginTop:'2px'}}><div style={{width:`${L.progress}%`,height:'100%',background:`linear-gradient(90deg,${T.gold},${T.goldLight})`}}/></div>}
            </>):(
              <div style={{fontSize:'0.74rem',color:T.textDim,textAlign:'center'}}>{t.noInstallment}</div>
            )}
          </div>
          <div style={{display:'flex',gap:'6px'}}><SmBtn onClick={()=>setDetails(item)} label={t.viewDetails} icon={Eye} color={T.gold} T={T}/><SmBtn onClick={()=>openEdit(item)} label={t.edit} icon={Pencil} color={T.info} T={T}/>{canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label="" icon={Trash2} color={T.danger} T={T}/>}</div>
        </div>
      );})}
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.vehicles}`:t.edit} onClose={()=>setModal(null)} T={T}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name} error={errors.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} T={T} error={errors.name}/></Field>
          <Field label={t.vehicleType} error={errors.type}><Inp value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} T={T} error={errors.type}/></Field>
          <Field label={t.plateNumber}><Inp value={form.plateNumber} onChange={e=>setForm(f=>({...f,plateNumber:e.target.value}))} T={T}/></Field>
          <Field label={t.year}><Inp type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} T={T}/></Field>
          <Field label={`${t.value} (${t.sar})`} error={errors.value}><Inp type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} T={T} error={errors.value}/></Field>
        </div>
        <SectionHeader title={`🛡️ ${t.insurance}`} T={T}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
          <Field label={lang==='ar'?'الشركة':'Company'} T={T}><Inp value={form.insurance?.company} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,company:e.target.value}})) } T={T}/></Field>
          <Field label={t.insExpiry} T={T}><Inp type="date" value={form.insurance?.expiryDate} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,expiryDate:e.target.value}})) } T={T}/></Field>
          <Field label={lang==='ar'?'القسط':'Premium'} T={T}><Inp type="number" value={form.insurance?.amount} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,amount:e.target.value}})) } T={T}/></Field>
        </div>
        <SectionHeader title={`📋 ${t.registration}`} T={T}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.regExpiry} T={T}><Inp type="date" value={form.registration?.expiryDate} onChange={e=>setForm(f=>({...f,registration:{...f.registration,expiryDate:e.target.value}})) } T={T}/></Field>
          <Field label={lang==='ar'?'الرسوم':'Fee'} T={T}><Inp type="number" value={form.registration?.amount} onChange={e=>setForm(f=>({...f,registration:{...f.registration,amount:e.target.value}})) } T={T}/></Field>
        </div>
        <SectionHeader title={`💳 ${t.installmentSummary} (${lang==='ar'?'اتركه فارغاً إن لا يوجد':'leave empty if none'})`} T={T}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.downPayment} T={T}><Inp type="number" value={form.loan?.downPayment} onChange={e=>setForm(f=>({...f,loan:{...f.loan,downPayment:e.target.value}})) } T={T}/></Field>
          <Field label={t.installment} T={T}><Inp type="number" value={form.loan?.monthlyInstallment} onChange={e=>setForm(f=>({...f,loan:{...f.loan,monthlyInstallment:e.target.value}})) } T={T}/></Field>
          <Field label={t.totalInstallments} T={T}><Inp type="number" value={form.loan?.totalMonths} onChange={e=>setForm(f=>({...f,loan:{...f.loan,totalMonths:e.target.value}})) } T={T}/></Field>
          <Field label={t.remainingMonths} T={T}><Inp type="number" value={form.loan?.remainingMonths} onChange={e=>setForm(f=>({...f,loan:{...f.loan,remainingMonths:e.target.value}})) } T={T}/></Field>
          <Field label={t.nextDue} T={T}><Inp type="date" value={form.loan?.nextDue} onChange={e=>setForm(f=>({...f,loan:{...f.loan,nextDue:e.target.value}})) } T={T}/></Field>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(null)} label={t.cancel} T={T}/>
      </Modal>}
      {details&&(()=>{const L=loanSummary(details.loan);const di=daysUntil(details.insurance?.expiryDate);const Row=({l,v,c})=>(<div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',padding:'2px 0'}}><span style={{color:T.textMuted}}>{l}</span><span style={{color:c||T.text,fontWeight:'600'}}>{v}</span></div>);return(
        <Modal title={`🚗 ${details.name}`} onClose={()=>setDetails(null)} T={T}>
          <p style={{margin:'0 0 12px',fontSize:'0.76rem',color:T.textMuted}}>{details.type} • {details.year} • {details.plateNumber}</p>
          <div style={{background:T.surface2,borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
            <Row l={`${t.value} (${t.sar})`} v={fmtC(details.value,lang)} c={T.gold}/>
          </div>
          <SectionHeader title={`🛡️ ${t.insurance}`} T={T}/>
          <div style={{background:T.surface2,borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
            <Row l={lang==='ar'?'الشركة':'Company'} v={details.insurance?.company||'—'}/>
            <Row l={t.insExpiry} v={fmtDate(details.insurance?.expiryDate,lang)} c={di!==null&&di<=30?T.warning:T.text}/>
            <Row l={t.annualPremium} v={fmtC(details.insurance?.amount||0,lang)}/>
          </div>
          <SectionHeader title={`📋 ${t.registration}`} T={T}/>
          <div style={{background:T.surface2,borderRadius:'12px',padding:'12px',marginBottom:'10px'}}>
            <Row l={t.regExpiry} v={fmtDate(details.registration?.expiryDate,lang)}/>
            <Row l={t.annualFee} v={fmtC(details.registration?.amount||0,lang)}/>
          </div>
          <SectionHeader title={`💳 ${t.installmentSummary}`} T={T}/>
          {L.hasLoan?(
          <div style={{background:T.surface2,borderRadius:'12px',padding:'12px'}}>
            <Row l={t.downPayment} v={fmtC(L.dp,lang)}/>
            <Row l={t.installment} v={`${fmtC(L.inst,lang)} / ${lang==='ar'?'شهر':'mo'}`} c={T.danger}/>
            <Row l={t.nextDue} v={fmtDate(details.loan?.nextDue,lang)}/>
            <div style={{height:'1px',background:T.border,margin:'6px 0'}}/>
            <Row l={t.totalInstallments} v={`${L.total} ${lang==='ar'?'قسط':'mo'}`}/>
            <Row l={t.paidInstallments} v={`${L.paidMonths} ${lang==='ar'?'قسط':'mo'}`} c={T.success}/>
            <Row l={t.remainingMonths} v={`${L.rem} ${lang==='ar'?'قسط':'mo'}`} c={T.warning}/>
            <div style={{height:'1px',background:T.border,margin:'6px 0'}}/>
            <Row l={t.paidAmount} v={fmtC(L.paidAmount,lang)} c={T.success}/>
            <Row l={t.remainingAmount} v={fmtC(L.remainingAmount,lang)} c={T.danger}/>
            <Row l={t.totalCost} v={fmtC(L.totalCost,lang)} c={T.gold}/>
            {L.total>0&&<div style={{marginTop:'8px'}}><div style={{height:'8px',borderRadius:'4px',background:T.border,overflow:'hidden'}}><div style={{width:`${L.progress}%`,height:'100%',background:`linear-gradient(90deg,${T.gold},${T.goldLight})`}}/></div><p style={{margin:'4px 0 0',fontSize:'0.7rem',color:T.textMuted,textAlign:'center'}}>{L.progress}% {lang==='ar'?'مكتمل':'completed'}</p></div>}
          </div>
          ):(<p style={{color:T.textDim,fontSize:'0.8rem',textAlign:'center',padding:'10px'}}>{t.noInstallment}</p>)}
          {details.notes&&<><SectionHeader title={`📝 ${t.notes}`} T={T}/><p style={{color:T.text,fontSize:'0.82rem',background:T.surface2,borderRadius:'12px',padding:'12px'}}>{details.notes}</p></>}
          <div style={{height:'8px'}}/>
          <CancelBtn onClick={()=>setDetails(null)} label={lang==='ar'?'إغلاق':'Close'} T={T}/>
        </Modal>
      );})()}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}

function InvestmentsPage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({}),[typeFilter,setTypeFilter]=useState('all');
  const items=data.investments||[];const it=lang==='ar'?INV_T.ar:INV_T.en;
  const icons={stocks:'📈',gold:'🥇',currencies:'💱',funds:'🏗️',crypto:'₿',startup:'🚀',other:'💡'};
  const openAdd=()=>{setForm({name:'',type:'',purchasePrice:'',currentValue:'',purchaseDate:todayStr(),notes:''});setErrors({});setModal('add');};
  const openEdit=item=>{setForm({...item,purchasePrice:String(item.purchasePrice),currentValue:String(item.currentValue)});setErrors({});setModal({edit:item});};
  const save=()=>{const errs=validate([['name',form.name],['type',form.type],['purchasePrice',form.purchasePrice]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:modal==='add'?genId():form.id,purchasePrice:Number(form.purchasePrice)||0,currentValue:Number(form.currentValue)||0};setData(d=>({...d,investments:modal==='add'?[...(d.investments||[]),entry]:(d.investments||[]).map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.investments,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,investments:d.investments.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.investments,`"${item?.name}"`);setConfirm(null);};
  const totalCost=items.reduce((s,i)=>s+i.purchasePrice,0),totalVal=items.reduce((s,i)=>s+i.currentValue,0),totalPL=totalVal-totalCost;
  const filtered=typeFilter==='all'?items:items.filter(x=>x.type===typeFilter);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
        {[{l:lang==='ar'?'التكلفة':'Cost',v:fmtC(totalCost,lang),c:T.info},{l:lang==='ar'?'القيمة':'Value',v:fmtC(totalVal,lang),c:T.gold},{l:t.profitLoss,v:fmtC(totalPL,lang),c:totalPL>=0?T.success:T.danger}].map((s,i)=>(<div key={i} style={{background:T.surface,borderRadius:'14px',padding:'10px',textAlign:'center',boxShadow:T.cardShadow}}><p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontSize:'0.82rem',fontWeight:'800',color:s.c}}>{s.v}</p></div>))}
      </div>
      <div style={{display:'flex',gap:'4px',overflowX:'auto',paddingBottom:'2px'}}>
        {['all',...Object.keys(it)].map(k=>(<button key={k} onClick={()=>setTypeFilter(k)} style={{padding:'6px 12px',borderRadius:'20px',border:'none',background:typeFilter===k?T.gold:'transparent',color:typeFilter===k?'#fff':T.textMuted,fontSize:'0.78rem',fontWeight:typeFilter===k?'700':'500',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>{k==='all'?(lang==='ar'?'الكل':'All'):`${icons[k]||''} ${it[k]||k}`}</button>))}
        <button onClick={openAdd} style={{marginRight:'auto',flexShrink:0,display:'flex',alignItems:'center',gap:'4px',padding:'6px 14px',borderRadius:'20px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontSize:'0.78rem',fontWeight:'700',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}><Plus size={13}/>{t.add}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        {filtered.length===0&&<div style={{gridColumn:'1/-1'}}><EmptyState icon="📈" title={lang==='ar'?'لا توجد استثمارات':'No investments yet'} subtitle={lang==='ar'?'أضف محافظك وأصولك الاستثمارية':'Add your portfolios and investment assets'} T={T}/></div>}
        {filtered.map(item=>{const pl=item.currentValue-item.purchasePrice;const p=pct(pl,item.purchasePrice);return(
          <div key={item.id} style={{background:T.surface,borderRadius:'16px',padding:'12px',boxShadow:T.cardShadow}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'1.2rem'}}>{icons[item.type]||'💡'}</span><Badge color={pl>=0?T.success:T.danger}>{pl>=0?'+':''}{p}%</Badge></div>
            <h4 style={{margin:'0 0 4px',color:T.text,fontWeight:'700',fontSize:'0.85rem'}}>{item.name}</h4>
            <Badge color={T.gold}>{it[item.type]||item.type}</Badge>
            <div style={{marginTop:'8px',background:T.surface2,borderRadius:'10px',padding:'8px',display:'flex',flexDirection:'column',gap:'3px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.purchasePrice}</span><span style={{color:T.text}}>{fmtC(item.purchasePrice,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.currentValue}</span><span style={{color:T.gold,fontWeight:'700'}}>{fmtC(item.currentValue,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.profitLoss}</span><span style={{color:pl>=0?T.success:T.danger,fontWeight:'700'}}>{pl>=0?'+':''}{fmtC(pl,lang)}</span></div>
            </div>
            <div style={{display:'flex',gap:'5px',marginTop:'8px'}}><SmBtn onClick={()=>openEdit(item)} label="" icon={Pencil} color={T.info} T={T}/>{canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label="" icon={Trash2} color={T.danger} T={T}/>}</div>
          </div>
        );})}
      </div>
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.investments}`:t.edit} onClose={()=>setModal(null)} T={T}>
        <Field label={t.name} error={errors.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} T={T} error={errors.name}/></Field>
        <Field label={t.investmentType} error={errors.type}><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
          {Object.entries(it).map(([k,v])=>(<button key={k} onClick={()=>setForm(f=>({...f,type:k}))} style={{padding:'8px 4px',borderRadius:'10px',border:`1.5px solid ${form.type===k?T.gold:T.border}`,background:form.type===k?T.gold+'22':'transparent',color:form.type===k?T.gold:T.textMuted,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}><span>{icons[k]}</span><span>{v}</span></button>))}
        </div>{errors.type&&<p style={{margin:'4px 0 0',fontSize:'0.7rem',color:T.danger}}>{errors.type}</p>}</Field>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={`${t.purchasePrice} (${t.sar})`} error={errors.purchasePrice}><Inp type="number" value={form.purchasePrice} onChange={e=>setForm(f=>({...f,purchasePrice:e.target.value}))} T={T} error={errors.purchasePrice}/></Field>
          <Field label={`${t.currentValue} (${t.sar})`}><Inp type="number" value={form.currentValue} onChange={e=>setForm(f=>({...f,currentValue:e.target.value}))} T={T}/></Field>
          <Field label={t.purchaseDate}><Inp type="date" value={form.purchaseDate} onChange={e=>setForm(f=>({...f,purchaseDate:e.target.value}))} T={T}/></Field>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(null)} label={t.cancel} T={T}/>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}
function OperationsPage({data,setData,lang,t,T,logActivity,currentUser,canDelete}){
  const [modal,setModal]=useState(false),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({}),[typeF,setTypeF]=useState('all'),[statusF,setStatusF]=useState('all');
  const items=data.operations||[];const ot=lang==='ar'?OP_T.ar:OP_T.en;const ft=lang==='ar'?FREQ_T.ar:FREQ_T.en;
  const icons={maintenance:'🔧',invoice:'📄',subscription:'🔄',installment:'💳',other:'📌'};
  const openAdd=()=>{setForm({date:todayStr(),type:'',description:'',amount:'',frequency:'once',nextDue:'',linkedName:'',status:'pending'});setErrors({});setModal(true);};
  const save=()=>{const errs=validate([['type',form.type],['description',form.description],['amount',form.amount]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,operations:[entry,...(d.operations||[])]}));logActivity(t.addedAction,t.operations,`${ot[form.type]}: ${form.description}`);setModal(false);};
  const [paidFlash,setPaidFlash]=useState(null);
  const markPaid=id=>{
    setData(d=>{
      const op=(d.operations||[]).find(o=>o.id===id);
      if(!op)return d;
      const amt=num(op.amount);
      // Post a real cash-flow entry so the ledger and dashboard reflect what was actually paid
      const expenseEntry={id:genId(),date:todayStr(),amount:amt,category:ot[op.type]||op.type,description:op.description,linkedName:op.linkedName||'',addedBy:currentUser?.name||'?',source:'operation'};
      const isInstallment=op.type==='installment'&&num(op.remainingMonths)>0;
      const operations=(d.operations||[]).map(o=>{
        if(o.id!==id)return o;
        if(isInstallment){
          const rem=num(o.remainingMonths)-1;
          // advance the due date by one billing period
          let nd=o.nextDue?new Date(o.nextDue):null;
          if(nd&&!isNaN(nd.getTime())){const step=o.frequency==='quarterly'?3:o.frequency==='yearly'?12:1;nd.setMonth(nd.getMonth()+step);}
          return{...o,remainingMonths:Math.max(0,rem),nextDue:nd?nd.toISOString().split('T')[0]:o.nextDue,status:rem<=0?'paid':'pending'};
        }
        return{...o,status:'paid'};
      });
      return{...d,operations,expenses:[expenseEntry,...(d.expenses||[])]};
    });
    setPaidFlash(id);setTimeout(()=>setPaidFlash(null),1800);
    logActivity(t.paidAction,t.operations,fmtC(num((items.find(o=>o.id===id)||{}).amount),lang));
  };
  const del=id=>{setData(d=>({...d,operations:d.operations.filter(o=>o.id!==id)}));setConfirm(null);};
  const filtered=items.filter(o=>(typeF==='all'||o.type===typeF)&&(statusF==='all'||o.status===statusF));
  const pending=items.filter(o=>o.status==='pending').reduce((s,o)=>s+num(o.amount),0);
  const sColor={paid:T.success,pending:T.warning,overdue:T.danger};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        <div style={{background:T.surface,borderRadius:'14px',padding:'12px',textAlign:'center',boxShadow:T.cardShadow}}><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'إجمالي':'Total'}</p><p style={{margin:0,fontWeight:'800',fontSize:'1.1rem',color:T.info}}>{items.length}</p></div>
        <div style={{background:T.surface,borderRadius:'14px',padding:'12px',textAlign:'center',boxShadow:T.cardShadow}}><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'مستحق':'Pending'}</p><p style={{margin:0,fontWeight:'800',fontSize:'0.9rem',color:T.warning}}>{fmtC(pending,lang)}</p></div>
      </div>
      <div style={{display:'flex',gap:'4px',overflowX:'auto',paddingBottom:'2px'}}>
        {['all',...Object.keys(ot)].map(k=>(<button key={k} onClick={()=>setTypeF(k)} style={{padding:'6px 12px',borderRadius:'20px',border:'none',background:typeF===k?T.gold:'transparent',color:typeF===k?'#fff':T.textMuted,fontSize:'0.78rem',fontWeight:typeF===k?'700':'500',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>{k==='all'?(lang==='ar'?'الكل':'All'):`${icons[k]||''} ${ot[k]||k}`}</button>))}
      </div>
      <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
        <div style={{display:'flex',gap:'2px',background:T.surface2,borderRadius:'10px',padding:'2px'}}>
          {['all','pending','paid'].map(s=>(<button key={s} onClick={()=>setStatusF(s)} style={{padding:'5px 10px',borderRadius:'8px',border:'none',background:statusF===s?T.surface:'transparent',color:statusF===s?T.text:T.textMuted,fontSize:'0.76rem',fontWeight:statusF===s?'600':'400',cursor:'pointer',fontFamily:'inherit',boxShadow:statusF===s?T.cardShadow:'none'}}>{s==='all'?(lang==='ar'?'الكل':'All'):s==='pending'?(lang==='ar'?'معلق':'Pending'):(lang==='ar'?'مدفوع':'Paid')}</button>))}
        </div>
        <div style={{marginRight:'auto'}}><AddBtn onClick={openAdd} label={lang==='ar'?'عملية جديدة':'New'} T={T}/></div>
      </div>
      {filtered.length===0&&<EmptyState icon="⚙️" title={lang==='ar'?'لا توجد عمليات':'No operations yet'} subtitle={lang==='ar'?'سجّل الصيانة والفواتير والاشتراكات':'Log maintenance, invoices and subscriptions'} T={T}/>}
      {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(
        <div key={item.id} style={{background:paidFlash===item.id?T.success+'18':T.surface,borderRadius:'14px',padding:'12px',boxShadow:T.cardShadow,display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap',border:`1.5px solid ${paidFlash===item.id?T.success:T.border}`,transition:'all 0.4s ease'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:T.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{icons[item.type]||'📌'}</div>
          <div style={{flex:1,minWidth:'120px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}><p style={{margin:0,fontSize:'0.82rem',fontWeight:'600',color:T.text}}>{item.description}</p><Badge color={sColor[item.status]||T.textMuted}>{item.status==='paid'?(lang==='ar'?'مدفوع':'Paid'):item.status==='pending'?(lang==='ar'?'معلق':'Pending'):(lang==='ar'?'متأخر':'Late')}</Badge></div>
            <div style={{display:'flex',gap:'6px',marginTop:'2px',flexWrap:'wrap',fontSize:'0.68rem',color:T.textMuted}}>
              <span>{ot[item.type]||item.type}</span>{item.linkedName&&<span>• {item.linkedName}</span>}<span>• {fmtDate(item.date,lang)}</span>
            </div>
          </div>
          <div style={{textAlign:'end',flexShrink:0}}>
            <p style={{margin:0,fontWeight:'800',fontSize:'0.88rem',color:T.danger}}>{fmtC(item.amount,lang)}</p>
            <div style={{display:'flex',gap:'4px',marginTop:'4px'}}>
              {item.status==='pending'&&<SmBtn onClick={()=>markPaid(item.id)} label={t.markPaid} icon={CheckCircle2} color={T.success} T={T}/>}
              {canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label="" icon={Trash2} color={T.danger} T={T}/>}
            </div>
          </div>
        </div>
      ))}
      {modal&&<Modal title={lang==='ar'?'إضافة عملية':'New Operation'} onClose={()=>setModal(false)} T={T}>
        <Field label={t.opType} error={errors.type}><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'4px'}}>
          {Object.entries(ot).map(([k,v])=>(<button key={k} onClick={()=>setForm(f=>({...f,type:k}))} style={{padding:'10px 4px',borderRadius:'12px',border:`1.5px solid ${form.type===k?T.gold:T.border}`,background:form.type===k?T.gold+'22':'transparent',color:form.type===k?T.gold:T.textMuted,cursor:'pointer',fontSize:'0.75rem',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}><span>{icons[k]}</span><span>{v}</span></button>))}
        </div>{errors.type&&<p style={{margin:'4px 0 0',fontSize:'0.7rem',color:T.danger}}>{errors.type}</p>}</Field>
        <Field label={t.description} error={errors.description}><Inp value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} T={T} error={errors.description}/></Field>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={`${t.amount} (${t.sar})`} error={errors.amount}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} T={T} error={errors.amount}/></Field>
          <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} T={T}/></Field>
          <Field label={t.frequency}><Sel value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))} T={T}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          {form.frequency!=='once'&&<Field label={t.nextDue}><Inp type="date" value={form.nextDue} onChange={e=>setForm(f=>({...f,nextDue:e.target.value}))} T={T}/></Field>}
          <Field label={t.linkedName}><Inp value={form.linkedName} onChange={e=>setForm(f=>({...f,linkedName:e.target.value}))} T={T}/></Field>
        </div>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(false)} label={t.cancel} T={T}/>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}

function LoansGivenPage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(false),[payModal,setPayModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({}),[payAmt,setPayAmt]=useState('');
  const items=data.loansGiven||[];
  const openAdd=()=>{setForm({borrowerName:'',borrowerPhone:'',amount:'',loanDate:todayStr(),durationMonths:'',returnDate:'',notes:''});setErrors({});setModal(true);};
  const save=()=>{const errs=validate([['borrowerName',form.borrowerName],['amount',form.amount]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:genId(),amount:Number(form.amount)||0,durationMonths:Number(form.durationMonths)||0,payments:[],status:'active'};if(!entry.returnDate&&entry.loanDate&&entry.durationMonths){const d=new Date(entry.loanDate);d.setMonth(d.getMonth()+entry.durationMonths);entry.returnDate=d.toISOString().split('T')[0];}setData(d=>({...d,loansGiven:[entry,...(d.loansGiven||[])]}));logActivity(t.addedAction,t.loansGiven,`${entry.borrowerName} — ${fmtC(entry.amount,lang)}`);setModal(false);};
  const recordPay=id=>{const amount=Number(payAmt)||0;if(!amount)return;const payment={id:genId(),date:todayStr(),amount};setData(d=>({...d,loansGiven:d.loansGiven.map(l=>{if(l.id!==id)return l;const np=[...(l.payments||[]),payment];const tp=np.reduce((s,p)=>s+p.amount,0);return{...l,payments:np,status:tp>=l.amount?'completed':'active'};})}));logActivity(t.paidAction,t.loansGiven,fmtC(amount,lang));setPayModal(null);setPayAmt('');};
  const del=id=>{setData(d=>({...d,loansGiven:d.loansGiven.filter(l=>l.id!==id)}));setConfirm(null);};
  const sc={active:T.info,completed:T.success,late:T.danger};
  const sl={ar:{active:'نشط',completed:'منتهي',late:'متأخر'},en:{active:'Active',completed:'Done',late:'Late'}};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:'0.78rem',color:T.textMuted}}>{lang==='ar'?'متبقي:':'Remaining:'} <strong style={{color:T.warning}}>{fmtC(items.reduce((s,l)=>s+l.amount-(l.payments||[]).reduce((sp,p)=>sp+p.amount,0),0),lang)}</strong></div>
        <AddBtn onClick={openAdd} label={t.add} T={T}/>
      </div>
      {items.length===0&&<EmptyState icon="🤝" title={lang==='ar'?'لا توجد قروض':'No loans given'} subtitle={lang==='ar'?'سجّل القروض التي أعطيتها لمتابعة السداد':'Track loans you gave to others'} T={T}/>}
      {items.map(item=>{const totalPaid=(item.payments||[]).reduce((s,p)=>s+p.amount,0);const remaining=item.amount-totalPaid;const p=pct(totalPaid,item.amount);const dr=daysUntil(item.returnDate);const status=item.status==='completed'?'completed':dr!==null&&dr<0?'late':'active';return(
        <div key={item.id} style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'4px'}}>
            <div><div style={{display:'flex',alignItems:'center',gap:'6px'}}><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.borrowerName}</h4><Badge color={sc[status]}>{sl[lang][status]}</Badge></div>{item.borrowerPhone&&<p style={{margin:'2px 0 0',fontSize:'0.7rem',color:T.textMuted}}>{item.borrowerPhone}</p>}</div>
            <div style={{textAlign:'end'}}><p style={{margin:0,fontWeight:'800',color:T.gold,fontSize:'0.95rem'}}>{fmtC(item.amount,lang)}</p><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'متبقي:':'Rem:'} {fmtC(remaining,lang)}</p></div>
          </div>
          <div style={{height:'6px',background:T.surface2,borderRadius:'3px',overflow:'hidden',marginBottom:'8px'}}><div style={{height:'100%',width:`${p}%`,background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,borderRadius:'3px',transition:'width 0.3s'}}/></div>
          <div style={{display:'flex',gap:'10px',fontSize:'0.7rem',color:T.textMuted,flexWrap:'wrap',marginBottom:'8px'}}>
            <span>{t.loanDate}: {fmtDate(item.loanDate,lang)}</span>
            <span style={{color:dr!==null&&dr<=30&&status!=='completed'?T.warning:T.textMuted}}>{t.returnDate}: {fmtDate(item.returnDate,lang)}{dr!==null&&dr>=0&&dr<=30&&status!=='completed'?` (${dr} ${t.days})`:''}</span>
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            {status!=='completed'&&<SmBtn onClick={()=>setPayModal(item.id)} label={t.recordPayment} icon={HandCoins} color={T.gold} T={T}/>}
            {canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label="" icon={Trash2} color={T.danger} T={T}/>}
          </div>
        </div>
      );})}
      {modal&&<Modal title={`${t.add} ${t.loansGiven}`} onClose={()=>setModal(false)} T={T}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.borrower} error={errors.borrowerName}><Inp value={form.borrowerName} onChange={e=>setForm(f=>({...f,borrowerName:e.target.value}))} T={T} error={errors.borrowerName}/></Field>
          <Field label={t.phone}><Inp value={form.borrowerPhone} onChange={e=>setForm(f=>({...f,borrowerPhone:e.target.value}))} T={T}/></Field>
          <Field label={`${t.amount} (${t.sar})`} error={errors.amount}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} T={T} error={errors.amount}/></Field>
          <Field label={t.loanDate}><Inp type="date" value={form.loanDate} onChange={e=>setForm(f=>({...f,loanDate:e.target.value}))} T={T}/></Field>
          <Field label={t.durationMonths}><Inp type="number" value={form.durationMonths} onChange={e=>setForm(f=>({...f,durationMonths:e.target.value}))} T={T}/></Field>
          <Field label={t.returnDate}><Inp type="date" value={form.returnDate} onChange={e=>setForm(f=>({...f,returnDate:e.target.value}))} T={T}/></Field>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(false)} label={t.cancel} T={T}/>
      </Modal>}
      {payModal&&<Modal title={t.recordPayment} onClose={()=>{setPayModal(null);setPayAmt('');}} T={T}>
        <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={payAmt} onChange={e=>setPayAmt(e.target.value)} T={T}/></Field>
        <SaveBtn onClick={()=>recordPay(payModal)} label={t.save} T={T}/>
        <CancelBtn onClick={()=>{setPayModal(null);setPayAmt('');}} label={t.cancel} T={T}/>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}

function FinancialPage({data,lang,t,T}){
  const re=data.realEstate||[],co=data.companies||[],iv=data.investments||[],tr=data.transactions||[];
  const propROI=re.map(p=>{let ar=0;if(p.hasUnits)ar=p.units.filter(u=>u.status==='occupied').reduce((s,u)=>{let r=u.rent?.amount||0;if(u.rent?.frequency==='monthly')r*=12;if(u.rent?.frequency==='quarterly')r*=4;return s+r;},0);else if(p.status==='occupied'){let r=p.rent?.amount||0;if(p.rent?.frequency==='monthly')r*=12;if(p.rent?.frequency==='quarterly')r*=4;ar=r;}const roi=p.value>0?((ar/p.value)*100):0;return{name:p.name.length>12?p.name.slice(0,12)+'..':p.name,roi:Number(roi.toFixed(1)),ar};}).filter(p=>p.ar>0).sort((a,b)=>b.roi-a.roi);
  const invPerf=iv.map(i=>{const pl=i.currentValue-i.purchasePrice;const p=i.purchasePrice>0?((pl/i.purchasePrice)*100):0;return{name:i.name.length>14?i.name.slice(0,14)+'...':i.name,pl,pct:Number(p.toFixed(1))};}).sort((a,b)=>b.pct-a.pct);
  const trend=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);const m=d.getMonth(),y=d.getFullYear();const inc=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='income'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);const exp=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='expense'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);return{name:lang==='ar'?MONTHS_AR[m]:MONTHS_EN[m],net:inc-exp};});
  const avgROI=propROI.reduce((s,p)=>s+p.roi,0)/(propROI.length||1);
  const recs=[];
  propROI.forEach(p=>{if(p.roi<avgROI*0.7)recs.push({icon:'⚠️',text:`${p.name}: عائد ${p.roi}% أقل من المتوسط`});});
  if(iv.find(i=>i.type==='stocks')&&!iv.find(i=>i.type==='crypto'))recs.push({icon:'💡',text:lang==='ar'?'تنوع: أضف عملات رقمية كتحوط <5%':'Consider 5% crypto hedge'});
  if(co.filter(c=>c.companyStatus==='underConstruction').length>0)recs.push({icon:'🏗️',text:lang==='ar'?'تابع تكاليف المشاريع قيد الإنشاء':'Monitor construction costs'});
  const totalLoanRem=(data.loansGiven||[]).filter(l=>l.status==='active').reduce((s,l)=>s+l.amount-(l.payments||[]).reduce((sp,p)=>sp+p.amount,0),0);
  if(totalLoanRem>0)recs.push({icon:'🤝',text:`${lang==='ar'?'قروض متبقية:':'Outstanding loans:'} ${fmtC(totalLoanRem,lang)}`});
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      {propROI.length>0&&<div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <p style={{color:T.text,fontWeight:'700',fontSize:'0.85rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><TrendingUp size={14} color={T.gold}/>{lang==='ar'?'العائد السنوي للعقارات %':'Property ROI %'}</p>
        <ResponsiveContainer width="100%" height={140}><BarChart data={propROI} margin={{top:0,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="name" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>`${v}%`} contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text,fontSize:'0.78rem'}}/><Bar dataKey="roi" radius={[6,6,0,0]}>{propROI.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer>
      </div>}
      <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <p style={{color:T.text,fontWeight:'700',fontSize:'0.85rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><BarChart3 size={14} color={T.gold}/>{lang==='ar'?'صافي التدفق النقدي':'Net Cash Flow'}</p>
        <ResponsiveContainer width="100%" height={140}><LineChart data={trend} margin={{top:0,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="name" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/><Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text,fontSize:'0.78rem'}}/><Line type="monotone" dataKey="net" stroke={T.gold} strokeWidth={2.5} dot={{fill:T.gold,r:4}}/></LineChart></ResponsiveContainer>
      </div>
      {invPerf.length>0&&<div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <p style={{color:T.text,fontWeight:'700',fontSize:'0.85rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><Award size={14} color={T.gold}/>{lang==='ar'?'ترتيب الاستثمارات':'Investments Ranking'}</p>
        {invPerf.map((item,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',background:T.surface2,borderRadius:'10px',marginBottom:'6px'}}>
          <span style={{width:'20px',height:'20px',borderRadius:'50%',background:i===0?T.gold:i===1?'#aaa':'#cd7f32',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:'700',color:'#000',flexShrink:0}}>{i+1}</span>
          <span style={{flex:1,fontSize:'0.78rem',color:T.text}}>{item.name}</span>
          <span style={{fontSize:'0.78rem',fontWeight:'700',color:item.pct>=0?T.success:T.danger}}>{item.pct>=0?'+':''}{item.pct}%</span>
        </div>))}
      </div>}
      <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <p style={{color:T.text,fontWeight:'700',fontSize:'0.85rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><Lightbulb size={14} color={T.gold}/>{t.recommendations}</p>
        {recs.length===0?<div style={{textAlign:'center',padding:'1rem'}}><span style={{fontSize:'2rem'}}>🌟</span><p style={{color:T.success,fontSize:'0.82rem',margin:'8px 0 0'}}>{lang==='ar'?'أصولك في حالة ممتازة!':'Portfolio looks great!'}</p></div>:recs.map((r,i)=>(<div key={i} style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'10px',background:T.surface2,borderRadius:'10px',marginBottom:'6px'}}><span style={{fontSize:'1rem',flexShrink:0}}>{r.icon}</span><p style={{margin:0,fontSize:'0.78rem',color:T.text}}>{r.text}</p></div>))}
      </div>
    </div>
  );
}

function FinanceTabPage({data,setData,lang,t,T,logActivity,currentUser,canDelete}){
  const [sub,setSub]=useState('expenses');
  const tabs=[{id:'expenses',label:lang==='ar'?'المصاريف':'Expenses'},{id:'transactions',label:lang==='ar'?'المعاملات':'Transactions'},{id:'financial',label:lang==='ar'?'الذكاء المالي':'Financial Intel'},{id:'reports',label:lang==='ar'?'التقارير':'Reports'}];
  const cats=data.customCategories||DEF_CATS_AR;
  const props={data,setData,lang,t,T,logActivity,currentUser,canDelete};
  return(
    <div>
      <SubTabs tabs={tabs} active={sub} onChange={setSub} T={T}/>
      {sub==='expenses'&&<ExpensesInner {...props} cats={cats}/>}
      {sub==='transactions'&&<TransactionsInner {...props}/>}
      {sub==='financial'&&<FinancialPage {...props}/>}
      {sub==='reports'&&<ReportsInner {...props}/>}
    </div>
  );
}

function ExpensesInner({data,setData,lang,t,T,logActivity,currentUser,canDelete,cats}){
  const [modal,setModal]=useState(false),[confirm,setConfirm]=useState(null),[catModal,setCatModal]=useState(false),[newCat,setNewCat]=useState(''),[form,setForm]=useState({}),[errors,setErrors]=useState({}),[filter,setFilter]=useState('all');
  const items=data.expenses||[];
  const openAdd=()=>{setForm({date:todayStr(),amount:'',category:cats[0]||'',description:''});setErrors({});setModal(true);};
  const save=()=>{const errs=validate([['amount',form.amount],['category',form.category]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,expenses:[entry,...(d.expenses||[])]}));logActivity(t.addedAction,t.expenses,fmtC(entry.amount,lang));setModal(false);};
  const del=id=>{setData(d=>({...d,expenses:d.expenses.filter(x=>x.id!==id)}));setConfirm(null);};
  const months=[...new Set(items.map(e=>e.date?.substring(0,7)))].sort().reverse();
  const filtered=filter==='all'?items:items.filter(e=>e.date?.startsWith(filter));
  const total=filtered.reduce((s,e)=>s+e.amount,0);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{flex:1,minWidth:'120px',background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:'12px',padding:'10px 12px',color:T.text,fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}}><option value="all">{t.all}</option>{months.map(m=><option key={m} value={m}>{m}</option>)}</select>
        <div style={{background:T.surface,borderRadius:'12px',padding:'8px 14px',fontSize:'0.82rem',color:T.text,boxShadow:T.cardShadow}}><strong style={{color:T.danger}}>{fmtC(total,lang)}</strong></div>
        <SmBtn onClick={()=>setCatModal(true)} label={lang==='ar'?'الفئات':'Cats'} icon={Filter} color={T.gold} T={T}/>
        <AddBtn onClick={openAdd} label={t.add} T={T}/>
      </div>
      <div style={{background:T.surface,borderRadius:'16px',boxShadow:T.cardShadow,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
          <thead><tr style={{background:T.surface2}}>{[t.date,t.category,t.description,t.amount,''].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.68rem',textAlign:'start',whiteSpace:'nowrap'}}>{h}</th>))}</tr></thead>
          <tbody>{filtered.length===0&&<tr><td colSpan={5} style={{padding:'2rem',textAlign:'center',color:T.textMuted}}>{t.noData}</td></tr>}
          {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(<tr key={item.id} style={{borderTop:`1px solid ${T.border}`}}>
            <td style={{padding:'9px 12px',color:T.textMuted,whiteSpace:'nowrap',fontSize:'0.7rem'}}>{fmtDate(item.date,lang)}</td>
            <td style={{padding:'9px 12px'}}><Badge color={T.warning}>{item.category}</Badge></td>
            <td style={{padding:'9px 12px',color:T.text,maxWidth:'130px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.description}</td>
            <td style={{padding:'9px 12px',fontWeight:'700',color:T.danger,whiteSpace:'nowrap'}}>{fmtC(item.amount,lang)}</td>
            <td style={{padding:'9px 12px'}}>{canDelete&&<button onClick={()=>setConfirm(item.id)} style={{background:'none',border:'none',color:T.danger,cursor:'pointer'}}><Trash2 size={13}/></button>}</td>
          </tr>))}</tbody>
        </table>
      </div></div>
      {modal&&<Modal title={`${t.add} ${t.expenses}`} onClose={()=>setModal(false)} T={T}>
        <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} T={T}/></Field>
        <Field label={t.category} error={errors.category}><Sel value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} T={T}>{cats.map(c=><option key={c}>{c}</option>)}</Sel></Field>
        <Field label={`${t.amount} (${t.sar})`} error={errors.amount}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} T={T} error={errors.amount}/></Field>
        <Field label={t.description}><Ta value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(false)} label={t.cancel} T={T}/>
      </Modal>}
      {catModal&&<Modal title={t.customCategories} onClose={()=>setCatModal(false)} T={T}>
        <div style={{display:'flex',gap:'6px',marginBottom:'10px'}}><Inp value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder={lang==='ar'?'فئة جديدة':'New category'} T={T}/><button onClick={()=>{if(!newCat.trim())return;setData(d=>({...d,customCategories:[...(d.customCategories||DEF_CATS_AR),newCat.trim()]}));setNewCat('');}} style={{background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,border:'none',borderRadius:'12px',padding:'0 14px',color:'#fff',cursor:'pointer',flexShrink:0}}><Plus size={15}/></button></div>
        {cats.map(c=>(<div key={c} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:T.surface2,borderRadius:'10px',marginBottom:'4px'}}><span style={{color:T.text,fontSize:'0.85rem'}}>{c}</span><button onClick={()=>setData(d=>({...d,customCategories:(d.customCategories||DEF_CATS_AR).filter(x=>x!==c)}))} style={{background:'none',border:'none',color:T.danger,cursor:'pointer'}}><X size={13}/></button></div>))}
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)} T={T}/>}
    </div>
  );
}

function TransactionsInner({data,setData,lang,t,T,logActivity,currentUser}){
  const [modal,setModal]=useState(false),[typeF,setTypeF]=useState('all'),[form,setForm]=useState({}),[errors,setErrors]=useState({});
  const items=data.transactions||[];
  const openAdd=()=>{setForm({date:todayStr(),type:'income',amount:'',category:'',description:''});setErrors({});setModal(true);};
  const save=()=>{const errs=validate([['amount',form.amount]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,transactions:[entry,...(d.transactions||[])]}));logActivity(t.addedAction,t.transactions,fmtC(entry.amount,lang));setModal(false);};
  const filtered=typeF==='all'?items:items.filter(x=>x.type===typeF);
  const tIn=items.filter(x=>x.type==='income').reduce((s,x)=>s+x.amount,0),tOut=items.filter(x=>x.type==='expense').reduce((s,x)=>s+x.amount,0);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
        {[{l:t.totalIncome,v:fmtC(tIn,lang),c:T.success},{l:t.totalExpenses,v:fmtC(tOut,lang),c:T.danger},{l:t.balance,v:fmtC(tIn-tOut,lang),c:tIn>=tOut?T.success:T.danger}].map((s,i)=>(<div key={i} style={{background:T.surface,borderRadius:'14px',padding:'10px',textAlign:'center',boxShadow:T.cardShadow}}><p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontWeight:'800',fontSize:'0.78rem',color:s.c}}>{s.v}</p></div>))}
      </div>
      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
        <div style={{display:'flex',gap:'2px',background:T.surface2,borderRadius:'10px',padding:'2px'}}>
          {[['all',t.all],['income',t.income],['expense',t.expense]].map(([v,l])=>(<button key={v} onClick={()=>setTypeF(v)} style={{padding:'5px 11px',borderRadius:'8px',border:'none',background:typeF===v?T.surface:'transparent',color:typeF===v?T.text:T.textMuted,fontSize:'0.76rem',fontWeight:typeF===v?'600':'400',cursor:'pointer',fontFamily:'inherit',boxShadow:typeF===v?T.cardShadow:'none'}}>{l}</button>))}
        </div>
        <div style={{marginRight:'auto'}}><AddBtn onClick={openAdd} label={t.addTransaction} T={T}/></div>
      </div>
      <div style={{background:T.surface,borderRadius:'16px',boxShadow:T.cardShadow,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
          <thead><tr style={{background:T.surface2}}>{[t.date,t.type,t.category,t.description,t.amount].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.68rem',textAlign:'start',whiteSpace:'nowrap'}}>{h}</th>))}</tr></thead>
          <tbody>{filtered.length===0&&<tr><td colSpan={5} style={{padding:'2rem',textAlign:'center',color:T.textMuted}}>{t.noData}</td></tr>}
          {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(<tr key={item.id} style={{borderTop:`1px solid ${T.border}`}}>
            <td style={{padding:'9px 12px',color:T.textMuted,whiteSpace:'nowrap',fontSize:'0.7rem'}}>{fmtDate(item.date,lang)}</td>
            <td style={{padding:'9px 12px'}}><Badge color={item.type==='income'?T.success:T.danger}>{item.type==='income'?t.income:t.expense}</Badge></td>
            <td style={{padding:'9px 12px',color:T.textMuted,fontSize:'0.7rem'}}>{item.category}</td>
            <td style={{padding:'9px 12px',color:T.text,maxWidth:'120px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.description}</td>
            <td style={{padding:'9px 12px',fontWeight:'700',whiteSpace:'nowrap',color:item.type==='income'?T.success:T.danger}}>{item.type==='income'?'+':'-'}{fmtC(item.amount,lang)}</td>
          </tr>))}</tbody>
        </table>
      </div></div>
      {modal&&<Modal title={t.addTransaction} onClose={()=>setModal(false)} T={T}>
        <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} T={T}/></Field>
        <Field label={t.type}><div style={{display:'flex',gap:'8px'}}>{[['income',t.income,T.success],['expense',t.expense,T.danger]].map(([v,l,c])=>(<button key={v} onClick={()=>setForm(f=>({...f,type:v}))} style={{flex:1,padding:'12px',borderRadius:'12px',border:`1.5px solid ${form.type===v?c:T.border}`,background:form.type===v?c+'22':'transparent',color:form.type===v?c:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.88rem',transition:'all 0.15s'}}>{l}</button>))}</div></Field>
        <Field label={t.category}><Inp value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} T={T}/></Field>
        <Field label={`${t.amount} (${t.sar})`} error={errors.amount}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} T={T} error={errors.amount}/></Field>
        <Field label={t.description}><Ta value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(false)} label={t.cancel} T={T}/>
      </Modal>}
    </div>
  );
}

function ReportsInner({data,lang,t,T}){
  const tr=data.transactions||[];
  const months=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return{m:d.getMonth(),y:d.getFullYear(),label:lang==='ar'?MONTHS_AR[d.getMonth()]:MONTHS_EN[d.getMonth()]};});
  const monthData=months.map(({m,y,label})=>{const inc=tr.filter(x=>{const d=new Date(x.date);return x.type==='income'&&d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,x)=>s+x.amount,0);const exp=tr.filter(x=>{const d=new Date(x.date);return x.type==='expense'&&d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,x)=>s+x.amount,0);return{label,inc,exp,net:inc-exp};});
  const handleCSV=()=>{const rows=[['التاريخ','النوع','الفئة','الوصف','المبلغ'],...tr.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(x=>[x.date,x.type==='income'?'دخل':'مصروف',x.category,x.description,x.amount])];const csv=rows.map(r=>r.join(',')).join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`تقرير_${todayStr()}.csv`;a.click();};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{display:'flex',gap:'8px'}}><button onClick={handleCSV} style={{display:'flex',alignItems:'center',gap:'6px',padding:'10px 16px',borderRadius:'12px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontWeight:'700',fontSize:'0.82rem',cursor:'pointer',fontFamily:'inherit'}}><Download size={13}/>{t.exportCSV}</button></div>
      <div style={{background:T.surface,borderRadius:'16px',boxShadow:T.cardShadow,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8rem'}}>
          <thead><tr style={{background:T.surface2}}>{[lang==='ar'?'الشهر':'Month',t.totalIncome,t.totalExpenses,t.balance].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.68rem',textAlign:'start'}}>{h}</th>))}</tr></thead>
          <tbody>{monthData.map((row,i)=>(<tr key={i} style={{borderTop:`1px solid ${T.border}`}}><td style={{padding:'10px 12px',fontWeight:'600',color:T.text}}>{row.label}</td><td style={{padding:'10px 12px',color:T.success,fontWeight:'600'}}>{fmtC(row.inc,lang)}</td><td style={{padding:'10px 12px',color:T.danger,fontWeight:'600'}}>{fmtC(row.exp,lang)}</td><td style={{padding:'10px 12px',fontWeight:'800',color:row.net>=0?T.success:T.danger}}>{fmtC(row.net,lang)}</td></tr>))}</tbody>
        </table>
      </div></div>
      <div style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
        <ResponsiveContainer width="100%" height={160}><BarChart data={monthData} margin={{top:0,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="label" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/><Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text,fontSize:'0.78rem'}}/><Bar dataKey="net" radius={[5,5,0,0]}>{monthData.map((d,i)=><Cell key={i} fill={d.net>=0?T.gold:T.danger}/>)}</Bar></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

function ActivityLogPage({data,lang,t,T}){
  const logs=(data.activityLog||[]).slice().sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  const ac={'أضاف':T.success,'عدّل':T.warning,'حذف':T.danger,'دفع':T.info,'added':T.success,'edited':T.warning,'deleted':T.danger,'paid':T.info};
  return(
    <div style={{background:T.surface,borderRadius:'16px',boxShadow:T.cardShadow,overflow:'hidden'}}>
      <div style={{padding:'14px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:'8px'}}><Activity size={14} color={T.gold}/><span style={{color:T.text,fontWeight:'700',fontSize:'0.85rem'}}>{t.activityLog}</span><Badge color={T.info}>{logs.length}</Badge></div>
      {logs.length===0&&<p style={{textAlign:'center',padding:'2rem',color:T.textMuted,fontSize:'0.85rem'}}>{t.noData}</p>}
      {logs.map(log=>{const dt=new Date(log.timestamp);const c=ac[log.action]||T.textMuted;return(
        <div key={log.id} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'12px 14px',borderBottom:`1px solid ${T.border}`}}>
          <div style={{width:'30px',height:'30px',borderRadius:'50%',background:c+'22',display:'flex',alignItems:'center',justifyContent:'center',color:c,fontWeight:'700',fontSize:'0.72rem',flexShrink:0}}>{log.userName?.charAt(0)||'?'}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}><span style={{fontSize:'0.76rem',fontWeight:'700',color:T.text}}>{log.userName}</span><Badge color={c}>{log.action}</Badge><span style={{fontSize:'0.68rem',color:T.textMuted}}>{lang==='ar'?'في':'in'} {log.module}</span></div>
            <p style={{margin:'2px 0 0',fontSize:'0.7rem',color:T.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.description}</p>
          </div>
          <div style={{textAlign:'end',flexShrink:0}}><p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{fmtDate(dt,lang)}</p><p style={{margin:0,fontSize:'0.62rem',color:T.textDim}}>{dt.toLocaleTimeString(lang==='ar'?'ar-SA':'en-US',{hour:'2-digit',minute:'2-digit'})}</p></div>
        </div>
      );})}
    </div>
  );
}
// ═══ MAIN APP ═══

export default function App(){
  const [lang,setLang]=useState('ar');
  const [isDark,setIsDark]=useState(true);
  const [cal,setCal]=useState(()=>{try{return localStorage.getItem('calendarPref')||'gregory';}catch{return 'gregory';}});
  const [activePage,setActivePage]=useState('dashboard');
  const [navOpen,setNavOpen]=useState(false);
  const [blockedReason,setBlockedReason]=useState(null); // 'inactive' | 'unauthorized'
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [authUser,setAuthUser]=useState(null);
  const [userProfile,setUserProfile]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [saveStatus,setSaveStatus]=useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const saveTimer=useRef(null);
  const savedTimer=useRef(null);
  const t=TR[lang];
  const T=isDark?DARK:LIGHT;
  DATE_CAL=cal;   // applied synchronously before children render
  const toggleCal=()=>setCal(c=>{const n=c==='hijri'?'gregory':'hijri';try{localStorage.setItem('calendarPref',n);}catch{}return n;});

  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,async fbUser=>{
      if(fbUser){
        try{
          const snap=await getDoc(doc(db,'users',fbUser.uid));
          if(snap.exists()){
            const profile={uid:fbUser.uid,...snap.data()};
            // ── Security: block deactivated accounts ──
            if(profile.status==='inactive'){
              await signOut(auth);
              setBlockedReason('inactive');
              setAuthUser(null);setUserProfile(null);setData(null);
              setAuthLoading(false);
              return;
            }
            setBlockedReason(null);
            setUserProfile(profile);
            setAuthUser(fbUser);
          } else {
            // ── Security: unknown user (not created by owner) → deny access ──
            await signOut(auth);
            setBlockedReason('unauthorized');
            setAuthUser(null);setUserProfile(null);setData(null);
            setAuthLoading(false);
            return;
          }
        }catch(e){console.error(e);}
      }else{setUserProfile(null);setData(null);setAuthUser(null);}
      setAuthLoading(false);
    });
    return unsub;
  },[]);

  useEffect(()=>{
    if(!authUser)return;
    const load=async()=>{
      setLoading(true);
      try{const snap=await getDoc(doc(db,'platform','main'));if(snap.exists())setData(snap.data());else{const sample=buildSampleData();await setDoc(doc(db,'platform','main'),sample);setData(sample);}}
      catch(e){setData(buildSampleData());}
      finally{setLoading(false);}
    };
    load();
  },[authUser]);

  useEffect(()=>{
    if(!authUser||loading||!data)return;
    clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current=setTimeout(()=>{
      const payload={...data,updatedAt:new Date().toISOString(),updatedBy:userProfile?.name||'?'};
      setDoc(doc(db,'platform','main'),payload)
        .then(()=>{setSaveStatus('saved');clearTimeout(savedTimer.current);savedTimer.current=setTimeout(()=>setSaveStatus('idle'),2200);})
        .catch(e=>{console.error(e);setSaveStatus('error');});
    },2000);
    return()=>clearTimeout(saveTimer.current);
  },[data,authUser,loading]);

  const logActivity=useCallback((action,module,description)=>{
    const entry={id:genId(),timestamp:new Date().toISOString(),userId:userProfile?.uid||'?',userName:userProfile?.name||'?',action,module,description};
    setData(d=>({...d,activityLog:[entry,...(d.activityLog||[]).slice(0,499)]}));
  },[userProfile]);

  const handleSignOut=async()=>{
    clearTimeout(saveTimer.current);
    if(data)await setDoc(doc(db,'platform','main'),data).catch(()=>{});
    await signOut(auth);
  };

  const role=userProfile?.role||'viewer';
  const canDelete=role==='owner';
  const currentUser={id:userProfile?.uid,name:userProfile?.name||'مستخدم'};
  const pageProps={data,setData,lang,t,T,logActivity,currentUser,canDelete};

  const spinner=msg=>(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:T.bg,fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif'}}><div style={{textAlign:'center'}}><div style={{width:'52px',height:'52px',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:`0 8px 24px ${T.gold}40`}}><div style={{width:'24px',height:'24px',border:'3px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/></div><p style={{color:T.textMuted,fontSize:'0.82rem',margin:0,fontWeight:'500'}}>{msg}</p></div><style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style></div>);

  if(authLoading)return spinner(lang==='ar'?'جاري التحقق...':'Authenticating...');

  // ── Blocked screen ──
  if(blockedReason){
    const isInactive=blockedReason==='inactive';
    return(
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(160deg,#0a0f1e 0%,#0d1f3c 100%)',padding:'1.5rem',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif',direction:'rtl'}}>
        <div style={{textAlign:'center',maxWidth:'320px'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'22px',background:isInactive?'rgba(255,69,58,0.15)':'rgba(255,159,10,0.15)',border:`1px solid ${isInactive?'rgba(255,69,58,0.3)':'rgba(255,159,10,0.3)'}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'2rem'}}>
            {isInactive?'🔒':'⛔'}
          </div>
          <h2 style={{color:'#fff',fontWeight:'800',fontSize:'1.2rem',margin:'0 0 10px'}}>
            {isInactive?'تم تعطيل حسابك':'غير مصرح لك بالدخول'}
          </h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.85rem',lineHeight:'1.6',margin:'0 0 24px'}}>
            {isInactive?'حسابك موجود لكنه معطّل حالياً. تواصل مع مالك النظام لإعادة تفعيله.':'هذا الحساب غير مسجّل في النظام. تواصل مع مالك النظام لإضافتك.'}
          </p>
          <button onClick={()=>setBlockedReason(null)} style={{padding:'12px 28px',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#8a6520,#c9a84c)',color:'#fff',fontWeight:'700',fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit'}}>
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if(!authUser)return <Login/>;
  if(loading||!data)return spinner(lang==='ar'?'جاري التحميل...':'Loading...');

  const dir=lang==='ar'?'rtl':'ltr';
  const alertCount=(()=>{
    let c=0;
    (data?.realEstate||[]).forEach(p=>{
      const units=p.hasUnits?p.units:(p.status==='occupied'?[p]:[]);
      units.filter(u=>u.status==='occupied').forEach(u=>{
        const d=daysUntil(u.rent?.nextDue);if(d!==null&&d<=30)c++;
        const dc=daysUntil(u.contract?.endDate);if(dc!==null&&dc>=0&&dc<=60)c++;
      });
    });
    (data?.vehicles||[]).forEach(v=>{const d=daysUntil(v.insurance?.expiryDate);if(d!==null&&d<=30)c++;});
    (data?.operations||[]).filter(o=>o.status==='pending').forEach(o=>{const d=daysUntil(o.nextDue||o.date);if(d!==null&&d<=7)c++;});
    (data?.loansGiven||[]).filter(l=>l.status==='active').forEach(l=>{const d=daysUntil(l.returnDate);if(d!==null&&d<=30)c++;});
    return c;
  })();

  // ── Navigation helper ──
  const navigate=(page)=>{ setActivePage(page); setNavOpen(false); };

  const renderPage=()=>{
    if(activePage==='dashboard')return<Dashboard {...pageProps}/>;
    if(activePage==='realEstate')return<RealEstatePage {...pageProps}/>;
    if(activePage==='companies')return<CompaniesPage {...pageProps}/>;
    if(activePage==='vehicles')return<VehiclesPage {...pageProps}/>;
    if(activePage==='investments')return<InvestmentsPage {...pageProps}/>;
    if(activePage==='operations')return<OperationsPage {...pageProps}/>;
    if(activePage==='loansGiven')return<LoansGivenPage {...pageProps}/>;
    if(activePage==='finance')return<FinanceTabPage {...pageProps}/>;
    if(activePage==='activityLog')return<ActivityLogPage {...pageProps}/>;
    if(activePage==='userManagement'&&role==='owner')return<UserManagement lang={lang} t={t} currentUser={userProfile}/>;
    return null;
  };

  const pageTitle=(()=>{
    const map={dashboard:t.dashboard,finance:t.financeTab,realEstate:t.realEstate,companies:t.companies,vehicles:t.vehicles,investments:t.investments,operations:t.operations,loansGiven:t.loansGiven,activityLog:t.activityLog,userManagement:t.userManagement};
    return map[activePage]||activePage;
  })();

  const goldGrad=`linear-gradient(135deg,${T.goldDark},${T.gold})`;

  // ── Nav menu structure ──
  const NAV_ITEMS=[
    {id:'dashboard',   icon:Home,       label:t.dashboard,      color:T.gold},
    {id:'assets-group',icon:Building2,  label:t.assets,         color:T.info, children:[
      {id:'realEstate',  icon:Home,        label:t.realEstate},
      {id:'companies',   icon:Building2,   label:t.companies},
      {id:'vehicles',    icon:Car,         label:t.vehicles},
      {id:'investments', icon:TrendingUp,  label:t.investments},
    ]},
    {id:'ops-group',   icon:Wrench,     label:t.operationsTab,  color:T.warning, children:[
      {id:'operations',  icon:Wrench,      label:t.operations},
      {id:'loansGiven',  icon:HandCoins,   label:t.loansGiven},
    ]},
    {id:'finance',     icon:BarChart2,  label:t.financeTab,     color:'#a855f7'},
    {id:'divider1'},
    {id:'activityLog', icon:Activity,   label:t.activityLog,    color:T.info},
    ...(role==='owner'?[{id:'userManagement',icon:Users,label:t.userManagement,color:T.gold}]:[]),
  ];

  return(
    <div dir={dir} style={{minHeight:'var(--app-height,100vh)',background:T.bg,color:T.text,fontFamily:"'IBM Plex Sans Arabic','Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dropDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        input[type=date]::-webkit-calendar-picker-indicator{filter:${isDark?'invert(0.7)':'none'}}
        select option{background:${T.surface};color:${T.text}}
        @media print{header,footer{display:none!important}}
        main > *{animation:fadeIn 0.28s cubic-bezier(0.32,0.72,0,1)}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background:isDark?'rgba(4,10,22,0.72)':'rgba(248,249,252,0.78)',
        borderBottom:`1px solid ${T.border}`,
        padding:'13px 15px',
        display:'flex',alignItems:'center',gap:'8px',
        position:'sticky',top:0,zIndex:40,
        backdropFilter:'blur(28px) saturate(180%)',WebkitBackdropFilter:'blur(28px) saturate(180%)',
      }}>

        {/* Nav trigger — page title + chevron */}
        <button onClick={()=>setNavOpen(v=>!v)} style={{
          display:'flex',alignItems:'center',gap:'5px',flex:1,
          background:'none',border:'none',cursor:'pointer',
          padding:'4px 0',minWidth:0,
        }}>
          <h2 style={{
            margin:0,color:T.text,fontWeight:'700',fontSize:'1.05rem',
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
            letterSpacing:'-0.3px',flex:1,textAlign:lang==='ar'?'right':'left',
          }}>{pageTitle}</h2>
          <ChevronDown size={16} color={T.gold} style={{
            flexShrink:0,
            transform:navOpen?'rotate(180deg)':'rotate(0deg)',
            transition:'transform 0.25s ease',
          }}/>
        </button>

        {/* Right controls */}
        <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
          {saveStatus!=='idle'&&(
            <span title={saveStatus} style={{
              display:'flex',alignItems:'center',gap:'4px',padding:'5px 8px',borderRadius:'9px',
              fontSize:'0.66rem',fontWeight:'700',
              background:(saveStatus==='error'?T.danger:saveStatus==='saved'?T.success:T.textMuted)+'18',
              color:saveStatus==='error'?T.danger:saveStatus==='saved'?T.success:T.textMuted,
            }}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'currentColor',
                animation:saveStatus==='saving'?'pulse 1s ease-in-out infinite':'none'}}/>
              {saveStatus==='saving'?(lang==='ar'?'حفظ…':'Saving…'):saveStatus==='saved'?(lang==='ar'?'محفوظ':'Saved'):(lang==='ar'?'فشل':'Failed')}
            </span>
          )}
          {alertCount>0&&(
            <button onClick={()=>{navigate('dashboard');}} style={{
              background:T.danger+'18',border:`1px solid ${T.danger}33`,
              borderRadius:'10px',padding:'6px 10px',cursor:'pointer',
              display:'flex',alignItems:'center',gap:'4px',color:T.danger,
            }}>
              <Bell size={13}/>
              <span style={{fontSize:'0.7rem',fontWeight:'800'}}>{alertCount}</span>
            </button>
          )}
          <button onClick={()=>setIsDark(d=>!d)} style={{
            display:'flex',alignItems:'center',justifyContent:'center',
            width:'34px',height:'34px',borderRadius:'10px',
            border:`1px solid ${T.border}`,background:T.surface2,
            cursor:'pointer',color:T.textMuted,
          }}>
            {isDark?<Sun size={15}/>:<Moon size={15}/>}
          </button>
          <button onClick={()=>setLang(l=>l==='ar'?'en':'ar')} style={{
            display:'flex',alignItems:'center',gap:'3px',padding:'6px 10px',
            background:T.surface2,border:`1px solid ${T.border}`,
            borderRadius:'10px',color:T.textMuted,cursor:'pointer',
            fontFamily:'inherit',fontSize:'0.75rem',fontWeight:'700',
          }}>
            {lang==='ar'?'EN':'ع'}
          </button>
        </div>
      </header>

      {/* ── DROPDOWN MENU ── */}
      {navOpen&&(
        <>
          {/* Backdrop */}
          <div onClick={()=>setNavOpen(false)} style={{
            position:'fixed',inset:0,zIndex:35,
            background:'rgba(0,0,0,0.35)',
            backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',
          }}/>
          {/* Panel */}
          <div style={{
            position:'fixed',top:'57px',
            [lang==='ar'?'right':'left']:'0',
            [lang==='ar'?'left':'right']:'0',
            zIndex:39,
            maxWidth:'600px',
            margin:'0 auto',
            padding:'0 12px',
            animation:'dropDown 0.22s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{
              background:isDark?'rgba(11,24,48,0.98)':'rgba(255,255,255,0.99)',
              border:`1px solid ${T.border}`,
              borderRadius:'20px',
              boxShadow:`0 16px 48px rgba(0,0,0,${isDark?'0.6':'0.15'})`,
              overflow:'hidden',
            }}>

              {/* User card */}
              <div style={{
                display:'flex',alignItems:'center',gap:'12px',
                padding:'14px 16px',
                background: isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)',
                borderBottom:`1px solid ${T.border}`,
              }}>
                <div style={{
                  width:'40px',height:'40px',borderRadius:'13px',
                  background:goldGrad,flexShrink:0,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:'1rem',fontWeight:'800',color:'#000',
                  boxShadow:`0 3px 10px ${T.gold}40`,
                }}>{userProfile?.name?.charAt(0)||'?'}</div>
                <div style={{minWidth:0,flex:1}}>
                  <p style={{margin:0,color:T.text,fontWeight:'700',fontSize:'0.88rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userProfile?.name}</p>
                  <div style={{display:'flex',alignItems:'center',gap:'5px',marginTop:'2px'}}>
                    <span style={{background:T.gold+'22',color:T.gold,borderRadius:'5px',padding:'1px 6px',fontWeight:'700',fontSize:'0.62rem'}}>
                      {role==='owner'?'مالك':role==='assistant'?'مساعد':'مشاهد'}
                    </span>
                    <span style={{color:T.textMuted,fontSize:'0.7rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userProfile?.email}</span>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <div style={{padding:'8px',maxHeight:'65vh',overflowY:'auto'}}>
                {NAV_ITEMS.map((item,idx)=>{
                  if(item.id.startsWith('divider')){
                    return <div key={idx} style={{height:'1px',background:T.border,margin:'4px 0'}}/>;
                  }
                  const isActive=item.id===activePage||item.children?.some(c=>c.id===activePage);
                  const Icon=item.icon;
                  return(
                    <div key={item.id}>
                      {/* Parent item — if has children just shows as label, else navigates */}
                      <button onClick={()=>{ if(!item.children) navigate(item.id); }}
                        style={{
                          display:'flex',alignItems:'center',gap:'10px',
                          width:'100%',padding:'10px 10px',
                          borderRadius:'12px',border:'none',
                          background: isActive&&!item.children ? T.gold+'15' : 'transparent',
                          cursor: item.children?'default':'pointer',
                          fontFamily:'inherit',
                          textAlign:lang==='ar'?'right':'left',
                        }}>
                        {Icon&&(
                          <div style={{
                            width:'32px',height:'32px',borderRadius:'9px',flexShrink:0,
                            background: isActive ? (item.color||T.gold)+'20' : T.surface2,
                            display:'flex',alignItems:'center',justifyContent:'center',
                            border:`1px solid ${isActive?(item.color||T.gold)+'30':T.border}`,
                          }}>
                            <Icon size={15} color={isActive?(item.color||T.gold):T.textMuted}/>
                          </div>
                        )}
                        <span style={{
                          flex:1,fontSize:'0.88rem',
                          fontWeight: isActive?'700':'500',
                          color: isActive?(item.color||T.gold):T.text,
                        }}>{item.label}</span>
                        {isActive&&!item.children&&(
                          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:item.color||T.gold,flexShrink:0}}/>
                        )}
                      </button>

                      {/* Children — always visible, indented */}
                      {item.children&&(
                        <div style={{marginBottom:'4px'}}>
                          {item.children.map(child=>{
                            const childActive=child.id===activePage;
                            const CIcon=child.icon;
                            return(
                              <button key={child.id} onClick={()=>navigate(child.id)} style={{
                                display:'flex',alignItems:'center',gap:'8px',
                                width:'100%',
                                padding:'8px 10px 8px 20px',
                                borderRadius:'10px',border:'none',
                                background: childActive ? T.gold+'12' : 'transparent',
                                cursor:'pointer',fontFamily:'inherit',
                                textAlign:lang==='ar'?'right':'left',
                              }}>
                                <div style={{
                                  width:'6px',height:'6px',borderRadius:'50%',flexShrink:0,
                                  background: childActive ? T.gold : T.border,
                                  transition:'background 0.15s',
                                }}/>
                                <CIcon size={13} color={childActive?T.gold:T.textMuted}/>
                                <span style={{
                                  fontSize:'0.82rem',
                                  fontWeight:childActive?'700':'400',
                                  color:childActive?T.gold:T.textMuted,
                                }}>{child.label}</span>
                                {childActive&&(
                                  <div style={{marginRight:'auto',marginLeft:'auto'}}/>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Divider before settings */}
                <div style={{height:'1px',background:T.border,margin:'4px 0'}}/>

                {/* Settings: calendar */}
                <button onClick={toggleCal} style={{
                  display:'flex',alignItems:'center',gap:'10px',
                  width:'100%',padding:'10px 10px',borderRadius:'12px',border:'none',
                  background:'transparent',cursor:'pointer',fontFamily:'inherit',
                  textAlign:lang==='ar'?'right':'left',
                }}>
                  <div style={{
                    width:'32px',height:'32px',borderRadius:'9px',flexShrink:0,
                    background:T.info+'18',display:'flex',alignItems:'center',justifyContent:'center',
                    border:`1px solid ${T.info}25`,
                  }}>
                    <Calendar size={15} color={T.info}/>
                  </div>
                  <span style={{flex:1,fontSize:'0.88rem',fontWeight:'500',color:T.text}}>
                    {lang==='ar'?'التقويم':'Calendar'}
                  </span>
                  <span style={{
                    display:'flex',gap:'2px',background:T.surface2,borderRadius:'9px',padding:'2px',
                  }}>
                    {[['gregory',lang==='ar'?'ميلادي':'Greg.'],['hijri',lang==='ar'?'هجري':'Hijri']].map(([v,l])=>(
                      <span key={v} style={{
                        padding:'4px 10px',borderRadius:'7px',fontSize:'0.72rem',fontWeight:'700',
                        background: cal===v ? T.gold : 'transparent',
                        color: cal===v ? '#fff' : T.textMuted,
                      }}>{l}</span>
                    ))}
                  </span>
                </button>

                {/* Divider before sign out */}
                <div style={{height:'1px',background:T.border,margin:'4px 0'}}/>

                {/* Sign out */}
                <button onClick={handleSignOut} style={{
                  display:'flex',alignItems:'center',gap:'10px',
                  width:'100%',padding:'10px 10px',borderRadius:'12px',border:'none',
                  background:'transparent',cursor:'pointer',fontFamily:'inherit',
                  textAlign:lang==='ar'?'right':'left',
                }}>
                  <div style={{
                    width:'32px',height:'32px',borderRadius:'9px',flexShrink:0,
                    background:T.danger+'18',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    border:`1px solid ${T.danger}25`,
                  }}>
                    <LogOut size={15} color={T.danger}/>
                  </div>
                  <span style={{fontSize:'0.88rem',fontWeight:'600',color:T.danger}}>
                    {lang==='ar'?'تسجيل الخروج':'Sign Out'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── CONTENT ── */}
      <main style={{padding:'14px',paddingBottom:'32px',maxWidth:'600px',margin:'0 auto',boxSizing:'border-box'}}>
        {renderPage()}
      </main>
    </div>
  );
}
