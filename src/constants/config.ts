// const CLOUD_API_ORIGIN = 'http://192.168.1.107:3000';
const CLOUD_API_ORIGIN = 'https://actionflow-api-203281358607.us-central1.run.app';

const API_ORIGIN = CLOUD_API_ORIGIN;

function toWebSocketOrigin(httpOrigin: string): string {
  return httpOrigin.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');
}

export const API_BASE_URL = API_ORIGIN;
export const WS_BASE_URL = toWebSocketOrigin(API_ORIGIN);

// Placeholder user ID until auth is implemented
export const PLACEHOLDER_USER_ID = 'user-demo';
