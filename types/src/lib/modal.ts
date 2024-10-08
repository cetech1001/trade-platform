export enum Modals {
  settings = 'settings',
  payments = 'payments',
  personal = 'personal',
  kycVerification = 'kycVerification',
  password = 'password',
  deposit = 'deposit',
  editDeposit = 'editDeposit',
  deleteDeposit = 'deleteDeposit',
  withdrawal = 'withdrawal',
  editWithdrawal = 'editWithdrawal',
  deleteWithdrawal = 'deleteWithdrawal',
  transactions = 'transactions',
  addUser = 'addUser',
  editUser = 'editUser',
  deleteUser = 'deleteUser',
  addPaymentMethod = 'addPaymentMethod',
  editPaymentMethod = 'editPaymentMethod',
  deletePaymentMethod = 'deletePaymentMethod',
  editKYC = 'editKYC',
  deleteKYC = 'deleteKYC',
  editTrade = 'editTrade',
  deleteTrade = 'deleteTrade',
}

export interface ModalState {
  activeModal: Modals | null;
}
