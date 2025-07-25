import {Button, Card, Col, Container, Form, InputGroup, Row} from "@themesberg/react-bootstrap";
import {Link} from "react-router-dom";
import {AuthRoutes} from "../../routes";
import { sendResetLink } from '@coinvant/store';
import { connect } from 'react-redux';
import { FormEvent, useState } from 'react';


interface IProps {
  sendResetLink: (email: string) => Promise<void>;
}

const actions = { sendResetLink };

export const ForgotPassword = connect(null, actions)((props: IProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    props.sendResetLink(email)
      .then(() => setEmail(""))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <main>
      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={`/${AuthRoutes.login}`} className="text-gray-700">
                <i className="fa-solid fa-long-arrow-left me-2"/> Back to sign in
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div
                className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3>Forgot your password?</h3>
                <p className="mb-4">Don't fret! Just type in your email and we will send you a link to reset your
                  password!</p>
                <Form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <Form.Label htmlFor="email">Your Email</Form.Label>
                    <InputGroup id="email">
                      <Form.Control required autoFocus type="email"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    disabled={isSubmitting}/>
                    </InputGroup>
                  </div>
                  <Button variant="primary" type="submit" className="w-100"
                          disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Recover password"}
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
