import {Button, Card, Col, Container, Form, InputGroup, Row} from "@themesberg/react-bootstrap";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {AuthRoutes} from "../../routes";
import { AlertState, ResetPasswordRequest } from '@coinvant/types';
import { connect } from 'react-redux';
import { resetPassword, showAlert } from '@coinvant/store';
import { FormEvent, useState } from 'react';


interface IProps {
  resetPassword: (payload: ResetPasswordRequest) => Promise<void>;
  showAlert: (payload: AlertState) => void;
}

const actions = { resetPassword, showAlert };

export const ResetPassword = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password !== rePassword) {
      return props.showAlert({
        message: 'Passwords do not match',
        type: 'error',
        show: true,
      });
    }

    setIsSubmitting(true);
    props.resetPassword({
      password,
      otp: searchParams.get('token') || '',
      email: searchParams.get('email') || '',
    })
      .then(() => {
        navigateTo(`/${AuthRoutes.login}`);
      })
      .catch(() => {
        setPassword("");
        setRePassword("");
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={`/${AuthRoutes.login}`} className="text-gray-700">
                <i className="fa-solid fa-long-arrow-left me-2"/> Back to sign in
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">Reset password</h3>
                <Form onSubmit={onSubmit}>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fa-solid fa-lock"/>
                      </InputGroup.Text>
                      <Form.Control required type="password" value={password}
                                    onChange={e =>
                                      setPassword(e.target.value)}
                                    disabled={isSubmitting}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fa-solid fa-lock"/>
                      </InputGroup.Text>
                      <Form.Control required type="password" value={rePassword}
                                    onChange={e =>
                                      setRePassword(e.target.value)}
                                    disabled={isSubmitting}/>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100"
                          disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset password"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
});
