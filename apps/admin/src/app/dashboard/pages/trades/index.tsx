import {Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {fetchTrades} from "@coinvant/store";
import { FindTradesQueryParams } from '@coinvant/types';
import {useEffect, useState} from "react";
import {TradesTable} from "./partials/trades-table";

interface IProps {
  fetchTrades: (query: FindTradesQueryParams) => void;
}

const actions = {
  fetchTrades,
}

export const Trades = connect(null, actions) ((props: IProps) => {
  const [options, setOptions] = useState<FindTradesQueryParams>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchTrades(options);
  }, [options, props]);

  return (
    <Row>
      <Col xs={12} xl={12} className="mb-4">
        <TradesTable options={options} setOptions={setOptions}/>
      </Col>
    </Row>
  );
});
