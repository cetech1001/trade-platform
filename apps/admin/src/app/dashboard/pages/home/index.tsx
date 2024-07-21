import {Col, Row} from "@themesberg/react-bootstrap";
import {CounterWidget} from "./partials/counter-widget";
import {connect} from "react-redux";
import {fetchUsers, RootState} from "@coinvant/store";
import {PaginationOptions, UserState} from "@coinvant/types";
import {useEffect, useState} from "react";
import {UsersTable} from "../users/partials/users-table";

interface IProps {
  userCount: number;
  fetchUsers: (options?: PaginationOptions) => void;
}

const mapStateToProps = (state: RootState) => ({
  userCount: state.user.count,
});

export const Home = connect(mapStateToProps, { fetchUsers }) ((props: IProps) => {
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchUsers(options);
  }, []);

  return (
    <>
      <Row className="justify-content-md-center">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Users"
            title={`${props.userCount}`}
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
          <UsersTable setOptions={setOptions} options={options}/>
        </Col>
      </Row>
    </>
  );
});
