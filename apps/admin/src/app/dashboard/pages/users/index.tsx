import {Button, Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {addUser, closeModal, editUser, fetchUsers, openModal, removeUser, RootState} from "@coinvant/store";
import {CreateUser, Modals, PaginationOptions, UpdateUser, UserState} from "@coinvant/types";
import {useEffect, useState} from "react";
import {UsersTable} from "./partials/users-table";
import {AddUserModal} from "./partials/add-user";

interface IProps {
  user: UserState;
  activeModal: Modals | null;
  fetchUsers: (options?: PaginationOptions) => void;
  addUser: (payload: CreateUser) => void;
  editUser: (id: string, payload: UpdateUser) => void;
  removeUser: (id: string) => void;
  openModal: (activeModal: Modals) => void;
  closeModal: () => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  activeModal: state.modal.activeModal,
});

const actions = {
  fetchUsers,
  addUser,
  editUser,
  removeUser,
  openModal,
  closeModal,
}

export const Users = connect(mapStateToProps, actions) ((props: IProps) => {
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchUsers(options);
  }, []);

  return (
    <>
      <Row>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <Button variant="outline-primary" onClick={() => props.openModal(Modals.addUser)}>
            Add User
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <UsersTable options={options} setOptions={setOptions}/>
        </Col>
      </Row>
      <AddUserModal/>
    </>
  );
});
