import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Login from "./Login";
import UserManagement from "./UserManagement";
import {
  LayoutDashboard, Building2, Car, TrendingUp, Receipt, Users, BarChart2,
  Bell, Menu, X, Plus, Pencil, Trash2, AlertTriangle, Download, Activity,
  Briefcase, DollarSign, ArrowUpCircle, ArrowDownCircle, Globe,
  CheckCircle2, LogOut, Wallet, BarChart3, RefreshCw,
  Wrench, CreditCard, Target, HandCoins, Bitcoin, Lightbulb,
  ChevronRight, ChevronDown, Filter, Calendar, FileText, Award
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";

const T = {
  bg:'#060d1a', surface:'#0c1a35', surface2:'#0f2040',
  border:'#1e3a6a', borderGold:'#c9a84c33',
  gold:'#c9a84c', goldLight:'#e8d48a', goldDark:'#8a6520',
  text:'#dce8f8', textMuted:'#6a88b4', textDim:'#3a5478',
  success:'#22c55e', danger:'#ef4444', warning:'#f59e0b', info:'#3b82f6',
};
const goldGrad = `linear-gradient(135deg,${T.goldDark},${T.gold})`;
const card  = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:'16px' };
const cardG = { background:T.surface, border:`1px solid ${T.borderGold}`, borderRadius:'16px', boxShadow:`0 0 20px ${T.goldDark}22` };
const inp   = { background:T.surface2, border:`1.5px solid ${T.border}`, borderRadius:'10px', color:T.text, padding:'10px 14px', fontSize:'0.875rem', width:'100%', boxSizing:'border-box', fontFamily:'inherit', outline:'none' };
const btn   = { background:goldGrad, color:'#0a0800', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' };
const btnSm = { ...btn, padding:'8px 16px', fontSize:'0.8rem' };
const btnDanger = { background:`${T.danger}22`, color:T.danger, border:`1px solid ${T.danger}44`, borderRadius:'10px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'6px 10px', fontSize:'0.78rem' };
const btnOutline= { background:'transparent', color:T.gold, border:`1px solid ${T.borderGold}`, borderRadius:'10px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'8px 14px', fontSize:'0.82rem' };

const TR = {
  ar:{
    appName:'منصة الأصول الشخصية', dashboard:'لوحة التحكم', realEstate:'العقارات',
    companies:'الشركات', vehicles:'المركبات', investments:'الاستثمارات',
    operations:'العمليات', loansGiven:'القروض المُعطاة', financial:'الذكاء المالي',
    expenses:'المصاريف', transactions:'المعاملات', activityLog:'سجل النشاط',
    reports:'التقارير', userManagement:'إدارة المستخدمين',
    totalAssets:'إجمالي الأصول', monthlyIncome:'الدخل الشهري',
    monthlyExpenses:'المصاريف الشهرية', netWorth:'صافي الثروة',
    alerts:'التنبيهات', add:'إضافة', edit:'تعديل', delete:'حذف',
    save:'حفظ', cancel:'إلغاء', name:'الاسم', type:'النوع',
    value:'القيمة', amount:'المبلغ', date:'التاريخ', notes:'ملاحظات',
    status:'الحالة', occupied:'مشغول', vacant:'شاغر', rent:'الإيجار',
    tenant:'المستأجر', contract:'العقد', paid:'مدفوع', unpaid:'غير مدفوع',
    dueDate:'تاريخ الاستحقاق', sar:'ريال', addedBy:'بواسطة',
    action:'الإجراء', module:'القسم', income:'دخل', expense:'مصروف',
    location:'الموقع', startDate:'بداية العقد', endDate:'نهاية العقد',
    phone:'الهاتف', ownership:'الملكية%', capital:'رأس المال',
    revenue:'الإيرادات', profit:'صافي الربح', employees:'الموظفون',
    salary:'الراتب', plateNumber:'رقم اللوحة', year:'سنة الصنع',
    insurance:'التأمين', registration:'التسجيل', installment:'القسط',
    remainingMonths:'الأشهر المتبقية', purchasePrice:'سعر الشراء',
    currentValue:'القيمة الحالية', profitLoss:'ربح/خسارة',
    category:'الفئة', description:'الوصف', search:'بحث...',
    noData:'لا توجد بيانات', confirmDelete:'تأكيد الحذف النهائي؟',
    yes:'نعم، احذف', no:'إلغاء', exportExcel:'تصدير Excel',
    recentTransactions:'آخر المعاملات', assetDistribution:'توزيع الأصول',
    incomeVsExpense:'الدخل مقابل المصاريف', rentDue:'إيجار مستحق',
    contractExpiring:'عقد ينتهي', insuranceExpiring:'تأمين ينتهي',
    days:'يوم', markPaid:'تحديد كمدفوع', frequency:'الدورية',
    monthly:'شهري', quarterly:'ربع سنوي', yearly:'سنوي',
    companyType:'نوع النشاط', addEmployee:'إضافة موظف', vehicleType:'نوع المركبة',
    loanAmount:'مبلغ القرض', user:'المستخدم', timestamp:'الوقت',
    totalIncome:'إجمالي الدخل', totalExpenses:'إجمالي المصاريف',
    balance:'الرصيد', units:'الوحدات', unit:'وحدة', addUnit:'إضافة وحدة',
    unitNumber:'رقم الوحدة', floor:'الطابق',
    opType:'نوع العملية', maintenance:'صيانة', invoice:'فاتورة',
    subscription:'اشتراك', otherOp:'عملية أخرى',
    borrower:'المقترض', loanDate:'تاريخ القرض',
    durationMonths:'المدة (أشهر)', returnDate:'تاريخ الإرجاع',
    recordPayment:'تسجيل دفعة', loanStatus:'حالة القرض',
    active:'نشط', completed:'منتهي', late:'متأخر',
    roi:'العائد السنوي%', performance:'الأداء', topAssets:'أفضل الأصول',
    recommendations:'توصيات', netWorthTrend:'مسار صافي الثروة',
    addCategory:'إضافة فئة', customCategories:'فئاتي المخصصة',
    linkedTo:'مرتبط بـ', recurring:'متكرر', once:'مرة واحدة',
    nextDue:'الاستحقاق القادم', lastPaid:'آخر دفعة',
    insExpiry:'انتهاء التأمين', regExpiry:'انتهاء التسجيل',
    totalRent:'إيرادات الإيجار', occupiedProps:'مشغولة', vacantProps:'شاغرة',
    totalProperties:'إجمالي العقارات', addTransaction:'إضافة معاملة',
    noAlerts:'لا توجد تنبيهات ✓',
    addedAction:'أضاف', editedAction:'عدّل', deletedAction:'حذف', paidAction:'دفع',
    investmentType:'نوع الاستثمار', purchaseDate:'تاريخ الشراء', all:'الكل',
    companyStatus:'حالة الشركة', activeCompany:'شركة حيّة', underConstruction:'قيد الإنشاء',
    cashFlow:'التدفق النقدي',
  },
  en:{
    appName:'Personal Asset Platform', dashboard:'Dashboard', realEstate:'Real Estate',
    companies:'Companies', vehicles:'Vehicles', investments:'Investments',
    operations:'Operations', loansGiven:'Loans Given', financial:'Financial Intel',
    expenses:'Expenses', transactions:'Transactions', activityLog:'Activity Log',
    reports:'Reports', userManagement:'Users',
    totalAssets:'Total Assets', monthlyIncome:'Monthly Income',
    monthlyExpenses:'Monthly Expenses', netWorth:'Net Worth',
    alerts:'Alerts', add:'Add', edit:'Edit', delete:'Delete',
    save:'Save', cancel:'Cancel', name:'Name', type:'Type',
    value:'Value', amount:'Amount', date:'Date', notes:'Notes',
    status:'Status', occupied:'Occupied', vacant:'Vacant', rent:'Rent',
    tenant:'Tenant', contract:'Contract', paid:'Paid', unpaid:'Unpaid',
    dueDate:'Due Date', sar:'SAR', addedBy:'By',
    action:'Action', module:'Module', income:'Income', expense:'Expense',
    location:'Location', startDate:'Start Date', endDate:'End Date',
    phone:'Phone', ownership:'Ownership%', capital:'Capital',
    revenue:'Revenue', profit:'Net Profit', employees:'Employees',
    salary:'Salary', plateNumber:'Plate', year:'Year',
    insurance:'Insurance', registration:'Registration', installment:'Installment',
    remainingMonths:'Remaining Mo.', purchasePrice:'Purchase Price',
    currentValue:'Current Value', profitLoss:'P&L',
    category:'Category', description:'Description', search:'Search...',
    noData:'No data', confirmDelete:'Confirm delete?',
    yes:'Yes, Delete', no:'Cancel', exportExcel:'Export CSV',
    recentTransactions:'Recent Transactions', assetDistribution:'Asset Mix',
    incomeVsExpense:'Income vs Expenses', rentDue:'Rent Due',
    contractExpiring:'Contract Expiring', insuranceExpiring:'Insurance Expiring',
    days:'days', markPaid:'Mark Paid', frequency:'Frequency',
    monthly:'Monthly', quarterly:'Quarterly', yearly:'Yearly',
    companyType:'Business Type', addEmployee:'Add Employee', vehicleType:'Vehicle Type',
    loanAmount:'Loan Amount', user:'User', timestamp:'Time',
    totalIncome:'Total Income', totalExpenses:'Total Expenses',
    balance:'Balance', units:'Units', unit:'Unit', addUnit:'Add Unit',
    unitNumber:'Unit No.', floor:'Floor',
    opType:'Operation Type', maintenance:'Maintenance', invoice:'Invoice',
    subscription:'Subscription', otherOp:'Other',
    borrower:'Borrower', loanDate:'Loan Date',
    durationMonths:'Duration (mo.)', returnDate:'Return Date',
    recordPayment:'Record Payment', loanStatus:'Loan Status',
    active:'Active', completed:'Completed', late:'Late',
    roi:'Annual ROI%', performance:'Performance', topAssets:'Top Assets',
    recommendations:'Insights', netWorthTrend:'Net Worth Trend',
    addCategory:'Add Category', customCategories:'My Categories',
    linkedTo:'Linked to', recurring:'Recurring', once:'Once',
    nextDue:'Next Due', lastPaid:'Last Paid',
    insExpiry:'Ins. Expiry', regExpiry:'Reg. Expiry',
    totalRent:'Total Rent', occupiedProps:'Occupied', vacantProps:'Vacant',
    totalProperties:'Properties', addTransaction:'Add Transaction',
    noAlerts:'No alerts ✓',
    addedAction:'added', editedAction:'edited', deletedAction:'deleted', paidAction:'paid',
    investmentType:'Investment Type', purchaseDate:'Purchase Date', all:'All',
    companyStatus:'Status', activeCompany:'Active', underConstruction:'Under Construction',
    cashFlow:'Cash Flow',
  }
};

const genId = () => `${Date.now()}_${Math.random().toString(36).substr(2,6)}`;
const todayStr = () => new Date().toISOString().split('T')[0];
const daysUntil = (d) => d ? Math.ceil((new Date(d)-new Date())/86400000) : null;
const fmt = (n) => Math.round(n||0).toLocaleString('ar-SA');
const fmtC = (n,lang) => `${fmt(n)} ${lang==='ar'?'ريال':'SAR'}`;
const fmtDate = (d,lang) => d ? new Date(d).toLocaleDateString(lang==='ar'?'ar-SA':'en-US') : '—';
const pct = (a,b) => b ? ((a/b)*100).toFixed(1) : '0.0';
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PROP_T = { ar:{apartment:'شقة',villa:'فيلا',shop:'محل',warehouse:'مستودع',land:'أرض',building:'عمارة',chalet:'شاليه',hotel:'فندق'}, en:{apartment:'Apartment',villa:'Villa',shop:'Shop',warehouse:'Warehouse',land:'Land',building:'Building',chalet:'Chalet',hotel:'Hotel'} };
const INV_T = { ar:{stocks:'أسهم',gold:'ذهب',currencies:'عملات',funds:'ريت',crypto:'عملات رقمية',startup:'مشاريع ناشئة',other:'أخرى'}, en:{stocks:'Stocks',gold:'Gold',currencies:'Currencies',funds:'REITs',crypto:'Crypto',startup:'Startups',other:'Other'} };
const OP_T = { ar:{maintenance:'صيانة',invoice:'فاتورة',subscription:'اشتراك',installment:'قسط',other:'أخرى'}, en:{maintenance:'Maintenance',invoice:'Invoice',subscription:'Subscription',installment:'Installment',other:'Other'} };
const FREQ_T = { ar:{once:'مرة واحدة',monthly:'شهري',quarterly:'ربع سنوي',yearly:'سنوي'}, en:{once:'Once',monthly:'Monthly',quarterly:'Quarterly',yearly:'Yearly'} };
const PIE_COLORS = ['#c9a84c','#3b82f6','#22c55e','#a855f7','#ef4444','#06b6d4','#f59e0b'];
const DEF_CATS_AR = ['صيانة','فواتير','رواتب','تأمين','ضرائب وزكاة','مصاريف خيرية','سفر وتمثيل','بروتوكول','مصاريف تشغيل','أخرى'];

function buildSampleData() {
  return {
    realEstate:[
      { id:genId(), name:'عمارة الروضة', type:'building', location:'الرياض - الروضة', value:3500000, status:'occupied', hasUnits:true,
        units:[
          { id:genId(), number:'1', floor:'1', type:'apartment', status:'occupied', tenant:{name:'أحمد محمد',phone:'0501234567'}, rent:{amount:30000,frequency:'yearly',nextDue:'2025-08-01',lastPaid:'2025-01-15'}, contract:{startDate:'2024-08-01',endDate:'2025-08-01'} },
          { id:genId(), number:'2', floor:'1', type:'apartment', status:'occupied', tenant:{name:'خالد عبدالله',phone:'0556789012'}, rent:{amount:32000,frequency:'yearly',nextDue:'2025-09-01',lastPaid:'2025-02-01'}, contract:{startDate:'2024-09-01',endDate:'2025-09-01'} },
          { id:genId(), number:'3', floor:'2', type:'apartment', status:'vacant', tenant:{name:'',phone:''}, rent:{amount:0,frequency:'yearly',nextDue:'',lastPaid:''}, contract:{startDate:'',endDate:''} },
        ],
        tenant:{name:'',phone:''}, rent:{amount:0,frequency:'yearly',nextDue:'',lastPaid:''}, contract:{startDate:'',endDate:''}, notes:'3 وحدات سكنية' },
      { id:genId(), name:'محل الملز التجاري', type:'shop', location:'الرياض - الملز', value:1200000, status:'occupied', hasUnits:false, units:[],
        tenant:{name:'شركة النور',phone:'0556789012'}, rent:{amount:60000,frequency:'yearly',nextDue:'2025-06-15',lastPaid:'2024-12-15'}, contract:{startDate:'2023-06-15',endDate:'2026-06-15'}, notes:'' },
      { id:genId(), name:'أرض العليا', type:'land', location:'الرياض - العليا', value:2000000, status:'vacant', hasUnits:false, units:[],
        tenant:{name:'',phone:''}, rent:{amount:0,frequency:'yearly',nextDue:'',lastPaid:''}, contract:{startDate:'',endDate:''}, notes:'للبيع أو التطوير' },
    ],
    companies:[
      { id:genId(), name:'شركة الأفق للتجارة', type:'تجارة عامة', companyStatus:'active', ownership:100, capital:500000, monthlyRevenue:85000, monthlyExpense:62000, employees:[{id:genId(),name:'محمد علي',salary:8000},{id:genId(),name:'عبدالله سعد',salary:6500}], notes:'' },
      { id:genId(), name:'مشروع المجمع التجاري', type:'عقارات', companyStatus:'underConstruction', ownership:60, capital:2000000, monthlyRevenue:0, monthlyExpense:45000, employees:[], notes:'يتوقع الانتهاء 2026' },
    ],
    vehicles:[
      { id:genId(), name:'تويوتا لاند كروزر 2022', type:'SUV', plateNumber:'أ ب ج 1234', year:2022, value:280000, insurance:{company:'التعاونية',expiryDate:'2025-09-15',amount:4500}, registration:{expiryDate:'2025-11-30',amount:900}, loan:{amount:0,monthlyInstallment:0,nextDue:'',remainingMonths:0}, notes:'' },
      { id:genId(), name:'مرسيدس E-Class 2023', type:'Sedan', plateNumber:'د هـ و 5678', year:2023, value:320000, insurance:{company:'ولاء',expiryDate:'2026-03-20',amount:6200}, registration:{expiryDate:'2026-03-20',amount:1100}, loan:{amount:180000,monthlyInstallment:5500,nextDue:'2025-06-05',remainingMonths:28}, notes:'' },
    ],
    investments:[
      { id:genId(), name:'محفظة تداول السعودية', type:'stocks', purchasePrice:150000, currentValue:178000, purchaseDate:'2023-01-15', notes:'أرامكو، سابك' },
      { id:genId(), name:'ذهب مسبوكات 50 غرام', type:'gold', purchasePrice:80000, currentValue:95000, purchaseDate:'2022-06-01', notes:'' },
      { id:genId(), name:'صندوق ريت السعودية', type:'funds', purchasePrice:200000, currentValue:215000, purchaseDate:'2023-09-01', notes:'' },
      { id:genId(), name:'Bitcoin & Ethereum', type:'crypto', purchasePrice:50000, currentValue:72000, purchaseDate:'2024-01-10', notes:'محفظة متنوعة' },
      { id:genId(), name:'مشروع تقنية المدفوعات', type:'startup', purchasePrice:100000, currentValue:100000, purchaseDate:'2024-06-01', notes:'مرحلة مبكرة' },
    ],
    operations:[
      { id:genId(), date:'2025-05-01', type:'maintenance', description:'صيانة سباكة عمارة الروضة', amount:2500, frequency:'once', linkedType:'property', linkedName:'عمارة الروضة', status:'paid', addedBy:'المالك' },
      { id:genId(), date:'2025-06-05', type:'installment', description:'قسط مرسيدس E-Class', amount:5500, frequency:'monthly', nextDue:'2025-06-05', linkedType:'vehicle', linkedName:'مرسيدس E-Class', status:'pending', addedBy:'المالك' },
      { id:genId(), date:'2025-07-01', type:'subscription', description:'اشتراك منظومة محاسبة', amount:350, frequency:'monthly', nextDue:'2025-07-01', linkedType:'company', linkedName:'شركة الأفق', status:'pending', addedBy:'المساعد' },
    ],
    loansGiven:[
      { id:genId(), borrowerName:'عبدالرحمن الشمري', borrowerPhone:'0501111222', amount:50000, loanDate:'2024-10-01', durationMonths:12, returnDate:'2025-10-01', status:'active', payments:[{id:genId(),date:'2025-02-01',amount:10000}], notes:'' },
    ],
    expenses:[
      { id:genId(), date:'2025-05-01', amount:5000, category:'صيانة', description:'صيانة عامة', addedBy:'المالك' },
      { id:genId(), date:'2025-05-10', amount:1200, category:'فواتير', description:'فاتورة كهرباء', addedBy:'المساعد' },
      { id:genId(), date:'2025-04-15', amount:3000, category:'سفر وتمثيل', description:'سفر عمل', addedBy:'المالك' },
    ],
    transactions:[
      { id:genId(), date:'2025-05-01', type:'income', amount:5000, category:'إيجار', description:'إيجار محل الملز', addedBy:'المالك' },
      { id:genId(), date:'2025-05-05', type:'income', amount:23000, category:'أرباح شركة', description:'أرباح شركة الأفق - أبريل', addedBy:'المالك' },
      { id:genId(), date:'2025-05-08', type:'expense', amount:5500, category:'قسط سيارة', description:'قسط مرسيدس', addedBy:'المالك' },
      { id:genId(), date:'2025-04-01', type:'income', amount:22000, category:'أرباح شركة', description:'أرباح مارس', addedBy:'المالك' },
      { id:genId(), date:'2025-04-10', type:'expense', amount:4200, category:'صيانة', description:'صيانة متنوعة', addedBy:'المساعد' },
      { id:genId(), date:'2025-03-01', type:'income', amount:20000, category:'أرباح شركة', description:'أرباح فبراير', addedBy:'المالك' },
    ],
    customCategories:[...DEF_CATS_AR],
    activityLog:[{ id:genId(), timestamp:new Date().toISOString(), userId:'system', userName:'النظام', action:'أضاف', module:'النظام', description:'تم إنشاء المنصة' }]
  };
}

const lbl = { display:'block', fontSize:'0.72rem', fontWeight:'600', color:T.textMuted, marginBottom:'4px' };
function Field({ label, children }) { return <div style={{marginBottom:'12px'}}><label style={lbl}>{label}</label>{children}</div>; }
function Inp({ value, onChange, type='text', placeholder='', min }) {
  return <input type={type} value={value||''} onChange={onChange} placeholder={placeholder} min={min}
    style={inp} onFocus={e=>{e.target.style.borderColor=T.gold;e.target.style.boxShadow=`0 0 0 2px ${T.goldDark}33`;}}
    onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow='none';}}/>;
}
function Sel({ value, onChange, children }) {
  return <select value={value||''} onChange={onChange} style={{...inp,cursor:'pointer'}}>{children}</select>;
}
function Ta({ value, onChange, rows=2 }) {
  return <textarea value={value||''} onChange={onChange} rows={rows} style={{...inp,resize:'vertical'}}/>;
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)'}}>
      <div style={{background:T.surface,border:`1px solid ${T.borderGold}`,borderRadius:'20px',width:'100%',maxWidth:wide?'700px':'480px',maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:`0 0 60px ${T.goldDark}44`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${T.surface2},#1a2f5a)`}}>
          <h3 style={{color:T.gold,margin:0,fontWeight:'700',fontSize:'1rem'}}>{title}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',padding:'4px'}}><X size={18}/></button>
        </div>
        <div style={{overflowY:'auto',flex:1,padding:'20px'}}>{children}</div>
      </div>
    </div>
  );
}
function Confirm({ t, onConfirm, onCancel }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.8)'}}>
      <div style={{background:T.surface,border:`1px solid ${T.danger}44`,borderRadius:'20px',padding:'2rem',maxWidth:'360px',textAlign:'center',boxShadow:`0 0 40px ${T.danger}33`}}>
        <div style={{width:'52px',height:'52px',background:`${T.danger}22`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}><Trash2 size={22} color={T.danger}/></div>
        <p style={{color:T.text,fontWeight:'700',marginBottom:'4px'}}>{t.confirmDelete}</p>
        <p style={{color:T.textMuted,fontSize:'0.8rem',marginBottom:'1.5rem'}}>لا يمكن التراجع عن هذا الإجراء</p>
        <div style={{display:'flex',gap:'8px',justifyContent:'center'}}>
          <button onClick={onConfirm} style={{...btn,padding:'10px 20px',fontSize:'0.85rem',background:T.danger}}>{t.yes}</button>
          <button onClick={onCancel} style={{...btnOutline,padding:'10px 20px',fontSize:'0.85rem'}}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}
function Badge({ color, children }) {
  return <span style={{fontSize:'0.72rem',padding:'2px 8px',borderRadius:'8px',fontWeight:'600',color,background:color+'22'}}>{children}</span>;
}
function StatCard({ label, value, icon:Icon, color, sub }) {
  return (
    <div style={{...card,padding:'14px',display:'flex',alignItems:'flex-start',gap:'10px'}}>
      <div style={{width:'38px',height:'38px',borderRadius:'12px',background:color+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={18} color={color}/></div>
      <div style={{minWidth:0}}>
        <p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{label}</p>
        <p style={{margin:0,fontSize:'0.9rem',fontWeight:'800',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value}</p>
        {sub && <p style={{margin:0,fontSize:'0.68rem',color:T.textDim}}>{sub}</p>}
      </div>
    </div>
  );
}
function Dashboard({ data, lang, t }) {
  const re=data.realEstate||[], co=data.companies||[], ve=data.vehicles||[], iv=data.investments||[];
  const tr=data.transactions||[];
  const totalRE=re.reduce((s,p)=>s+p.value,0), totalCo=co.reduce((s,c)=>s+c.capital,0);
  const totalVe=ve.reduce((s,v)=>s+v.value,0), totalIv=iv.reduce((s,i)=>s+i.currentValue,0);
  const totalAssets=totalRE+totalCo+totalVe+totalIv;
  const now=new Date();
  const thisMonth=tx=>{const d=new Date(tx.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();};
  const mInc=tr.filter(tx=>tx.type==='income'&&thisMonth(tx)).reduce((s,tx)=>s+tx.amount,0);
  const mExp=tr.filter(tx=>tx.type==='expense'&&thisMonth(tx)).reduce((s,tx)=>s+tx.amount,0);
  const alerts=[];
  re.forEach(p=>{
    const units=p.hasUnits?p.units:(p.status==='occupied'?[{...p,id:p.id,rent:p.rent,contract:p.contract}]:[]);
    units.filter(u=>u.status==='occupied').forEach(u=>{
      const d=daysUntil(u.rent?.nextDue); if(d!==null&&d<=30) alerts.push({label:t.rentDue,name:`${p.name}${p.hasUnits?' - وحدة '+u.number:''}`,days:d,color:d<=7?T.danger:T.warning});
      const dc=daysUntil(u.contract?.endDate); if(dc!==null&&dc>=0&&dc<=60) alerts.push({label:t.contractExpiring,name:p.name,days:dc,color:dc<=14?T.danger:T.warning});
    });
  });
  ve.forEach(v=>{
    const di=daysUntil(v.insurance?.expiryDate); if(di!==null&&di<=30) alerts.push({label:t.insuranceExpiring,name:v.name,days:di,color:di<=7?T.danger:T.warning});
    if(v.loan?.amount>0){const dl=daysUntil(v.loan?.nextDue);if(dl!==null&&dl<=14)alerts.push({label:t.installment,name:v.name,days:dl,color:dl<=5?T.danger:T.warning});}
  });
  (data.operations||[]).filter(o=>o.status==='pending').forEach(o=>{const d=daysUntil(o.nextDue||o.date);if(d!==null&&d<=7)alerts.push({label:(lang==='ar'?OP_T.ar:OP_T.en)[o.type]||o.type,name:o.description,days:d,color:d<=2?T.danger:T.warning});});
  (data.loansGiven||[]).filter(l=>l.status==='active').forEach(l=>{const d=daysUntil(l.returnDate);if(d!==null&&d<=30)alerts.push({label:lang==='ar'?'قرض مُعطى':'Loan due',name:l.borrowerName,days:d,color:d<=7?T.danger:T.warning});});
  alerts.sort((a,b)=>a.days-b.days);
  const chartData=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);const m=d.getMonth(),y=d.getFullYear();const mn=lang==='ar'?MONTHS_AR[m]:MONTHS_EN[m];const inc=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='income'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);const exp=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='expense'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);return{name:mn,دخل:inc,مصاريف:exp};});
  const pieData=[{name:lang==='ar'?'عقارات':'Real Estate',value:totalRE},{name:lang==='ar'?'شركات':'Companies',value:totalCo},{name:lang==='ar'?'مركبات':'Vehicles',value:totalVe},{name:lang==='ar'?'استثمارات':'Investments',value:totalIv}].filter(d=>d.value>0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{...cardG,padding:'24px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${T.goldDark}22,transparent 70%)`,pointerEvents:'none'}}/>
        <p style={{color:T.textMuted,fontSize:'0.8rem',margin:'0 0 4px'}}>{t.netWorth}</p>
        <p style={{color:T.gold,fontSize:'2.4rem',fontWeight:'900',margin:'0 0 2px',letterSpacing:'-1px'}}>{fmt(totalAssets)}</p>
        <p style={{color:T.textMuted,fontSize:'0.75rem',margin:0}}>{lang==='ar'?'ريال سعودي':'Saudi Riyal'}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <StatCard label={t.totalAssets} value={fmtC(totalAssets,lang)} icon={Wallet} color={T.gold}/>
        <StatCard label={t.monthlyIncome} value={fmtC(mInc,lang)} icon={ArrowUpCircle} color={T.success}/>
        <StatCard label={t.monthlyExpenses} value={fmtC(mExp,lang)} icon={ArrowDownCircle} color={T.danger}/>
        <StatCard label={t.balance} value={fmtC(mInc-mExp,lang)} icon={TrendingUp} color={mInc>=mExp?T.success:T.danger}/>
      </div>
      {alerts.length>0 && (
        <div style={{...card,padding:'14px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
            <Bell size={14} color={T.gold}/><span style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem'}}>{t.alerts}</span>
            <span style={{background:T.danger,color:'#fff',borderRadius:'50%',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:'700'}}>{alerts.length}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            {alerts.slice(0,5).map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px',borderRadius:'10px',background:a.color+'11',border:`1px solid ${a.color}33`}}>
                <AlertTriangle size={13} color={a.color} style={{flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:'0.8rem',fontWeight:'600',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</p>
                  <p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{a.label}</p>
                </div>
                <span style={{fontSize:'0.72rem',fontWeight:'700',color:a.color,whiteSpace:'nowrap'}}>{a.days<=0?'اليوم!':a.days===1?'غداً':`${a.days} ${t.days}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{...card,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><BarChart3 size={13}/>{t.incomeVsExpense}</p>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={chartData} margin={{top:0,right:0,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.success} stopOpacity={0.35}/><stop offset="95%" stopColor={T.success} stopOpacity={0}/></linearGradient>
              <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.danger} stopOpacity={0.35}/><stop offset="95%" stopColor={T.danger} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="name" tick={{fontSize:10,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/>
            <Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text}}/>
            <Area type="monotone" dataKey="دخل" stroke={T.success} fill="url(#ig)" strokeWidth={2}/>
            <Area type="monotone" dataKey="مصاريف" stroke={T.danger} fill="url(#eg)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <div style={{...card,padding:'14px'}}>
          <p style={{color:T.gold,fontWeight:'700',fontSize:'0.78rem',margin:'0 0 8px'}}>{t.assetDistribution}</p>
          {pieData.length>0?(
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                  {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text}}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                {pieData.map((d,i)=>(<div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'0.68rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'7px',height:'7px',borderRadius:'50%',background:PIE_COLORS[i%PIE_COLORS.length],display:'inline-block'}}/><span style={{color:T.textMuted}}>{d.name}</span></div>
                  <span style={{color:T.text,fontWeight:'700'}}>{pct(d.value,totalAssets)}%</span>
                </div>))}
              </div>
            </>
          ):<p style={{color:T.textMuted,textAlign:'center',fontSize:'0.8rem',padding:'1rem'}}>{t.noData}</p>}
        </div>
        <div style={{...card,padding:'14px'}}>
          <p style={{color:T.gold,fontWeight:'700',fontSize:'0.78rem',margin:'0 0 8px'}}>{t.recentTransactions}</p>
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            {(data.transactions||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4).map((tx,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{width:'26px',height:'26px',borderRadius:'8px',background:tx.type==='income'?T.success+'22':T.danger+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {tx.type==='income'?<ArrowUpCircle size={11} color={T.success}/>:<ArrowDownCircle size={11} color={T.danger}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:'0.7rem',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tx.description}</p>
                  <p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{fmtDate(tx.date,lang)}</p>
                </div>
                <span style={{fontSize:'0.7rem',fontWeight:'700',color:tx.type==='income'?T.success:T.danger,whiteSpace:'nowrap'}}>{tx.type==='income'?'+':'-'}{fmt(tx.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealEstatePage({ data, setData, lang, t, logActivity, canDelete }) {
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[unitModal,setUnitModal]=useState(null);
  const [expandedId,setExpandedId]=useState(null),[search,setSearch]=useState(''),[form,setForm]=useState({}),[unitForm,setUnitForm]=useState({});
  const items=data.realEstate||[]; const pt=lang==='ar'?PROP_T.ar:PROP_T.en; const ft=lang==='ar'?FREQ_T.ar:FREQ_T.en;
  const openAdd=()=>{setForm({name:'',type:'apartment',location:'',value:'',status:'occupied',hasUnits:false,units:[],tenant:{name:'',phone:''},rent:{amount:'',frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''},notes:''});setModal('add');};
  const openEdit=item=>{setForm({...item,value:String(item.value),rent:{...item.rent,amount:String(item.rent?.amount||'')}});setModal({edit:item});};
  const save=()=>{const entry={...form,id:modal==='add'?genId():form.id,value:Number(form.value)||0,rent:{...form.rent,amount:Number(form.rent?.amount)||0}};setData(d=>({...d,realEstate:modal==='add'?[...items,entry]:items.map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.realEstate,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,realEstate:d.realEstate.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.realEstate,`"${item?.name}"`);setConfirm(null);};
  const markPaid=(pid,uid)=>{const nl=items.map(p=>{if(p.id!==pid)return p;if(uid&&p.hasUnits)return{...p,units:p.units.map(u=>u.id===uid?{...u,rent:{...u.rent,lastPaid:todayStr()}}:u)};return{...p,rent:{...p.rent,lastPaid:todayStr()}};});setData(d=>({...d,realEstate:nl}));logActivity(t.paidAction,t.realEstate,`إيجار "${items.find(p=>p.id===pid)?.name}"`);}; 
  const openAddUnit=pid=>{setUnitForm({id:'',number:'',floor:'',type:'apartment',status:'occupied',tenant:{name:'',phone:''},rent:{amount:'',frequency:'yearly',nextDue:'',lastPaid:''},contract:{startDate:'',endDate:''}});setUnitModal({pid,isNew:true});};
  const openEditUnit=(pid,u)=>{setUnitForm({...u,rent:{...u.rent,amount:String(u.rent?.amount||'')}});setUnitModal({pid,isNew:false});};
  const saveUnit=()=>{const entry={...unitForm,id:unitModal.isNew?genId():unitForm.id,rent:{...unitForm.rent,amount:Number(unitForm.rent?.amount)||0}};setData(d=>({...d,realEstate:d.realEstate.map(p=>p.id===unitModal.pid?{...p,units:unitModal.isNew?[...(p.units||[]),entry]:(p.units||[]).map(u=>u.id===entry.id?entry:u)}:p)}));setUnitModal(null);};
  const delUnit=(pid,uid)=>setData(d=>({...d,realEstate:d.realEstate.map(p=>p.id===pid?{...p,units:p.units.filter(u=>u.id!==uid)}:p)}));
  const filtered=items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.location?.toLowerCase().includes(search.toLowerCase()));
  const totalRent=items.reduce((s,p)=>{let r=0;if(p.hasUnits)r=p.units.filter(u=>u.status==='occupied').reduce((su,u)=>{let rv=u.rent?.amount||0;if(u.rent?.frequency==='monthly')rv*=12;if(u.rent?.frequency==='quarterly')rv*=4;return su+rv;},0);else if(p.status==='occupied'){let rv=p.rent?.amount||0;if(p.rent?.frequency==='monthly')rv*=12;if(p.rent?.frequency==='quarterly')rv*=4;r=rv;}return s+r;},0);
  const renderUnit=(u,pid)=>{const du=daysUntil(u.rent?.nextDue);return(
    <div key={u.id} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',padding:'10px 12px',marginBottom:'6px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
        <span style={{fontSize:'0.78rem',fontWeight:'700',color:T.gold}}>وحدة {u.number}</span>
        {u.floor&&<span style={{fontSize:'0.7rem',color:T.textMuted}}>ط{u.floor}</span>}
        <Badge color={u.status==='occupied'?T.success:T.warning}>{u.status==='occupied'?t.occupied:t.vacant}</Badge>
        {u.status==='occupied'&&u.tenant?.name&&<span style={{fontSize:'0.74rem',color:T.text}}>— {u.tenant.name}</span>}
        <div style={{marginRight:'auto',display:'flex',gap:'4px'}}>
          {u.status==='occupied'&&<button onClick={()=>markPaid(pid,u.id)} style={{...btnSm,padding:'4px 8px',fontSize:'0.68rem'}}><CheckCircle2 size={10}/></button>}
          <button onClick={()=>openEditUnit(pid,u)} style={{...btnOutline,padding:'4px 8px',fontSize:'0.68rem'}}><Pencil size={10}/></button>
          {canDelete&&<button onClick={()=>delUnit(pid,u.id)} style={{...btnDanger,padding:'4px 8px',fontSize:'0.68rem'}}><Trash2 size={10}/></button>}
        </div>
      </div>
      {u.status==='occupied'&&<div style={{display:'flex',gap:'10px',marginTop:'5px',flexWrap:'wrap'}}>
        <span style={{fontSize:'0.7rem',color:T.textMuted}}>{fmtC(u.rent?.amount,lang)} / {ft[u.rent?.frequency]}</span>
        {du!==null&&du<=30&&<span style={{fontSize:'0.7rem',color:T.warning}}>⚠️ {du} {t.days}</span>}
      </div>}
    </div>
  );};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        {[{l:t.totalProperties,v:items.length,c:T.info},{l:t.totalRent+' '+lang==='ar'?'سنوياً':'yearly',v:fmtC(totalRent,lang),c:T.gold}].map((s,i)=>(
          <div key={i} style={{...card,padding:'12px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontWeight:'800',fontSize:'1rem',color:s.c}}>{s.v}</p></div>
        ))}
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{...inp,flex:1}}/>
        <button onClick={openAdd} style={{...btn,padding:'10px 16px',fontSize:'0.82rem',whiteSpace:'nowrap'}}><Plus size={14}/>{t.add}</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
        {filtered.map(item=>{const isEx=expandedId===item.id;const du=!item.hasUnits&&daysUntil(item.rent?.nextDue);const ce=!item.hasUnits&&daysUntil(item.contract?.endDate);return(
          <div key={item.id} style={{...card,overflow:'hidden'}}>
            <div style={{padding:'14px',cursor:'pointer'}} onClick={()=>setExpandedId(isEx?null:item.id)}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                    <h4 style={{margin:0,color:T.text,fontWeight:'700',fontSize:'0.95rem'}}>{item.name}</h4>
                    {item.hasUnits&&<Badge color={T.info}>{item.units?.length||0} {t.units}</Badge>}
                    {!item.hasUnits&&<Badge color={item.status==='occupied'?T.success:T.warning}>{item.status==='occupied'?t.occupied:t.vacant}</Badge>}
                  </div>
                  <p style={{margin:'2px 0 0',fontSize:'0.74rem',color:T.textMuted}}>{item.location} • {pt[item.type]||item.type} • {fmtC(item.value,lang)}</p>
                  {!item.hasUnits&&item.status==='occupied'&&<div style={{display:'flex',gap:'8px',marginTop:'4px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'0.72rem',color:T.textMuted}}>{item.tenant?.name}</span>
                    <span style={{fontSize:'0.72rem',color:T.textMuted}}>• {fmtC(item.rent?.amount,lang)}/{ft[item.rent?.frequency]}</span>
                    {du!==null&&du<=30&&<Badge color={T.warning}>⚠️ {du} {t.days}</Badge>}
                    {ce!==null&&ce>=0&&ce<=60&&<Badge color={T.danger}>⚠️ {t.contractExpiring}</Badge>}
                  </div>}
                </div>
                {isEx?<ChevronDown size={15} color={T.gold}/>:<ChevronRight size={15} color={T.textMuted}/>}
              </div>
            </div>
            {isEx&&<div style={{borderTop:`1px solid ${T.border}`,padding:'12px 14px'}}>
              {item.hasUnits?(
                <>{(item.units||[]).map(u=>renderUnit(u,item.id))}<button onClick={()=>openAddUnit(item.id)} style={{...btnOutline,width:'100%',marginTop:'4px',fontSize:'0.78rem'}}><Plus size={13}/>{t.addUnit}</button></>
              ):item.status==='occupied'&&(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
                  {[{l:t.startDate,v:fmtDate(item.contract?.startDate,lang)},{l:t.endDate,v:fmtDate(item.contract?.endDate,lang)},{l:t.lastPaid,v:fmtDate(item.rent?.lastPaid,lang)},{l:t.phone,v:item.tenant?.phone}].map((f,i)=>(
                    <div key={i}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{f.l}</p><p style={{margin:0,fontSize:'0.78rem',color:T.text,fontWeight:'600'}}>{f.v||'—'}</p></div>
                  ))}
                </div>
              )}
              {item.notes&&<p style={{fontSize:'0.73rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 8px'}}>"{item.notes}"</p>}
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {!item.hasUnits&&item.status==='occupied'&&<button onClick={()=>markPaid(item.id,null)} style={{...btn,...btnSm}}><CheckCircle2 size={12}/>{t.markPaid}</button>}
                <button onClick={()=>openEdit(item)} style={{...btnOutline,...btnSm}}><Pencil size={12}/>{t.edit}</button>
                {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,...btnSm}}><Trash2 size={12}/>{t.delete}</button>}
              </div>
            </div>}
          </div>
        );})}
      </div>
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.realEstate}`:`${t.edit}`} onClose={()=>setModal(null)} wide>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <Field label={t.type}><Sel value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{Object.entries(pt).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          <Field label={t.location}><Inp value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/></Field>
          <Field label={`${t.value} (${t.sar})`}><Inp type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))}/></Field>
          <div style={{gridColumn:'1/-1'}}><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',color:T.text,fontSize:'0.85rem'}}><input type="checkbox" checked={form.hasUnits||false} onChange={e=>setForm(f=>({...f,hasUnits:e.target.checked}))} style={{width:'16px',height:'16px',accentColor:T.gold}}/>{lang==='ar'?'يحتوي على وحدات متعددة':'Has multiple units'}</label></div>
          {!form.hasUnits&&<Field label={t.status}><Sel value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}><option value="occupied">{t.occupied}</option><option value="vacant">{t.vacant}</option></Sel></Field>}
        </div>
        {!form.hasUnits&&form.status==='occupied'&&<>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px',marginTop:'6px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>👤 {t.tenant}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Field label={t.name}><Inp value={form.tenant?.name} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}}))}/></Field>
              <Field label={t.phone}><Inp value={form.tenant?.phone} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}}))}/></Field>
            </div>
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>💰 {t.rent}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
              <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={form.rent?.amount} onChange={e=>setForm(f=>({...f,rent:{...f.rent,amount:e.target.value}}))}/></Field>
              <Field label={t.frequency}><Sel value={form.rent?.frequency} onChange={e=>setForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}}))}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
              <Field label={t.nextDue}><Inp type="date" value={form.rent?.nextDue} onChange={e=>setForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}}))}/></Field>
            </div>
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>📄 {t.contract}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Field label={t.startDate}><Inp type="date" value={form.contract?.startDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}}))}/></Field>
              <Field label={t.endDate}><Inp type="date" value={form.contract?.endDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}}))}/></Field>
            </div>
          </div>
        </>}
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(null)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {unitModal&&<Modal title={unitModal.isNew?t.addUnit:t.edit} onClose={()=>setUnitModal(null)}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.unitNumber}><Inp value={unitForm.number} onChange={e=>setUnitForm(f=>({...f,number:e.target.value}))}/></Field>
          <Field label={t.floor}><Inp value={unitForm.floor} onChange={e=>setUnitForm(f=>({...f,floor:e.target.value}))}/></Field>
          <Field label={t.type}><Sel value={unitForm.type} onChange={e=>setUnitForm(f=>({...f,type:e.target.value}))}>{Object.entries(pt).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          <Field label={t.status}><Sel value={unitForm.status} onChange={e=>setUnitForm(f=>({...f,status:e.target.value}))}><option value="occupied">{t.occupied}</option><option value="vacant">{t.vacant}</option></Sel></Field>
        </div>
        {unitForm.status==='occupied'&&<>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>👤 {t.tenant}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Field label={t.name}><Inp value={unitForm.tenant?.name} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}}))}/></Field>
              <Field label={t.phone}><Inp value={unitForm.tenant?.phone} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}}))}/></Field>
            </div>
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>💰 {t.rent}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
              <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={unitForm.rent?.amount} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,amount:e.target.value}}))}/></Field>
              <Field label={t.frequency}><Sel value={unitForm.rent?.frequency} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}}))}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
              <Field label={t.nextDue}><Inp type="date" value={unitForm.rent?.nextDue} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}}))}/></Field>
            </div>
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Field label={t.startDate}><Inp type="date" value={unitForm.contract?.startDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}}))}/></Field>
              <Field label={t.endDate}><Inp type="date" value={unitForm.contract?.endDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}}))}/></Field>
            </div>
          </div>
        </>}
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={saveUnit} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setUnitModal(null)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}
function CompaniesPage({ data, setData, lang, t, logActivity, canDelete }) {
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({});
  const items=data.companies||[];
  const openAdd=()=>{setForm({name:'',type:'',companyStatus:'active',ownership:100,capital:'',monthlyRevenue:'',monthlyExpense:'',employees:[],notes:''});setModal('add');};
  const openEdit=item=>{setForm({...item,capital:String(item.capital),monthlyRevenue:String(item.monthlyRevenue),monthlyExpense:String(item.monthlyExpense)});setModal({edit:item});};
  const save=()=>{const entry={...form,id:modal==='add'?genId():form.id,capital:Number(form.capital)||0,monthlyRevenue:Number(form.monthlyRevenue)||0,monthlyExpense:Number(form.monthlyExpense)||0,ownership:Number(form.ownership)||0};setData(d=>({...d,companies:modal==='add'?[...items,entry]:items.map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.companies,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,companies:d.companies.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.companies,`"${item?.name}"`);setConfirm(null);};
  const addEmp=()=>setForm(f=>({...f,employees:[...(f.employees||[]),{id:genId(),name:'',salary:''}]}));
  const remEmp=eid=>setForm(f=>({...f,employees:f.employees.filter(e=>e.id!==eid)}));
  const editEmp=(eid,field,val)=>setForm(f=>({...f,employees:f.employees.map(e=>e.id===eid?{...e,[field]:val}:e)}));
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><p style={{margin:0,fontSize:'0.78rem',color:T.textMuted}}>{items.length} {lang==='ar'?'شركة/مؤسسة':'entities'}</p>
          <p style={{margin:0,fontSize:'0.75rem',color:T.success}}>{lang==='ar'?'صافي شهري:':'Net/mo:'} {fmtC(items.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+c.monthlyRevenue-c.monthlyExpense,0),lang)}</p>
        </div>
        <button onClick={openAdd} style={{...btn,...btnSm}}><Plus size={14}/>{t.add}</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
        {items.map(item=>{const profit=item.monthlyRevenue-item.monthlyExpense;const isActive=item.companyStatus==='active';return(
          <div key={item.id} style={{...card,padding:'14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px',flexWrap:'wrap',gap:'4px'}}>
              <div><div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                <h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.name}</h4>
                <Badge color={isActive?T.success:T.warning}>{isActive?t.activeCompany:t.underConstruction}</Badge>
              </div>
              <p style={{margin:'2px 0 0',fontSize:'0.73rem',color:T.textMuted}}>{item.type} • {item.ownership}% {t.ownership}</p></div>
              {isActive&&<div style={{textAlign:'end'}}><p style={{margin:0,fontSize:'0.85rem',fontWeight:'800',color:profit>=0?T.success:T.danger}}>{profit>=0?'+':''}{fmtC(profit,lang)}</p><p style={{margin:0,fontSize:'0.68rem',color:T.textMuted}}>{lang==='ar'?'شهرياً':'monthly'}</p></div>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'10px'}}>
              {[{l:t.capital,v:fmtC(item.capital,lang)},{l:t.revenue,v:fmtC(item.monthlyRevenue,lang)},{l:t.profit,v:fmtC(profit,lang),c:profit>=0?T.success:T.danger}].map((s,i)=>(
                <div key={i} style={{background:T.surface2,borderRadius:'8px',padding:'7px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontSize:'0.76rem',fontWeight:'700',color:s.c||T.text}}>{s.v}</p></div>
              ))}
            </div>
            {item.employees?.length>0&&<div style={{marginBottom:'8px'}}><p style={{margin:'0 0 4px',fontSize:'0.7rem',color:T.textMuted}}>{t.employees} ({item.employees.length})</p>
              {item.employees.map(e=>(<div key={e.id} style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem',padding:'4px 8px',background:T.surface2,borderRadius:'7px',marginBottom:'2px'}}><span style={{color:T.text}}>{e.name}</span><span style={{color:T.gold,fontWeight:'600'}}>{fmtC(e.salary,lang)}</span></div>))}
            </div>}
            {item.notes&&<p style={{fontSize:'0.7rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 8px'}}>"{item.notes}"</p>}
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>openEdit(item)} style={{...btnOutline,flex:1,...btnSm}}><Pencil size={12}/>{t.edit}</button>
              {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,...btnSm}}><Trash2 size={12}/></button>}
            </div>
          </div>
        );})}
      </div>
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.companies}`:`${t.edit}`} onClose={()=>setModal(null)} wide>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <Field label={t.companyType}><Inp value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}/></Field>
          <Field label={t.companyStatus}><Sel value={form.companyStatus} onChange={e=>setForm(f=>({...f,companyStatus:e.target.value}))}><option value="active">{t.activeCompany}</option><option value="underConstruction">{t.underConstruction}</option></Sel></Field>
          <Field label={`${t.ownership}%`}><Inp type="number" value={form.ownership} onChange={e=>setForm(f=>({...f,ownership:e.target.value}))}/></Field>
          <Field label={t.capital}><Inp type="number" value={form.capital} onChange={e=>setForm(f=>({...f,capital:e.target.value}))}/></Field>
          <Field label={lang==='ar'?'الإيرادات الشهرية':'Monthly Revenue'}><Inp type="number" value={form.monthlyRevenue} onChange={e=>setForm(f=>({...f,monthlyRevenue:e.target.value}))}/></Field>
          <Field label={lang==='ar'?'المصاريف الشهرية':'Monthly Expenses'}><Inp type="number" value={form.monthlyExpense} onChange={e=>setForm(f=>({...f,monthlyExpense:e.target.value}))}/></Field>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px',marginTop:'4px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
            <p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:0}}>👥 {t.employees}</p>
            <button onClick={addEmp} style={{...btnOutline,fontSize:'0.72rem',padding:'4px 10px'}}><Plus size={12}/>{t.addEmployee}</button>
          </div>
          {(form.employees||[]).map(e=>(<div key={e.id} style={{display:'flex',gap:'6px',marginBottom:'6px',alignItems:'center'}}>
            <input placeholder={lang==='ar'?'الاسم':'Name'} value={e.name} onChange={ev=>editEmp(e.id,'name',ev.target.value)} style={{...inp,flex:2}}/>
            <input placeholder={t.salary} type="number" value={e.salary} onChange={ev=>editEmp(e.id,'salary',ev.target.value)} style={{...inp,flex:1}}/>
            <button onClick={()=>remEmp(e.id)} style={{background:'none',border:'none',color:T.danger,cursor:'pointer',flexShrink:0}}><X size={14}/></button>
          </div>))}
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(null)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

function VehiclesPage({ data, setData, lang, t, logActivity, canDelete }) {
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({});
  const items=data.vehicles||[];
  const openAdd=()=>{setForm({name:'',type:'SUV',plateNumber:'',year:new Date().getFullYear(),value:'',insurance:{company:'',expiryDate:'',amount:''},registration:{expiryDate:'',amount:''},loan:{amount:'',monthlyInstallment:'',nextDue:'',remainingMonths:''},notes:''});setModal('add');};
  const openEdit=item=>{setForm({...item,value:String(item.value)});setModal({edit:item});};
  const save=()=>{const entry={...form,id:modal==='add'?genId():form.id,value:Number(form.value)||0,insurance:{...form.insurance,amount:Number(form.insurance?.amount)||0},registration:{...form.registration,amount:Number(form.registration?.amount)||0},loan:{...form.loan,amount:Number(form.loan?.amount)||0,monthlyInstallment:Number(form.loan?.monthlyInstallment)||0,remainingMonths:Number(form.loan?.remainingMonths)||0}};setData(d=>({...d,vehicles:modal==='add'?[...items,entry]:items.map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.vehicles,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,vehicles:d.vehicles.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.vehicles,`"${item?.name}"`);setConfirm(null);};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <p style={{margin:0,fontSize:'0.8rem',color:T.textMuted}}>{lang==='ar'?'إجمالي القيمة:':'Total value:'} {fmtC(items.reduce((s,v)=>s+v.value,0),lang)}</p>
        <button onClick={openAdd} style={{...btn,...btnSm}}><Plus size={14}/>{t.add}</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
        {items.map(item=>{const di=daysUntil(item.insurance?.expiryDate);const dl=item.loan?.amount>0?daysUntil(item.loan?.nextDue):null;return(
          <div key={item.id} style={{...card,padding:'14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
              <div><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.name}</h4>
              <p style={{margin:'2px 0 0',fontSize:'0.73rem',color:T.textMuted}}>{item.type} • {item.year} • {item.plateNumber}</p></div>
              <Badge color={T.gold}>{fmtC(item.value,lang)}</Badge>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'5px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.insurance} / {t.insExpiry}</span><span style={{color:di!==null&&di<=30?T.warning:T.text}}>{fmtDate(item.insurance?.expiryDate,lang)}{di!==null&&di<=30?' ⚠️':''}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.registration} / {t.regExpiry}</span><span style={{color:T.text}}>{fmtDate(item.registration?.expiryDate,lang)}</span></div>
              {item.loan?.amount>0&&<><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.installment}</span><span style={{color:T.danger,fontWeight:'700'}}>{fmtC(item.loan.monthlyInstallment,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.nextDue}</span><span style={{color:dl!==null&&dl<=14?T.danger:T.text}}>{fmtDate(item.loan?.nextDue,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.remainingMonths}</span><span style={{color:T.text}}>{item.loan.remainingMonths} {lang==='ar'?'شهر':'mo'}</span></div></>}
            </div>
            {item.notes&&<p style={{fontSize:'0.7rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 8px'}}>"{item.notes}"</p>}
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>openEdit(item)} style={{...btnOutline,flex:1,...btnSm}}><Pencil size={12}/>{t.edit}</button>
              {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,...btnSm}}><Trash2 size={12}/></button>}
            </div>
          </div>
        );})}
      </div>
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.vehicles}`:`${t.edit}`} onClose={()=>setModal(null)} wide>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
          <Field label={t.vehicleType}><Inp value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}/></Field>
          <Field label={t.plateNumber}><Inp value={form.plateNumber} onChange={e=>setForm(f=>({...f,plateNumber:e.target.value}))}/></Field>
          <Field label={t.year}><Inp type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))}/></Field>
          <Field label={`${t.value} (${t.sar})`}><Inp type="number" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))}/></Field>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px',marginTop:'4px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>🛡️ {t.insurance}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
            <Field label={lang==='ar'?'الشركة':'Company'}><Inp value={form.insurance?.company} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,company:e.target.value}}))}/></Field>
            <Field label={t.insExpiry}><Inp type="date" value={form.insurance?.expiryDate} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,expiryDate:e.target.value}}))}/></Field>
            <Field label={lang==='ar'?'القسط السنوي':'Annual Premium'}><Inp type="number" value={form.insurance?.amount} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,amount:e.target.value}}))}/></Field>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>📋 {t.registration}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.regExpiry}><Inp type="date" value={form.registration?.expiryDate} onChange={e=>setForm(f=>({...f,registration:{...f.registration,expiryDate:e.target.value}}))}/></Field>
            <Field label={lang==='ar'?'الرسوم':'Fee'}><Inp type="number" value={form.registration?.amount} onChange={e=>setForm(f=>({...f,registration:{...f.registration,amount:e.target.value}}))}/></Field>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:'10px'}}><p style={{color:T.gold,fontSize:'0.78rem',fontWeight:'700',margin:'0 0 8px'}}>💳 {t.installment} ({lang==='ar'?'اتركه فارغاً إن لا يوجد':'leave empty if none'})</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.loanAmount}><Inp type="number" value={form.loan?.amount} onChange={e=>setForm(f=>({...f,loan:{...f.loan,amount:e.target.value}}))}/></Field>
            <Field label={t.installment}><Inp type="number" value={form.loan?.monthlyInstallment} onChange={e=>setForm(f=>({...f,loan:{...f.loan,monthlyInstallment:e.target.value}}))}/></Field>
            <Field label={t.nextDue}><Inp type="date" value={form.loan?.nextDue} onChange={e=>setForm(f=>({...f,loan:{...f.loan,nextDue:e.target.value}}))}/></Field>
            <Field label={t.remainingMonths}><Inp type="number" value={form.loan?.remainingMonths} onChange={e=>setForm(f=>({...f,loan:{...f.loan,remainingMonths:e.target.value}}))}/></Field>
          </div>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(null)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

