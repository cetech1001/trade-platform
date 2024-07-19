import {Col, Row} from "@themesberg/react-bootstrap";
import {CounterWidget} from "./shared/counter-widget";
import {TransactionsTable} from "./shared/transactions-table";
import {connect} from "react-redux";
import {fetchUsers, RootState} from "@coinvant/store";
import {UserState} from "@coinvant/types";
import {useEffect} from "react";

interface IProps {
  user: UserState;
  fetchUsers: () => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

export const Home = connect(mapStateToProps, { fetchUsers }) ((props: IProps) => {
  useEffect(() => {
    props.fetchUsers();
  }, []);

  return (
    <>
      <Row className="justify-content-md-center">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Users"
            title={`${props.user.list.length}`}
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
          <TransactionsTable/>
        </Col>
      </Row>
    </>
  );
});
