// User progress tracking via Firestore.
// Each user has a doc at users/{userName} containing:
//   streaks:         { [word]: number }  — correct-in-a-row per word
//   masteredOrder:   [word, ...]          — words mastered, in order mastered
//   updatedAt:       serverTimestamp
//
// Custom cards live at decks/{deckId}/cards. Each user belongs to a deck —
// Max and Jaesun share the "family" deck so adds sync between them; everyone
// else gets a private deck named after their userId. New decks are seeded
// from the legacy shared/customCards doc on first load so every user starts
// from the same baseline.
//
// A word is considered "mastered" once its streak reaches MASTERY_THRESHOLD.
// Mastered words are grouped into batches of BATCH_SIZE for review.

import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const MASTERY_THRESHOLD = 20;
export const BATCH_SIZE = 50;
export const CURRENT_USER_KEY = "lexicon_current_user";

export function getCurrentUser() {
  try { return localStorage.getItem(CURRENT_USER_KEY) || ""; } catch(e) { return ""; }
}
export function setCurrentUser(name) {
  try { localStorage.setItem(CURRENT_USER_KEY, name); } catch(e) {}
}

export function normalizeUserName(name) {
  return (name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Load a user's progress from Firestore. Returns { streaks, masteredOrder }.
export async function loadProgress(userName) {
  var id = normalizeUserName(userName);
  if(!id) return { streaks:{}, masteredOrder:[] };
  try {
    var snap = await getDoc(doc(db, "users", id));
    if(snap.exists()){
      var data = snap.data();
      return {
        streaks: data.streaks || {},
        masteredOrder: data.masteredOrder || []
      };
    }
  } catch(e) {
    console.error("loadProgress failed", e);
  }
  return { streaks:{}, masteredOrder:[] };
}

// Save a user's progress to Firestore.
export async function saveProgress(userName, streaks, masteredOrder) {
  var id = normalizeUserName(userName);
  if(!id) return;
  try {
    await setDoc(doc(db, "users", id), {
      displayName: userName,
      streaks: streaks,
      masteredOrder: masteredOrder,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch(e) {
    console.error("saveProgress failed", e);
  }
}

// Apply an answer result to in-memory progress. Returns new { streaks, masteredOrder }.
export function applyAnswer(streaks, masteredOrder, word, isCorrect) {
  var nextStreaks = Object.assign({}, streaks);
  var nextMastered = masteredOrder.slice();
  if(isCorrect){
    var s = (nextStreaks[word] || 0) + 1;
    nextStreaks[word] = s;
    if(s >= MASTERY_THRESHOLD && nextMastered.indexOf(word) === -1){
      nextMastered.push(word);
    }
  } else {
    nextStreaks[word] = 0;
    // Unmaster on miss so it comes back into active rotation
    var idx = nextMastered.indexOf(word);
    if(idx !== -1) nextMastered.splice(idx, 1);
  }
  return { streaks: nextStreaks, masteredOrder: nextMastered };
}

// Split a list of mastered words into batches of BATCH_SIZE.
export function getMasteredBatches(masteredOrder) {
  var batches = [];
  for(var i=0; i<masteredOrder.length; i+=BATCH_SIZE){
    batches.push(masteredOrder.slice(i, i+BATCH_SIZE));
  }
  return batches;
}

// ── Per-deck custom cards ──

// Users in this set share the "family" deck. Everyone else gets a private
// deck named after their normalized userId.
var FAMILY_DECK_USERS = ["max", "jaesun"];

export function getDeckId(userName) {
  var id = normalizeUserName(userName);
  if(!id) return "";
  if(FAMILY_DECK_USERS.indexOf(id) !== -1) return "family";
  return id;
}

async function loadLegacySharedCards() {
  try {
    var snap = await getDoc(doc(db, "shared", "customCards"));
    if(snap.exists()){
      var data = snap.data();
      return Array.isArray(data.cards) ? data.cards : [];
    }
  } catch(e) {
    console.error("loadLegacySharedCards failed", e);
  }
  return [];
}

// Load custom cards for a deck. If the deck doc doesn't exist yet, seed it
// from the legacy shared/customCards doc so the user starts from the
// existing baseline.
export async function loadCustomCardsForDeck(deckId) {
  if(!deckId) return [];
  try {
    var snap = await getDoc(doc(db, "decks", deckId));
    if(snap.exists()){
      var data = snap.data();
      return Array.isArray(data.cards) ? data.cards : [];
    }
    var seed = await loadLegacySharedCards();
    await setDoc(doc(db, "decks", deckId), {
      cards: seed,
      updatedAt: serverTimestamp()
    });
    return seed;
  } catch(e) {
    console.error("loadCustomCardsForDeck failed", e);
    return [];
  }
}

export async function saveCustomCardsForDeck(deckId, cards) {
  if(!deckId) return;
  try {
    await setDoc(doc(db, "decks", deckId), {
      cards: cards,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch(e) {
    console.error("saveCustomCardsForDeck failed", e);
  }
}
