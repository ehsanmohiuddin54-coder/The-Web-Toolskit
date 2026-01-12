
import { User, UserRole } from '../types';

const USERS_KEY = 'seo_utility_users';
const SESSION_KEY = 'seo_utility_session';

// Internal type for storing users with passwords in LocalStorage
interface StoredUser extends User {
  password?: string;
}

const ADMIN_USER: StoredUser = {
  id: 'admin-1',
  email: 'admin@admin.com',
  name: 'System Admin',
  role: 'ADMIN',
  password: 'Admin123'
};

// Email validation: restricted to @gmail.com and @outlook.com
export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/;
  return regex.test(email.toLowerCase());
};

// Initialize with Admin if not exists
const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const initial = [ADMIN_USER];
    localStorage.setItem(USERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const signUp = (email: string, name: string, password?: string): User => {
  if (!isValidEmail(email)) {
    throw new Error('Only @gmail.com and @outlook.com emails are allowed.');
  }

  const users = getStoredUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User with this email already exists.');
  }

  const newUser: StoredUser = {
    id: Math.random().toString(36).substr(2, 9),
    email: email.toLowerCase(),
    name,
    role: 'USER',
    password // Store password internally
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Return User without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = (email: string, password?: string): User => {
  const lowerEmail = email.toLowerCase();
  
  // Hardcoded check for Admin
  if (lowerEmail === 'admin@admin.com') {
    if (password === 'Admin123') {
      saveSession(ADMIN_USER);
      return ADMIN_USER;
    } else {
      throw new Error('Incorrect password for Administrator.');
    }
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format. Use @gmail.com or @outlook.com.');
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === lowerEmail);
  
  if (!user) {
    throw new Error('No account found with this email.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }
  
  // Strip password before saving session and returning
  const { password: _, ...sessionUser } = user;
  saveSession(sessionUser);
  return sessionUser;
};

export const googleLogin = (email: string, name: string, avatar: string): User => {
  // Even for simulated Google login, we enforce domain for consistency
  if (!isValidEmail(email)) {
    throw new Error('Simulated Google login only supports @gmail.com or @outlook.com for this tool.');
  }

  const users = getStoredUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    user = {
      id: 'google-' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      role: 'USER',
      avatar
    };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  const { password: _, ...sessionUser } = user;
  saveSession(sessionUser);
  return sessionUser;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

const saveSession = (user: User) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getAllUsers = (): User[] => {
  return getStoredUsers().map(({ password, ...user }) => user);
};

export const deleteUser = (id: string) => {
  if (id === 'admin-1') return; // Cannot delete system admin
  const users = getStoredUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
