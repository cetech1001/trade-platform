import {Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {fetchKYC} from "@coinvant/store";
import { PaginationOptions } from '@coinvant/types';
import {useEffect, useState} from "react";
import {KycTable} from "./partials/kyc-table";

interface IProps {
  fetchKYC: (options?: PaginationOptions) => void;
}

const actions = {
  fetchKYC,
}

export const KYC = connect(null, actions) ((props: IProps) => {
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchKYC(options);
  }, [options, props]);

  return (
    <Row>
      <Col xs={12} xl={12} className="mb-4">
        <KycTable options={options} setOptions={setOptions}/>
      </Col>
    </Row>
  );
});
