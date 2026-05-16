import { Platform } from 'react-native';

// Android emulator maps localhost → 10.0.2.2
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${HOST}:3000`;
export const WS_BASE_URL = `ws://${HOST}:3000`;

// Placeholder user ID until auth is implemented
export const PLACEHOLDER_USER_ID = 'user-demo';
