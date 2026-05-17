// Use your development machine's LAN IP when testing on a real device.
// Android emulator can use 10.0.2.2, and iOS simulator can use localhost.
const DEV_MACHINE_HOST = '192.168.100.3';
const HOST = __DEV__ ? DEV_MACHINE_HOST : 'localhost';

export const API_BASE_URL = `http://${HOST}:3000`;
export const WS_BASE_URL = `ws://${HOST}:3000`;

// Placeholder user ID until auth is implemented
export const PLACEHOLDER_USER_ID = 'user-demo';
