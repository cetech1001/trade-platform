import { ChangeEvent, useState } from 'react';
import { AlertState, AuthUser, CreateKYC, Modals, UpdateUser } from '@coinvant/types';
import {
  closeModal,
  editUser,
  openModal,
  refreshUserProfile,
  RootState,
  showAlert, uploadKYC
} from '@coinvant/store';
import {connect} from "react-redux";
import { Form } from 'react-bootstrap';

interface IProps {
  activeModal: Modals | null;
  user: AuthUser | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  editUser: (id: string, payload: UpdateUser) => Promise<void>;
  showAlert: (payload: AlertState) => void;
  refreshUserProfile: () => Promise<void>;
  uploadKYC: (formData: FormData) => Promise<void>;
}

const mapStateToProps = (state: RootState) => ({
  activeModal: state.modal.activeModal,
  user: state.auth.user,
});

const actions = {
  openModal,
  closeModal,
  editUser,
  showAlert,
  refreshUserProfile,
  uploadKYC,
};

export const KYCVerification = connect(mapStateToProps, actions)((props: IProps) => {
  if (props.activeModal !== Modals.kycVerification) return null;

  const [createKYC, setCreateKYC] = useState<CreateKYC>({
    dob: '',
    firstName: '',
    lastName: '',
    nationality: '',
    residentialAddress: ''
  });
  const [photo, setPhoto] = useState(null);
  const [idCard, setIDCard] = useState(null);
  const [proofOfAddress, setProofOfAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateKYC(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  const onSave = async () => {
    try {
      setIsSubmitting(true);
      if (props.user) {
        if (!photo || !idCard/* || !proofOfAddress*/) {
          return props.showAlert({
            type: 'error',
            message: 'Please fill out the form completely',
            show: true,
          });
        }
        const formData = new FormData();
        Object.keys(createKYC).forEach((key) => {
          // @ts-expect-error idk
          formData.append(key, createKYC[key]);
        });
        formData.append('photo', photo);
        formData.append('idCard', idCard);
        if (proofOfAddress) {
          formData.append('proofOfAddress', proofOfAddress);
        }
        await props.uploadKYC(formData);
        await props.refreshUserProfile();
        props.openModal(Modals.settings);
      } else {
        props.showAlert({
          type: 'error',
          message: 'User not provided',
          show: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={'sidebar open'}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={() => props.openModal(Modals.settings)}></i>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className="title" style={{ padding: 0 }}>
          <h5 style={{ color: "#FFF" }}>KYC Verification</h5>
        </div>
        <div className={"flex-column"} style={{ gap: "2rem", marginTop: "2rem" }}>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>First name</span>
              <div className={'input-field'}>
                <input type={'text'} name={"firstName"} value={createKYC.firstName}
                       onChange={onChange} required />
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Last name</span>
              <div className={'input-field'}>
                <input type={'text'} name={"lastName"} value={createKYC.lastName}
                       onChange={onChange} required />
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>D.O.B.</span>
              <div className={'input-field'}>
                <input type={'date'} name={"dob"} value={createKYC.dob}
                       onChange={onChange} required />
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Nationality</span>
              <div className={'input-field'}>
                <input type={'text'} name={"nationality"}
                       value={createKYC.nationality}
                       onChange={onChange} required />
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Residential address</span>
              <div className={'input-field'}>
                <input type={'text'} name={"residentialAddress"}
                       value={createKYC.residentialAddress}
                       onChange={onChange} required />
              </div>
            </div>
          </div>
          <Form.Group controlId="proof" className="mb-3">
            <Form.Label style={{ color: "#fff", fontSize: "12px" }}>
              Upload a recent photograph of yourself
            </Form.Label>
            <Form.Control type="file" size="sm"
                          onChange={(e: any) =>
                            setPhoto(e.target.files[0])} />
          </Form.Group>
          <Form.Group controlId="proof" className="mb-3">
            <Form.Label style={{ color: "#fff", fontSize: "12px" }}>
              Upload a government-issued identification document (National ID Card | Passport | Driving License)
            </Form.Label>
            <Form.Control type="file" size="sm" onChange={(e: any) =>
              setIDCard(e.target.files[0])} />
          </Form.Group>
          <Form.Group controlId="proof" className="mb-3">
            <Form.Label style={{ color: "#fff", fontSize: "12px" }}>
              Upload proof of address (Bank statement | Utility Bills | Rental / Lease Agreements)
            </Form.Label>
            <Form.Control type="file" size="sm" onChange={(e: any) =>
              setProofOfAddress(e.target.files[0])} />
          </Form.Group>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <button className={"button bg-primary"} onClick={onSave} style={{ marginBottom: "1rem" }}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
});
