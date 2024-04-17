import {Col, Row} from "@themesberg/react-bootstrap";
import {CounterWidget} from "./shared/counter-widget";
import {TransactionsTable} from "./shared/transactions-table";

export const Home = () => {
  return (
    <>
      <Row className="justify-content-md-center">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Users"
            title="3"
            icon={'users'}
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Deposits"
            title="$43,594"
            icon={'wallet'}
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Withdrawals"
            title="$43,594"
            icon={'money-bill'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <TransactionsTable/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
