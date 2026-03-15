/**
 * ─────────────────────────────────────────────────────────────────
 *  FlagIT — Resilience Score Diagnostic Seed Script
 *  Usage:  node scripts/diagResilience.js
 *
 *  What it does:
 *    1. Clears ALL existing SimulationResult documents.
 *    2. Inserts 10 controlled test entries with known isCorrect/flagged
 *       values so the score formula can be verified.
 *    3. Queries the counts back from MongoDB and prints the expected
 *       DetectionRate, ReportingRate, and final Score.
 *
 *  Expected output (with these 10 entries):
 *    Total      : 10
 *    Correct    : 8   → Detection Rate = 80%
 *    Flagged    : 5   → Reporting Rate = 50%
 *    Score      : (80 × 0.6) + (50 × 0.4) = 48 + 20 = 68  ← Moderate Risk ✓
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend root (one level up from /scripts)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const SimulationResult = require('../models/SimulationResult');
const User = require('../models/User');
const Simulation = require('../models/Simulation');

// ── Helper: build a minimal ObjectId placeholder ──────────────────
const fakeId = () => new mongoose.Types.ObjectId();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Resolve real IDs (use first user + first simulation found) ─
    //    The script won't crash if none exist — it uses placeholder IDs.
    const anyUser       = await User.findOne()       || { _id: fakeId() };
    const anySimulation = await Simulation.findOne() || { _id: fakeId() };

    const userId       = anyUser._id;
    const simulationId = anySimulation._id;

    // ── 2. Clear existing results ─────────────────────────────────────
    const deletedCount = await SimulationResult.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing SimulationResult documents.\n`);

    // ── 3. Insert 10 controlled test entries ──────────────────────────
    //
    //  Group A — 2 entries: clicked the link, did NOT report
    //            (isCorrect: false, flagged: false)
    //
    //  Group B — 3 entries: did NOT click, forgot to report
    //            (isCorrect: true,  flagged: false)
    //
    //  Group C — 5 entries: did NOT click AND did report  ← ideal
    //            (isCorrect: true,  flagged: true)
    //
    const testEntries = [
      // Group A (2)
      { userId, simulationId, choice: 'legit', isCorrect: false, flagged: false, responseTime: 30 },
      { userId, simulationId, choice: 'legit', isCorrect: false, flagged: false, responseTime: 45 },
      // Group B (3)
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: false, responseTime: 20 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: false, responseTime: 22 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: false, responseTime: 18 },
      // Group C (5)
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: true,  responseTime: 12 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: true,  responseTime: 15 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: true,  responseTime: 10 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: true,  responseTime: 14 },
      { userId, simulationId, choice: 'phish', isCorrect: true,  flagged: true,  responseTime: 11 },
    ];

    await SimulationResult.insertMany(testEntries);
    console.log(`🧪 Inserted ${testEntries.length} diagnostic test entries.\n`);

    // ── 4. Query back and verify ──────────────────────────────────────
    const total        = await SimulationResult.countDocuments();
    const correctCount = await SimulationResult.countDocuments({ isCorrect: true });
    const flaggedCount = await SimulationResult.countDocuments({ flagged: true });

    const detectionRate = Math.round((correctCount / total) * 100);
    const reportingRate = Math.round((flaggedCount  / total) * 100);
    const finalScore    = Math.round(detectionRate * 0.6 + reportingRate * 0.4);

    const band =
      finalScore <= 40 ? '🔴 Critical'       :
      finalScore <= 70 ? '🟠 Moderate Risk'  :
      finalScore <= 90 ? '🟢 Good'           :
                         '💚 Excellent';

    console.log('══════════════════════════════════════════');
    console.log('  DIAGNOSTIC RESULT VERIFICATION');
    console.log('══════════════════════════════════════════');
    console.log(`  Total results   : ${total}`);
    console.log(`  Correct (≠ clicked) : ${correctCount}`);
    console.log(`  Flagged (reported)  : ${flaggedCount}`);
    console.log('──────────────────────────────────────────');
    console.log(`  Detection Rate  : ${detectionRate}%  (expected: 80%)`);
    console.log(`  Reporting Rate  : ${reportingRate}%  (expected: 50%)`);
    console.log(`  Final Score     : ${finalScore}    (expected: 68)`);
    console.log(`  Risk Band       : ${band}  (expected: Moderate Risk)`);
    console.log('══════════════════════════════════════════');

    if (detectionRate === 80 && reportingRate === 50 && finalScore === 68) {
      console.log('\n✅ ALL VALUES MATCH — formula is working correctly.\n');
    } else {
      console.error('\n❌ MISMATCH DETECTED — check the formula or schema.\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Diagnostic script error:', err.message);
    process.exit(1);
  }
};

run();
