import { KYCVerification } from './kyc-verification';
import { Settings } from './settings';
import { Payments } from './payments';
import { UpdateProfile } from './update-profile';
import { UpdatePassword } from './update-password';
import { Deposit } from './deposit';
import { Withdrawal } from './withdrawal';
import { Transactions } from './transactions';

export const Modals = () => (
  <>
    <Settings/>
    <Payments/>
    <UpdateProfile/>
    <UpdatePassword/>
    <Deposit/>
    <Withdrawal/>
    <Transactions/>
    <KYCVerification/>
  </>
);
