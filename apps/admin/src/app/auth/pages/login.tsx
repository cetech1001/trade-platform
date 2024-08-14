import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {AdminRoutes, AuthRoutes} from "../../routes";
import {FormEvent, useState} from "react";
import {login} from "@coinvant/store";
import {connect} from "react-redux";
import {LoginRequest} from "@coinvant/types";

interface IProps {
  login: (payload: LoginRequest) => Promise<void>;
}

export const Login = connect(null, { login })((props: IProps) => {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    props.login({ email, password })
      .then(() => navigateTo(`/${AdminRoutes.overview}`))
      .catch(() => {})
      .finally(() => setIsSubmitting(false));
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to our platform</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fa-solid fa-envelope"/>
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="fa-solid fa-lock"/>
                        </InputGroup.Text>
                        <Form.Control required type="password" value={password} autoComplete={'current-password'}
                                      onChange={(e) => setPassword(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2"/>
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                      <Card.Link as={Link} to={`/${AuthRoutes.forgotPassword}`} className="small text-end">
                        Lost password?
                      </Card.Link>
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={isSubmitting}
                          className="w-100">
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
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
