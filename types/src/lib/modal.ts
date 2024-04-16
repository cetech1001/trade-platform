export enum Modals {
  settings = 'settings',
  payments = 'payments',
  personal = 'personal',
  password = 'password',
  deposit = 'deposit',
  withdrawal = 'withdrawal',
}

export interface ModalState {
  activeModal: Modals | null;
}
