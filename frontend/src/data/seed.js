export const INITIAL_MODULES = [
  {
    id: 1,
    title: 'Psychological Tactics',
    description: 'Learn to identify manipulation techniques',
    progress: 85,
    rating: 4.8,
    icon: 'Brain'
  },
  {
    id: 2,
    title: 'BiTB Awareness',
    description: 'Browser-in-the-Browser attack detection',
    progress: 60,
    rating: 4.8,
    icon: 'Shield'
  },
  {
    id: 3,
    title: 'Deceptive Links 101',
    description: 'Spot malicious URLs and domains',
    progress: 92,
    rating: 4.8,
    icon: 'Link'
  },
  {
    id: 4,
    title: 'Email Security',
    description: 'Advanced email threat recognition',
    progress: 45,
    rating: 4.8,
    icon: 'Mail'
  }
];

export const INITIAL_SIMULATIONS = [
  { id: 1, slug: 'psychological-tactics', title: 'Psychological Tactics', description: 'Analyze this email and decide: Is it a legitimate request or a manipulation attempt?', progress: 0, rating: 4.8, icon: 'Brain' },
  { id: 2, slug: 'bitb-awareness', title: 'BiTB Awareness', description: 'Examine this browser window. Can you spot anything unusual?', progress: 0, rating: 4.8, icon: 'Globe' },
  { id: 3, slug: 'deceptive-links-101', title: 'Deceptive Links 101', description: 'Before you click, examine this link. Is it safe or suspicious?', progress: 0, rating: 4.9, icon: 'Link' },
  { id: 4, slug: 'credential-harvesting', title: 'Credential Harvesting', description: 'Review this login page carefully. Would you enter your credentials?', progress: 0, rating: 4.6, icon: 'UserSecret' },
  { id: 5, slug: 'spear-phishing', title: 'Spear Phishing', description: 'This email knows your name and role. Does that make it trustworthy?', progress: 0, rating: 4.7, icon: 'Bullseye' },
  { id: 6, slug: 'ceo-fraud-detection', title: 'CEO Fraud Detection', description: 'Urgent request from your CEO. Would you comply or verify?', progress: 0, rating: 4.9, icon: 'Envelope' },
  { id: 7, slug: 'quishing-tactics', title: 'Quishing Tactics', description: 'Scan this QR code? Think twice. What could be hidden behind it?', progress: 0, rating: 4.5, icon: 'Qrcode' },
  { id: 8, slug: 'vishing-tactics', title: 'Vishing Tactics', description: 'Listen to this voicemail. Would you call back?', progress: 0, rating: 4.4, icon: 'Phone' },
  { id: 9, slug: 'watering-hole-attack', title: 'Watering Hole Attack', description: 'This website looks normal. Can you spot the hidden danger?', progress: 0, rating: 4.6, icon: 'Shield' }
];

export const MOCK_USER = {
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  resilienceScore: 78,
  stats: {
    simulationsCompleted: 24,
    phishDetected: 18,
    modulesFinished: 7
  }
};

export const ADMIN_STATS = {
  totalUsers: 1247,
  activeUsers: 1089,
  avgDetectionRate: 78,
  detectionRate: 78,
  reportingRate: 65,
  incidentsReported: 23,
  orgResilienceScore: 73,
};

export const MOCK_USERS = [
  { id: 1, name: 'Alice Tan', email: 'alice.tan@edunet.org', role: 'End User', department: 'Operations', status: 'Active' },
  { id: 2, name: 'Jordan Lim', email: 'jordan.lim@cybersecmail.com', role: 'Admin', department: 'IT', status: 'Active' },
  { id: 3, name: 'Priya Sharma', email: 'priya.sharma@flagit.org', role: 'End User', department: 'HR', status: 'Active' },
  { id: 4, name: 'Muhammad Iqbal', email: 'm.iqbal@securecorp.com', role: 'AI Maintainer', department: 'Engineering', status: 'Active' },
  { id: 5, name: 'Emily Wong', email: 'emily.w@edunet.org', role: 'End User', department: 'Finance', status: 'Active' },
  { id: 6, name: 'John Reyes', email: 'j.reyes@flagit.org', role: 'Admin', department: 'IT', status: 'Active' },
  { id: 7, name: 'Sarah Ng', email: 'sarah.ng@cybermail.com', role: 'End User', department: 'Operations', status: 'Active' },
  { id: 8, name: 'Daniel Chow', email: 'dan.chow@mlops.ai', role: 'AI Maintainer', department: 'Engineering', status: 'Active' },
  { id: 9, name: 'Hafiz Rahman', email: 'hafiz.r@orgmail.com', role: 'End User', department: 'Sales', status: 'Inactive' }
];

