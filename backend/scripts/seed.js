/**
 * FlagIt Database Seeder
 *
 * Seeds MongoDB with sample data mirroring the frontend seed.js.
 *
 * Usage: npm run seed
 *    or: node scripts/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Models
const User = require('../models/User');
const Module = require('../models/Module');
const Simulation = require('../models/Simulation');
const Campaign = require('../models/Campaign');
const AIModel = require('../models/AIModel');
const Dataset = require('../models/Dataset');

// ── Seed Data ───────────────────────────────────────────────

const users = [
  {
    name: 'Tariq User',
    email: 'flagit@gmail.com',
    password: 'Pilon123',
    role: 'user',
    department: 'Operations',
    status: 'Active',
    resilienceScore: 72,
    stats: { simulationsCompleted: 12, phishDetected: 9, modulesFinished: 3 },
  },
  {
    name: 'Admin Tariq',
    email: 'admin@flagit.com',
    password: 'Pilon123',
    role: 'admin',
    department: 'IT',
    status: 'Active',
    resilienceScore: 85,
    stats: { simulationsCompleted: 20, phishDetected: 18, modulesFinished: 5 },
  },
  {
    name: 'AI Maintainer',
    email: 'ai@flagit.com',
    password: 'Pilon123',
    role: 'ai_maintainer',
    department: 'Engineering',
    status: 'Active',
    resilienceScore: 90,
    stats: { simulationsCompleted: 30, phishDetected: 28, modulesFinished: 6 },
  },
  {
    name: 'Jane Doe',
    email: 'jane@company.com',
    password: 'Password123',
    role: 'user',
    department: 'HR',
    status: 'Active',
    resilienceScore: 65,
    stats: { simulationsCompleted: 8, phishDetected: 5, modulesFinished: 2 },
  },
  {
    name: 'Mark Johnson',
    email: 'mark@company.com',
    password: 'Password123',
    role: 'user',
    department: 'Finance',
    status: 'Active',
    resilienceScore: 50,
    stats: { simulationsCompleted: 5, phishDetected: 3, modulesFinished: 1 },
  },
  {
    name: 'Sarah Lee',
    email: 'sarah@company.com',
    password: 'Password123',
    role: 'user',
    department: 'Marketing',
    status: 'Inactive',
    resilienceScore: 42,
    stats: { simulationsCompleted: 3, phishDetected: 1, modulesFinished: 0 },
  },
];

const modules = [
  {
    title: 'Psychological Tactics',
    description: 'Learn to recognize social engineering manipulation techniques used in phishing.',
    icon: 'Brain',
    difficulty: 'Intermediate',
    duration: '15 min',
    rating: 4.8,
    isFeatured: true,
    tags: ['popular'],
  },
  {
    title: 'URL & Domain Analysis',
    description: 'Master the art of inspecting links and domains for suspicious indicators.',
    icon: 'Link',
    difficulty: 'Beginner',
    duration: '10 min',
    rating: 4.6,
    isFeatured: true,
    tags: ['new'],
  },
  {
    title: 'Email Header Inspection',
    description: 'Understand email headers to identify spoofed senders and routing anomalies.',
    icon: 'Mail',
    difficulty: 'Advanced',
    duration: '20 min',
    rating: 4.5,
    isFeatured: false,
    tags: [],
  },
  {
    title: 'Defense Strategies',
    description: 'Build robust personal and organizational defenses against phishing attacks.',
    icon: 'Shield',
    difficulty: 'Intermediate',
    duration: '15 min',
    rating: 4.7,
    isFeatured: true,
    tags: ['popular'],
  },
];

const simulations = [
  {
    title: 'Psychological Tactics',
    description: 'Analyze this email and decide: Is it a legitimate request or a manipulation attempt?',
    icon: 'Brain',
    rating: 4.8,
    difficulty: 'Beginner',
    tags: ['NEW'],
    playCount: 12,
    isPhishing: true,
    timeLimit: 720,
    emailContent: {
      senderName: 'IT Help Desk',
      senderEmail: 'helpdesk@company-support-portal.com',
      subject: 'ACTION REQUIRED: Verify Your Identity to Avoid Account Suspension',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
<div style="background-color: #1a365d; padding: 20px; color: white; text-align: center;">
<h1>IT Help Desk - Account Verification</h1>
</div>
<div style="padding: 20px;">
<p>Dear Employee,</p>
<p>We have detected unusual activity on your corporate account. As part of our security protocol, you must verify your identity within <strong>12 hours</strong> or your account will be temporarily suspended.</p>
<p>Please click the link below to verify your credentials:</p>
<p><a href="#" style="background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Now</a></p>
<p style="font-size: 12px; color: #666;">This is an automated message. Do not reply directly.</p>
</div>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Suspicious Domain', description: 'The sender domain "company-support-portal.com" is not the real corporate domain.' },
        { type: 'psychological', title: 'Urgency & Time Pressure', description: 'Creates false urgency with a 12-hour deadline.' },
        { type: 'psychological', title: 'Fear & Consequences', description: 'Threatens account suspension to compel action.' },
        { type: 'psychological', title: 'Authority Impersonation', description: 'Pretends to be from "IT Help Desk".' },
      ],
    },
  },
  {
    title: 'Credential Harvesting',
    description: 'Review this login page carefully. Would you enter your credentials?',
    icon: 'UserSecret',
    rating: 4.6,
    difficulty: 'Beginner',
    tags: [],
    playCount: 45,
    isPhishing: true,
    timeLimit: 600,
    emailContent: {
      senderName: 'Microsoft Security Team',
      senderEmail: 'security-alerts@microsft-security.com',
      subject: 'URGENT: Unusual Sign-in Activity Detected on Your Account',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
<div style="background-color: #0078d4; padding: 20px; color: white; text-align: center;">
<h1>Microsoft Account Security Alert</h1>
</div>
<div style="padding: 20px;">
<p>Dear User,</p>
<p>We detected an unusual sign-in attempt on your Microsoft account from:</p>
<ul>
<li><strong>Location:</strong> Moscow, Russia</li>
<li><strong>Device:</strong> Unknown Windows PC</li>
<li><strong>Time:</strong> ${new Date().toISOString()}</li>
</ul>
<p>If this wasn't you, your account may be compromised. <strong>IMMEDIATE ACTION REQUIRED</strong> — verify your identity within 24 hours or your account will be suspended.</p>
<p><a href="#" style="background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Your Identity Now</a></p>
<p style="font-size: 12px; color: #666;">If you do not verify within 24 hours, access to Office 365, OneDrive, and Teams will be revoked.</p>
</div>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Suspicious Domain', description: 'The sender domain "microsft-security.com" is missing the \'o\' in Microsoft.' },
        { type: 'technical', title: 'External Sender Warning', description: 'The email was flagged as "External" yet claims to be from Microsoft Security.' },
        { type: 'technical', title: 'Suspicious Links', description: 'The verification link points to a non-Microsoft domain.' },
        { type: 'psychological', title: 'Urgency & Time Pressure', description: 'Creates false urgency with a "24 hours" deadline.' },
        { type: 'psychological', title: 'Authority Impersonation', description: 'Pretends to be from "Microsoft Security Team".' },
        { type: 'psychological', title: 'Fear & Consequences', description: 'Threatens account suspension and loss of access.' },
      ],
    },
  },
  {
    title: 'BiTB Awareness',
    description: 'Examine this browser window. Can you spot anything unusual?',
    icon: 'Globe',
    rating: 4.8,
    difficulty: 'Intermediate',
    tags: ['POPULAR'],
    playCount: 120,
    isPhishing: true,
    timeLimit: 900,
    emailContent: {
      senderName: 'Google Workspace',
      senderEmail: 'workspace-noreply@google-apps-auth.com',
      subject: 'Sign in to Continue to Google Drive',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
<div style="background-color: #4285f4; padding: 20px; color: white; text-align: center;">
<h1>Google Workspace</h1>
</div>
<div style="padding: 20px;">
<p>Hi,</p>
<p>Someone shared a document with you on Google Drive. To view the file, please sign in with your Google account.</p>
<p><a href="#" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Open in Google Drive</a></p>
<p style="font-size: 12px; color: #666;">This link will open a secure sign-in window.</p>
</div>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Fake Login Window', description: 'The sign-in popup is actually rendered inside the page (Browser-in-the-Browser attack).' },
        { type: 'technical', title: 'Spoofed Domain', description: 'The domain "google-apps-auth.com" is not owned by Google.' },
        { type: 'psychological', title: 'Trust Exploitation', description: 'Leverages the trust users place in familiar Google sign-in windows.' },
      ],
    },
  },
  {
    title: 'Deceptive Links 101',
    description: 'Before you click, examine this link. Is it safe or suspicious?',
    icon: 'Link',
    rating: 4.9,
    difficulty: 'Beginner',
    tags: [],
    playCount: 88,
    isPhishing: true,
    timeLimit: 480,
    emailContent: {
      senderName: 'PayPal Customer Service',
      senderEmail: 'service@paypa1-resolution.com',
      subject: 'Your PayPal Account Has Been Limited',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
<div style="background-color: #003087; padding: 20px; color: white; text-align: center;">
<h1>PayPal</h1>
</div>
<div style="padding: 20px;">
<p>Dear Customer,</p>
<p>We've noticed some unusual activity on your PayPal account. Your account access has been limited until you verify your information.</p>
<p>Click below to restore full access:</p>
<p><a href="#" style="background-color: #0070ba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Restore Account Access</a></p>
<p style="font-size: 12px; color: #666;">If you don't verify within 48 hours, your account will be permanently restricted.</p>
</div>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Lookalike Domain', description: 'The domain "paypa1-resolution.com" uses the number "1" instead of the letter "l".' },
        { type: 'technical', title: 'Hover Mismatch', description: 'The displayed link text doesn\'t match the actual URL destination.' },
        { type: 'psychological', title: 'Fear', description: 'Threatens permanent account restriction.' },
        { type: 'psychological', title: 'Urgency', description: 'Imposes a 48-hour deadline.' },
      ],
    },
  },
  {
    title: 'Spear Phishing',
    description: 'This email knows your name and role. Does that make it trustworthy?',
    icon: 'Bullseye',
    rating: 4.7,
    difficulty: 'Advanced',
    tags: [],
    playCount: 32,
    isPhishing: true,
    timeLimit: 1200,
    emailContent: {
      senderName: 'David Chen, CFO',
      senderEmail: 'd.chen@companycorp-finance.com',
      subject: 'Quick Favor - Confidential Wire Transfer',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Hi,</p>
<p>I'm in a meeting and can't talk right now. I need you to process an urgent wire transfer for a confidential acquisition we're finalizing today.</p>
<p><strong>Amount:</strong> $47,500.00<br/>
<strong>Recipient:</strong> Apex Holdings LLC<br/>
<strong>Account:</strong> 8834-2291-0057<br/>
<strong>Routing:</strong> 021000089</p>
<p>Please process this ASAP and confirm once done. Don't discuss this with anyone — it's confidential until the deal closes.</p>
<p>Thanks,<br/>David Chen<br/>Chief Financial Officer</p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'External Domain', description: 'The sender uses "companycorp-finance.com" instead of the real company domain.' },
        { type: 'psychological', title: 'Authority', description: 'Impersonates a C-level executive (CFO).' },
        { type: 'psychological', title: 'Secrecy', description: 'Insists on confidentiality to prevent verification.' },
        { type: 'psychological', title: 'Urgency', description: 'Pressures immediate action with "ASAP".' },
      ],
    },
  },
  {
    title: 'Quishing Tactics',
    description: 'Scan this QR code? Think twice. What could be hidden behind it?',
    icon: 'Qrcode',
    rating: 4.5,
    difficulty: 'Intermediate',
    tags: [],
    playCount: 19,
    isPhishing: true,
    timeLimit: 720,
    emailContent: {
      senderName: 'Facilities Management',
      senderEmail: 'facilities@building-mgmt-portal.com',
      subject: 'Updated Parking Registration - QR Code Enclosed',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Dear Tenant,</p>
<p>As part of our new digital parking system, all employees must re-register their vehicles by scanning the QR code below.</p>
<p style="text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">[QR Code Image Placeholder]</p>
<p>Please complete registration by end of this week to avoid parking violations.</p>
<p>Thank you,<br/>Building Facilities Team</p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'QR Code Danger', description: 'QR codes can redirect to any URL — you cannot verify the destination before scanning.' },
        { type: 'technical', title: 'Unknown Sender Domain', description: 'The domain "building-mgmt-portal.com" is not a recognized company domain.' },
        { type: 'psychological', title: 'Routine Disguise', description: 'Disguises the attack as a routine administrative task.' },
        { type: 'psychological', title: 'Mild Urgency', description: 'Imposes an end-of-week deadline.' },
      ],
    },
  },
  {
    title: 'Vishing Tactics',
    description: 'Listen to this voicemail. Would you call back?',
    icon: 'Phone',
    rating: 4.4,
    difficulty: 'Intermediate',
    tags: [],
    playCount: 15,
    isPhishing: true,
    timeLimit: 900,
    emailContent: {
      senderName: 'Bank Security Department',
      senderEmail: 'alerts@secure-banknotify.com',
      subject: 'Voicemail: Urgent Call About Your Account',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>You have a new voicemail from your bank's security department:</p>
<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
<p><em>"This is the fraud prevention department. We've detected suspicious transactions on your account ending in 4829. Your account has been temporarily frozen. Please call us back immediately at 1-800-555-0199 to verify your identity and restore access."</em></p>
</div>
<p><a href="#" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Listen to Full Voicemail</a></p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Fake Callback Number', description: 'The phone number leads to scammers, not your real bank.' },
        { type: 'technical', title: 'Spoofed Email Domain', description: 'The domain "secure-banknotify.com" is not a real bank domain.' },
        { type: 'psychological', title: 'Fear', description: 'Claims your account is frozen to trigger panic.' },
        { type: 'psychological', title: 'Urgency', description: 'Pressures you to call back "immediately".' },
      ],
    },
  },
  {
    title: 'Watering Hole Attack',
    description: 'This website looks normal. Can you spot the hidden danger?',
    icon: 'Shield',
    rating: 4.6,
    difficulty: 'Advanced',
    tags: [],
    playCount: 8,
    isPhishing: true,
    timeLimit: 1080,
    emailContent: {
      senderName: 'Industry Newsletter',
      senderEmail: 'newsletter@techinsider-daily.com',
      subject: 'Breaking: Major Security Vulnerability Discovered',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Dear Security Professional,</p>
<p>A critical zero-day vulnerability has been discovered affecting major enterprise systems. Read the full analysis and recommended patches on our blog:</p>
<p><a href="#" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Read Full Analysis</a></p>
<p style="font-size: 12px; color: #666;">This article is trending in the cybersecurity community.</p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Compromised Website', description: 'The linked blog has been compromised with a drive-by download exploit.' },
        { type: 'technical', title: 'Unknown Domain', description: 'The domain "techinsider-daily.com" is not a recognized industry publication.' },
        { type: 'psychological', title: 'Professional Appeal', description: 'Targets security professionals with relevant-sounding content.' },
        { type: 'psychological', title: 'Curiosity', description: 'Uses "breaking news" to entice clicking.' },
      ],
    },
  },
  {
    title: 'CEO Fraud Detection',
    description: 'Urgent request from your CEO. Would you comply or verify?',
    icon: 'Envelope',
    rating: 4.9,
    difficulty: 'Advanced',
    tags: [],
    playCount: 55,
    isPhishing: true,
    timeLimit: 900,
    emailContent: {
      senderName: 'Sarah Mitchell, CEO',
      senderEmail: 's.mitchell@company-executive.com',
      subject: 'URGENT - Need Gift Cards for Client Appreciation',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Hi,</p>
<p>I need you to purchase 10 Amazon gift cards at $200 each for a surprise client appreciation event I'm organizing. Please buy them today and send me the codes via email.</p>
<p>I'm in back-to-back meetings so I can't call. Just reply with the codes when you have them.</p>
<p>I'll get you reimbursed through expense reports.</p>
<p>Thanks for handling this quickly!<br/>Sarah Mitchell<br/>CEO</p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'External Domain', description: 'The sender uses "company-executive.com" instead of the real company domain.' },
        { type: 'psychological', title: 'Authority', description: 'Impersonates the CEO to leverage organizational authority.' },
        { type: 'psychological', title: 'Urgency', description: 'Requests immediate action — "buy them today".' },
        { type: 'psychological', title: 'Isolation', description: 'Claims to be unavailable for calls, preventing verbal verification.' },
        { type: 'psychological', title: 'Gift Card Red Flag', description: 'Legitimate executives never request gift card purchases via email.' },
      ],
    },
  },
];

const campaigns = [
  {
    name: 'Q4 Phishing Awareness',
    targetGroup: 'All Employees',
    scenarioType: 'Phishing Email',
    schedule: new Date('2025-12-01'),
    status: 'Active',
    progress: 65,
  },
  {
    name: 'Executive Training',
    targetGroup: 'C-Suite',
    scenarioType: 'Spear Phishing',
    schedule: new Date('2025-11-15'),
    status: 'Active',
    progress: 40,
  },
  {
    name: 'New Hire Onboarding',
    targetGroup: 'New Employees',
    scenarioType: 'Social Engineering',
    schedule: new Date('2025-10-01'),
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'Q3 Assessment',
    targetGroup: 'All Employees',
    scenarioType: 'Phishing Email',
    schedule: new Date('2025-09-01'),
    status: 'Completed',
    progress: 100,
  },
];

const aiModels = [
  {
    name: 'Phishing Classifier',
    description: 'Primary classification model for detecting phishing emails using NLP and pattern recognition.',
    status: 'Active',
    version: 'v2.4.1',
    metrics: { accuracy: 96.8, precision: 95.2, recall: 97.1, f1: 96.1 },
    lastTrainedAt: new Date('2025-03-01'),
  },
  {
    name: 'URL Analyzer',
    description: 'Deep learning model for analyzing URLs and detecting malicious patterns and redirects.',
    status: 'Active',
    version: 'v1.8.0',
    metrics: { accuracy: 94.5, precision: 93.8, recall: 95.0, f1: 94.4 },
    lastTrainedAt: new Date('2025-02-15'),
  },
  {
    name: 'Content Generator',
    description: 'Generative AI model for creating realistic phishing simulation scenarios for training.',
    status: 'Active',
    version: 'v3.1.0',
    metrics: { accuracy: 91.2, precision: 89.7, recall: 92.5, f1: 91.1 },
    lastTrainedAt: new Date('2025-01-20'),
  },
];

const datasets = [
  {
    name: 'Phish Corpus 2024',
    description: 'Comprehensive collection of real-world phishing emails gathered from global honeypots.',
    tags: ['CSV', 'NLP'],
    size: '2.4 GB',
    records: '1,247,832',
    source: 'API',
    status: 'Active',
    lastUpdated: new Date('2025-03-01'),
  },
  {
    name: 'Legitimate Email Baseline',
    description: 'Curated set of legitimate business emails for training false-positive reduction.',
    tags: ['JSON'],
    size: '1.8 GB',
    records: '856,291',
    source: 'Manual Upload',
    status: 'Active',
    lastUpdated: new Date('2025-02-20'),
  },
  {
    name: 'URL Threat Intelligence',
    description: 'Live feed of known malicious URLs and domains from threat intelligence providers.',
    tags: ['CSV'],
    size: '890 MB',
    records: '3,421,567',
    source: 'External Feed',
    status: 'Active',
    lastUpdated: new Date('2025-03-10'),
  },
  {
    name: 'Social Engineering Patterns',
    description: 'Annotated dataset of social engineering tactics extracted from real attack campaigns.',
    tags: ['JSON', 'NLP'],
    size: '450 MB',
    records: '125,883',
    source: 'Web Scraping',
    status: 'Active',
    lastUpdated: new Date('2025-01-15'),
  },
];

// ── Seed Runner ─────────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Module.deleteMany({});
    await Simulation.deleteMany({});
    await Campaign.deleteMany({});
    await AIModel.deleteMany({});
    await Dataset.deleteMany({});

    // Seed Users
    console.log('👤 Seeding users...');
    const createdUsers = await User.create(users);
    console.log(`   ✓ ${createdUsers.length} users created`);

    // Seed Modules
    console.log('📚 Seeding modules...');
    const createdModules = await Module.create(modules);
    console.log(`   ✓ ${createdModules.length} modules created`);

    // Seed Simulations
    console.log('🎯 Seeding simulations...');
    const createdSimulations = await Simulation.create(simulations);
    console.log(`   ✓ ${createdSimulations.length} simulations created`);

    // Seed Campaigns (link to admin user)
    console.log('📋 Seeding campaigns...');
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const campaignsWithCreator = campaigns.map((c) => ({
      ...c,
      createdBy: adminUser._id,
    }));
    const createdCampaigns = await Campaign.create(campaignsWithCreator);
    console.log(`   ✓ ${createdCampaigns.length} campaigns created`);

    // Seed AI Models
    console.log('🤖 Seeding AI models...');
    const createdModels = await AIModel.create(aiModels);
    console.log(`   ✓ ${createdModels.length} AI models created`);

    // Seed Datasets
    console.log('📊 Seeding datasets...');
    const createdDatasets = await Dataset.create(datasets);
    console.log(`   ✓ ${createdDatasets.length} datasets created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('──────────────────────────────────────');
    console.log('Login credentials:');
    console.log('  User:         flagit@gmail.com / Pilon123');
    console.log('  Admin:        admin@flagit.com / Pilon123');
    console.log('  AI Maintainer: ai@flagit.com   / Pilon123');
    console.log('──────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
