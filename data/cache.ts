// data/cache.ts
import { Trainer, Pokemon } from '../types';

const LOGGED_IN_USER_KEY = 'pokerpg_loggedInUser';

interface UserData {
  trainer: Trainer;
  team: Pokemon[];
}

// --- Session Management ---

export const saveSession = (username: string): void => {
  try {
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
  } catch (error) {
    console.error("Failed to save session to localStorage", error);
  }
};

export const loadSession = (): string | null => {
  try {
    return localStorage.getItem(LOGGED_IN_USER_KEY);
  } catch (error) {
    console.error("Failed to load session from localStorage", error);
    return null;
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
  } catch (error) {
    console.error("Failed to clear session from localStorage", error);
  }
};


// --- User Data Management ---

const getUserDataKey = (username: string) => `pokerpg_userData_${username}`;

export const loadUserData = (username: string): UserData | null => {
  try {
    const key = getUserDataKey(username);
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error(`Failed to load data for user ${username}`, error);
    return null;
  }
};

export const saveUserData = (username: string, data: UserData): void => {
  try {
    const key = getUserDataKey(username);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save data for user ${username}`, error);
  }
};