export const ACTIVE_CAMPAIGNS = [
  { id: 1, name: 'Q4 Phishing Awareness', targetGroup: 'All Employees', scenarioType: 'Phishing Email', schedule: '2024-01-15', status: 'Active', progress: 75 },
  { id: 2, name: 'Executive Social Engineering', targetGroup: 'C-Suite', scenarioType: 'Social Engineering', schedule: '2024-01-10', status: 'Active', progress: 45 },
  { id: 3, name: 'IT Department Malware Training', targetGroup: 'IT Department', scenarioType: 'Malware Detection', schedule: '2024-01-05', status: 'Active', progress: 90 }
];

export const PAST_CAMPAIGNS = [
  { id: 4, name: 'Holiday Security Awareness', targetGroup: 'All Employees', scenarioType: 'Phishing Email', schedule: '2023-12-01', status: 'Completed', progress: 100 },
  { id: 5, name: 'New Hire Onboarding Security', targetGroup: 'New Hires', scenarioType: 'Mixed Scenarios', schedule: '2023-11-15', status: 'Completed', progress: 100 }
];

export const REPORT_TRENDS = [
  { w: 'Week 1', total: 110, detected: 80, reported: 70 },
  { w: 'Week 2', total: 125, detected: 90, reported: 85 },
  { w: 'Week 3', total: 155, detected: 110, reported: 95 },
  { w: 'Week 4', total: 175, detected: 140, reported: 120 },
  { w: 'Week 5', total: 190, detected: 155, reported: 135 },
  { w: 'Week 6', total: 215, detected: 175, reported: 155 },
  { w: 'Week 7', total: 230, detected: 193, reported: 171 },
];

export const AI_MODELS = [
  { id: 1, name: 'Phishing Classifier', status: 'Active', version: 'v2.4.1', date: '2024-01-15 14:32', description: 'Advanced ML model for detecting phishing emails and malicious content patterns', metrics: { accuracy: 94.2, precision: 92.8, recall: 95.1, f1: 93.9 } },
  { id: 2, name: 'Psychological Detector', status: 'Training', version: 'v1.8.3', date: '2024-01-14 09:15', description: 'Behavioral analysis model for identifying psychological manipulation techniques', metrics: { accuracy: 87.6, precision: 89.2, recall: 85.4, f1: 87.3 } },
  { id: 3, name: 'BiTB Detector', status: 'Active', version: 'v3.1.0', date: '2024-01-13 16:47', description: 'Browser-in-the-Browser attack detection and prevention system', metrics: { accuracy: 91.8, precision: 90.5, recall: 93.2, f1: 91.8 } },
  { id: 4, name: 'Visual Deception Detector', status: 'Training', version: 'v2.0.1', date: '2024-01-28 14:30', description: 'Computer vision model that detects visual spoofing cues like cloned branding, fake logos, or deceptive UI elements.', metrics: { accuracy: 86.4, precision: 87.7, recall: 84.3, f1: 85.0 } }
];

export const AI_DATASETS = [
  { id: 1, name: 'Phish Corpus', description: 'Comprehensive phishing email dataset with labeled examples', tags: ['CSV', 'JSON'], size: '2.4 GB', records: '1,247,832', date: '2024-01-15 14:32', source: 'API', status: 'Active' },
  { id: 2, name: 'Legit Emails', description: 'Legitimate email samples for training classification models', tags: ['CSV'], size: '1.8 GB', records: '892,156', date: '2024-01-15 12:18', source: 'Manual Upload', status: 'Active' },
  { id: 3, name: 'BiTB Samples', description: 'Browser-in-the-Browser attack samples and variations', tags: ['JSON', 'HTML'], size: '512 MB', records: '45,892', date: '2024-01-14 16:47', source: 'Web Scraping', status: 'Processing' },
  { id: 4, name: 'Social Engineering Corpus', description: 'Social engineering attack patterns and psychological manipulation techniques', tags: ['CSV', 'JSON'], size: '3.1 GB', records: '1,892,445', date: '2024-01-13 09:22', source: 'API', status: 'Active' },
  { id: 5, name: 'URL Blacklist', description: 'Malicious URL database with threat intelligence feeds', tags: ['TXT', 'JSON'], size: '156 MB', records: '234,567', date: '2024-01-12 18:35', source: 'External Feed', status: 'Active' },
  { id: 6, name: 'Clean Web Content', description: 'Legitimate web content for training content classification models', tags: ['HTML', 'JSON'], size: '4.2 GB', records: '2,156,789', date: '2024-01-11 14:12', source: 'Web Scraping', status: 'Active' }
];
