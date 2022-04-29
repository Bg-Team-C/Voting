import React, { useEffect, useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";
import { encrypt } from "../../encryption";

export default function ViewElection({ schoolRead, votingRead, votingWrite, tx, id }) {
  const { path } = useRouteMatch();

  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const  [electionId,  setElectionId] = useState(id);

  // Check if user has already voted in this election.
  const vote = async address => {
    await tx(votingWrite.vote(encrypt(address), 0));
  };

  const loadElection = async () => {
    setElection(await votingRead.getElection(electionId));
  };

  const viewResults = async () => {
    const results = await votingRead.viewResults(electionId);
    console.log(results[0])
    console.log(parseInt(results[1][1].toHexString()))
    alert(JSON.stringify(results));
  };

  useEffect(() => {
    if (election) {
      console.log("Election >>> ", election);
      const loadCandidates = async () => {
        const candidatesInfo = await Promise.all(
          election[1].map(async candidateAddr => {
            return await schoolRead.getStakeholder(candidateAddr);
          }),
        );
        console.log("candidates >>> ", candidatesInfo);
        setCandidates(candidatesInfo);
      };
      loadCandidates();
    }
  }, [election]);

  const dataSource = [];
  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "Mike",
  //     address: "0x9897987979797798",
  //     votes: "",
  //     action: (
  //       <div className="table-actions">
  //         <Link className="view" onClick={() => vote(5)} to="#">
  //           Vote
  //         </Link>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     name: "John",
  //     address: "Stopped",
  //     votes: "",
  //     action: (
  //       <div className="table-actions">
  //         <Link className="view" onClick={() => vote(5)} to="#">
  //           Vote
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //       </div>
  //     ),
  //   },
  // ];

  if (candidates && candidates.length) {
    candidates.map((candidate, key) => {
      const [address, name, role, votes] = candidate;
      return dataSource.push({
        key: key,
        name: <div>{name}</div>,
        address: <div>{address}</div>,
        votes: <div>{votes}</div>,
        action: (
          <div className="table-actions">
            <Link className="view" onClick={async () => await vote(address)} to="#">
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
      dataIndex: "name",
      key: "name",
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

  const additionalNav = [
    <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }}>
      <Link className="add" onClick={async () => await loadElection()} to="#">
        Load Election
      </Link>
    </Button>,
    <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }}>
      <Link className="add" onClick={async () => await viewResults()} to="#">
        View Results
      </Link>
    </Button>,
  ];
  return (
    <Card title={`Viewing an Election for`}>
      <div style={{ padding: 8 }}>
        <Navigation buttons={additionalNav} />
        <div>
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    </Card>
  );
}
