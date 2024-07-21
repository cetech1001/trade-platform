export enum Modals {
  settings = 'settings',
  payments = 'payments',
  personal = 'personal',
  password = 'password',
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  addUser = 'addUser',
  editUser = 'editUser',
  deleteUser = 'deleteUser',
}

export interface ModalState {
  activeModal: Modals | null;
}
