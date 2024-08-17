export enum Modals {
  settings = 'settings',
  payments = 'payments',
  personal = 'personal',
  password = 'password',
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  transactions = 'transactions',
  addUser = 'addUser',
  editUser = 'editUser',
  deleteUser = 'deleteUser',
  addPaymentMethod = 'addPaymentMethod',
  editPaymentMethod = 'editPaymentMethod',
  deletePaymentMethod = 'deletePaymentMethod',
}

export interface ModalState {
  activeModal: Modals | null;
}
