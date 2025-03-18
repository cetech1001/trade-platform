import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import {Modals, PaginationOptions, User, UserState, UserStatus} from "@coinvant/types";
import {TablePagination} from "../../../../shared/table-pagination";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentUser} from "@coinvant/store";
import {EditUserModal} from "./edit-user";
import {DeleteUserModal} from "./delete-user";

interface IProps {
  options: PaginationOptions;
  setOptions: Dispatch<SetStateAction<PaginationOptions>>;
  user: UserState;
  setCurrentUser: (user: User) => void;
  openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

const actions = {
  setCurrentUser,
  openModal,
};

export const UsersTable = connect(mapStateToProps, actions)((props: IProps) => {
  const TableRow = (user: User) => {
    const statusVariant = useMemo(() =>
      user.status === UserStatus.active ? "success" : "danger", [user]);

    const onEditClick = useCallback(() => {
      props.setCurrentUser(user);
      props.openModal(Modals.editUser);
    }, [user]);

    const onDeleteClick = useCallback(() => {
      props.setCurrentUser(user);
      props.openModal(Modals.deleteUser);
    }, [user]);

    return (
      <tr>
        <td>
	              <span className="fw-normal">
	                {user.name}
	              </span>
        </td>
        <td>
	              <span className="fw-normal">
	                {user.email}
	              </span>
        </td>
        <td>
	              <span className="fw-normal">
	                {user.password}
	              </span>
        </td>
        <td>
	              <span className={`fw-normal text-${statusVariant}`}>
	                {user.status}
	              </span>
        </td>
        <td>
	              <span className={`fw-normal`}>
	                {user.role}
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
              <Dropdown.Item className="text-danger" onClick={onDeleteClick}>
                <i className="fa-solid fa-delete-left me-2"/> Remove
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
        <Table hover className="user-table align-items-center">
          <thead>
          <tr>
            <th className="border-bottom">Name</th>
            <th className="border-bottom">Email address</th>
            <th className="border-bottom">Password</th>
            <th className="border-bottom">Status</th>
            <th className="border-bottom">Role</th>
            <th className="border-bottom">Action</th>
          </tr>
          </thead>
          <tbody>
          {props.user.list.map(user => (
            <TableRow key={user.id} {...user}/>
          ))}
          </tbody>
        </Table>
        <TablePagination itemsCount={props.user.list.length}
                         totalCount={props.user.totalUserCount}
                         options={props.options}
                         totalPages={props.user.totalUserPages}
                         setOptions={props.setOptions}/>
      </Card.Body>
      <EditUserModal/>
      <DeleteUserModal/>
    </Card>
  );
});
