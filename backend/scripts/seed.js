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
    title: 'Credential Harvesting',
    description: 'A fake Microsoft security alert designed to steal your login credentials.',
    icon: 'Shield',
    rating: 4.5,
    difficulty: 'Intermediate',
    isPhishing: true,
    timeLimit: 1066,
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
        { type: 'technical', title: 'Suspicious Attachments', description: 'Unexpected PDF attachments in security alerts are often malicious.' },
        { type: 'psychological', title: 'Urgency & Time Pressure', description: 'Creates false urgency with a "24 hours" deadline.' },
        { type: 'psychological', title: 'Authority Impersonation', description: 'Pretends to be from "Microsoft Security Team".' },
        { type: 'psychological', title: 'Fear & Consequences', description: 'Threatens account suspension and loss of access.' },
        { type: 'psychological', title: 'Social Engineering', description: 'Uses specific details like "Moscow, Russia" to create credibility.' },
      ],
    },
  },
  {
    title: 'Invoice Fraud',
    description: 'A fake invoice scam targeting finance teams with urgent payment requests.',
    icon: 'Mail',
    rating: 4.3,
    difficulty: 'Advanced',
    isPhishing: true,
    timeLimit: 900,
    emailContent: {
      senderName: 'Accounts Payable',
      senderEmail: 'ap@supp1ier-invoices.com',
      subject: 'OVERDUE: Invoice #INV-2024-8891 — Payment Required Immediately',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Dear Finance Team,</p>
<p>Please find attached the overdue invoice #INV-2024-8891 for $14,750.00. This payment was due 15 days ago.</p>
<p>Please process payment immediately to avoid service interruption and late fees.</p>
<p><strong>New Banking Details:</strong></p>
<ul>
<li>Bank: Chase International</li>
<li>Account: 4418-9920-3311</li>
<li>Routing: 072000326</li>
</ul>
<p><a href="#" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Download Invoice PDF</a></p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Misspelled Domain', description: 'The domain "supp1ier-invoices.com" uses a number "1" instead of the letter "l".' },
        { type: 'technical', title: 'Changed Banking Details', description: 'Legitimate vendors rarely change banking details via email.' },
        { type: 'psychological', title: 'Urgency', description: 'Pressures immediate payment with threats of late fees.' },
        { type: 'psychological', title: 'Authority', description: 'Impersonates a known vendor/supplier.' },
      ],
    },
  },
  {
    title: 'Account Recovery Scam',
    description: 'A deceptive password reset email designed to capture your current credentials.',
    icon: 'Link',
    rating: 4.0,
    difficulty: 'Beginner',
    isPhishing: true,
    timeLimit: 600,
    emailContent: {
      senderName: 'Google Account Recovery',
      senderEmail: 'noreply@g00gle-recover.com',
      subject: 'Your Google Account Password Has Been Changed',
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
<p>Hi,</p>
<p>Your Google Account password was recently changed. If you did not make this change, someone may have accessed your account.</p>
<p>Please reset your password immediately:</p>
<p><a href="#" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
<p style="font-size: 12px; color: #666;">Google will never ask for your password via email.</p>
</div>`,
      redFlags: [
        { type: 'technical', title: 'Fake Domain', description: 'The domain "g00gle-recover.com" uses zeros instead of "o".' },
        { type: 'psychological', title: 'Fear', description: 'Creates fear that someone has taken over your account.' },
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
