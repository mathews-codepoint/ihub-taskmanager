// Shared demo data used across screens.

const APPROVALS = [{
  id: 1,
  title: 'Q2 Marketing Budget Increase',
  requester: 'Sara Al-Qahtani',
  department: 'Marketing',
  age: '2h',
  amount: 'KWD 23k',
  priority: 'high',
  icon: 'dollar',
  reason: 'Increase reflects the Ramadan campaign brief approved by Brand last week. Allocates 65% to digital, 25% to OOH, 10% contingency. Pre-cleared with Finance — needs your sign-off before Monday procurement cycle.'
}, {
  id: 2,
  title: 'Overtime — Mall Operations Team',
  requester: 'Khaled Ibrahim',
  department: 'Operations',
  age: '5h',
  amount: '34 hrs',
  priority: 'med',
  icon: 'clock',
  reason: 'Weekend inventory reconciliation across SAMA Mall and Riyadh Park. 8 team members, capped at 4.25 hrs each. Within monthly OT budget (72% utilized).'
}, {
  id: 3,
  title: 'Vendor Contract — Cleaning Services',
  requester: 'Procurement',
  department: 'Procurement',
  age: '1d',
  amount: 'KWD 100k',
  priority: 'high',
  icon: 'shield',
  reason: '24-month renewal with Nasim Facility. 6% rate increase indexed to inflation; service-level tightened (response SLA 2h → 45m). Legal reviewed.'
}, {
  id: 4,
  title: 'Leave Request — 12 days',
  requester: 'Mohammed Al-Otaibi',
  department: 'Finance',
  age: '1d',
  amount: '12 days',
  priority: 'low',
  icon: 'calendar',
  reason: 'Annual leave, Jun 5–17. Coverage plan attached: handoff to Rania during close window; return before Q2 reporting.'
}, {
  id: 5,
  title: 'New Hire Requisition — Senior Analyst',
  requester: 'HR',
  department: 'HR',
  age: '2d',
  amount: 'KWD 1.8k/mo',
  priority: 'med',
  icon: 'users',
  reason: 'Backfill for A. Nasser (resigned). Role slotted against approved Q1 headcount plan. Shortlist includes 3 internal referrals.'
}, {
  id: 6,
  title: 'Expense Report — Travel, March',
  requester: 'Layla Haddad',
  department: 'Business Dev.',
  age: '3d',
  amount: 'KWD 1,180',
  priority: 'low',
  icon: 'receipt',
  reason: 'Doha summit + 2 client visits. All receipts attached. Within per-diem policy.'
}];
const TEAM = [{
  name: 'Sara Al-Qahtani',
  role: 'Marketing Lead',
  status: 'in',
  metric: '97%',
  avatar: null,
  location: 'SAMA Mall'
}, {
  name: 'Khaled Ibrahim',
  role: 'Ops Supervisor',
  status: 'in',
  metric: '94%',
  avatar: null,
  location: 'Riyadh Park'
}, {
  name: 'Mohammed Al-Otaibi',
  role: 'Finance Analyst',
  status: 'leave',
  metric: '—',
  avatar: null,
  location: 'Remote'
}, {
  name: 'Rania Farouk',
  role: 'HR Business Partner',
  status: 'in',
  metric: '99%',
  avatar: null,
  location: 'HQ'
}, {
  name: 'Yazan Malik',
  role: 'IT Lead',
  status: 'remote',
  metric: '91%',
  avatar: null,
  location: 'Remote'
}, {
  name: 'Nour Al-Sabah',
  role: 'Brand Designer',
  status: 'in',
  metric: '96%',
  avatar: null,
  location: 'HQ'
}, {
  name: 'Layla Haddad',
  role: 'BD Manager',
  status: 'travel',
  metric: '88%',
  avatar: null,
  location: 'Doha'
}, {
  name: 'Tareq Nasser',
  role: 'Senior Developer',
  status: 'in',
  metric: '93%',
  avatar: null,
  location: 'HQ'
}];
const ANNOUNCEMENTS = [{
  title: 'Q2 all-hands — Thursday 2 PM',
  tag: 'Event',
  body: 'CEO keynote + regional updates from every mall GM. Livestream for remote teams.',
  time: '3h'
}, {
  title: 'New expense policy effective May 1',
  tag: 'Policy',
  body: 'Per-diem rates updated. Travel pre-approval threshold raised from 400 to 800 KWD.',
  time: '1d'
}, {
  title: 'Ramadan working hours',
  tag: 'HR',
  body: 'Core hours 10:00 AM–4:00 PM. Flexible start between 9:00 AM and 11:00 AM.',
  time: '2d'
}];
const CALENDAR_EVENTS = [{
  day: 19,
  title: "Today — Board review",
  time: '2:00 PM'
}, {
  day: 21,
  title: 'Q2 All-Hands',
  time: '2:00 PM'
}, {
  day: 22,
  title: '1:1 with Sara',
  time: '10:30 AM'
}, {
  day: 24,
  title: 'Budget lockdown',
  time: 'All day'
}, {
  day: 28,
  title: 'HR policy rollout',
  time: '9:00 AM'
}];
Object.assign(window, {
  APPROVALS,
  TEAM,
  ANNOUNCEMENTS,
  CALENDAR_EVENTS
});