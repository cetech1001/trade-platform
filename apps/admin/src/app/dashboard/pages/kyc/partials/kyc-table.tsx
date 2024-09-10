import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import { Modals, PaginationOptions, KYC, KYCStatus, UserState } from '@coinvant/types';
import {TablePagination} from "../../../../shared/table-pagination";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentKYC} from "@coinvant/store";
import {DeleteKYCModal} from "./delete-kyc";
import {formatDate} from "../../../../helpers";
import {environment} from "../../../../../environment/environment";
import { EditKYCModal } from './edit-kyc';

interface IProps {
  options: PaginationOptions;
  setOptions: Dispatch<SetStateAction<PaginationOptions>>;
  user: UserState;
  setCurrentKYC: (kyc: KYC) => void;
  openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const actions = {
  setCurrentKYC,
  openModal,
};

export const KycTable = connect(mapStateToProps, actions)((props: IProps) => {
  const TableRow = (kyc: KYC) => {
    const statusVariant = useMemo(() => {
      return kyc.user.kycStatus === KYCStatus.verified ? "success" : "warning";
    }, [kyc]);

    const onEditClick = useCallback(() => {
      props.setCurrentKYC(kyc);
      props.openModal(Modals.editKYC);
    }, [kyc]);

    const onDeleteClick = useCallback(() => {
      props.setCurrentKYC(kyc);
      props.openModal(Modals.deleteKYC);
    }, [kyc]);

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {kyc.user?.name}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {kyc.firstName + ' ' + kyc.lastName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {kyc.dob}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {kyc.nationality}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {kyc.residentialAddress}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            <a href={`${environment.apiUrl}/uploads/${kyc.photo}`}
               target="_blank" rel={"noreferrer"}>
              <i className="fa-solid fa-file"></i>
            </a>
          </span>
        </td>
        <td>
          <span className="fw-normal">
            <a href={`${environment.apiUrl}/uploads/${kyc.idCard}`}
               target="_blank" rel={"noreferrer"}>
              <i className="fa-solid fa-file"></i>
            </a>
          </span>
        </td>
        <td>
          <span className="fw-normal">
            <a href={`${environment.apiUrl}/uploads/${kyc.proofOfAddress}`}
               target="_blank" rel={"noreferrer"}>
              <i className="fa-solid fa-file"></i>
            </a>
          </span>
        </td>
        <td>
          <span className={`fw-normal text-${statusVariant}`}>
            {kyc.user.kycStatus}
          </span>
        </td>
        <td>
          <span className={`fw-normal`}>
            {formatDate(kyc.createdAt)}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <i className="fa-solid fa-ellipsis icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onEditClick}>
                <i className="fa-solid fa-pen-to-square me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={onDeleteClick}>
                <i className="fa-solid fa-delete-left me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="kyc-table align-items-center">
          <thead>
          <tr>
            <th className="border-bottom">User</th>
            <th className="border-bottom">Name</th>
            <th className="border-bottom">DOB</th>
            <th className="border-bottom">Nationality</th>
            <th className="border-bottom">Address</th>
            <th className="border-bottom">Photo</th>
            <th className="border-bottom">ID</th>
            <th className="border-bottom">Proof of Address</th>
            <th className="border-bottom">Status</th>
            <th className="border-bottom">Date</th>
            <th className="border-bottom">Action</th>
          </tr>
          </thead>
          <tbody>
          {props.user.kycList.map(kyc => (
            <TableRow key={kyc.id} {...kyc}/>
          ))}
          </tbody>
        </Table>
        <TablePagination items={props.user.kycList.length} total={props.user.kycCount}
                         options={props.options} setOptions={props.setOptions}/>
      </Card.Body>
      <EditKYCModal/>
      <DeleteKYCModal/>
    </Card>
  );
});