function InvestmentsPage({ data, setData, lang, t, logActivity, canDelete }) {
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[typeFilter,setTypeFilter]=useState('all');
  const items=data.investments||[]; const it=lang==='ar'?INV_T.ar:INV_T.en;
  const icons={stocks:'📈',gold:'🥇',currencies:'💱',funds:'🏗️',crypto:'₿',startup:'🚀',other:'💡'};
  const openAdd=()=>{setForm({name:'',type:'stocks',purchasePrice:'',currentValue:'',purchaseDate:todayStr(),notes:''});setModal('add');};
  const openEdit=item=>{setForm({...item,purchasePrice:String(item.purchasePrice),currentValue:String(item.currentValue)});setModal({edit:item});};
  const save=()=>{const entry={...form,id:modal==='add'?genId():form.id,purchasePrice:Number(form.purchasePrice)||0,currentValue:Number(form.currentValue)||0};setData(d=>({...d,investments:modal==='add'?[...items,entry]:items.map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.investments,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,investments:d.investments.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.investments,`"${item?.name}"`);setConfirm(null);};
  const totalCost=items.reduce((s,i)=>s+i.purchasePrice,0),totalVal=items.reduce((s,i)=>s+i.currentValue,0),totalPL=totalVal-totalCost;
  const filtered=typeFilter==='all'?items:items.filter(x=>x.type===typeFilter);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
        {[{l:lang==='ar'?'التكلفة':'Cost',v:fmtC(totalCost,lang),c:T.info},{l:lang==='ar'?'القيمة الحالية':'Current',v:fmtC(totalVal,lang),c:T.gold},{l:t.profitLoss,v:fmtC(totalPL,lang),c:totalPL>=0?T.success:T.danger}].map((s,i)=>(
          <div key={i} style={{...card,padding:'10px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontSize:'0.82rem',fontWeight:'800',color:s.c}}>{s.v}</p></div>
        ))}
      </div>
      <div style={{display:'flex',gap:'5px',overflowX:'auto',paddingBottom:'2px'}}>
        {['all',...Object.keys(it)].map(k=>(
          <button key={k} onClick={()=>setTypeFilter(k)} style={{...btnOutline,padding:'5px 8px',fontSize:'0.7rem',whiteSpace:'nowrap',background:typeFilter===k?T.gold+'22':'transparent',borderColor:typeFilter===k?T.gold:T.border,color:typeFilter===k?T.gold:T.textMuted}}>
            {k==='all'?(lang==='ar'?'الكل':'All'):icons[k]||''} {k!=='all'&&(it[k]||k)}
          </button>
        ))}
        <button onClick={openAdd} style={{...btn,...btnSm,marginRight:'auto',flexShrink:0}}><Plus size={13}/>{t.add}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem',gridColumn:'1/-1'}}>{t.noData}</p>}
        {filtered.map(item=>{const pl=item.currentValue-item.purchasePrice;const p=pct(pl,item.purchasePrice);return(
          <div key={item.id} style={{...card,padding:'12px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}><span style={{fontSize:'1.1rem'}}>{icons[item.type]||'💡'}</span><Badge color={pl>=0?T.success:T.danger}>{pl>=0?'+':''}{p}%</Badge></div>
            <h4 style={{margin:'0 0 4px',color:T.text,fontWeight:'700',fontSize:'0.82rem'}}>{item.name}</h4>
            <Badge color={T.gold}>{it[item.type]||item.type}</Badge>
            <div style={{marginTop:'8px',display:'flex',flexDirection:'column',gap:'3px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.purchasePrice}</span><span style={{color:T.text}}>{fmtC(item.purchasePrice,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.currentValue}</span><span style={{color:T.gold,fontWeight:'700'}}>{fmtC(item.currentValue,lang)}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}><span style={{color:T.textMuted}}>{t.profitLoss}</span><span style={{color:pl>=0?T.success:T.danger,fontWeight:'700'}}>{pl>=0?'+':''}{fmtC(pl,lang)}</span></div>
            </div>
            {item.notes&&<p style={{fontSize:'0.68rem',color:T.textMuted,margin:'6px 0 0',fontStyle:'italic'}}>{item.notes}</p>}
            <div style={{display:'flex',gap:'5px',marginTop:'8px'}}>
              <button onClick={()=>openEdit(item)} style={{...btnOutline,flex:1,padding:'5px',fontSize:'0.7rem'}}><Pencil size={11}/>{t.edit}</button>
              {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,padding:'5px 8px',fontSize:'0.7rem'}}><Trash2 size={11}/></button>}
            </div>
          </div>
        );})}
      </div>
      {modal&&<Modal title={modal==='add'?`${t.add} ${t.investments}`:`${t.edit}`} onClose={()=>setModal(null)}>
        <Field label={t.name}><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
        <Field label={t.investmentType}><Sel value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{Object.entries(it).map(([k,v])=><option key={k} value={k}>{icons[k]} {v}</option>)}</Sel></Field>
        <Field label={`${t.purchasePrice} (${t.sar})`}><Inp type="number" value={form.purchasePrice} onChange={e=>setForm(f=>({...f,purchasePrice:e.target.value}))}/></Field>
        <Field label={`${t.currentValue} (${t.sar})`}><Inp type="number" value={form.currentValue} onChange={e=>setForm(f=>({...f,currentValue:e.target.value}))}/></Field>
        <Field label={t.purchaseDate}><Inp type="date" value={form.purchaseDate} onChange={e=>setForm(f=>({...f,purchaseDate:e.target.value}))}/></Field>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(null)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}
function OperationsPage({ data, setData, lang, t, logActivity, currentUser, canDelete }) {
  const [modal,setModal]=useState(false),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[typeF,setTypeF]=useState('all'),[statusF,setStatusF]=useState('all');
  const items=data.operations||[]; const ot=lang==='ar'?OP_T.ar:OP_T.en; const ft=lang==='ar'?FREQ_T.ar:FREQ_T.en;
  const icons={maintenance:'🔧',invoice:'📄',subscription:'🔄',installment:'💳',other:'📌'};
  const openAdd=()=>{setForm({date:todayStr(),type:'maintenance',description:'',amount:'',frequency:'once',nextDue:'',linkedType:'',linkedName:'',status:'pending'});setModal(true);};
  const save=()=>{const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,operations:[entry,...(d.operations||[])]}));logActivity(t.addedAction,t.operations,`${ot[form.type]}: ${form.description}`);setModal(false);};
  const markPaid=id=>setData(d=>({...d,operations:d.operations.map(o=>o.id===id?{...o,status:'paid'}:o)}));
  const del=id=>{setData(d=>({...d,operations:d.operations.filter(o=>o.id!==id)}));setConfirm(null);};
  const filtered=items.filter(o=>(typeF==='all'||o.type===typeF)&&(statusF==='all'||o.status===statusF));
  const pending=items.filter(o=>o.status==='pending').reduce((s,o)=>s+o.amount,0);
  const sColor={paid:T.success,pending:T.warning,overdue:T.danger};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        <div style={{...card,padding:'12px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'إجمالي العمليات':'Total Operations'}</p><p style={{margin:0,fontWeight:'800',fontSize:'1.1rem',color:T.info}}>{items.length}</p></div>
        <div style={{...card,padding:'12px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'مستحق الدفع':'Pending'}</p><p style={{margin:0,fontWeight:'800',fontSize:'0.9rem',color:T.warning}}>{fmtC(pending,lang)}</p></div>
      </div>
      <div style={{display:'flex',gap:'5px',overflowX:'auto',paddingBottom:'2px'}}>
        {['all',...Object.keys(ot)].map(k=>(
          <button key={k} onClick={()=>setTypeF(k)} style={{...btnOutline,padding:'5px 9px',fontSize:'0.7rem',whiteSpace:'nowrap',background:typeF===k?T.gold+'22':'transparent',borderColor:typeF===k?T.gold:T.border,color:typeF===k?T.gold:T.textMuted}}>
            {k==='all'?(lang==='ar'?'الكل':'All'):`${icons[k]||''} ${ot[k]||k}`}
          </button>
        ))}
      </div>
      <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
        {['all','pending','paid'].map(s=>(
          <button key={s} onClick={()=>setStatusF(s)} style={{...btnOutline,padding:'4px 9px',fontSize:'0.7rem',background:statusF===s?T.gold+'22':'transparent',borderColor:statusF===s?T.gold:T.border,color:statusF===s?T.gold:T.textMuted}}>
            {s==='all'?(lang==='ar'?'الكل':'All'):s==='pending'?(lang==='ar'?'معلق':'Pending'):(lang==='ar'?'مدفوع':'Paid')}
          </button>
        ))}
        <button onClick={openAdd} style={{...btn,...btnSm,marginRight:'auto'}}><Plus size={13}/>{lang==='ar'?'عملية جديدة':'New Op'}</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
        {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(
          <div key={item.id} style={{...card,padding:'12px',display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
            <div style={{width:'34px',height:'34px',borderRadius:'10px',background:T.surface2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{icons[item.type]||'📌'}</div>
            <div style={{flex:1,minWidth:'120px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
                <p style={{margin:0,fontSize:'0.82rem',fontWeight:'600',color:T.text}}>{item.description}</p>
                <Badge color={sColor[item.status]||T.textMuted}>{item.status==='paid'?(lang==='ar'?'مدفوع':'Paid'):item.status==='pending'?(lang==='ar'?'معلق':'Pending'):(lang==='ar'?'متأخر':'Late')}</Badge>
              </div>
              <div style={{display:'flex',gap:'6px',marginTop:'2px',flexWrap:'wrap'}}>
                <span style={{fontSize:'0.68rem',color:T.textMuted}}>{ot[item.type]||item.type}</span>
                {item.linkedName&&<span style={{fontSize:'0.68rem',color:T.textMuted}}>• {item.linkedName}</span>}
                <span style={{fontSize:'0.68rem',color:T.textMuted}}>• {fmtDate(item.date,lang)}</span>
                {item.frequency!=='once'&&<span style={{fontSize:'0.68rem',color:T.info}}>• {ft[item.frequency]}</span>}
              </div>
            </div>
            <div style={{textAlign:'end',flexShrink:0}}>
              <p style={{margin:0,fontWeight:'800',fontSize:'0.88rem',color:T.danger}}>{fmtC(item.amount,lang)}</p>
              <div style={{display:'flex',gap:'4px',marginTop:'4px'}}>
                {item.status==='pending'&&<button onClick={()=>markPaid(item.id)} style={{...btn,padding:'4px 8px',fontSize:'0.67rem'}}><CheckCircle2 size={10}/>{t.markPaid}</button>}
                {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,padding:'4px 8px',fontSize:'0.67rem'}}><Trash2 size={10}/></button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal&&<Modal title={lang==='ar'?'إضافة عملية جديدة':'New Operation'} onClose={()=>setModal(false)}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px',marginBottom:'12px'}}>
          {Object.entries(ot).map(([k,v])=>(
            <button key={k} onClick={()=>setForm(f=>({...f,type:k}))} style={{padding:'8px 4px',borderRadius:'10px',border:`1.5px solid ${form.type===k?T.gold:T.border}`,background:form.type===k?T.gold+'22':T.surface2,color:form.type===k?T.gold:T.textMuted,cursor:'pointer',fontSize:'0.72rem',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
              <span>{icons[k]}</span><span>{v}</span>
            </button>
          ))}
        </div>
        <Field label={t.description}><Inp value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></Field>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></Field>
          <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
          <Field label={t.frequency}><Sel value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))}>{Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
          {form.frequency!=='once'&&<Field label={t.nextDue}><Inp type="date" value={form.nextDue} onChange={e=>setForm(f=>({...f,nextDue:e.target.value}))}/></Field>}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={lang==='ar'?'نوع الأصل المرتبط':'Linked Asset Type'}><Sel value={form.linkedType} onChange={e=>setForm(f=>({...f,linkedType:e.target.value}))}><option value="">{lang==='ar'?'-- اختياري --':'-- Optional --'}</option><option value="property">{t.realEstate}</option><option value="vehicle">{t.vehicles}</option><option value="company">{t.companies}</option></Sel></Field>
          <Field label={lang==='ar'?'اسم الأصل':'Asset Name'}><Inp value={form.linkedName} onChange={e=>setForm(f=>({...f,linkedName:e.target.value}))}/></Field>
        </div>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(false)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

function LoansGivenPage({ data, setData, lang, t, logActivity, canDelete }) {
  const [modal,setModal]=useState(false),[payModal,setPayModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[payAmt,setPayAmt]=useState('');
  const items=data.loansGiven||[];
  const openAdd=()=>{setForm({borrowerName:'',borrowerPhone:'',amount:'',loanDate:todayStr(),durationMonths:'',returnDate:'',notes:''});setModal(true);};
  const save=()=>{
    const entry={...form,id:genId(),amount:Number(form.amount)||0,durationMonths:Number(form.durationMonths)||0,payments:[],status:'active'};
    if(!entry.returnDate&&entry.loanDate&&entry.durationMonths){const d=new Date(entry.loanDate);d.setMonth(d.getMonth()+entry.durationMonths);entry.returnDate=d.toISOString().split('T')[0];}
    setData(d=>({...d,loansGiven:[entry,...(d.loansGiven||[])]}));
    logActivity(t.addedAction,t.loansGiven,`${entry.borrowerName} — ${fmtC(entry.amount,lang)}`);
    setModal(false);
  };
  const recordPay=id=>{
    const amount=Number(payAmt)||0; if(!amount)return;
    const payment={id:genId(),date:todayStr(),amount};
    setData(d=>({...d,loansGiven:d.loansGiven.map(l=>{if(l.id!==id)return l;const np=[...(l.payments||[]),payment];const tp=np.reduce((s,p)=>s+p.amount,0);return{...l,payments:np,status:tp>=l.amount?'completed':'active'};})}));
    logActivity(t.paidAction,t.loansGiven,`دفعة ${fmtC(amount,lang)}`);
    setPayModal(null);setPayAmt('');
  };
  const del=id=>{setData(d=>({...d,loansGiven:d.loansGiven.filter(l=>l.id!==id)}));setConfirm(null);};
  const sc={active:T.info,completed:T.success,late:T.danger};
  const sl={ar:{active:'نشط',completed:'منتهي',late:'متأخر'},en:{active:'Active',completed:'Done',late:'Late'}};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
        {[{l:lang==='ar'?'إجمالي القروض':'Total Loans',v:fmtC(items.reduce((s,l)=>s+l.amount,0),lang),c:T.info},{l:lang==='ar'?'المحصّل':'Collected',v:fmtC(items.reduce((s,l)=>s+(l.payments||[]).reduce((sp,p)=>sp+p.amount,0),0),lang),c:T.success},{l:lang==='ar'?'المتبقي':'Remaining',v:fmtC(items.reduce((s,l)=>s+l.amount-(l.payments||[]).reduce((sp,p)=>sp+p.amount,0),0),lang),c:T.warning}].map((s,i)=>(
          <div key={i} style={{...card,padding:'10px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontWeight:'800',fontSize:'0.78rem',color:s.c}}>{s.v}</p></div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={openAdd} style={{...btn,...btnSm}}><Plus size={13}/>{t.add}</button></div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
        {items.map(item=>{
          const totalPaid=(item.payments||[]).reduce((s,p)=>s+p.amount,0);
          const remaining=item.amount-totalPaid;
          const p=pct(totalPaid,item.amount);
          const dr=daysUntil(item.returnDate);
          const status=item.status==='completed'?'completed':dr!==null&&dr<0?'late':'active';
          return(
          <div key={item.id} style={{...card,padding:'14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',flexWrap:'wrap',gap:'6px'}}>
              <div><div style={{display:'flex',alignItems:'center',gap:'6px'}}><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.borrowerName}</h4><Badge color={sc[status]}>{sl[lang][status]}</Badge></div>
              {item.borrowerPhone&&<p style={{margin:'2px 0 0',fontSize:'0.7rem',color:T.textMuted}}>{item.borrowerPhone}</p>}</div>
              <div style={{textAlign:'end'}}><p style={{margin:0,fontWeight:'800',color:T.gold,fontSize:'0.95rem'}}>{fmtC(item.amount,lang)}</p><p style={{margin:0,fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'متبقي:':'Rem:'} {fmtC(remaining,lang)}</p></div>
            </div>
            <div style={{height:'6px',background:T.surface2,borderRadius:'3px',overflow:'hidden',marginBottom:'8px'}}><div style={{height:'100%',width:`${p}%`,background:goldGrad,borderRadius:'3px',transition:'width 0.3s'}}/></div>
            <div style={{display:'flex',gap:'10px',marginBottom:'8px',flexWrap:'wrap'}}>
              <span style={{fontSize:'0.7rem',color:T.textMuted}}>{t.loanDate}: {fmtDate(item.loanDate,lang)}</span>
              <span style={{fontSize:'0.7rem',color:dr!==null&&dr<=30&&status!=='completed'?T.warning:T.textMuted}}>{t.returnDate}: {fmtDate(item.returnDate,lang)}{dr!==null&&dr>=0&&dr<=30&&status!=='completed'?` (${dr} ${t.days})`:''}</span>
            </div>
            {(item.payments||[]).length>0&&<div style={{marginBottom:'8px'}}><p style={{margin:'0 0 3px',fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'آخر دفعة:':'Last payment:'}</p>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',padding:'4px 8px',background:T.surface2,borderRadius:'7px'}}>
                <span style={{color:T.textMuted}}>{fmtDate(item.payments[item.payments.length-1].date,lang)}</span>
                <span style={{color:T.success,fontWeight:'600'}}>{fmtC(item.payments[item.payments.length-1].amount,lang)}</span>
              </div>
            </div>}
            {item.notes&&<p style={{fontSize:'0.7rem',color:T.textMuted,fontStyle:'italic',margin:'0 0 8px'}}>"{item.notes}"</p>}
            <div style={{display:'flex',gap:'6px'}}>
              {status!=='completed'&&<button onClick={()=>setPayModal(item.id)} style={{...btn,flex:1,...btnSm}}><HandCoins size={12}/>{t.recordPayment}</button>}
              {canDelete&&<button onClick={()=>setConfirm(item.id)} style={{...btnDanger,...btnSm}}><Trash2 size={12}/></button>}
            </div>
          </div>
        );})}
      </div>
      {modal&&<Modal title={`${t.add} ${t.loansGiven}`} onClose={()=>setModal(false)}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.borrower}><Inp value={form.borrowerName} onChange={e=>setForm(f=>({...f,borrowerName:e.target.value}))}/></Field>
          <Field label={t.phone}><Inp value={form.borrowerPhone} onChange={e=>setForm(f=>({...f,borrowerPhone:e.target.value}))}/></Field>
          <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></Field>
          <Field label={t.loanDate}><Inp type="date" value={form.loanDate} onChange={e=>setForm(f=>({...f,loanDate:e.target.value}))}/></Field>
          <Field label={t.durationMonths}><Inp type="number" value={form.durationMonths} onChange={e=>setForm(f=>({...f,durationMonths:e.target.value}))}/></Field>
          <Field label={t.returnDate}><Inp type="date" value={form.returnDate} onChange={e=>setForm(f=>({...f,returnDate:e.target.value}))}/></Field>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>setModal(false)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {payModal&&<Modal title={t.recordPayment} onClose={()=>{setPayModal(null);setPayAmt('');}}>
        <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={payAmt} onChange={e=>setPayAmt(e.target.value)}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}>
          <button onClick={()=>recordPay(payModal)} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button>
          <button onClick={()=>{setPayModal(null);setPayAmt('');}} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button>
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

function FinancialPage({ data, lang, t }) {
  const re=data.realEstate||[], co=data.companies||[], iv=data.investments||[], tr=data.transactions||[];
  const propROI=re.map(p=>{let ar=0;if(p.hasUnits)ar=p.units.filter(u=>u.status==='occupied').reduce((s,u)=>{let r=u.rent?.amount||0;if(u.rent?.frequency==='monthly')r*=12;if(u.rent?.frequency==='quarterly')r*=4;return s+r;},0);else if(p.status==='occupied'){let r=p.rent?.amount||0;if(p.rent?.frequency==='monthly')r*=12;if(p.rent?.frequency==='quarterly')r*=4;ar=r;}const roi=p.value>0?((ar/p.value)*100):0;return{name:p.name.length>12?p.name.slice(0,12)+'..':p.name,roi:Number(roi.toFixed(1)),ar,value:p.value};}).filter(p=>p.ar>0).sort((a,b)=>b.roi-a.roi);
  const invPerf=iv.map(i=>{const pl=i.currentValue-i.purchasePrice;const p=i.purchasePrice>0?((pl/i.purchasePrice)*100):0;return{name:i.name.length>16?i.name.slice(0,16)+'...':i.name,pl,pct:Number(p.toFixed(1))};}).sort((a,b)=>b.pct-a.pct);
  const trend=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);const m=d.getMonth(),y=d.getFullYear();const inc=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='income'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);const exp=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='expense'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);return{name:lang==='ar'?MONTHS_AR[m]:MONTHS_EN[m],net:inc-exp};});
  const avgROI=propROI.reduce((s,p)=>s+p.roi,0)/(propROI.length||1);
  const recs=[];
  propROI.forEach(p=>{if(p.roi<avgROI*0.7)recs.push({icon:'⚠️',text:`${p.name}: عائد ${p.roi}% أقل من المتوسط (${avgROI.toFixed(1)}%)`});});
  if(iv.find(i=>i.type==='stocks')&&!iv.find(i=>i.type==='crypto'))recs.push({icon:'💡',text:lang==='ar'?'تنوع: العملات الرقمية <5% كتحوط مقترح':'Consider 5% crypto as hedge'});
  if(co.filter(c=>c.companyStatus==='underConstruction').length>0)recs.push({icon:'🏗️',text:lang==='ar'?'تابع تكاليف المشاريع قيد الإنشاء':'Monitor under-construction project costs'});
  const totalLoanRem=(data.loansGiven||[]).filter(l=>l.status==='active').reduce((s,l)=>s+l.amount-(l.payments||[]).reduce((sp,p)=>sp+p.amount,0),0);
  if(totalLoanRem>0)recs.push({icon:'🤝',text:`${lang==='ar'?'قروض مُعطاة متبقية:':'Outstanding loans:'} ${fmtC(totalLoanRem,lang)}`});
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      {propROI.length>0&&<div style={{...cardG,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><TrendingUp size={13}/>{lang==='ar'?'العائد السنوي للعقارات %':'Property Annual ROI %'}</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={propROI} margin={{top:0,right:0,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="name" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <Tooltip formatter={v=>`${v}%`} contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text}}/>
            <Bar dataKey="roi" name={lang==='ar'?'العائد%':'ROI%'} radius={[6,6,0,0]}>
              {propROI.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>}
      <div style={{...card,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><BarChart3 size={13}/>{lang==='ar'?'صافي التدفق النقدي الشهري':'Monthly Net Cash Flow'}</p>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={trend} margin={{top:0,right:0,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="name" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/>
            <Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text}}/>
            <Line type="monotone" dataKey="net" stroke={T.gold} strokeWidth={2.5} dot={{fill:T.gold,r:4}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      {invPerf.length>0&&<div style={{...card,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><Award size={13}/>{lang==='ar'?'ترتيب أداء الاستثمارات':'Investment Performance'}</p>
        <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
          {invPerf.map((item,i)=>(<div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px',background:T.surface2,borderRadius:'10px'}}>
            <span style={{width:'20px',height:'20px',borderRadius:'50%',background:i===0?T.gold:i===1?'#aaa':'#8a6520',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:'700',color:'#000',flexShrink:0}}>{i+1}</span>
            <span style={{flex:1,fontSize:'0.77rem',color:T.text}}>{item.name}</span>
            <span style={{fontSize:'0.77rem',fontWeight:'700',color:item.pct>=0?T.success:T.danger}}>{item.pct>=0?'+':''}{item.pct}%</span>
          </div>))}
        </div>
      </div>}
      <div style={{...cardG,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'6px'}}><Lightbulb size={13}/>{t.recommendations}</p>
        {recs.length===0?(<div style={{textAlign:'center',padding:'1.5rem'}}><span style={{fontSize:'2rem'}}>🌟</span><p style={{color:T.success,fontSize:'0.82rem',margin:'8px 0 0'}}>{lang==='ar'?'أصولك في حالة ممتازة!':'Your portfolio looks great!'}</p></div>):(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {recs.map((r,i)=>(<div key={i} style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'10px',background:T.gold+'11',border:`1px solid ${T.borderGold}`,borderRadius:'10px'}}>
              <span style={{fontSize:'0.95rem',flexShrink:0}}>{r.icon}</span><p style={{margin:0,fontSize:'0.77rem',color:T.text}}>{r.text}</p>
            </div>))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpensesPage({ data, setData, lang, t, logActivity, currentUser, canDelete }) {
  const [modal,setModal]=useState(false),[confirm,setConfirm]=useState(null),[catModal,setCatModal]=useState(false),[newCat,setNewCat]=useState(''),[form,setForm]=useState({}),[filter,setFilter]=useState('all');
  const items=data.expenses||[], cats=data.customCategories||DEF_CATS_AR;
  const openAdd=()=>{setForm({date:todayStr(),amount:'',category:cats[0]||'',description:''});setModal(true);};
  const save=()=>{const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,expenses:[entry,...(d.expenses||[])]}));logActivity(t.addedAction,t.expenses,fmtC(entry.amount,lang));setModal(false);};
  const del=id=>{setData(d=>({...d,expenses:d.expenses.filter(x=>x.id!==id)}));setConfirm(null);};
  const addCat=()=>{if(!newCat.trim())return;setData(d=>({...d,customCategories:[...(d.customCategories||DEF_CATS_AR),newCat.trim()]}));setNewCat('');};
  const months=[...new Set(items.map(e=>e.date?.substring(0,7)))].sort().reverse();
  const filtered=filter==='all'?items:items.filter(e=>e.date?.startsWith(filter));
  const total=filtered.reduce((s,e)=>s+e.amount,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        <Sel value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{t.all}</option>{months.map(m=><option key={m} value={m}>{m}</option>)}</Sel>
        <div style={{...card,padding:'8px 14px',fontSize:'0.8rem',color:T.text,display:'flex',alignItems:'center',gap:'6px'}}>{lang==='ar'?'الإجمالي:':'Total:'} <strong style={{color:T.danger}}>{fmtC(total,lang)}</strong></div>
        <div style={{display:'flex',gap:'6px',marginRight:'auto'}}>
          <button onClick={()=>setCatModal(true)} style={{...btnOutline,fontSize:'0.75rem',padding:'8px 10px'}}><Filter size={12}/>{lang==='ar'?'الفئات':'Cats'}</button>
          <button onClick={openAdd} style={{...btn,...btnSm}}><Plus size={13}/>{t.add}</button>
        </div>
      </div>
      <div style={{...card,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
          <thead><tr style={{background:T.surface2}}>{[t.date,t.category,t.description,t.amount,t.addedBy,''].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.7rem',textAlign:'start',whiteSpace:'nowrap'}}>{h}</th>))}</tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:'2rem',textAlign:'center',color:T.textMuted}}>{t.noData}</td></tr>}
            {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(<tr key={item.id} style={{borderTop:`1px solid ${T.border}`}}>
              <td style={{padding:'9px 12px',color:T.textMuted,whiteSpace:'nowrap',fontSize:'0.7rem'}}>{fmtDate(item.date,lang)}</td>
              <td style={{padding:'9px 12px'}}><Badge color={T.warning}>{item.category}</Badge></td>
              <td style={{padding:'9px 12px',color:T.text,maxWidth:'140px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.description}</td>
              <td style={{padding:'9px 12px',fontWeight:'700',color:T.danger,whiteSpace:'nowrap'}}>{fmtC(item.amount,lang)}</td>
              <td style={{padding:'9px 12px',color:T.textMuted,fontSize:'0.7rem'}}>{item.addedBy}</td>
              <td style={{padding:'9px 12px'}}>{canDelete&&<button onClick={()=>setConfirm(item.id)} style={{background:'none',border:'none',color:T.danger,cursor:'pointer'}}><Trash2 size={13}/></button>}</td>
            </tr>))}
          </tbody>
        </table>
      </div></div>
      {modal&&<Modal title={`${t.add} ${t.expenses}`} onClose={()=>setModal(false)}>
        <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        <Field label={t.category}><Sel value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{cats.map(c=><option key={c}>{c}</option>)}</Sel></Field>
        <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></Field>
        <Field label={t.description}><Ta value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}><button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button><button onClick={()=>setModal(false)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button></div>
      </Modal>}
      {catModal&&<Modal title={t.customCategories} onClose={()=>setCatModal(false)}>
        <div style={{display:'flex',gap:'6px',marginBottom:'10px'}}><Inp value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder={lang==='ar'?'اسم الفئة الجديدة':'New category'}/><button onClick={addCat} style={{...btn,padding:'10px 14px',flexShrink:0}}><Plus size={13}/></button></div>
        <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
          {cats.map(c=>(<div key={c} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:T.surface2,borderRadius:'8px'}}>
            <span style={{color:T.text,fontSize:'0.83rem'}}>{c}</span>
            <button onClick={()=>setData(d=>({...d,customCategories:(d.customCategories||DEF_CATS_AR).filter(x=>x!==c)}))} style={{background:'none',border:'none',color:T.danger,cursor:'pointer'}}><X size={13}/></button>
          </div>))}
        </div>
      </Modal>}
      {confirm&&<Confirm t={t} onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

function TransactionsPage({ data, setData, lang, t, logActivity, currentUser }) {
  const [modal,setModal]=useState(false),[typeF,setTypeF]=useState('all'),[form,setForm]=useState({});
  const items=data.transactions||[];
  const openAdd=()=>{setForm({date:todayStr(),type:'income',amount:'',category:'',description:''});setModal(true);};
  const save=()=>{const entry={...form,id:genId(),amount:Number(form.amount)||0,addedBy:currentUser?.name||'?'};setData(d=>({...d,transactions:[entry,...(d.transactions||[])]}));logActivity(t.addedAction,t.transactions,`${entry.type==='income'?t.income:t.expense}: ${fmtC(entry.amount,lang)}`);setModal(false);};
  const filtered=typeF==='all'?items:items.filter(x=>x.type===typeF);
  const tIn=items.filter(x=>x.type==='income').reduce((s,x)=>s+x.amount,0),tOut=items.filter(x=>x.type==='expense').reduce((s,x)=>s+x.amount,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
        {[{l:t.totalIncome,v:fmtC(tIn,lang),c:T.success},{l:t.totalExpenses,v:fmtC(tOut,lang),c:T.danger},{l:t.balance,v:fmtC(tIn-tOut,lang),c:tIn>=tOut?T.success:T.danger}].map((s,i)=>(<div key={i} style={{...card,padding:'10px',textAlign:'center'}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{s.l}</p><p style={{margin:0,fontWeight:'800',fontSize:'0.78rem',color:s.c}}>{s.v}</p></div>))}
      </div>
      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
        <div style={{display:'flex',gap:'4px',background:T.surface2,borderRadius:'10px',padding:'3px'}}>
          {[['all',t.all],['income',t.income],['expense',t.expense]].map(([v,l])=>(<button key={v} onClick={()=>setTypeF(v)} style={{padding:'5px 11px',borderRadius:'8px',border:'none',background:typeF===v?T.gold:'transparent',color:typeF===v?'#000':T.textMuted,fontSize:'0.76rem',fontWeight:typeF===v?'700':'400',cursor:'pointer',fontFamily:'inherit'}}>{l}</button>))}
        </div>
        <button onClick={openAdd} style={{...btn,...btnSm,marginRight:'auto'}}><Plus size={13}/>{t.addTransaction}</button>
      </div>
      <div style={{...card,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
          <thead><tr style={{background:T.surface2}}>{[t.date,t.type,t.category,t.description,t.amount,t.addedBy].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.7rem',textAlign:'start',whiteSpace:'nowrap'}}>{h}</th>))}</tr></thead>
          <tbody>
            {filtered.length===0&&<tr><td colSpan={6} style={{padding:'2rem',textAlign:'center',color:T.textMuted}}>{t.noData}</td></tr>}
            {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(<tr key={item.id} style={{borderTop:`1px solid ${T.border}`}}>
              <td style={{padding:'9px 12px',color:T.textMuted,whiteSpace:'nowrap',fontSize:'0.7rem'}}>{fmtDate(item.date,lang)}</td>
              <td style={{padding:'9px 12px'}}><Badge color={item.type==='income'?T.success:T.danger}>{item.type==='income'?t.income:t.expense}</Badge></td>
              <td style={{padding:'9px 12px',color:T.textMuted,fontSize:'0.7rem'}}>{item.category}</td>
              <td style={{padding:'9px 12px',color:T.text,maxWidth:'130px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.description}</td>
              <td style={{padding:'9px 12px',fontWeight:'700',whiteSpace:'nowrap',color:item.type==='income'?T.success:T.danger}}>{item.type==='income'?'+':'-'}{fmtC(item.amount,lang)}</td>
              <td style={{padding:'9px 12px',color:T.textMuted,fontSize:'0.7rem'}}>{item.addedBy}</td>
            </tr>))}
          </tbody>
        </table>
      </div></div>
      {modal&&<Modal title={t.addTransaction} onClose={()=>setModal(false)}>
        <Field label={t.date}><Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
        <Field label={t.type}><div style={{display:'flex',gap:'8px'}}>{[['income',t.income],['expense',t.expense]].map(([v,l])=>(<button key={v} onClick={()=>setForm(f=>({...f,type:v}))} style={{flex:1,padding:'10px',borderRadius:'10px',border:`1.5px solid ${form.type===v?(v==='income'?T.success:T.danger):T.border}`,background:form.type===v?(v==='income'?T.success+'22':T.danger+'22'):T.surface2,color:form.type===v?(v==='income'?T.success:T.danger):T.textMuted,cursor:'pointer',fontFamily:'inherit',fontWeight:'600',fontSize:'0.85rem'}}>{l}</button>))}</div></Field>
        <Field label={t.category}><Inp value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/></Field>
        <Field label={`${t.amount} (${t.sar})`}><Inp type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></Field>
        <Field label={t.description}><Ta value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></Field>
        <div style={{display:'flex',gap:'8px',paddingTop:'8px'}}><button onClick={save} style={{...btn,flex:1,padding:'12px'}}>{t.save}</button><button onClick={()=>setModal(false)} style={{...btnOutline,padding:'12px 20px'}}>{t.cancel}</button></div>
      </Modal>}
    </div>
  );
}

function ActivityLogPage({ data, lang, t }) {
  const logs=(data.activityLog||[]).slice().sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  const ac={'أضاف':T.success,'عدّل':T.warning,'حذف':T.danger,'دفع':T.info,'added':T.success,'edited':T.warning,'deleted':T.danger,'paid':T.info};
  return (
    <div style={{...card,overflow:'hidden'}}>
      <div style={{padding:'14px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:'8px'}}><Activity size={14} color={T.gold}/><span style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem'}}>{t.activityLog}</span><Badge color={T.info}>{logs.length}</Badge></div>
      <div>
        {logs.length===0&&<p style={{textAlign:'center',padding:'2rem',color:T.textMuted,fontSize:'0.85rem'}}>{t.noData}</p>}
        {logs.map(log=>{const dt=new Date(log.timestamp);const c=ac[log.action]||T.textMuted;return(
          <div key={log.id} style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'12px 14px',borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',background:c+'22',border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',color:c,fontWeight:'700',fontSize:'0.73rem',flexShrink:0}}>{log.userName?.charAt(0)||'?'}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}><span style={{fontSize:'0.76rem',fontWeight:'700',color:T.text}}>{log.userName}</span><Badge color={c}>{log.action}</Badge><span style={{fontSize:'0.7rem',color:T.textMuted}}>{lang==='ar'?'في':'in'} {log.module}</span></div>
              <p style={{margin:'2px 0 0',fontSize:'0.7rem',color:T.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.description}</p>
            </div>
            <div style={{textAlign:'end',flexShrink:0}}><p style={{margin:0,fontSize:'0.66rem',color:T.textMuted}}>{dt.toLocaleDateString(lang==='ar'?'ar-SA':'en-US')}</p><p style={{margin:0,fontSize:'0.64rem',color:T.textDim}}>{dt.toLocaleTimeString(lang==='ar'?'ar-SA':'en-US',{hour:'2-digit',minute:'2-digit'})}</p></div>
          </div>
        );})}
      </div>
    </div>
  );
}

function ReportsPage({ data, lang, t }) {
  const tr=data.transactions||[];
  const months=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return{m:d.getMonth(),y:d.getFullYear(),label:lang==='ar'?MONTHS_AR[d.getMonth()]:MONTHS_EN[d.getMonth()]};});
  const monthData=months.map(({m,y,label})=>{const inc=tr.filter(x=>{const d=new Date(x.date);return x.type==='income'&&d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,x)=>s+x.amount,0);const exp=tr.filter(x=>{const d=new Date(x.date);return x.type==='expense'&&d.getMonth()===m&&d.getFullYear()===y;}).reduce((s,x)=>s+x.amount,0);return{label,inc,exp,net:inc-exp};});
  const handleCSV=()=>{const rows=[['التاريخ','النوع','الفئة','الوصف','المبلغ'],...tr.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(x=>[x.date,x.type==='income'?'دخل':'مصروف',x.category,x.description,x.amount])];const csv=rows.map(r=>r.join(',')).join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`تقرير_${todayStr()}.csv`;a.click();};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      <div style={{display:'flex',gap:'8px'}}><button onClick={()=>window.print()} style={{...btnOutline,padding:'8px 14px',fontSize:'0.78rem'}}><FileText size={13}/>{lang==='ar'?'طباعة':'Print'}</button><button onClick={handleCSV} style={{...btn,padding:'8px 14px',fontSize:'0.78rem'}}><Download size={13}/>{t.exportExcel}</button></div>
      <div style={{...card,overflow:'hidden'}}><div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8rem'}}>
          <thead><tr style={{background:T.surface2}}>{[lang==='ar'?'الشهر':'Month',t.totalIncome,t.totalExpenses,t.balance].map((h,i)=>(<th key={i} style={{padding:'10px 12px',color:T.textMuted,fontWeight:'600',fontSize:'0.7rem',textAlign:'start'}}>{h}</th>))}</tr></thead>
          <tbody>{monthData.map((row,i)=>(<tr key={i} style={{borderTop:`1px solid ${T.border}`}}><td style={{padding:'10px 12px',fontWeight:'600',color:T.text}}>{row.label}</td><td style={{padding:'10px 12px',color:T.success,fontWeight:'600'}}>{fmtC(row.inc,lang)}</td><td style={{padding:'10px 12px',color:T.danger,fontWeight:'600'}}>{fmtC(row.exp,lang)}</td><td style={{padding:'10px 12px',fontWeight:'800',color:row.net>=0?T.success:T.danger}}>{fmtC(row.net,lang)}</td></tr>))}</tbody>
        </table>
      </div></div>
      <div style={{...card,padding:'14px'}}>
        <p style={{color:T.gold,fontWeight:'700',fontSize:'0.82rem',margin:'0 0 10px'}}>{lang==='ar'?'صافي الربح الشهري':'Monthly Net Profit'}</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthData} margin={{top:0,right:0,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="label" tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:T.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/>
            <Tooltip formatter={v=>fmtC(v,lang)} contentStyle={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.text}}/>
            <Bar dataKey="net" radius={[5,5,0,0]}>{monthData.map((d,i)=><Cell key={i} fill={d.net>=0?T.gold:T.danger}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
const NAV_ALL = [
  {id:'dashboard',icon:LayoutDashboard}, {id:'realEstate',icon:Building2},
  {id:'companies',icon:Briefcase},        {id:'vehicles',icon:Car},
  {id:'investments',icon:TrendingUp},     {id:'operations',icon:Wrench},
  {id:'loansGiven',icon:HandCoins},       {id:'financial',icon:Lightbulb},
  {id:'expenses',icon:Receipt},           {id:'transactions',icon:DollarSign},
  {id:'activityLog',icon:Activity},       {id:'reports',icon:BarChart2},
  {id:'userManagement',icon:Users},
];

export default function App() {
  const [lang,setLang]=useState('ar');
  const [activePage,setActivePage]=useState('dashboard');
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [authUser,setAuthUser]=useState(null);
  const [userProfile,setUserProfile]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const saveTimer=useRef(null);
  const t=TR[lang];

  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,async fbUser=>{
      setAuthUser(fbUser);
      if(fbUser){
        try{
          const snap=await getDoc(doc(db,'users',fbUser.uid));
          if(snap.exists()){setUserProfile({uid:fbUser.uid,...snap.data()});}
          else{const profile={name:fbUser.email.split('@')[0],email:fbUser.email,role:'owner',status:'active'};await setDoc(doc(db,'users',fbUser.uid),profile);setUserProfile({uid:fbUser.uid,...profile});}
        }catch(e){console.error(e);}
      }else{setUserProfile(null);setData(null);}
      setAuthLoading(false);
    });
    return unsub;
  },[]);

  useEffect(()=>{
    if(!authUser)return;
    const load=async()=>{
      setLoading(true);
      try{
        const snap=await getDoc(doc(db,'platform','main'));
        if(snap.exists())setData(snap.data());
        else{const sample=buildSampleData();await setDoc(doc(db,'platform','main'),sample);setData(sample);}
      }catch(e){setData(buildSampleData());}
      finally{setLoading(false);}
    };
    load();
  },[authUser]);

  useEffect(()=>{
    if(!authUser||loading||!data)return;
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{setDoc(doc(db,'platform','main'),data).catch(console.error);},2000);
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
  const NAV=NAV_ALL.filter(n=>n.id!=='userManagement'||role==='owner');
  const currentUser={id:userProfile?.uid,name:userProfile?.name||'مستخدم'};
  const pageProps={data,setData,lang,t,logActivity,currentUser,canDelete};

  const spinner=msg=>(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:T.bg}}><div style={{textAlign:'center'}}><div style={{width:'48px',height:'48px',border:`3px solid ${T.gold}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 1rem'}}/><p style={{color:T.textMuted,fontSize:'0.85rem'}}>{msg}</p></div><style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style></div>);

  if(authLoading)return spinner(lang==='ar'?'جاري التحقق من الهوية...':'Authenticating...');
  if(!authUser)return <Login/>;
  if(loading||!data)return spinner(lang==='ar'?'جاري تحميل بياناتك...':'Loading your data...');

  const dir=lang==='ar'?'rtl':'ltr';
  const alertCount=(()=>{let c=0;(data?.realEstate||[]).forEach(p=>{const units=p.hasUnits?p.units:(p.status==='occupied'?[p]:[]);units.filter(u=>u.status==='occupied').forEach(u=>{const d=daysUntil(u.rent?.nextDue);if(d!==null&&d<=30)c++;});});(data?.vehicles||[]).forEach(v=>{const d=daysUntil(v.insurance?.expiryDate);if(d!==null&&d<=30)c++;});return c;})();

  return (
    <div dir={dir} style={{minHeight:'100vh',display:'flex',background:T.bg,color:T.text,fontFamily:'Segoe UI,system-ui,sans-serif'}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${T.surface}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
        @media print{aside,header,button{display:none!important}main{padding:0!important}}
        select option{background:${T.surface2};color:${T.text}}
      `}</style>

      {sidebarOpen&&<div style={{position:'fixed',inset:0,zIndex:40,background:'rgba(0,0,0,0.7)'}} onClick={()=>setSidebarOpen(false)}/>}

      {/* SIDEBAR */}
      <aside style={{position:'fixed',top:0,[lang==='ar'?'right':'left']:0,height:'100%',zIndex:40,width:'234px',display:'flex',flexDirection:'column',background:T.surface,borderLeft:lang==='ar'?`1px solid ${T.border}`:'none',borderRight:lang==='ar'?'none':`1px solid ${T.border}`,transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)',transform:sidebarOpen?'translateX(0)':(lang==='ar'?'translateX(100%)':'translateX(-100%)'),boxShadow:`-8px 0 40px rgba(0,0,0,0.6)`}}>
        <div style={{padding:'16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'10px',background:goldGrad,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Wallet size={16} color="#0a0800"/></div>
          <div style={{flex:1,minWidth:0}}><p style={{margin:0,color:T.gold,fontWeight:'800',fontSize:'0.78rem',lineHeight:'1.2'}}>{lang==='ar'?'منصة الأصول':'Asset Platform'}</p><p style={{margin:0,color:T.textDim,fontSize:'0.62rem'}}>{lang==='ar'?'إدارة شخصية':'Personal Management'}</p></div>
          <button onClick={()=>setSidebarOpen(false)} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',padding:'3px'}}><X size={15}/></button>
        </div>
        <nav style={{flex:1,padding:'6px',overflowY:'auto'}}>
          {NAV.map(({id,icon:Icon})=>{const active=activePage===id;return(
            <button key={id} onClick={()=>{setActivePage(id);setSidebarOpen(false);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'9px',padding:'9px 10px',borderRadius:'9px',border:'none',marginBottom:'1px',background:active?`${T.gold}1e`:'transparent',color:active?T.gold:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:'0.8rem',fontWeight:active?'700':'400',transition:'all 0.12s',textAlign:lang==='ar'?'right':'left',borderLeft:active&&lang!=='ar'?`2px solid ${T.gold}`:'2px solid transparent',borderRight:active&&lang==='ar'?`2px solid ${T.gold}`:'2px solid transparent'}}>
              <Icon size={14}/>{t[id]}
            </button>
          );})}
        </nav>
        <div style={{padding:'8px',borderTop:`1px solid ${T.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',background:T.surface2,borderRadius:'10px',marginBottom:'6px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:role==='owner'?goldGrad:T.border,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:'700',color:role==='owner'?'#000':'#fff',flexShrink:0}}>{userProfile?.name?.charAt(0)||'?'}</div>
            <div style={{flex:1,minWidth:0}}><p style={{margin:0,color:T.text,fontSize:'0.76rem',fontWeight:'600',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userProfile?.name}</p><p style={{margin:0,color:T.textDim,fontSize:'0.62rem'}}>{role==='owner'?'👑 مالك':role==='assistant'?'🤝 مساعد':'👁 مشاهد'}</p></div>
          </div>
          <button onClick={handleSignOut} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',padding:'7px',background:'none',border:`1px solid ${T.border}`,borderRadius:'8px',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:'0.76rem',transition:'all 0.15s'}}>
            <LogOut size={12}/>{lang==='ar'?'تسجيل الخروج':'Sign Out'}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        <header style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'11px 14px',display:'flex',alignItems:'center',gap:'8px',position:'sticky',top:0,zIndex:30}}>
          <button onClick={()=>setSidebarOpen(true)} style={{background:'none',border:`1px solid ${T.border}`,color:T.textMuted,cursor:'pointer',padding:'7px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Menu size={17}/>
          </button>
          <h2 style={{margin:0,color:T.gold,fontWeight:'800',fontSize:'0.92rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t[activePage]}</h2>
          <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <div style={{position:'relative'}}>
              <div style={{padding:'7px',border:`1px solid ${T.border}`,borderRadius:'8px',cursor:'pointer',color:T.textMuted,display:'flex',alignItems:'center'}} onClick={()=>setActivePage('dashboard')}>
                <Bell size={15}/>
              </div>
              {alertCount>0&&<span style={{position:'absolute',top:'-3px',[lang==='ar'?'left':'right']:'-3px',width:'15px',height:'15px',background:T.danger,color:'#fff',borderRadius:'50%',fontSize:'0.62rem',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700'}}>{alertCount}</span>}
            </div>
            <button onClick={()=>setLang(l=>l==='ar'?'en':'ar')} style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 10px',background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'8px',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:'0.76rem',fontWeight:'600'}}>
              <Globe size={12}/>{lang==='ar'?'EN':'ع'}
            </button>
          </div>
        </header>

        <main style={{flex:1,padding:'12px',overflowY:'auto',maxWidth:'900px',width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
          {activePage==='dashboard'      && <Dashboard {...pageProps}/>}
          {activePage==='realEstate'     && <RealEstatePage {...pageProps}/>}
          {activePage==='companies'      && <CompaniesPage {...pageProps}/>}
          {activePage==='vehicles'       && <VehiclesPage {...pageProps}/>}
          {activePage==='investments'    && <InvestmentsPage {...pageProps}/>}
          {activePage==='operations'     && <OperationsPage {...pageProps}/>}
          {activePage==='loansGiven'     && <LoansGivenPage {...pageProps}/>}
          {activePage==='financial'      && <FinancialPage {...pageProps}/>}
          {activePage==='expenses'       && <ExpensesPage {...pageProps}/>}
          {activePage==='transactions'   && <TransactionsPage {...pageProps}/>}
          {activePage==='activityLog'    && <ActivityLogPage {...pageProps}/>}
          {activePage==='reports'        && <ReportsPage {...pageProps}/>}
          {activePage==='userManagement' && role==='owner' && <UserManagement lang={lang} t={t} currentUser={userProfile}/>}
        </main>

        <footer style={{padding:'7px 14px',textAlign:'center',fontSize:'0.65rem',color:T.textDim,borderTop:`1px solid ${T.border}`,background:T.surface}}>
          {lang==='ar'?'منصة الأصول الشخصية — البيانات محمية في السحابة':'Personal Asset Platform — Data secured in cloud'}
        </footer>
      </div>
    </div>
  );
}
