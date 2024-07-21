import {Card, Col, Row} from "@themesberg/react-bootstrap";
import React, {FC} from "react";

interface IProps {
  icon: string;
  category: string;
  title: string;
}

export const CounterWidget: FC<IProps> = (props) => {return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col xl={5} className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0">
            <div className={`icon icon-shape icon-md rounded me-4 me-sm-0`}>
              <i className={`fa-solid fa-${props.icon}`} />
            </div>
            <div className="d-sm-none">
              <h5>{props.category}</h5>
              <h3 className="mb-1">{props.title}</h3>
            </div>
          </Col>
          <Col xs={12} xl={7} className="px-xl-0">
            <div className="d-none d-sm-block">
              <h5>{props.category}</h5>
              <h3 className="mb-1">{props.title}</h3>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
