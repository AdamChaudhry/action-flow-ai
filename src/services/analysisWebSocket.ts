import { WS_BASE_URL } from '../constants/config';
import type { WsMessage, WsEventType } from '../types/analysis';

type MessageHandler = (msg: WsMessage) => void;
type ErrorHandler = () => void;

// ─── WebSocket Client ─────────────────────────────────────────────────────────

/**
 * Manages the WebSocket connection for a single analysis job.
 * Call connect() after the job is created; call disconnect() on cleanup.
 */
export class AnalysisWebSocketClient {
  private ws: WebSocket | null = null;
  private readonly terminalEvents: WsEventType[] = [
    'analysis_completed',
    'analysis_failed',
    'analysis_needs_clarification',
  ];

  connect(
    jobId: string,
    onMessage: MessageHandler,
    onError: ErrorHandler = () => {},
  ): void {
    if (this.ws) {
      this.disconnect();
    }

    this.ws = new WebSocket(WS_BASE_URL);

    this.ws.onopen = () => {
      this.ws?.send(
        JSON.stringify({
          type: 'subscribe_analysis',
          payload: { jobId },
        }),
      );
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        onMessage(msg);

        // Auto-close on terminal events
        if (this.terminalEvents.includes(msg.type)) {
          this.disconnect();
        }
      } catch {
        // Ignore malformed frames
      }
    };

    this.ws.onerror = () => {
      onError();
    };

    this.ws.onclose = () => {
      this.ws = null;
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
