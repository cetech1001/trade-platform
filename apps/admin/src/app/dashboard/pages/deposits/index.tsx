import {Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {fetchDeposits} from "@coinvant/store";
import { FindDepositsQueryParams } from '@coinvant/types';
import {useEffect, useState} from "react";
import {DepositsTable} from "./partials/deposits-table";

interface IProps {
  fetchDeposits: (options?: FindDepositsQueryParams) => void;
}

const actions = {
  fetchDeposits,
}

export const Deposits = connect(null, actions) ((props: IProps) => {
  const [options, setOptions] = useState<FindDepositsQueryParams>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchDeposits(options);
  }, [options, props]);

  return (
    <Row>
      <Col xs={12} xl={12} className="mb-4">
        <DepositsTable options={options} setOptions={setOptions}/>
      </Col>
    </Row>
  );
});
