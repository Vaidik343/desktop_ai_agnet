import React from "react";
import { useParams } from "react-router-dom";
import BaselineTable from "./BaselineTable";

const BaselineTableWrapper = () => {
  const { agentId } = useParams();
  return <BaselineTable agentId={agentId} />;
};

export default BaselineTableWrapper;
