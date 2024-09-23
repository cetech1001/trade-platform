import {useState} from "react";
import {USER_ROUTES} from "../../../../routes";
import { sendSupportEmail, showAlert } from '@coinvant/store';
import { AlertState, SupportEmailPayload } from '@coinvant/types';
import { connect } from 'react-redux';

interface IProps {
  toggleNav: (route: USER_ROUTES) => void;
  showAlert: (payload: AlertState) => void;
  sendSupportEmail: (payload: SupportEmailPayload) => Promise<void>;
}

const actions = {
  showAlert,
  sendSupportEmail,
}

export const Support = connect(null, actions)((props: IProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSave = async () => {
    if (subject === "" || message === "") {
      props.showAlert({
        show: true,
        type: 'error',
        message: 'Please fill out the form completely',
      });
    }
    try {
      setIsSubmitting(true);
      await props.sendSupportEmail({ subject, message });
      setSubject("");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={"assets"}>
      <div className="asset-list" style={{ padding: "16px" }}>
        <div className={'title'}>
          <h3>Support</h3>
          <div className={'icons'}>
            <i className="fa-solid fa-xmark"
               onClick={() => props.toggleNav(USER_ROUTES.chart)}></i>
          </div>
        </div>
        <div className={"flex-column"} style={{ gap: "2rem", marginTop: "2rem" }}>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Subject</span>
              <div className={'input-field'}>
                <input type={'text'} name={"subject"} value={subject}
                       onChange={e =>
                         setSubject(e.target.value)}
                       required />
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Message</span>
              <div className={'input-field'}>
                <textarea name={"message"} value={message} rows={10}
                       onChange={e =>
                         setMessage(e.target.value)}
                       required />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <button className={"button bg-primary"} onClick={onSave}
                  style={{ marginBottom: "1rem" }}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
});
