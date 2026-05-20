import { WS_BASE_URL } from '../constants/config';
import type { WsEventType, WsMessage } from '../types/analysis';

type MessageHandler = (msg: WsMessage) => void;
type TerminalStatus = 'success' | 'failed';
type TerminalHandler = (msg: WsMessage, status: TerminalStatus) => void;

/**
 * Manages the WebSocket connection for a single analysis job.
 * Call connect() after the job is created; call disconnect() on cleanup.
 */
export class AnalysisWebSocketClient {
  private ws: WebSocket | null = null;
  private readonly successfulTerminalEvents: WsEventType[] = [
    'outcome_updated',
    'workflow_completed',
  ];
  private readonly failedTerminalEvents: WsEventType[] = [
    'workflow_failed',
  ];

  connect(
    jobId: string,
    onMessage: MessageHandler,
    onOpen: () => void = () => {},
    onTerminal: TerminalHandler = () => {},
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
      // Signal to the caller that the connection is live.
      onOpen();
    };

    this.ws.onmessage = event => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        const terminalStatus = this.resolveTerminalStatus(msg.type);

        onMessage(msg);

        if (terminalStatus) {
          onTerminal(msg, terminalStatus);
          this.disconnect();
        }
      } catch {
        // Ignore malformed frames.
      }
    };

    this.ws.onerror = () => {
      // WS failed — caller's poll fallback will take over.
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

  private resolveTerminalStatus(type: WsEventType): TerminalStatus | null {
    if (this.successfulTerminalEvents.includes(type)) {
      return 'success';
    }

    if (this.failedTerminalEvents.includes(type)) {
      return 'failed';
    }

    return null;
  }
}
