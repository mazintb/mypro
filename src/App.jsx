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
  MoreHorizontal, TrendingDown, Filter
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";

// ═══ THEMES ═══
const DARK = {
  bg:'#050c1a', surface:'#0b1830', surface2:'#0e1e3a',
  border:'#1a3460', borderGold:'#c9a84c22',
  gold:'#c9a84c', goldLight:'#e8d48a', goldDark:'#8a6520',
  text:'#e4eeff', textMuted:'#5a7aaa', textDim:'#2e4a70',
  success:'#30d158', danger:'#ff453a', warning:'#ffd60a', info:'#0a84ff',
  tabBar:'#0b1830', cardShadow:'none', inputBg:'#0e1e3a',
  glassCard:'rgba(255,255,255,0.04)', glassBorder:'rgba(255,255,255,0.07)',
};
const LIGHT = {
  bg:'#F2F2F7', surface:'#FFFFFF', surface2:'#F2F2F7',
  border:'#E5E5EA', borderGold:'#c9a84c44',
  gold:'#B07D1A', goldLight:'#D4A017', goldDark:'#7a5510',
  text:'#1C1C1E', textMuted:'#6C6C70', textDim:'#AEAEB2',
  success:'#34C759', danger:'#FF3B30', warning:'#FF9500', info:'#007AFF',
  tabBar:'rgba(249,249,249,0.95)', cardShadow:'0 1px 3px rgba(0,0,0,0.07)', inputBg:'#F2F2F7',
  glassCard:'rgba(255,255,255,0.9)', glassBorder:'rgba(0,0,0,0.06)',
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
const daysUntil=d=>d?Math.ceil((new Date(d)-new Date())/86400000):null;
const fmt=n=>Math.round(n||0).toLocaleString('ar-SA');
const fmtC=(n,lang)=>`${fmt(n)} ${lang==='ar'?'ريال':'SAR'}`;
const fmtDate=(d,lang)=>d?new Date(d).toLocaleDateString(lang==='ar'?'ar-SA':'en-US'):'—';
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
      {id:genId(),name:'تويوتا لاند كروزر 2022',type:'SUV',plateNumber:'أ ب ج 1234',year:2022,value:280000,insurance:{company:'التعاونية',expiryDate:'2025-09-15',amount:4500},registration:{expiryDate:'2025-11-30',amount:900},loan:{amount:0,monthlyInstallment:0,nextDue:'',remainingMonths:0},notes:''},
      {id:genId(),name:'مرسيدس E-Class 2023',type:'Sedan',plateNumber:'د هـ و 5678',year:2023,value:320000,insurance:{company:'ولاء',expiryDate:'2026-03-20',amount:6200},registration:{expiryDate:'2026-03-20',amount:1100},loan:{amount:180000,monthlyInstallment:5500,nextDue:'2025-06-05',remainingMonths:28},notes:''},
    ],
    investments:[
      {id:genId(),name:'محفظة تداول السعودية',type:'stocks',purchasePrice:150000,currentValue:178000,purchaseDate:'2023-01-15',notes:''},
      {id:genId(),name:'ذهب مسبوكات',type:'gold',purchasePrice:80000,currentValue:95000,purchaseDate:'2022-06-01',notes:''},
      {id:genId(),name:'Bitcoin & Ethereum',type:'crypto',purchasePrice:50000,currentValue:72000,purchaseDate:'2024-01-10',notes:''},
    ],
    operations:[
      {id:genId(),date:'2025-05-01',type:'maintenance',description:'صيانة سباكة عمارة الروضة',amount:2500,frequency:'once',linkedName:'عمارة الروضة',status:'paid',addedBy:'المالك'},
      {id:genId(),date:'2025-06-05',type:'installment',description:'قسط مرسيدس E-Class',amount:5500,frequency:'monthly',nextDue:'2025-06-05',linkedName:'مرسيدس',status:'pending',addedBy:'المالك'},
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

function Field({label,children,error}){
  return(
    <div style={{marginBottom:'14px'}}>
      <label style={{display:'block',fontSize:'0.72rem',fontWeight:'600',color:'#888',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</label>
      {children}
      {error&&<p style={{margin:'4px 0 0',fontSize:'0.7rem',color:'#FF3B30'}}>{error}</p>}
    </div>
  );
}
function Inp({value,onChange,type='text',placeholder='',T,error}){
  const [focused,setFocused]=useState(false);
  return<input type={type} value={value||''} onChange={onChange} placeholder={placeholder}
    style={{background:T.inputBg,border:`1.5px solid ${focused?T.gold:(error?'#FF3B30':T.border)}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',transition:'border 0.15s'}}
    onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>;
}
function Sel({value,onChange,children,T}){
  return<select value={value||''} onChange={onChange} style={{background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',cursor:'pointer'}}>{children}</select>;
}
function Ta({value,onChange,rows=2,T}){
  return<textarea value={value||''} onChange={onChange} rows={rows} style={{background:T.inputBg,border:`1.5px solid ${T.border}`,borderRadius:'12px',color:T.text,padding:'12px 14px',fontSize:'0.9rem',width:'100%',boxSizing:'border-box',fontFamily:'inherit',outline:'none',resize:'vertical'}}/>;
}

function Modal({title,onClose,children,T}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'flex-end',justifyContent:'center',background:'rgba(0,0,0,0.55)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)'}}>
      <div style={{background:T.surface,borderRadius:'26px 26px 0 0',width:'100%',maxWidth:'600px',maxHeight:'93vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 -12px 50px rgba(0,0,0,0.3)',border:`1px solid ${T.border}`,animation:'slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)'}}>
        <div style={{width:'36px',height:'4px',background:T.border,borderRadius:'2px',margin:'12px auto 0'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px 12px',borderBottom:`1px solid ${T.border}`}}>
          <h3 style={{color:T.text,margin:0,fontWeight:'700',fontSize:'1rem',letterSpacing:'-0.3px'}}>{title}</h3>
          <button onClick={onClose} style={{background:T.surface2,border:`1px solid ${T.border}`,color:T.textMuted,cursor:'pointer',borderRadius:'50%',display:'flex',width:'30px',height:'30px',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}><X size={14}/></button>
        </div>
        <div style={{overflowY:'auto',flex:1,padding:'20px'}}>{children}</div>
      </div>
    </div>
  );
}

function Confirm({t,onConfirm,onCancel,T}){
  return(
    <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.6)'}}>
      <div style={{background:T.surface,borderRadius:'20px',padding:'2rem',maxWidth:'320px',width:'100%',textAlign:'center',boxShadow:'0 8px 40px rgba(0,0,0,0.3)'}}>
        <div style={{width:'52px',height:'52px',background:`${T.danger}22`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}><Trash2 size={22} color={T.danger}/></div>
        <p style={{color:T.text,fontWeight:'700',marginBottom:'4px'}}>{t.confirmDelete}</p>
        <p style={{color:T.textMuted,fontSize:'0.8rem',marginBottom:'1.5rem'}}>لا يمكن التراجع</p>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={onConfirm} style={{flex:1,padding:'12px',borderRadius:'12px',border:'none',background:T.danger,color:'#fff',fontWeight:'700',cursor:'pointer',fontFamily:'inherit'}}>{t.yes}</button>
          <button onClick={onCancel} style={{flex:1,padding:'12px',borderRadius:'12px',border:`1px solid ${T.border}`,background:'transparent',color:T.textMuted,cursor:'pointer',fontFamily:'inherit'}}>{t.no}</button>
        </div>
      </div>
    </div>
  );
}

function Badge({color,children}){
  return<span style={{fontSize:'0.7rem',padding:'3px 9px',borderRadius:'20px',fontWeight:'600',color,background:color+'22',whiteSpace:'nowrap'}}>{children}</span>;
}

function StatCard({label,value,icon:Icon,color,T}){
  return(
    <div style={{
      background:T.surface,borderRadius:'18px',padding:'15px',
      boxShadow:T.cardShadow,display:'flex',alignItems:'center',gap:'12px',
      border:`1px solid ${T.border}`,
    }}>
      <div style={{width:'44px',height:'44px',borderRadius:'14px',background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${color}22`}}>
        <Icon size={20} color={color}/>
      </div>
      <div style={{minWidth:0}}>
        <p style={{margin:0,fontSize:'0.68rem',color:T.textMuted,fontWeight:'500',letterSpacing:'0.2px'}}>{label}</p>
        <p style={{margin:0,fontSize:'0.9rem',fontWeight:'800',color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',letterSpacing:'-0.3px'}}>{value}</p>
      </div>
    </div>
  );
}

function SaveBtn({onClick,label,T}){
  return<button onClick={onClick} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontWeight:'800',fontSize:'0.95rem',cursor:'pointer',fontFamily:'inherit',marginTop:'8px'}}>{label}</button>;
}
function CancelBtn({onClick,label,T}){
  return<button onClick={onClick} style={{width:'100%',padding:'12px',borderRadius:'14px',border:`1px solid ${T.border}`,background:'transparent',color:T.textMuted,fontWeight:'600',fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit',marginTop:'6px'}}>{label}</button>;
}
function AddBtn({onClick,label,T}){
  return<button onClick={onClick} style={{display:'flex',alignItems:'center',gap:'6px',padding:'10px 16px',borderRadius:'12px',border:'none',background:`linear-gradient(135deg,${T.goldDark},${T.gold})`,color:'#fff',fontWeight:'700',fontSize:'0.82rem',cursor:'pointer',fontFamily:'inherit'}}><Plus size={15}/>{label}</button>;
}
function SmBtn({onClick,label,icon:Icon,color,T}){
  return<button onClick={onClick} style={{display:'flex',alignItems:'center',gap:'4px',padding:'7px 12px',borderRadius:'10px',border:`1px solid ${color}44`,background:color+'11',color:color,fontWeight:'600',fontSize:'0.75rem',cursor:'pointer',fontFamily:'inherit'}}>{Icon&&<Icon size={12}/>}{label}</button>;
}

// validate helper
function validate(fields,t){
  const errors={};
  fields.forEach(([key,val])=>{ if(!val||String(val).trim()==='')errors[key]=t.fieldRequired; });
  return errors;
}

// Section header (iOS style)
function SectionHeader({title,T}){
  return<p style={{margin:'16px 0 6px',fontSize:'0.7rem',fontWeight:'600',color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.8px'}}>{title}</p>;
}

// Sub tab bar
function SubTabs({tabs,active,onChange,T}){
  return(
    <div style={{display:'flex',gap:'4px',overflowX:'auto',paddingBottom:'2px',marginBottom:'12px'}}>
      {tabs.map(tab=>(
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{padding:'7px 14px',borderRadius:'20px',border:'none',background:active===tab.id?T.gold:'transparent',color:active===tab.id?'#fff':T.textMuted,fontSize:'0.8rem',fontWeight:active===tab.id?'700':'500',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',transition:'all 0.15s'}}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
// ═══ DASHBOARD ═══
function Dashboard({data,lang,t,T}){
  const re=data.realEstate||[],co=data.companies||[],ve=data.vehicles||[],iv=data.investments||[],tr=data.transactions||[];
  const totalAssets=re.reduce((s,p)=>s+p.value,0)+co.reduce((s,c)=>s+c.capital,0)+ve.reduce((s,v)=>s+v.value,0)+iv.reduce((s,i)=>s+i.currentValue,0);

  // Monthly income: sum from active companies + normalized rent from properties
  const rentNormalize=(amt,freq)=>{if(!amt)return 0;if(freq==='monthly')return amt;if(freq==='quarterly')return amt/3;if(freq==='yearly')return amt/12;return amt/12;};
  const rentIncome=re.reduce((s,p)=>{if(p.hasUnits)return s+p.units.filter(u=>u.status==='occupied').reduce((su,u)=>su+rentNormalize(u.rent?.amount,u.rent?.frequency),0);if(p.status==='occupied')return s+rentNormalize(p.rent?.amount,p.rent?.frequency);return s;},0);
  const companyIncome=co.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+c.monthlyRevenue,0);
  const mInc=rentIncome+companyIncome;

  // Monthly expenses: company costs + vehicle installments + recurring operations
  const companyExp=co.filter(c=>c.companyStatus==='active').reduce((s,c)=>s+c.monthlyExpense,0);
  const loanExp=ve.reduce((s,v)=>s+(v.loan?.monthlyInstallment||0),0);
  const recurringOps=(data.operations||[]).filter(o=>o.frequency==='monthly'&&o.status!=='paid').reduce((s,o)=>s+o.amount,0);
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
  const chartData=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);const m=d.getMonth(),y=d.getFullYear();const mn=lang==='ar'?MONTHS_AR[m]:MONTHS_EN[m];const inc=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='income'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);const exp=tr.filter(tx=>{const td=new Date(tx.date);return tx.type==='expense'&&td.getMonth()===m&&td.getFullYear()===y;}).reduce((s,tx)=>s+tx.amount,0);return{name:mn,دخل:inc,مصاريف:exp};});
  const pieData=[{name:lang==='ar'?'عقارات':'Real Estate',value:re.reduce((s,p)=>s+p.value,0)},{name:lang==='ar'?'شركات':'Companies',value:co.reduce((s,c)=>s+c.capital,0)},{name:lang==='ar'?'مركبات':'Vehicles',value:ve.reduce((s,v)=>s+v.value,0)},{name:lang==='ar'?'استثمارات':'Investments',value:iv.reduce((s,i)=>s+i.currentValue,0)}].filter(d=>d.value>0);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
      {/* Hero */}
      <div style={{
        background:`linear-gradient(145deg,${T.goldDark} 0%,${T.gold} 55%,#e8c96a 100%)`,
        borderRadius:'24px',padding:'28px 24px',textAlign:'center',
        position:'relative',overflow:'hidden',
        boxShadow:`0 8px 32px ${T.gold}40`,
      }}>
        <div style={{position:'absolute',top:'-30%',right:'-10%',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(255,255,255,0.08)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-20%',left:'-5%',width:'120px',height:'120px',borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}}/>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.78rem',margin:'0 0 6px',fontWeight:'600',letterSpacing:'0.5px',textTransform:'uppercase'}}>{t.netWorth}</p>
        <p style={{color:'#fff',fontSize:'2.6rem',fontWeight:'900',margin:'0 0 4px',letterSpacing:'-1.5px',textShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>{fmt(totalAssets)}</p>
        <p style={{color:'rgba(255,255,255,0.65)',fontSize:'0.75rem',margin:0,fontWeight:'500'}}>{lang==='ar'?'ريال سعودي':'Saudi Riyal'}</p>
      </div>
      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <StatCard label={lang==='ar'?'الدخل الشهري المتوقع':'Est. Monthly Income'} value={fmtC(mInc,lang)} icon={ArrowUpCircle} color={T.success} T={T}/>
        <StatCard label={lang==='ar'?'المصاريف الشهرية':'Monthly Expenses'} value={fmtC(mExp,lang)} icon={ArrowDownCircle} color={T.danger} T={T}/>
        <StatCard label={lang==='ar'?'صافي شهري':'Net Monthly'} value={fmtC(mInc-mExp,lang)} icon={TrendingUp} color={mInc>=mExp?T.success:T.danger} T={T}/>
        <StatCard label={t.totalAssets} value={fmtC(totalAssets,lang)} icon={Wallet} color={T.gold} T={T}/>
      </div>
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
  const markPaid=(pid,uid)=>{setData(d=>({...d,realEstate:d.realEstate.map(p=>{if(p.id!==pid)return p;if(uid&&p.hasUnits)return{...p,units:p.units.map(u=>u.id===uid?{...u,rent:{...u.rent,lastPaid:todayStr()}}:u)};return{...p,rent:{...p.rent,lastPaid:todayStr()}};})}));logActivity(t.paidAction,t.realEstate,`إيجار "${items.find(p=>p.id===pid)?.name}"`);};
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
      {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
      {filtered.map(item=>{const isEx=expandedId===item.id;const du=!item.hasUnits&&daysUntil(item.rent?.nextDue);const ce=!item.hasUnits&&daysUntil(item.contract?.endDate);const statColor=item.status==='occupied'?T.success:item.status==='personal'?T.info:T.warning;const statLabel=item.status==='occupied'?t.occupied:item.status==='personal'?t.personal:t.vacant;return(
        <div key={item.id} style={{background:T.surface,borderRadius:'20px',boxShadow:T.cardShadow,overflow:'hidden',border:`1px solid ${T.border}`}}>
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
            <Field label={t.name}><Inp value={form.tenant?.name} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}}))}/></Field>
            <Field label={t.phone}><Inp value={form.tenant?.phone} onChange={e=>setForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}}))}/></Field>
          </div>
          <SectionHeader title={t.rent} T={T}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
            <Field label={t.amount}><Inp type="number" value={form.rent?.amount} onChange={e=>setForm(f=>({...f,rent:{...f.rent,amount:e.target.value}}))}/></Field>
            <Field label={t.frequency}><Sel value={form.rent?.frequency} onChange={e=>setForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}}))}>  {Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
            <Field label={t.nextDue}><Inp type="date" value={form.rent?.nextDue} onChange={e=>setForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}}))}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.startDate}><Inp type="date" value={form.contract?.startDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}}))}/></Field>
            <Field label={t.endDate}><Inp type="date" value={form.contract?.endDate} onChange={e=>setForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}}))}/></Field>
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
            <Field label={t.name}><Inp value={unitForm.tenant?.name} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,name:e.target.value}}))}/></Field>
            <Field label={t.phone}><Inp value={unitForm.tenant?.phone} onChange={e=>setUnitForm(f=>({...f,tenant:{...f.tenant,phone:e.target.value}}))}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
            <Field label={t.amount}><Inp type="number" value={unitForm.rent?.amount} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,amount:e.target.value}}))}/></Field>
            <Field label={t.frequency}><Sel value={unitForm.rent?.frequency} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,frequency:e.target.value}}))}>  {Object.entries(ft).map(([k,v])=><option key={k} value={k}>{v}</option>)}</Sel></Field>
            <Field label={t.nextDue}><Inp type="date" value={unitForm.rent?.nextDue} onChange={e=>setUnitForm(f=>({...f,rent:{...f.rent,nextDue:e.target.value}}))}/></Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <Field label={t.startDate}><Inp type="date" value={unitForm.contract?.startDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,startDate:e.target.value}}))}/></Field>
            <Field label={t.endDate}><Inp type="date" value={unitForm.contract?.endDate} onChange={e=>setUnitForm(f=>({...f,contract:{...f.contract,endDate:e.target.value}}))}/></Field>
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
  const save=()=>{const errs=validate([['name',form.name],['capital',form.capital]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:modal==='add'?genId():form.id,capital:Number(form.capital)||0,monthlyRevenue:Number(form.monthlyRevenue)||0,monthlyExpense:Number(form.monthlyExpense)||0,ownership:Number(form.ownership)||0};setData(d=>({...d,companies:modal==='add'?[...(d.companies||[]),entry]:(d.companies||[]).map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.companies,`"${entry.name}"`);setModal(null);};
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
      {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
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
          {item.employees?.length>0&&<div style={{marginBottom:'8px'}}><p style={{margin:'0 0 4px',fontSize:'0.68rem',color:T.textMuted}}>{t.employees}</p>{item.employees.map(e=>(<div key={e.id} style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem',padding:'5px 10px',background:T.surface2,borderRadius:'8px',marginBottom:'2px'}}><span style={{color:T.text}}>{e.name}</span><span style={{color:T.gold,fontWeight:'600'}}>{fmtC(e.salary,lang)}</span></div>))}</div>}
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

function VehiclesPage({data,setData,lang,t,T,logActivity,canDelete}){
  const [modal,setModal]=useState(null),[confirm,setConfirm]=useState(null),[form,setForm]=useState({}),[errors,setErrors]=useState({});
  const items=data.vehicles||[];
  const openAdd=()=>{setForm({name:'',type:'',plateNumber:'',year:new Date().getFullYear(),value:'',insurance:{company:'',expiryDate:'',amount:''},registration:{expiryDate:'',amount:''},loan:{amount:'',monthlyInstallment:'',nextDue:'',remainingMonths:''},notes:''});setErrors({});setModal('add');};
  const openEdit=item=>{setForm({...item,value:String(item.value)});setErrors({});setModal({edit:item});};
  const save=()=>{const errs=validate([['name',form.name],['type',form.type],['value',form.value]],t);if(Object.keys(errs).length){setErrors(errs);return;}const entry={...form,id:modal==='add'?genId():form.id,value:Number(form.value)||0,insurance:{...form.insurance,amount:Number(form.insurance?.amount)||0},registration:{...form.registration,amount:Number(form.registration?.amount)||0},loan:{...form.loan,amount:Number(form.loan?.amount)||0,monthlyInstallment:Number(form.loan?.monthlyInstallment)||0,remainingMonths:Number(form.loan?.remainingMonths)||0}};setData(d=>({...d,vehicles:modal==='add'?[...(d.vehicles||[]),entry]:(d.vehicles||[]).map(x=>x.id===entry.id?entry:x)}));logActivity(modal==='add'?t.addedAction:t.editedAction,t.vehicles,`"${entry.name}"`);setModal(null);};
  const del=id=>{const item=items.find(x=>x.id===id);setData(d=>({...d,vehicles:d.vehicles.filter(x=>x.id!==id)}));logActivity(t.deletedAction,t.vehicles,`"${item?.name}"`);setConfirm(null);};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><p style={{margin:0,fontSize:'0.78rem',color:T.textMuted}}>{fmtC(items.reduce((s,v)=>s+v.value,0),lang)}</p><AddBtn onClick={openAdd} label={t.add} T={T}/></div>
      {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
      {items.map(item=>{const di=daysUntil(item.insurance?.expiryDate);const dl=item.loan?.amount>0?daysUntil(item.loan?.nextDue):null;return(
        <div key={item.id} style={{background:T.surface,borderRadius:'16px',padding:'14px',boxShadow:T.cardShadow}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}><div><h4 style={{margin:0,color:T.text,fontWeight:'700'}}>{item.name}</h4><p style={{margin:'2px 0 0',fontSize:'0.73rem',color:T.textMuted}}>{item.type} • {item.year} • {item.plateNumber}</p></div><Badge color={T.gold}>{fmtC(item.value,lang)}</Badge></div>
          <div style={{background:T.surface2,borderRadius:'12px',padding:'10px',marginBottom:'10px',display:'flex',flexDirection:'column',gap:'5px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.insurance}</span><span style={{color:di!==null&&di<=30?T.warning:T.text,fontWeight:'500'}}>{fmtDate(item.insurance?.expiryDate,lang)}{di!==null&&di<=30?' ⚠️':''}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.registration}</span><span style={{color:T.text}}>{fmtDate(item.registration?.expiryDate,lang)}</span></div>
            {item.loan?.amount>0&&<><div style={{height:'1px',background:T.border,margin:'2px 0'}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.installment}</span><span style={{color:T.danger,fontWeight:'700'}}>{fmtC(item.loan.monthlyInstallment,lang)}</span></div><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem'}}><span style={{color:T.textMuted}}>{t.nextDue}</span><span style={{color:dl!==null&&dl<=14?T.danger:T.text}}>{fmtDate(item.loan?.nextDue,lang)}</span></div></>}
          </div>
          <div style={{display:'flex',gap:'6px'}}><SmBtn onClick={()=>openEdit(item)} label={t.edit} icon={Pencil} color={T.info} T={T}/>{canDelete&&<SmBtn onClick={()=>setConfirm(item.id)} label={t.delete} icon={Trash2} color={T.danger} T={T}/>}</div>
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
          <Field label={lang==='ar'?'الشركة':'Company'}><Inp value={form.insurance?.company} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,company:e.target.value}}))}/></Field>
          <Field label={t.insExpiry}><Inp type="date" value={form.insurance?.expiryDate} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,expiryDate:e.target.value}}))}/></Field>
          <Field label={lang==='ar'?'القسط':'Premium'}><Inp type="number" value={form.insurance?.amount} onChange={e=>setForm(f=>({...f,insurance:{...f.insurance,amount:e.target.value}}))}/></Field>
        </div>
        <SectionHeader title={`📋 ${t.registration}`} T={T}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.regExpiry}><Inp type="date" value={form.registration?.expiryDate} onChange={e=>setForm(f=>({...f,registration:{...f.registration,expiryDate:e.target.value}}))}/></Field>
          <Field label={lang==='ar'?'الرسوم':'Fee'}><Inp type="number" value={form.registration?.amount} onChange={e=>setForm(f=>({...f,registration:{...f.registration,amount:e.target.value}}))}/></Field>
        </div>
        <SectionHeader title={`💳 ${t.installment} (${lang==='ar'?'اتركه فارغاً إن لا يوجد':'leave empty if none'})`} T={T}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field label={t.loanAmount}><Inp type="number" value={form.loan?.amount} onChange={e=>setForm(f=>({...f,loan:{...f.loan,amount:e.target.value}}))}/></Field>
          <Field label={t.installment}><Inp type="number" value={form.loan?.monthlyInstallment} onChange={e=>setForm(f=>({...f,loan:{...f.loan,monthlyInstallment:e.target.value}}))}/></Field>
          <Field label={t.nextDue}><Inp type="date" value={form.loan?.nextDue} onChange={e=>setForm(f=>({...f,loan:{...f.loan,nextDue:e.target.value}}))}/></Field>
          <Field label={t.remainingMonths}><Inp type="number" value={form.loan?.remainingMonths} onChange={e=>setForm(f=>({...f,loan:{...f.loan,remainingMonths:e.target.value}}))}/></Field>
        </div>
        <Field label={t.notes}><Ta value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} T={T}/></Field>
        <SaveBtn onClick={save} label={t.save} T={T}/><CancelBtn onClick={()=>setModal(null)} label={t.cancel} T={T}/>
      </Modal>}
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
        {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem',gridColumn:'1/-1'}}>{t.noData}</p>}
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
  const markPaid=id=>setData(d=>({...d,operations:d.operations.map(o=>o.id===id?{...o,status:'paid'}:o)}));
  const del=id=>{setData(d=>({...d,operations:d.operations.filter(o=>o.id!==id)}));setConfirm(null);};
  const filtered=items.filter(o=>(typeF==='all'||o.type===typeF)&&(statusF==='all'||o.status===statusF));
  const pending=items.filter(o=>o.status==='pending').reduce((s,o)=>s+o.amount,0);
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
      {filtered.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
      {filtered.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(item=>(
        <div key={item.id} style={{background:T.surface,borderRadius:'14px',padding:'12px',boxShadow:T.cardShadow,display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
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
      {items.length===0&&<p style={{color:T.textMuted,textAlign:'center',padding:'2rem',fontSize:'0.85rem'}}>{t.noData}</p>}
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
          <div style={{textAlign:'end',flexShrink:0}}><p style={{margin:0,fontSize:'0.64rem',color:T.textMuted}}>{dt.toLocaleDateString(lang==='ar'?'ar-SA':'en-US')}</p><p style={{margin:0,fontSize:'0.62rem',color:T.textDim}}>{dt.toLocaleTimeString(lang==='ar'?'ar-SA':'en-US',{hour:'2-digit',minute:'2-digit'})}</p></div>
        </div>
      );})}
    </div>
  );
}
// ═══ BOTTOM TAB NAV + MAIN APP ═══
const BOTTOM_TABS = [
  {id:'dashboard',icon:Home},
  {id:'assets',icon:Building2},
  {id:'operations',icon:Wrench},
  {id:'finance',icon:BarChart2},
  {id:'more',icon:MoreHorizontal},
];
const ASSET_SUBS = ['realEstate','companies','vehicles','investments'];
const OPS_SUBS = ['operations','loansGiven'];

export default function App(){
  const [lang,setLang]=useState('ar');
  const [isDark,setIsDark]=useState(true);
  const [activeTab,setActiveTab]=useState('dashboard');
  const [activePage,setActivePage]=useState('dashboard');
  const [assetSub,setAssetSub]=useState('realEstate');
  const [opSub,setOpSub]=useState('operations');
  const [moreOpen,setMoreOpen]=useState(false);
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [authUser,setAuthUser]=useState(null);
  const [userProfile,setUserProfile]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const saveTimer=useRef(null);
  const t=TR[lang];
  const T=isDark?DARK:LIGHT;

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
      try{const snap=await getDoc(doc(db,'platform','main'));if(snap.exists())setData(snap.data());else{const sample=buildSampleData();await setDoc(doc(db,'platform','main'),sample);setData(sample);}}
      catch(e){setData(buildSampleData());}
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
  const currentUser={id:userProfile?.uid,name:userProfile?.name||'مستخدم'};
  const pageProps={data,setData,lang,t,T,logActivity,currentUser,canDelete};

  const spinner=msg=>(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:T.bg}}><div style={{textAlign:'center'}}><div style={{width:'48px',height:'48px',border:`3px solid ${T.gold}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 1rem'}}/><p style={{color:T.textMuted,fontSize:'0.85rem'}}>{msg}</p></div><style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style></div>);

  if(authLoading)return spinner(lang==='ar'?'جاري التحقق...':'Authenticating...');
  if(!authUser)return <Login/>;
  if(loading||!data)return spinner(lang==='ar'?'جاري التحميل...':'Loading...');

  const dir=lang==='ar'?'rtl':'ltr';
  const alertCount=(()=>{let c=0;(data?.realEstate||[]).forEach(p=>{const units=p.hasUnits?p.units:(p.status==='occupied'?[p]:[]);units.filter(u=>u.status==='occupied').forEach(u=>{const d=daysUntil(u.rent?.nextDue);if(d!==null&&d<=30)c++;});});(data?.vehicles||[]).forEach(v=>{const d=daysUntil(v.insurance?.expiryDate);if(d!==null&&d<=30)c++;});return c;})();

  const assetSubTabs=[{id:'realEstate',label:t.realEstate},{id:'companies',label:t.companies},{id:'vehicles',label:t.vehicles},{id:'investments',label:t.investments}];
  const opsSubTabs=[{id:'operations',label:t.operations},{id:'loansGiven',label:t.loansGiven}];

  const handleTabPress=tab=>{
    if(tab==='more'){setMoreOpen(true);return;}
    setActiveTab(tab);
    if(tab==='dashboard')setActivePage('dashboard');
    else if(tab==='assets')setActivePage(assetSub);
    else if(tab==='operations')setActivePage(opSub);
    else if(tab==='finance')setActivePage('finance');
  };

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

  const pageTitle=()=>{
    if(activePage==='dashboard')return t.dashboard;
    if(activePage==='finance')return t.financeTab;
    return t[activePage]||activePage;
  };

  const goldGrad=`linear-gradient(135deg,${T.goldDark},${T.gold})`;

  return(
    <div dir={dir} style={{minHeight:'100vh',background:T.bg,color:T.text,fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue","Segoe UI",system-ui,sans-serif'}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        input[type=date]::-webkit-calendar-picker-indicator{filter:${isDark?'invert(0.7)':'none'}}
        select option{background:${T.surface};color:${T.text}}
        @media print{header,footer,nav{display:none!important}}
        button:active{transform:scale(0.97);transition:transform 0.1s}
        main > *{animation:fadeIn 0.2s ease}
      `}</style>

      {/* HEADER */}
      <header style={{
        background:isDark?'rgba(5,12,26,0.85)':'rgba(249,249,249,0.92)',
        borderBottom:`1px solid ${T.border}`,
        padding:'14px 16px 12px',
        display:'flex',alignItems:'center',gap:'8px',
        position:'sticky',top:0,zIndex:30,
        backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',
      }}>
        <h2 style={{margin:0,color:T.text,fontWeight:'700',fontSize:'1.05rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',letterSpacing:'-0.3px'}}>{pageTitle()}</h2>
        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
          {alertCount>0&&(
            <button onClick={()=>{setActiveTab('dashboard');setActivePage('dashboard');}} style={{position:'relative',background:T.danger+'18',border:`1px solid ${T.danger}33`,borderRadius:'10px',padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',color:T.danger}}>
              <Bell size={13}/>
              <span style={{fontSize:'0.7rem',fontWeight:'800'}}>{alertCount}</span>
            </button>
          )}
          <button onClick={()=>setIsDark(d=>!d)} style={{display:'flex',alignItems:'center',justifyContent:'center',width:'34px',height:'34px',borderRadius:'10px',border:`1px solid ${T.border}`,background:T.surface2,cursor:'pointer',color:T.textMuted}}>
            {isDark?<Sun size={15}/>:<Moon size={15}/>}
          </button>
          <button onClick={()=>setLang(l=>l==='ar'?'en':'ar')} style={{display:'flex',alignItems:'center',gap:'3px',padding:'6px 10px',background:T.surface2,border:`1px solid ${T.border}`,borderRadius:'10px',color:T.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:'0.75rem',fontWeight:'700'}}>
            {lang==='ar'?'EN':'ع'}
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{padding:'14px',paddingBottom:'90px',maxWidth:'600px',margin:'0 auto',boxSizing:'border-box'}}>
        {/* Sub nav for assets */}
        {activeTab==='assets'&&<SubTabs tabs={assetSubTabs} active={assetSub} onChange={id=>{setAssetSub(id);setActivePage(id);}} T={T}/>}
        {/* Sub nav for operations */}
        {activeTab==='operations'&&<SubTabs tabs={opsSubTabs} active={opSub} onChange={id=>{setOpSub(id);setActivePage(id);}} T={T}/>}
        {renderPage()}
      </main>

      {/* BOTTOM TAB BAR — iOS style */}
      <nav style={{
        position:'fixed',bottom:0,left:0,right:0,
        height:'80px',paddingBottom:'env(safe-area-inset-bottom,8px)',
        background:isDark?'rgba(10,20,42,0.88)':'rgba(249,249,249,0.92)',
        borderTop:`1px solid ${T.border}`,
        display:'flex',alignItems:'center',justifyContent:'space-around',
        backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',zIndex:30
      }}>
        {BOTTOM_TABS.map(({id,icon:Icon})=>{
          const isActive=activeTab===id;
          const label={dashboard:t.dashboard,assets:t.assets,operations:t.operationsTab,finance:t.financeTab,more:t.more}[id];
          return(
            <button key={id} onClick={()=>handleTabPress(id)} style={{
              display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',
              background:'none',border:'none',
              color:isActive?T.gold:T.textMuted,
              cursor:'pointer',fontFamily:'inherit',flex:1,padding:'8px 0',
              transition:'color 0.15s',position:'relative',
            }}>
              {id==='dashboard'&&alertCount>0&&!isActive&&<span style={{position:'absolute',top:'6px',[lang==='ar'?'left':'right']:'calc(50% - 16px)',width:'9px',height:'9px',background:T.danger,borderRadius:'50%',border:`2px solid ${T.bg}`}}/>}
              <div style={{
                width:isActive?'44px':'36px',height:isActive?'30px':'28px',
                background:isActive?T.gold+'18':'transparent',
                borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',
                transition:'all 0.2s',
              }}>
                <Icon size={20} strokeWidth={isActive?2.5:1.8}/>
              </div>
              <span style={{fontSize:'0.6rem',fontWeight:isActive?'700':'400',letterSpacing:'-0.2px'}}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* MORE SHEET */}
      {moreOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:40,display:'flex',alignItems:'flex-end',justifyContent:'center',background:'rgba(0,0,0,0.5)',backdropFilter:'blur(8px)'}} onClick={()=>setMoreOpen(false)}>
          <div style={{background:T.surface,borderRadius:'24px 24px 0 0',width:'100%',maxWidth:'600px',padding:'20px',animation:'slideUp 0.25s ease',boxShadow:'0 -8px 40px rgba(0,0,0,0.2)'}} onClick={e=>e.stopPropagation()}>
            <div style={{width:'40px',height:'4px',background:T.border,borderRadius:'2px',margin:'0 auto 20px'}}/>
            <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
              {/* User info */}
              <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px',background:T.surface2,borderRadius:'14px',marginBottom:'8px'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:goldGrad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:'700',color:'#000'}}>{userProfile?.name?.charAt(0)||'?'}</div>
                <div><p style={{margin:0,color:T.text,fontWeight:'700',fontSize:'0.95rem'}}>{userProfile?.name}</p><p style={{margin:0,color:T.textMuted,fontSize:'0.75rem'}}>{role==='owner'?'👑 مالك':role==='assistant'?'🤝 مساعد':'👁 مشاهد'} • {userProfile?.email}</p></div>
              </div>
              {[
                {id:'activityLog',icon:Activity,label:t.activityLog},
                ...(role==='owner'?[{id:'userManagement',icon:Users,label:t.userManagement}]:[]),
              ].map(({id,icon:Icon,label})=>(
                <button key={id} onClick={()=>{setActivePage(id);setActiveTab('more');setMoreOpen(false);}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px',background:T.surface2,borderRadius:'14px',border:'none',color:T.text,cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',fontWeight:'500',width:'100%',textAlign:lang==='ar'?'right':'left'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',background:T.gold+'22',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={T.gold}/></div>
                  {label}
                  <ChevronRight size={16} color={T.textMuted} style={{marginRight:'auto',transform:lang==='ar'?'rotate(180deg)':'none'}}/>
                </button>
              ))}
              <button onClick={handleSignOut} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px',background:T.danger+'11',borderRadius:'14px',border:'none',color:T.danger,cursor:'pointer',fontFamily:'inherit',fontSize:'0.9rem',fontWeight:'600',width:'100%',marginTop:'4px'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:T.danger+'22',display:'flex',alignItems:'center',justifyContent:'center'}}><LogOut size={18} color={T.danger}/></div>
                {lang==='ar'?'تسجيل الخروج':'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
