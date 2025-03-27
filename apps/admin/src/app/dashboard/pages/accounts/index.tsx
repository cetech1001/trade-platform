import {Button, Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import { addAccount, fetchAccounts, openModal, RootState } from '@coinvant/store';
import { Modals, PaginationOptions } from '@coinvant/types';
import {useEffect, useState} from "react";
import {AccountsTable} from "./partials/accounts-table";
import { useParams } from 'react-router-dom';

interface IProps {
  fetchAccounts: (userID: string) => void;
  addAccount: (userID?: string) => void;
  openModal: (activeModal: Modals) => void;
}

const actions = {
  fetchAccounts,
  addAccount,
  openModal,
}

export const Accounts = connect(null, actions) ((props: IProps) => {
  const { userID } = useParams();
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchAccounts(userID || "");
  }, [userID]);

  return (
    <>
      <Row>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <Button variant="outline-primary" onClick={() => props.addAccount(userID)}>
            Add Account
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <AccountsTable options={options} setOptions={setOptions}/>
        </Col>
      </Row>
    </>
  );
});
