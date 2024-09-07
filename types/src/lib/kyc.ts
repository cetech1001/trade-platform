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
  createdAt: string;
  updatedAt: string;
}

export type CreateKYC = Pick<KYC, 'firstName' | 'lastName' | 'dob' | 'nationality' | 'residentialAddress'>;
