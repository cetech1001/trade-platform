import {Button, ButtonGroup, Card, Dropdown, Nav, Pagination, Table} from "@themesberg/react-bootstrap";
import {Link} from "react-router-dom";
import {User, UserStatus} from "@coinvant/types";

interface IProps {
  users: User[];
}

export const UsersTable = (props: IProps) => {
  const TableRow = (props: User) => {
    const statusVariant = props.status === UserStatus.active ? "success" : "danger";

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {props.name}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {props.email}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            ${parseFloat(props.walletBalance).toFixed(2)}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {props.password}
          </span>
        </td>
        <td>
          <span className={`fw-normal text-${statusVariant}`}>
            {props.status}
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
              <Dropdown.Item>
                <i className="fa-solid fa-eye me-2" /> View Details
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="fa-solid fa-pen-to-square me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
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
        <Table hover className="user-table align-items-center">
          <thead>
          <tr>
            <th className="border-bottom">Name</th>
            <th className="border-bottom">Email address</th>
            <th className="border-bottom">Wallet balance</th>
            <th className="border-bottom">Password</th>
            <th className="border-bottom">Status</th>
            <th className="border-bottom">Action</th>
          </tr>
          </thead>
          <tbody>
          {props.users.map(user => (
            <TableRow key={user.id} {...user}/>
          ))}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev disabled={true}>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Next>
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{props.users.length}</b> out of <b>{props.users.length}</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};
