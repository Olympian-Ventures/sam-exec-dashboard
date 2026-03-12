// ============================================
// Strategic Asset Management - Dashboard Data
// Last synced: 2026-03-11
// Sources: Revela (sam.revela.co), Todoist, Gmail
// ============================================

const DASHBOARD_DATA = {

  // --- PAYABLES (from Revela Accounting > Payables) ---
  payables: [
    { date: "03/09/26", invoice: "R3609", description: "Lawn Service", property: "Chesnut Court", vendor: "Green Grass Landscaping", status: "overdue", amount: 150.00, balance: 150.00 },
    { date: "03/09/26", invoice: "R3608", description: "Electric - Acct 6508147002", property: "St. James Plaza", vendor: "Berkeley Electric Coop", status: "overdue", amount: 412.09, balance: 412.09 },
    { date: "03/06/26", invoice: "526", description: "WO#526 Disassembly", property: "900 Johnnie Dodds", vendor: "Strategic Asset Mgmt", status: "overdue", amount: 310.00, balance: 310.00 },
    { date: "03/11/26", invoice: "R3619", description: "Water - Acct 0072361-0027", property: "Ryan Bennett Center", vendor: "Mt Pleasant Water", status: "due-soon", amount: 99.75, balance: 99.75 },
    { date: "03/08/26", invoice: "R3601", description: "Insurance - SCCH07082101", property: "Moultrie Office Park", vendor: "McKay Insurance Co", status: "due-soon", amount: 750.00, balance: 750.00 },
    { date: "03/10/26", invoice: "R3618", description: "WO#526 Disassembly", property: "900 Johnnie Dodds", vendor: "Strategic Asset Mgmt", status: "due-30", amount: 347.50, balance: 347.50 },
    { date: "08/01/26", invoice: "R3247", description: "Pest Control - 856 Low Country", property: "Lowcountry Blvd", vendor: "Terminix Service, Inc.", status: "due-later", amount: 571.00, balance: 571.00 },
    { date: "12/16/26", invoice: "R3221", description: "Insurance - Acct MAYFCOU-01", property: "Mayflower Court HPR", vendor: "Travelers Insurance", status: "due-later", amount: 16655.78, balance: 16655.78 },
    { date: "05/01/26", invoice: "R3116", description: "Electric - Acct 2-2100-8881-9", property: "Moultrie Office Park", vendor: "Dominion Energy", status: "paid", amount: 426.57, balance: 0.00 },
    { date: "03/06/26", invoice: "6787", description: "Maintenance Contract", property: "Lenhart", vendor: "LandOne Group, LLC", status: "paid", amount: 893.00, balance: 0.00 },
    { date: "03/06/26", invoice: "6788", description: "Initial Clean Up", property: "Moultrie Office Park", vendor: "LandOne Group, LLC", status: "paid", amount: 640.00, balance: 0.00 },
    { date: "03/04/26", invoice: "6801610979", description: "Vegetation Management", property: "East Cooper Medical", vendor: "TruGreen", status: "paid", amount: 262.38, balance: 0.00 },
  ],

  // --- PORTFOLIOS (from Revela Portfolios) ---
  portfolios: [
    { name: "48 & 50 Cooper HPR", properties: 1, units: 2, tenants: 2, occupancy: 100 },
    { name: "84 King Council of CoOwners", properties: 1, units: 3, tenants: 5, occupancy: 100 },
    { name: "900 Johnnie Dodds HPR", properties: 1, units: 6, tenants: 7, occupancy: 100 },
    { name: "America & Cooper HOA", properties: 1, units: 1, tenants: 1, occupancy: 100 },
    { name: "Beechwood HPR", properties: 1, units: 4, tenants: 5, occupancy: 100 },
    { name: "Bennett Center", properties: 2, units: 9, tenants: 11, occupancy: 88 },
    { name: "Chesnut Court", properties: 1, units: 10, tenants: 14, occupancy: 100 },
    { name: "Church Creek Landing", properties: 4, units: 68, tenants: 64, occupancy: 51 },
    { name: "Coleman Center", properties: 1, units: 17, tenants: 13, occupancy: 58 },
    { name: "East Cooper Medical Plaza", properties: 1, units: 7, tenants: 7, occupancy: 85 },
    { name: "JLL", properties: 4, units: 5, tenants: 6, occupancy: 100 },
    { name: "Lenhart Park", properties: 1, units: 10, tenants: 14, occupancy: 100 },
    { name: "Parker's Preserve HOA", properties: 1, units: 41, tenants: 50, occupancy: 92 },
    { name: "Queensborough A POA", properties: 1, units: 5, tenants: 4, occupancy: 80 },
    { name: "Queensborough E POA", properties: 1, units: 8, tenants: 11, occupancy: 100 },
    { name: "Queensborough H Village", properties: 1, units: 9, tenants: 14, occupancy: 100 },
    { name: "St James Plaza - NVS", properties: 1, units: 5, tenants: 8, occupancy: 100 },
    { name: "Strategic Asset Mgmt", properties: 1, units: 8, tenants: 0, occupancy: 0 },
    { name: "64 Lenwood POA", properties: 0, units: 0, tenants: 0, occupancy: 0 },
  ],

  // --- VACANCY ALERTS (from Revela Operations Pulse - Available Units) ---
  vacancies: [
    { property: "2239 Parsonage Church", available: 10, vacancy: 28 },
    { property: "852 Lowcountry", available: 6, vacancy: 66 },
    { property: "Boykin Lane (Church Creek)", available: 5, vacancy: 50 },
    { property: "Magi Properties", available: 2, vacancy: 100 },
    { property: "1321 Bennet Center", available: 1, vacancy: 25 },
    { property: "858 Lowcountry Blvd", available: 1, vacancy: 33 },
  ],

  // --- OPEN WORK ORDERS (from Revela Operations Pulse) ---
  workOrders: [
    { title: "Pests at 856 Lowcountry Suite 101", desc: "Animal movement from ceilings - pests appear to be getting in through the roof", age: "6 days ago" },
    { title: "Gate - 100048203842", desc: "Gate repair needed", age: "6 days ago" },
    { title: "Camera Install", desc: "2 hours $642 materials - Camera, solar panel, steel security box, and battery pack install", age: "7 days ago" },
    { title: "Overhead Door - 500087701917", desc: "Overhead door maintenance", age: "14 days ago" },
    { title: "Trashcan", desc: "Lock repair", age: "14 days ago" },
    { title: "Squirrels", desc: "Wildlife issue - squirrel removal follow-up needed", age: "1 month ago" },
  ],

  // --- TODOIST TASKS (from SAM Project - Live) ---
  // Section IDs: Onboarding=6g5r78ppX3x26PcP, Training=6g7rqprqJpH9GC4w, Flows=6g7rqw3rr92MX3Ww
  tasks: {
    urgent: [
      { id: "6g8HXv97QwJgrr4w", content: "Reach Jackie Jourdain re: Queensborough leak", desc: "28 days, ASAP - Hannah tried calling but couldn't reach Jackie. Owner reported a leak.", priority: "p1", due: "2026-03-11", assignee: null },
      { id: "6g8HXvCxRvprXJGP", content: "Reply to Parkway Associates", desc: "Past due invoices + 2026 invoice request + check #5147 dispute", priority: "p1", due: "2026-03-11", assignee: null },
      { id: "6g8HXvJ78rmPR9Ww", content: "Chase Ye Old Fashioned - $5,435.21 Feb rent", desc: "Largest single outstanding balance. Sent 02/19, no reply after 20 days.", priority: "p1", due: "2026-03-11", assignee: null },
      { id: "6g8HXvPHXrGV6qww", content: "Respond to Jimmy Bailey - HVAC vs POA confusion", desc: "Says payment is for individual HVAC maintenance, not POA. 11 days no reply.", priority: "p1", due: "2026-03-11", assignee: null },
    ],
    high: [
      { id: "6g8Hc25GcMPhfqjw", content: "Resolve Ariel Properties overcharging ($448.50 vs $433.33)", desc: "Claims overcharging. Screenshots as proof. Raised 3 times.", priority: "p2", due: "2026-03-13", assignee: null },
      { id: "6g8Hc2cgRHrgW8jw", content: "Follow up Dec 2025 unpaid invoices", desc: "5 accounts, $7,210+ - Scott Kearney, Barnwell INC, Q23 LLC, Queensborough F, Nick Skover", priority: "p2", due: "2026-03-13", assignee: null },
      { id: "6g8Hc37RxQMFF5Mw", content: "Address Brett Wagner double HOA dues", desc: "Paying ~$240 for 6 years and seeing doubled charges.", priority: "p2", due: "2026-03-13", assignee: null },
      { id: "6g8Hc3jXQhxrhvQw", content: "Verify Ariel Properties landscaping fix", desc: "Stuart admitted missed message (02/23). Also mulch Ticket 282.", priority: "p2", due: "2026-03-13", assignee: null },
      { id: "6g7rqjv9cM6MG8Jw", content: "Create Pitch Sheet for Maintenance", desc: "Only clients. Buffalo Wings needs one.", priority: "p2", assignee: "Steph" },
      { id: "6g8HVFVCf49fMGJw", content: "Revela Emails - scrape & summarize", desc: "Use Claude to scrape emails and give summary and action items.", priority: "p2", due: "2026-03-13", assignee: "Steph" },
      { id: "6g5r7X4W9vWXWG4P", content: "Cert Course - Prop Mgmt", desc: "Take course, pass, provide cert to Stu.", priority: "p2", assignee: "Steph" },
      { id: "6g8HfVQCJcFpVGqP", content: "Revela Access", desc: "Steph can log in but no data populated. Need group access.", priority: "p2", assignee: "Stuart" },
    ],
    medium: [
      { id: "6g8Hc3pJcCprVcjP", content: "Confirm 9 mailing address changes processed", desc: "Samantha Waters, Taylor Lenhart, Sharon Freeman + 6 more.", priority: "p3", due: "2026-03-13" },
      { id: "6g8Hc3xWM2pmh4fP", content: "Check Periwinkle Properties portal", desc: "Missing Nov reconciliation docs. Also review financials & stucco repair quote.", priority: "p3", due: "2026-03-13" },
      { id: "6g8Hc5GPXr6vJmmw", content: "Ron Thayer RK Properties - plumbing", desc: "Plumbing issue impacting 6 units/4 tenants. Invoice attached.", priority: "p3", due: "2026-03-13" },
      { id: "6g8Hc5Hm85Fc589P", content: "Charleston Chiropractor - painting schedule", desc: "Planning to paint back of 3 buildings. Also tree removal notice.", priority: "p3", due: "2026-03-23" },
      { id: "6g8Hc5PGhM5QwGRP", content: "Kenny Betancourt - wrong address/dues on portal", desc: "Address showing incorrectly, wrong dues amount.", priority: "p3", due: "2026-03-13" },
      { id: "6g8Hc5McFh73MWVw", content: "Emily Nolan - unpaid invoices", desc: "Stuart advised 10% off on resent final invoice. Confirm resolution.", priority: "p3", due: "2026-03-13" },
    ],
    other: [
      { id: "6g8Hmrx2c7GpFQ3P", content: "1 Carriage Lane Trash Bill", desc: "Switch trash bill from old address to new address.", priority: "p4" },
      { id: "6g7rqqf6Hw7whw3P", content: "JobTread Training", desc: "Training module.", priority: "p4", section: "Training" },
      { id: "6g7rqr6fw3p5WxVw", content: "Revela Training", desc: "Training module.", priority: "p4", section: "Training" },
      { id: "6g7rqrHvjxF9f8HP", content: "Quickbooks Training", desc: "Training module.", priority: "p4", section: "Training" },
      { id: "6g7rqxhGVWcHpQMP", content: "Identify Manual Processes for Automation/AI", desc: "Flows section.", priority: "p4", section: "Flows" },
      { id: "6g8Hc5V9Q8vjwjFw", content: "Verify older maintenance items completed", desc: "Woodpecker stucco, window awnings, carpet, drain backup, AC platform.", priority: "p4", due: "2026-03-23" },
      { id: "6g7rvCX6CWq95xfw", content: "Get Access to Quo", desc: "Onboarding.", priority: "p4" },
    ]
  },

  // --- RECEIVABLES AT RISK (derived from Todoist urgent items) ---
  receivablesAtRisk: [
    { tenant: "Ye Old Fashioned", amount: 5435.21, daysLate: 20, property: "N/A", note: "Largest outstanding - no reply" },
    { tenant: "Parkway Associates", amount: 0, daysLate: 28, property: "N/A", note: "Past due invoices + check #5147 dispute" },
    { tenant: "Scott Kearney", amount: 2488.50, daysLate: 90, property: "N/A", note: "Dec 2025 unpaid" },
    { tenant: "Barnwell INC", amount: 2065.44, daysLate: 90, property: "N/A", note: "Dec 2025 unpaid" },
    { tenant: "Q23 LLC", amount: 1115.48, daysLate: 90, property: "N/A", note: "Dec 2025 unpaid" },
    { tenant: "Queensborough F", amount: 939.16, daysLate: 90, property: "N/A", note: "Dec 2025 unpaid" },
    { tenant: "Nick Skover", amount: 602.18, daysLate: 90, property: "N/A", note: "Dec 2025 unpaid" },
    { tenant: "Ariel Properties", amount: 15.17, daysLate: 60, property: "N/A", note: "Overcharging dispute $448.50 vs $433.33" },
  ],

  // --- COMPLAINTS / ISSUES ---
  complaints: [
    { from: "Jackie Jourdain", property: "Queensborough", issue: "Roof leak - 28 days unresolved", severity: "critical", daysOpen: 28 },
    { from: "Jimmy Bailey", property: "N/A", issue: "HVAC vs POA payment confusion", severity: "high", daysOpen: 11 },
    { from: "Brett Wagner", property: "N/A", issue: "Double HOA dues for 6 years", severity: "high", daysOpen: 67 },
    { from: "Ariel Properties", property: "N/A", issue: "Overcharging + landscaping not fixed", severity: "medium", daysOpen: 60 },
    { from: "Kenny Betancourt", property: "N/A", issue: "Wrong address and dues on portal", severity: "medium", daysOpen: 65 },
    { from: "Ron Thayer / RK Properties", property: "N/A", issue: "Plumbing impacting 6 units / 4 tenants", severity: "high", daysOpen: 44 },
  ],

  // --- RECENT COMMUNICATIONS (from Gmail) ---
  communications: [
    {
      from: "Luke Mancini",
      initials: "LM",
      subject: "SAM Proposal 2026-001-1 (Draft for Approval)",
      snippet: "Job Cruz - Water Damage Repair at 1432 Water Oak Cut, Mt Pleasant, SC 29466",
      date: "Feb 24, 2026",
      labels: ["starred", "inbox"],
    },
  ],

  // --- SUMMARY METRICS ---
  metrics: {
    totalOccupancy: 76.68,
    occupancyTrend: 2.8,
    totalVacant: 59,
    openWorkOrders: 12,
    overduePayables: 872.09,
    overdueCount: 3,
    dueSoonTotal: 849.75,
    dueSoonCount: 2,
    totalOutstanding: 19346.03,
    urgentTasks: 4,
    highTasks: 8,
    openTasks: 33,
    openComplaints: 6,
    receivablesAtRisk: 12661.14,
  }
};
