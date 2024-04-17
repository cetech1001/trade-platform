import {Button, ButtonGroup, Card, Dropdown, Nav, Pagination, Table} from "@themesberg/react-bootstrap";
import {Link} from "react-router-dom";
import moment from "moment-timezone";
import {FC, useMemo} from "react";

interface TableRowProps {
  invoiceNumber: number;
  subscription: string;
  price: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export const TransactionsTable = () => {
  const transactions = useMemo(() => ([
    {
      "invoiceNumber": 300500,
      "status": "Paid",
      "subscription": "Platinum Subscription Plan",
      "price": "799,00",
      "issueDate": moment().subtract(1, "days").format("DD MMM YYYY"),
      "dueDate": moment().subtract(1, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300499,
      "status": "Paid",
      "subscription": "Platinum Subscription Plan",
      "price": "799,00",
      "issueDate": moment().subtract(2, "days").format("DD MMM YYYY"),
      "dueDate": moment().subtract(2, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300498,
      "status": "Paid",
      "subscription": "Platinum Subscription Plan",
      "price": "799,00",
      "issueDate": moment().subtract(2, "days").format("DD MMM YYYY"),
      "dueDate": moment().subtract(2, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300497,
      "status": "Paid",
      "subscription": "Flexible Subscription Plan",
      "price": "233,42",
      "issueDate": moment().subtract(3, "days").format("DD MMM YYYY"),
      "dueDate": moment().subtract(3, "days").add(1, "month").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300496,
      "status": "Due",
      "subscription": "Gold Subscription Plan",
      "price": "533,42",
      "issueDate": moment().subtract(1, "day").subtract(1, "month").format("DD MMM YYYY"),
      "dueDate": moment().subtract(1, "day").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300495,
      "status": "Due",
      "subscription": "Gold Subscription Plan",
      "price": "533,42",
      "issueDate": moment().subtract(3, "days").subtract(1, "month").format("DD MMM YYYY"),
      "dueDate": moment().subtract(3, "days").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300494,
      "status": "Due",
      "subscription": "Flexible Subscription Plan",
      "price": "233,42",
      "issueDate": moment().subtract(4, "days").subtract(1, "month").format("DD MMM YYYY"),
      "dueDate": moment().subtract(4, "days").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300493,
      "status": "Canceled",
      "subscription": "Gold Subscription Plan",
      "price": "533,42",
      "issueDate": moment().subtract(20, "days").subtract(1, "month").format("DD MMM YYYY"),
      "dueDate": moment().subtract(20, "days").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300492,
      "status": "Canceled",
      "subscription": "Platinum Subscription Plan",
      "price": "799,00",
      "issueDate": moment().subtract(2, "months").format("DD MMM YYYY"),
      "dueDate": moment().subtract(3, "months").format("DD MMM YYYY")
    },
    {
      "invoiceNumber": 300491,
      "status": "Paid",
      "subscription": "Platinum Subscription Plan",
      "price": "799,00",
      "issueDate": moment().subtract(6, "days").format("DD MMM YYYY"),
      "dueDate": moment().subtract(6, "days").add(1, "month").format("DD MMM YYYY")
    }
  ]), []);
  const totalTransactions = transactions.length;

  const TableRow: FC<TableRowProps> = (props) => {
    const statusVariant = props.status === "Paid" ? "success"
      : props.status === "Due" ? "warning"
        : props.status === "Canceled" ? "danger" : "primary";

    return (
      <tr>
        <td>
          <Card.Link as={Link} to={'#'} className="fw-normal">
            {props.invoiceNumber}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {props.subscription}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {props.issueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {props.dueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            ${parseFloat(props.price).toFixed(2)}
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
            <th className="border-bottom">#</th>
            <th className="border-bottom">Bill For</th>
            <th className="border-bottom">Issue Date</th>
            <th className="border-bottom">Due Date</th>
            <th className="border-bottom">Total</th>
            <th className="border-bottom">Status</th>
            <th className="border-bottom">Action</th>
          </tr>
          </thead>
          <tbody>
          {transactions.map(t => (
            <TableRow key={`transaction-${t.invoiceNumber}`} dueDate={t.dueDate} invoiceNumber={t.invoiceNumber}
                      issueDate={t.issueDate} price={t.price} status={t.status} subscription={t.subscription}/>
          ))}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>4</Pagination.Item>
              <Pagination.Item>5</Pagination.Item>
              <Pagination.Next>
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> out of <b>25</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};
