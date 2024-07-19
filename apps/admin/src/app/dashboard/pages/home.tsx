import {Col, Row} from "@themesberg/react-bootstrap";
import {CounterWidget} from "./shared/counter-widget";
import {TransactionsTable} from "./shared/transactions-table";
import {connect} from "react-redux";
import {fetchUsers, RootState} from "@coinvant/store";
import {PaginationOptions, User} from "@coinvant/types";
import {useEffect} from "react";
import {UsersTable} from "./shared/users-table";

interface IProps {
  users: User[];
  fetchUsers: (options?: PaginationOptions) => void;
}

const mapStateToProps = (state: RootState) => ({
  users: state.user.list,
  count: state.user.count,
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
            title={`${props.users.length}`}
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
          <UsersTable users={props.users}/>
        </Col>
      </Row>
    </>
  );
});
