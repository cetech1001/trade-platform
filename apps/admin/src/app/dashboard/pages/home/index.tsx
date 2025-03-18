import {Col, Row} from "@themesberg/react-bootstrap";
import {CounterWidget} from "./partials/counter-widget";
import {connect} from "react-redux";
import {
  fetchUsers,
  RootState,
  setTotalDepositAmount,
  setTotalWithdrawalAmount
} from "@coinvant/store";
import {PaginationOptions} from "@coinvant/types";
import React, {useEffect, useState} from "react";
import {UsersTable} from "../users/partials/users-table";
import {formatCurrency} from "../../../helpers";

interface IProps {
  userCount: number;
  totalDepositAmount: number;
  totalWithdrawalAmount: number;
  fetchUsers: (options?: PaginationOptions) => void;
  setTotalDepositAmount: () => void;
  setTotalWithdrawalAmount: () => void;
}

const mapStateToProps = (state: RootState) => ({
  userCount: state.user.totalUserCount,
  totalDepositAmount: state.deposit.totalDepositAmount,
  totalWithdrawalAmount: state.withdrawal.totalWithdrawalAmount,
});

const actions = {
  fetchUsers,
  setTotalDepositAmount,
  setTotalWithdrawalAmount,
}

export const Home = connect(mapStateToProps, actions) ((props: IProps) => {
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.setTotalDepositAmount();
    props.setTotalWithdrawalAmount();
  }, []);

  useEffect(() => {
    props.fetchUsers(options);
  }, [options]);

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
              title={formatCurrency(props.totalDepositAmount)}
              icon={'wallet'}
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Withdrawals"
            title={formatCurrency(props.totalWithdrawalAmount)}
            icon={'hand-holding-dollar'}
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
