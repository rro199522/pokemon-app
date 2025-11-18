// data/api.ts
import { Trainer, Pokemon } from '../types';
import * as cache from './cache';
import { TRAINER_DATA } from '../trainerData';
import { JSONBIN_API_KEY, JSONBIN_BIN_ID } from './config';

// --- Mock User Credentials ---
const USERS: Record<string, string> = {
  'rr': '1255',
  'mj': '4321',
};

interface UserData {
  trainer: Trainer;
  team: Pokemon[];
}

interface AllData {
  [username: string]: UserData;
}

/**
 * Reads all data from the JSONBin.
 * @returns All user data from the cloud.
 */
const readBin = async (): Promise<AllData> => {
  // FIX: Removed obsolete check for placeholder bin ID that was causing a TypeScript error.
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    console.warn("JSONBin credentials not set. App will not have permanent storage.");
    return {};
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
      },
    });
    
    if (!response.ok) {
        throw new Error(`Failed to read bin: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    // Handle completely empty bin from JSONBin which returns empty string
    if (!responseText) {
      console.log("Bin is empty, initializing.");
      return {};
    }

    const data = JSON.parse(responseText);
    // The actual data is nested under the 'record' property
    return data.record || {};
  } catch (error) {
    console.error("Error reading from JSONBin:", error);
    // If there's an error (e.g., parsing, network), return an empty object to prevent app crash
    return {};
  }
};

/**
 * Writes all data to the JSONBin.
 * @param data The complete data object for all users.
 */
const writeBin = async (data: AllData): Promise<void> => {
  // FIX: Removed obsolete check for placeholder bin ID that was causing a TypeScript error.
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    console.warn("JSONBin credentials not set. Skipping write to bin.");
    return;
  }
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to write to bin: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error writing to JSONBin:", error);
  }
};


/**
 * Handles user login. Fetches from cloud, creates profile if needed.
 */
export const login = async (username: string, password: string): Promise<UserData> => {
  if (USERS[username] !== password) {
    throw new Error('Invalid username or password.');
  }

  const allData = await readBin();
  let userData = allData[username];
  
  if (!userData) {
    console.log(`No online data for ${username}, creating default profile.`);
    userData = {
      trainer: { ...TRAINER_DATA, name: username },
      team: [],
    };
    allData[username] = userData;
    await writeBin(allData);
  }
  
  cache.saveSession(username);
  cache.saveUserData(username, userData); // Also cache locally for offline access/speed

  return userData;
};

/**
 * Checks for a local session and tries to load data.
 * Does not hit the network, relies on data loaded at login.
 */
export const checkSession = async (): Promise<{ username: string } & UserData | null> => {
  const username = cache.loadSession();
  if (!username) {
    return null;
  }
  
  // Use locally cached data for session restoration to make it instant
  const userData = cache.loadUserData(username);
  if (!userData) {
    cache.clearSession();
    return null;
  }

  return { username, ...userData };
};

export const logout = async (): Promise<void> => {
  cache.clearSession();
};

/**
 * Saves the trainer data to the cloud and local cache.
 */
export const saveTrainer = async (username: string, trainer: Trainer): Promise<void> => {
  const allData = await readBin();
  const userData = allData[username] || { trainer: TRAINER_DATA, team: [] };
  
  userData.trainer = trainer;
  allData[username] = userData;

  await writeBin(allData);
  cache.saveUserData(username, userData); // Update local cache
};

/**
 * Saves the team data to the cloud and local cache.
 */
export const saveTeam = async (username: string, team: Pokemon[]): Promise<void> => {
  const allData = await readBin();
  const userData = allData[username] || { trainer: TRAINER_DATA, team: [] };

  userData.team = team;
  allData[username] = userData;

  await writeBin(allData);
  cache.saveUserData(username, userData); // Update local cache
};
