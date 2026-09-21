/* ==========================================================================
   iHub — Mock data layer
   NOTE: there is no backend in this build. Everything below stands in for
   API responses. All writes go to an in-memory store (optionally mirrored
   to localStorage), so created/edited records persist while the tab is open.
   ========================================================================== */
(function (global) {
  'use strict';

  /* --- Top navigation ----------------------------------------------------- */
  var NAV = [
    { id: 'home', label: 'Home', labelAr: 'الرئيسية', icon: 'home', route: '#/home' },
    { id: 'finance', label: 'Finance & Budgets', labelAr: 'المالية والميزانيات', icon: 'coins', route: '#/section/finance' },
    { id: 'hr', label: 'HR', labelAr: 'الموارد البشرية', icon: 'users', route: '#/section/hr' },
    { id: 'appraisal', label: 'Appraisal', labelAr: 'التقييم', icon: 'star', route: '#/section/appraisal' },
    { id: 'quality', label: 'Quality & Compliance', labelAr: 'الجودة والامتثال', icon: 'shield', route: '#/section/quality' },
    { id: 'history', label: 'History', labelAr: 'السجل', icon: 'clock', route: '#/section/history' },
    { id: 'workflows', label: 'Workflows', labelAr: 'سير العمل', icon: 'workflow', route: '#/section/workflows' },
    { id: 'masters', label: 'Masters', labelAr: 'البيانات الرئيسية', icon: 'layers', mega: true },
    { id: 'masters-list', label: 'Masters (List)', labelAr: 'قائمة البيانات', icon: 'grid', route: '#/masters-list' }
  ];

  /* --- Masters mega menu: 47 items across 7 columns ----------------------- */
  var MEGA_COLUMNS = [
    ['Brand', 'Appraisal Section Name', 'Case Category', 'Question Category', 'Checklist Comments', 'Ride Category', 'Payment Method'],
    ['Petty Cash Stage', 'Payment Mode', 'Employees Category Type', 'Employees Overall Category', 'Employees OPS Category', 'Employees Jobs', 'PC Category Master'],
    ['Item POS System', 'Item Concept Name', 'Item Main Group', 'Item Sub Group One', 'Item Sub Group Two', 'Item Type Name', 'Item Reporting Category'],
    ['Item Unit', 'Quality Assurance Type', 'Locations', 'Zone', 'Departments', 'Revenue Stream', 'Assignment Areas'],
    ['Designations', 'Job Order Mapping', 'Average Day Sales', 'Standard Headcount', 'Observations', 'Supplier', 'Budget Activities'],
    ['Currency Exchange', 'Crises Level', 'Violation Policy', 'Employees', 'Appraiser Mapping', 'Overtime Calculation'],
    ['Appraiser Questions', 'Projecting Budget Modify', 'Projecting Revenue Modify', 'Holiday Master', 'Item Master', 'Appraisal Deduction Master']
  ];

  /* --- Masters (List): categorised browser -------------------------------- */
  var MASTER_CATEGORIES = [
    {
      id: 'admin', label: 'Admin', labelAr: 'الإدارة',
      items: ['Action Sheet Approval Workflow', 'Brand', 'Budget Approval Workflow', 'Budgeting Entry Template',
        'Case Category', 'Checklist Comments', 'Common Verify/Approve Workflow', 'Configuration',
        'Cron Job Settings', 'Holiday Master', 'Loan Approval Workflow', 'Petty Cash Stage',
        'Question Category', 'Ride Category', 'Violation Policy', 'User Configuration']
    },
    {
      id: 'general', label: 'General', labelAr: 'عام',
      items: ['Brand', 'Currency Exchange', 'Crises Level', 'Departments', 'Designations', 'Locations',
        'Payment Method', 'Payment Mode', 'Revenue Stream', 'Supplier', 'Zone', 'Assignment Areas',
        'Average Day Sales', 'Budget Activities']
    },
    {
      id: 'hr', label: 'HR', labelAr: 'الموارد البشرية',
      items: ['Appraisal Deduction Master', 'Appraisal Section Name', 'Appraiser Mapping', 'Appraiser Questions',
        'Employees', 'Employees Category Type', 'Employees Jobs', 'Employees OPS Category',
        'Employees Overall Category', 'Overtime Calculation', 'Standard Headcount']
    },
    {
      id: 'operation', label: 'Operation', labelAr: 'العمليات',
      items: ['Item Concept Name', 'Item Main Group', 'Item Master', 'Item POS System', 'Item Reporting Category',
        'Item Sub Group One', 'Item Sub Group Two', 'Item Type Name', 'Item Unit', 'Job Order Mapping',
        'Observations', 'Quality Assurance Type', 'PC Category Master', 'Projecting Budget Modify',
        'Projecting Revenue Modify']
    }
  ];

  /* --- Option lists (shared by forms and filters) -------------------------- */
  var LOCATIONS = ['360 Mall', 'The Gate Mall', 'Al Kout Mall', 'Assima Mall', 'Avenues Mall', 'Entertainment City'];
  var ZONES = ['Zone A - Main Rides', 'Zone A - Kids Zone', 'Zone A - Grand Avenue', 'Zone B - Water Park',
    'Zone B - Adventure Zone', 'Zone C - Rides', 'Zone C - Entertainment', 'Fun Tiki', 'Wonder Zone'];
  var AREAS = ['Roller Coaster Zone', 'Wave Pool Area', 'Splash Zone', 'Carousel Section', 'Climbing Wall',
    'Ferris Wheel', 'Cinema', 'Gaming', 'North Wing', 'Reception / Entrance', 'Arcade', 'Party Rooms'];
  var SUBAREAS = ['Counter / Till', 'Kitchen', 'Play Structure', 'Ticketing', 'Lockers', 'Seating Area',
    'Storage', 'Control Room', 'Entrance Gate', 'Queue Line', 'Track Section Area'];
  var DEPARTMENTS = ['Maintenance Department', 'Safety Department', 'Operations Department', 'Guest Services',
    'Engineering Department', 'IT Department', 'Security Department', 'HR Department', 'Finance Department'];
  var TASK_TYPES = ['Emergency Maintenance', 'Preventive Maintenance', 'Facility Request',
    'Procurement / Purchase', 'Guest Incident', 'Commercial / Promotion', 'QA / Compliance Check'];
  var PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
  var PROJECT_CATEGORIES = ['Infrastructure', 'Digital Transformation', 'Facilities', 'Operations', 'Safety'];
  var ASSET_CATEGORIES = ['Rides & Attractions', 'Facility Assets', 'Electrical Systems', 'HVAC Systems', 'IT Equipment'];
  var RISK_CATEGORIES = ['Safety', 'Operations', 'Guest Experience', 'Equipment Failure', 'Financial Impact', 'Compliance'];
  var TOUCHPOINTS = ['Guest Services', 'Entering the Zone Facility', 'IT Services', 'Employee Morale',
    'Redemption Counter Experience', 'Reception / Card Purchasing'];
  var USERS = ['Alex Morgan', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Tom Baker', 'David Lee', 'Nora Hassan'];
  var STAGES = ['Logged', 'In Review', 'Approved', 'To Be Initiated', 'Assigned', 'In Progress', 'Completed', 'Closed & Verified'];

  /* --- Seeded pseudo-random so the mock data is stable across reloads ------ */
  function seeded(seed) {
    var s = seed;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length) % arr.length]; }
  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }

  /* --- Master records ------------------------------------------------------ */
  function buildMasterRows(name, count) {
    var rnd = seeded(name.length * 977 + 13);
    var rows = [];
    for (var i = 0; i < count; i++) {
      var active = rnd() > 0.2;
      rows.push({
        id: 'REC-' + pad(i + 1, 3),
        seq: i + 1,
        location: pick(rnd, LOCATIONS),
        zone: pick(rnd, ZONES),
        area: pick(rnd, AREAS),
        department: pick(rnd, DEPARTMENTS),
        status: active ? 'Active' : 'Inactive',
        createdOn: '2026-0' + (1 + (i % 8)) + '-' + pad(3 + (i % 25), 2),
        createdBy: pick(rnd, USERS),
        updatedOn: '2026-0' + (1 + ((i + 3) % 8)) + '-' + pad(5 + (i % 22), 2),
        updatedBy: pick(rnd, USERS)
      });
    }
    return rows;
  }

  /* --- Tasks --------------------------------------------------------------- */
  var TASK_SUBJECTS = [
    'Replace cinema projector lamp — Screen 6',
    'POS network outage — 360 Mall',
    'HVAC filter replacement — Zone B',
    'Quarterly ride safety inspection',
    'Wave pool pump pressure drop',
    'Carousel motor unusual noise',
    'Redemption counter queue overflow',
    'Arcade token dispenser jam',
    'Emergency lighting test — North Wing',
    'Guest incident report — Splash Zone',
    'Climbing wall harness audit',
    'Ferris wheel cabin door sensor fault',
    'Party room AC not cooling',
    'Ticketing kiosk card reader fault',
    'Fire extinguisher annual service',
    'CCTV camera offline — Entrance Gate'
  ];

  function buildTasks() {
    var rnd = seeded(4242);
    return TASK_SUBJECTS.map(function (subject, i) {
      var stageIdx = Math.floor(rnd() * STAGES.length);
      var pct = Math.min(100, Math.round((stageIdx / (STAGES.length - 1)) * 100));
      return {
        id: 'TASK-' + pad(1001 + i, 4),
        subject: subject,
        scope: rnd() > 0.35 ? 'internal' : 'external',
        taskType: pick(rnd, TASK_TYPES),
        priority: pick(rnd, PRIORITIES),
        severity: pick(rnd, PRIORITIES),
        department: pick(rnd, DEPARTMENTS),
        location: pick(rnd, LOCATIONS),
        zone: pick(rnd, ZONES),
        area: pick(rnd, AREAS),
        assignee: pick(rnd, USERS),
        requester: pick(rnd, USERS),
        stage: STAGES[stageIdx],
        progress: pct,
        sla: rnd() > 0.75 ? 'Breached' : rnd() > 0.45 ? 'At Risk' : 'On Track',
        startDate: '2026-09-' + pad(1 + (i % 25), 2),
        endDate: '2026-10-' + pad(2 + (i % 26), 2),
        projectName: 'General Operations',
        projectCategory: pick(rnd, PROJECT_CATEGORIES),
        details: 'Scheduled maintenance and inspection task raised for the ' + pick(rnd, DEPARTMENTS) + '.',
        riskCategory: pick(rnd, RISK_CATEGORIES),
        impactedArea: pick(rnd, AREAS),
        touchPoint: pick(rnd, TOUCHPOINTS),
        assetCategory: pick(rnd, ASSET_CATEGORIES),
        assetName: 'Unit ' + pad(i + 7, 3),
        assetCode: 'AST-2026-' + pad(1000 + i * 7, 4),
        createdOn: '2026-09-' + pad(1 + (i % 14), 2)
      };
    });
  }

  /* --- Dashboard ----------------------------------------------------------- */
  var DASHBOARD = {
    user: 'Ahmad',
    office: 'Head Office',
    stats: [
      { icon: 'inbox', label: 'Actions waiting', value: '10', meta: '1 urgent', tone: 'bad' },
      { icon: 'clock', label: 'Overdue', value: '1', meta: 'past due', tone: 'bad' },
      { icon: 'bolt', label: 'Open incidents', value: '5', meta: '1 critical · 1 SLA', tone: 'bad' },
      { icon: 'folder', label: 'New tasks', value: '3', meta: '6 total', tone: '' },
      { icon: 'trend', label: 'Avg. decision time', value: '4.2h', meta: '↓ 1.1h', tone: 'ok' }
    ],
    rightNow: { title: 'Board review prep', pct: 68, room: 'Conference Room 4B', window: 'Started 12:30 PM · Ends 2:00 PM', next: 'Board review with J. Al-Thani' },
    recommended: {
      id: 'BUD-2026-107',
      title: 'Budget Release — Eid Activation, 360 Mall',
      owner: 'Sara Al-Qahtani',
      dept: 'Marketing',
      amount: 'KWD 42,000',
      why: 'Surfaced first because it is overdue · critical priority · high financial impact.',
      strip: [
        { kicker: 'Critical incident', title: 'POS network outage — 360 Mall', meta: 'SLA breached · 18m over', tone: 'bad' },
        { chip: 'high', title: 'Purchase Approval (PC) — Cinema Projector Units ×2', meta: 'Due today · KWD 28,500' },
        { chip: 'high', title: 'Action Sheet — Crowd Safety Plan, Summer Festival', meta: 'Due 4:00 PM · 6 owners' }
      ]
    },
    queue: [
      { id: 'BUD-2026-107', title: 'Budget Release — Eid Activation, 360 Mall', amount: 'KWD 42,000',
        chips: [['critical','bad'], ['Overdue 2 days','bad'], ['Over by 5.3h','warn']], tone: 'urgent' },
      { id: 'PC-2026-114', title: 'Purchase Approval (PC) — Cinema Projector Units ×2', amount: 'KWD 28,500',
        chips: [['high','bad'], ['Due today','warn']], tone: 'warn' },
      { id: 'AS-2026-121', title: 'Action Sheet — Crowd Safety Plan, Summer Festival', amount: '6 owners',
        chips: [['high','bad'], ['Due 4:00 PM','warn']], tone: 'warn' },
      { id: 'LV-2026-088', title: 'Leave approval — 3 requests pending', amount: 'Operations',
        chips: [['low','info']], tone: '' }
    ],
    incidents: [
      { id: 'INC-2041', title: 'POS network outage — 360 Mall', state: 'Critical', status: 'Investigating', tone: 'bad' },
      { id: 'INC-2039', title: 'Wave pool pump pressure drop', state: 'High', status: 'Assigned', tone: 'warn' },
      { id: 'INC-2035', title: 'Arcade token dispenser jam', state: 'Medium', status: 'In progress', tone: '' },
      { id: 'INC-2030', title: 'CCTV camera offline — Entrance Gate', state: 'Medium', status: 'Pending parts', tone: '' },
      { id: 'INC-2028', title: 'Party room AC not cooling', state: 'Low', status: 'Monitoring', tone: '' }
    ],
    actions: [
      { title: 'Critical incident — POS network outage', meta: '360 Mall — SLA breached · 18m over', tone: 'bad', chip: 'critical' },
      { title: 'Purchase Approval (PC) — Cinema Projector Units ×2', meta: 'Due today · KWD 28,500', tone: 'warn', chip: 'high' },
      { title: 'Action Sheet — Crowd Safety Plan, Summer Festival', meta: 'Due 4:00 PM · 6 owners', tone: 'warn', chip: 'high' },
      { title: 'Budget release — Q4 Maintenance allocation', meta: 'Awaiting your sign-off · KWD 112,000', tone: 'info', chip: 'medium' },
      { title: 'Leave approval — 3 requests pending', meta: 'Operations Department', tone: 'info', chip: 'low' }
    ],
    feed: [
      { text: 'Sarah Johnson completed “Zone A filter replacement”', time: '4 minutes ago', tone: 'ok' },
      { text: 'SLA warning raised on TASK-1002 — POS network outage', time: '18 minutes ago', tone: 'bad' },
      { text: 'Mike Chen commented on the Crowd Safety action sheet', time: '46 minutes ago', tone: 'accent' },
      { text: 'Budget entry template updated by Finance Department', time: '1 hour ago', tone: 'info' },
      { text: 'New task assigned to Emily Davis — Arcade token dispenser jam', time: '2 hours ago', tone: 'accent' }
    ],
    workload: [
      { name: 'Maintenance Department', open: 12, done: 31 },
      { name: 'Operations Department', open: 8, done: 24 },
      { name: 'Safety Department', open: 5, done: 19 },
      { name: 'Guest Services', open: 4, done: 15 },
      { name: 'IT Department', open: 3, done: 11 }
    ]
  };

  /* --- Work Centre sub-sections ------------------------------------------- */
  var WORKCENTRE = {
    categories: [
      { id: 'general', label: 'General', labelAr: 'عام' },
      { id: 'commercial', label: 'Commercial', labelAr: 'تجاري' }
    ],
    subs: {
      general: [
        { id: 'createTask', label: 'Create a New Task', labelAr: 'إنشاء مهمة جديدة' },
        { id: 'tasks', label: 'Tasks', labelAr: 'المهام' },
        { id: 'enquiry', label: 'Enquiry', labelAr: 'استفسار' },
        { id: 'observations', label: 'Observations', labelAr: 'الملاحظات' },
        { id: 'checklists', label: 'Checklists', labelAr: 'قوائم المراجعة' },
        { id: 'snagLists', label: 'Snag Lists', labelAr: 'قوائم الملاحظات الفنية' }
      ],
      commercial: [
        { id: 'priceChange', label: 'Price Change', labelAr: 'تغيير السعر' },
        { id: 'promotions', label: 'Promotions', labelAr: 'العروض' }
      ]
    }
  };

  /* --- Persistence (guarded: file:// pages may have no storage access) ----- */
  var STORE_KEY = 'ihub.vanilla.state.v1';
  function loadPersisted() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function persist(state) {
    try {
      global.localStorage && global.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { /* opaque origin or blocked storage — run in memory only */ }
  }

  /* --- Store --------------------------------------------------------------- */
  var masterCache = {};

  var Store = {
    tasks: buildTasks(),

    prefs: (function () {
      var p = loadPersisted() || {};
      return {
        theme: p.theme || 'paper',
        locale: p.locale || 'en',
        accent: p.accent || 'purple'
      };
    })(),

    savePrefs: function () { persist(this.prefs); },

    /* Master records are generated per master type on first access, then
       cached so edits made in the UI stick for the session. */
    masterRows: function (name) {
      if (!masterCache[name]) masterCache[name] = buildMasterRows(name, 15);
      return masterCache[name];
    },
    addMasterRow: function (name, row) {
      var rows = this.masterRows(name);
      row.seq = rows.length + 1;
      row.id = 'REC-' + pad(rows.length + 1, 3);
      rows.unshift(row);
      return row;
    },
    updateMasterRow: function (name, id, patch) {
      var rows = this.masterRows(name);
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === id) { Object.assign(rows[i], patch); return rows[i]; }
      }
      return null;
    },
    deleteMasterRow: function (name, id) {
      var rows = this.masterRows(name);
      var idx = rows.findIndex(function (r) { return r.id === id; });
      if (idx > -1) rows.splice(idx, 1);
      return idx > -1;
    },

    addTask: function (task) {
      task.id = 'TASK-' + pad(1001 + this.tasks.length, 4);
      task.stage = task.stage || 'Logged';
      task.progress = 0;
      task.sla = 'On Track';
      task.createdOn = new Date().toISOString().slice(0, 10);
      this.tasks.unshift(task);
      return task;
    },
    getTask: function (id) {
      return this.tasks.find(function (t) { return t.id === id; }) || null;
    },
    updateTask: function (id, patch) {
      var t = this.getTask(id);
      if (t) Object.assign(t, patch);
      return t;
    }
  };

  global.Data = {
    NAV: NAV,
    MEGA_COLUMNS: MEGA_COLUMNS,
    MEGA_ITEMS: MEGA_COLUMNS.reduce(function (a, c) { return a.concat(c); }, []),
    MASTER_CATEGORIES: MASTER_CATEGORIES,
    LOCATIONS: LOCATIONS,
    ZONES: ZONES,
    AREAS: AREAS,
    SUBAREAS: SUBAREAS,
    DEPARTMENTS: DEPARTMENTS,
    TASK_TYPES: TASK_TYPES,
    PRIORITIES: PRIORITIES,
    PROJECT_CATEGORIES: PROJECT_CATEGORIES,
    ASSET_CATEGORIES: ASSET_CATEGORIES,
    RISK_CATEGORIES: RISK_CATEGORIES,
    TOUCHPOINTS: TOUCHPOINTS,
    USERS: USERS,
    STAGES: STAGES,
    DASHBOARD: DASHBOARD,
    WORKCENTRE: WORKCENTRE,
    Store: Store
  };
})(window);
