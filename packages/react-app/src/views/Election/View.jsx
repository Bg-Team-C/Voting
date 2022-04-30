import React, { useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";

import { Table, Button, Row, Col, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";
import { encrypt } from "../../encryption";
import { encryptCandidateAddress } from "../../rsaEncryption";

export default function ViewElection({ schoolRead, votingRead, votingWrite, tx, id }) {
  const { path } = useRouteMatch();

  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [electionId, setElectionId] = useState(id);

  // Check if user has already voted in this election.
  const vote = async address => {
<<<<<<< HEAD
    await tx(votingWrite.vote(encrypt(address), electionId));
=======
    await tx(votingWrite.vote(encryptCandidateAddress(address), 0));
>>>>>>> 4b8ed3f51d968780fe01e73d098312bed1d16488
  };

  const loadElection = async () => {
    setElection(await votingRead.getElection(electionId));
  };

  const viewResults = async () => {
    const results = await votingRead.viewResults(electionId);

    setCandidates(prev => prev.map(candidate => {
        // Get index of candidate in result
        const candidateIndex = results[0].findIndex((value, index) => {
          return candidate[0] === value;
        });
        return [...candidate, BigNumber.from(results[1][candidateIndex]).toNumber()];
      }),
    );
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
