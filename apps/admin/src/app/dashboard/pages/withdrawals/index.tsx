import {Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {fetchWithdrawals} from "@coinvant/store";
import {FindWithdrawalsQueryParams} from "@coinvant/types";
import {useEffect, useState} from "react";
import {WithdrawalsTable} from "./partials/withdrawals-table";

interface IProps {
  fetchWithdrawals: (options?: FindWithdrawalsQueryParams) => void;
}

const actions = {
  fetchWithdrawals,
}

export const Withdrawals = connect(null, actions) ((props: IProps) => {
  const [options, setOptions] = useState<FindWithdrawalsQueryParams>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchWithdrawals(options);
  }, [options, props]);

  return (
    <Row>
      <Col xs={12} xl={12} className="mb-4">
        <WithdrawalsTable options={options} setOptions={setOptions}/>
      </Col>
    </Row>
  );
});
