const genId=()=>`${Date.now()}_${Math.random().toString(36).substr(2,6)}`;

export const DEF_CATS_AR=['صيانة','فواتير','رواتب','تأمين','ضرائب وزكاة','مصاريف خيرية','سفر وتمثيل','بروتوكول','مصاريف تشغيل','أخرى'];

export function buildSampleData(){
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
      {id:genId(),name:'مرسيدس E-Class 2023',type:'Sedan',plateNumber:'د هـ و 5678',year:2023,value:320000,insurance:{company:'ولاء',expiryDate:'2026-03-20',amount:6200},registration:{expiryDate:'2026-03-20',amount:1100},financing:{type:'installment',purchasePrice:320000,downPayment:60000,balanceToInstall:260000,monthlyInstallment:5417,totalMonths:48,payments:[{id:genId(),month:1,dueDate:'2025-04-15',amount:5417,method:'bank',status:'paid',paidAmount:5417,pendingAmount:0,date:'2025-04-15'},{id:genId(),month:2,dueDate:'2025-05-15',amount:5417,method:'bank',status:'paid',paidAmount:5417,pendingAmount:0,date:'2025-05-15'},{id:genId(),month:3,dueDate:'2025-06-15',amount:5417,method:'bank',status:'paid',paidAmount:5417,pendingAmount:0,date:'2025-06-15'},{id:genId(),month:4,dueDate:'2025-07-15',amount:5417,method:'cash',status:'partial',paidAmount:3000,pendingAmount:2417,date:'2025-07-18'},{id:genId(),month:5,dueDate:'2025-08-15',amount:5417,method:'bank',status:'pending',paidAmount:0,pendingAmount:5417,date:null}]},notes:''},
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
