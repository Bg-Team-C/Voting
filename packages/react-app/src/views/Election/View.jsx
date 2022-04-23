import React, { useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";

export default function ViewElection({ match, votingRead, votingWrite, tx }) {
  const { path } = useRouteMatch();

  const [candidates, setCandidates] = useState([]);

  // Check if user has already voted in this election.

  const vote = address => {
    alert("Voted");
  };

  // Get all Candidates using match.params.address.

  // const dataSource = [];
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      address: "0x9897987979797798",
      votes: "",
      action: (
        <div className="table-actions">
          <Link className="view" onClick={() => vote(5)} to="#">
            Vote
          </Link>
        </div>
      ),
    },
    {
      key: "2",
      name: "John",
      address: "Stopped",
      votes: "",
      action: (
        <div className="table-actions">
          <Link className="view" onClick={() => vote(5)} to="#">
            Vote
          </Link>
          &nbsp;&nbsp;&nbsp;
        </div>
      ),
    },
  ];

  if (candidates && candidates.length) {
    candidates.map((candidate, key) => {
      const { name, address, votes } = candidate;
      return dataSource.push({
        name: <div>{name}</div>,
        address: <div>{address}</div>,
        votes: <div>{votes}</div>,
        action: (
          <div className="table-actions">
            <Link className="view" onClick={() => vote(address)} to="#">
              Vote
            </Link>
            &nbsp;&nbsp;&nbsp;
          </div>
        ),
      });
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      width: "300px",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "300px",
    },
  ];

  return (
    <Card title="All Elections">
      <div style={{ padding: 8 }}>
        <Navigation />
        <div>
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    </Card>
  );
}
