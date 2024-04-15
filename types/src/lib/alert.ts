export interface AlertState {
  message: string | null;
  type: 'success' | 'error' | null;
  show: boolean;
}
