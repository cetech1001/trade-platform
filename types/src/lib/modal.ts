export enum Modals {
  settings = 'settings',
  payments = 'payments',
  personal = 'personal',
  deposit = 'deposit',
  withdrawal = 'withdrawal',
}

export interface ModalState {
  activeModal: Modals | null;
}
