import {Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {Button, Form} from "react-bootstrap";
import {FormEvent, useEffect, useState} from "react";
import {editUser, refreshUserProfile, RootState, showAlert} from "@coinvant/store";
import {AlertState, AuthUser, UpdateUser} from "@coinvant/types";

interface IProps {
  user: Omit<AuthUser, 'password'> | null;
  editUser: (id: string, payload: UpdateUser) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
})

const actions = {
  editUser,
  refreshUserProfile,
  showAlert,
}

export const Profile = connect(mapStateToProps, actions) ((props: IProps) => {
  const [isSubmittingData, setIsSubmittingData] = useState<boolean>(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  useEffect(() => {
    if (props.user) {
      setName(props.user.name);
      setEmail(props.user.email);
    }
  }, [props.user]);

  const onSaveData = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setIsSubmittingData(true);
      if (props.user) {
        await props.editUser(props.user?.id, {name, email});
        await props.refreshUserProfile();
      } else {
        props.showAlert({
          type: 'error',
          message: 'User not provided',
          show: true,
        });
      }
    } finally {
      setIsSubmittingData(false);
    }
  }

  const onSavePassword = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (password !== rePassword) {
        return props.showAlert({
          type: 'error',
          message: 'Passwords do not match',
          show: true,
        });
      }
      setIsSubmittingPassword(true);
      if (props.user) {
        await props.editUser(props.user?.id, { password });
        setPassword("");
        setRePassword("");
      } else {
        props.showAlert({
          type: 'error',
          message: 'User not provided',
          show: true,
        });
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  return (
      <Row>
        <Col xs={12} xl={6} className="mb-4">
          <h3>Update Profile</h3>
          <Form onSubmit={onSaveData}>
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" name={"name"}
                            value={name} onChange={e =>
                  setName(e.target.value)} required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name={"email"}
                            value={email} onChange={e =>
                  setEmail(e.target.value)} required/>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmittingData}>
              {isSubmittingData ? 'Submitting...' : 'Submit'}
            </Button>
          </Form>
        </Col>
        <Col xs={12} xl={6} className="mb-4">
          <h3>Change Password</h3>
          <Form onSubmit={onSavePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" placeholder="Password" name={"password"}
                            value={password} onChange={e =>
                  setPassword(e.target.value)} required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Re-type Password</Form.Label>
              <Form.Control type="text" placeholder="Password" name={"password"}
                            value={rePassword} onChange={e =>
                  setRePassword(e.target.value)} required/>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmittingPassword}>
              {isSubmittingPassword ? 'Submitting...' : 'Submit'}
            </Button>
          </Form>
        </Col>
      </Row>
  );
});
