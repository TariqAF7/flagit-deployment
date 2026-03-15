/**
 * FlagIt — Standalone Simulation Seeder
 *
 * Resets only the simulations collection and re-seeds the 9 default simulations.
 * Does NOT touch users, modules, campaigns, or any other collection.
 *
 * Usage: node scripts/seedSimulations.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const Simulation = require('../models/Simulation');

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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px;"><div style="background-color: #1a365d; padding: 20px; color: white; text-align: center;"><h1>IT Help Desk - Account Verification</h1></div><div style="padding: 20px;"><p>Dear Employee,</p><p>We have detected unusual activity on your corporate account. As part of our security protocol, you must verify your identity within <strong>12 hours</strong> or your account will be temporarily suspended.</p><p>Please click the link below to verify your credentials:</p><p><a href="#" style="background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Now</a></p><p style="font-size: 12px; color: #666;">This is an automated message. Do not reply directly.</p></div></div>',
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px;"><div style="background-color: #0078d4; padding: 20px; color: white; text-align: center;"><h1>Microsoft Account Security Alert</h1></div><div style="padding: 20px;"><p>Dear User,</p><p>We detected an unusual sign-in attempt on your Microsoft account from:</p><ul><li><strong>Location:</strong> Moscow, Russia</li><li><strong>Device:</strong> Unknown Windows PC</li></ul><p>If this wasn\'t you, your account may be compromised. <strong>IMMEDIATE ACTION REQUIRED</strong> — verify your identity within 24 hours or your account will be suspended.</p><p><a href="#" style="background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Your Identity Now</a></p></div></div>',
      redFlags: [
        { type: 'technical', title: 'Suspicious Domain', description: 'The sender domain "microsft-security.com" is missing the \'o\' in Microsoft.' },
        { type: 'technical', title: 'Suspicious Links', description: 'The verification link points to a non-Microsoft domain.' },
        { type: 'psychological', title: 'Urgency & Time Pressure', description: 'Creates false urgency with a "24 hours" deadline.' },
        { type: 'psychological', title: 'Authority Impersonation', description: 'Pretends to be from "Microsoft Security Team".' },
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px;"><div style="background-color: #4285f4; padding: 20px; color: white; text-align: center;"><h1>Google Workspace</h1></div><div style="padding: 20px;"><p>Hi,</p><p>Someone shared a document with you on Google Drive. To view the file, please sign in with your Google account.</p><p><a href="#" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Open in Google Drive</a></p></div></div>',
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px;"><div style="background-color: #003087; padding: 20px; color: white; text-align: center;"><h1>PayPal</h1></div><div style="padding: 20px;"><p>Dear Customer,</p><p>We\'ve noticed some unusual activity on your PayPal account. Your account access has been limited until you verify your information.</p><p><a href="#" style="background-color: #0070ba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Restore Account Access</a></p></div></div>',
      redFlags: [
        { type: 'technical', title: 'Lookalike Domain', description: 'The domain "paypa1-resolution.com" uses the number "1" instead of the letter "l".' },
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;"><p>Hi,</p><p>I\'m in a meeting and can\'t talk right now. I need you to process an urgent wire transfer for a confidential acquisition we\'re finalizing today.</p><p><strong>Amount:</strong> $47,500.00<br/><strong>Recipient:</strong> Apex Holdings LLC</p><p>Please process this ASAP. Don\'t discuss this with anyone — it\'s confidential.</p><p>Thanks,<br/>David Chen<br/>CFO</p></div>',
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;"><p>Dear Tenant,</p><p>As part of our new digital parking system, all employees must re-register their vehicles by scanning the QR code below.</p><p style="text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">[QR Code Image]</p><p>Please complete registration by end of this week.</p></div>',
      redFlags: [
        { type: 'technical', title: 'QR Code Danger', description: 'QR codes can redirect to any URL — you cannot verify the destination before scanning.' },
        { type: 'technical', title: 'Unknown Sender Domain', description: 'The domain "building-mgmt-portal.com" is not a recognized company domain.' },
        { type: 'psychological', title: 'Routine Disguise', description: 'Disguises the attack as a routine administrative task.' },
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;"><p>You have a new voicemail from your bank\'s security department:</p><div style="background: #f5f5f5; padding: 15px; border-radius: 8px;"><p><em>"This is the fraud prevention department. We\'ve detected suspicious transactions on your account. Your account has been temporarily frozen. Please call us back immediately at 1-800-555-0199."</em></p></div></div>',
      redFlags: [
        { type: 'technical', title: 'Fake Callback Number', description: 'The phone number leads to scammers, not your real bank.' },
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;"><p>Dear Security Professional,</p><p>A critical zero-day vulnerability has been discovered. Read the full analysis on our blog:</p><p><a href="#" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Read Full Analysis</a></p></div>',
      redFlags: [
        { type: 'technical', title: 'Compromised Website', description: 'The linked blog has been compromised with a drive-by download exploit.' },
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
      body: '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;"><p>Hi,</p><p>I need you to purchase 10 Amazon gift cards at $200 each for a surprise client appreciation event. Please buy them today and send me the codes via email.</p><p>I\'m in back-to-back meetings so I can\'t call.</p><p>Thanks!<br/>Sarah Mitchell<br/>CEO</p></div>',
      redFlags: [
        { type: 'technical', title: 'External Domain', description: 'The sender uses "company-executive.com" instead of the real company domain.' },
        { type: 'psychological', title: 'Authority', description: 'Impersonates the CEO to leverage organizational authority.' },
        { type: 'psychological', title: 'Urgency', description: 'Requests immediate action — "buy them today".' },
        { type: 'psychological', title: 'Gift Card Red Flag', description: 'Legitimate executives never request gift card purchases via email.' },
      ],
    },
  },
];

const seedSimulations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing simulations...');
    await Simulation.deleteMany({});

    console.log('🎯 Seeding simulations...');
    const created = await Simulation.create(simulations);
    console.log(`   ✓ ${created.length} simulations created`);

    console.log('\n🎉 Simulations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedSimulations();
