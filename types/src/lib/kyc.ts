import { User } from './user';

export interface KYC {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  residentialAddress: string;
  idCard: string;
  proofOfAddress: string;
  photo: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export type CreateKYC = Pick<KYC, 'firstName' | 'lastName' | 'dob' | 'nationality' | 'residentialAddress'>;
