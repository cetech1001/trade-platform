import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Table,
} from '@themesberg/react-bootstrap';
import {
  Account,
  AccountType,
  Modals,
  PaginationOptions,
} from '@coinvant/types';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { connect } from 'react-redux';
import { openModal, RootState, setCurrentAccount } from '@coinvant/store';
import { EditAccountModal } from './edit-account';
import { DeleteAccountModal } from './delete-account';
import { formatCurrency, formatDate } from '../../../../helpers';

interface IProps {
  options: PaginationOptions;
  setOptions: Dispatch<SetStateAction<PaginationOptions>>;
  accounts: Account[];
  setCurrentAccount: (account: Account) => void;
  openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
  accounts: state.account.list,
});

const actions = {
  setCurrentAccount,
  openModal,
};

export const AccountsTable = connect(mapStateToProps, actions)((props: IProps) => {
  const TableRow = (account: Account) => {

    const onEditClick = useCallback(() => {
      props.setCurrentAccount(account);
      props.openModal(Modals.editAccount);
    }, [account]);

    const onDeleteClick = useCallback(() => {
      props.setCurrentAccount(account);
      props.openModal(Modals.deleteAccount);
    }, [account]);

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {account.type}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {formatCurrency(account.walletBalance)}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {formatDate(account.createdAt)}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
			              <span className="icon icon-sm">
			                <i className="fa-solid fa-ellipsis icon-dark"/>
			              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onEditClick}>
                <i className="fa-solid fa-pen-to-square me-2"/> Edit
              </Dropdown.Item>
              {account.type !== AccountType.demo && (
                <Dropdown.Item className="text-danger" onClick={onDeleteClick}>
                  <i className="fa-solid fa-delete-left me-2"/> Remove
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="account-table align-items-center">
          <thead>
          <tr>
            <th className="border-bottom">Type</th>
            <th className="border-bottom">Wallet Balance</th>
            <th className="border-bottom">Created On</th>
            <th className="border-bottom">Action</th>
          </tr>
          </thead>
          <tbody>
          {props.accounts.map(account => (
            <TableRow key={account.id} {...account}/>
          ))}
          </tbody>
        </Table>
      </Card.Body>
      <EditAccountModal/>
      <DeleteAccountModal/>
    </Card>
  );
});
