// data/api.ts
import { Trainer, Pokemon } from '../types.ts';
import { TRAINER_DATA } from '../trainerData.ts';
import { JSONBIN_API_KEY, JSONBIN_BIN_ID } from './config.ts';


export interface AppData {
  trainer: Trainer;
  team: Pokemon[];
}

/**
 * Reads all data from the JSONBin.
 * @returns All user data from the cloud.
 */
const readBin = async (): Promise<AppData | null> => {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    console.warn("JSONBin credentials not set. App will not have permanent storage.");
    return null;
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
    if (!responseText) {
      console.log("Bin is empty, initializing.");
      return null;
    }

    const data = JSON.parse(responseText);
    return data.record || null;
  } catch (error) {
    console.error("Error reading from JSONBin:", error);
    return null;
  }
};

/**
 * Writes all data to the JSONBin.
 * @param data The complete data object for all users.
 */
const writeBin = async (data: AppData): Promise<void> => {
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
 * Loads the application data from the cloud, or returns default data.
 */
export const loadAppData = async (): Promise<AppData> => {
    const onlineData = await readBin();

    if (onlineData && onlineData.trainer) {
        return onlineData;
    }

    // If no data online, or data is malformed, return default
    console.log(`No online data found, creating default profile.`);
    return {
        trainer: TRAINER_DATA, // Default trainer
        team: [],
    };
};

/**
 * Saves the entire application state to the cloud.
 */
export const saveAppData = async (data: AppData): Promise<void> => {
    await writeBin(data);
};
