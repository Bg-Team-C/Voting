import React, { useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";

export default function AllElections({ votingRead, votingWrite, tx }) {
  const [elections, setElections] = useState([]);

  const startElection = async id => {
    alert("Starting Election");
    await tx(votingWrite.startElection(id));
  };

  const endElection = async id => {
    alert("Ending Election");
    await tx(votingWrite.stopElection(id));
  };

  const compileResult = async id => {
    // Fetch full details about the election.
    const [startBlock, endBlock] = await votingRead.getBlockNumbers(id);
    const election = await votingRead.getElection(id);

    // Get the candidates into a mapping
    const candidates = election[1];
    let resultObj = {};
    console.log("election >>>>>>>> ", election);
    for (let i = 0; i < candidates.length; i++) {
      resultObj = { ...resultObj, [candidates[i]]: 0 };
    }
    // Go through all events since when the block was deployed until when it was stopped.
    const voteHistory = await votingRead.queryFilter("Voted");
    console.log("History >>> ", voteHistory);
    voteHistory.forEach(data => {
      // Get the candidate and electionId
      const electionId = data.args[0];
      const candidateAddress = data.args[1];

      if (electionId === election[0]) {
        alert("came here");
        resultObj[candidateAddress] += 1;
      }
    });

    // Call Smart contract to Publish election Results
    // Pass the array of Candidates and their results.
    const resultArr = candidates.map(candidate => {
      return resultObj[candidate];
    });

    await tx(votingWrite.collateResult(election[0], candidates, resultArr));
    alert("Result has been successfully compiled");
  };

  const loadElections = async () => {
    setElections(await votingWrite.getElections());
  };

  // Get My Role

  // Get all Elections

  const dataSource = [];
  // const dataSource = [
  //   {
  //     key: "1",
  //     position: "Mike",
  //     electionStatus: "Started",
  //     votingStatus: "Enabled",
  //     action: (
  //       <div className="table-actions">
  //         <Link className="view" onClick={() => startElection(5)} to="#">
  //           Start
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //         <Link className="edit" onClick={() => enableVoting(5)} to="#">
  //           End
  //         </Link>
  //         ' &nbsp;&nbsp;&nbsp; '
  //         <Link className="delete" onClick={() => enableVoting(5)} to="#">
  //           Enable Voting
  //         </Link>
  //         ' &nbsp;&nbsp;&nbsp; '
  //         <Link className="delete" onClick={() => enableVoting(5)} to="#">
  //           Disable Voting
  //         </Link>
  //         ' &nbsp;&nbsp;&nbsp; '
  //         <Link className="delete" onClick={() => compileResult(5)} to="#">
  //           Compile Result
  //         </Link>
  //         ' &nbsp;&nbsp;&nbsp; '
  //         <Link className="delete" onClick={() => compileResult(5)} to="#">
  //           View
  //         </Link>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     position: "John",
  //     electionStatus: "Stopped",
  //     votingStatus: "Disabled",
  //     action: (
  //       <div className="table-actions">
  //         <Link className="view" onClick={() => enableVoting(5)} to="#">
  //           Start
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //         <Link className="edit" onClick={() => enableVoting(5)} to="#">
  //           End
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //         <Link className="delete" onClick={() => enableVoting(5)} to="#">
  //           Enable Voting
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //         <Link className="delete" onClick={() => enableVoting(5)} to="#">
  //           Disable Voting
  //         </Link>
  //         ' &nbsp;&nbsp;&nbsp; '
  //         <Link className="delete" onClick={() => compileResult(5)} to="#">
  //           Compile Result
  //         </Link>
  //         &nbsp;&nbsp;&nbsp;
  //         <Link className="delete" onClick={() => compileResult(5)} to="#">
  //           View
  //         </Link>
  //       </div>
  //     ),
  //   },
  // ];

  if (elections && elections.length && elections[0].length) {
    elections[0].map((id, index) => {
      const position = elections[2][index];
      const isActive = elections[3][index];
      const isEnded = elections[4][index];

      return dataSource.push({
        key: id,
        position: <div>{position}</div>,
        electionStatus: <div>{!isActive && isEnded ? "Ended" : isActive ? "Started" : "Not Started"}</div>,
        action: (
          <div className="table-actions">
            <Link className="view" onClick={async () => await startElection(id)} to="#">
              Start
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="edit" onClick={async () => await endElection(id)} to="#">
              End
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="disable" onClick={async () => await compileResult(id)} to="#">
              Compile Result
            </Link>
            ' &nbsp;&nbsp;&nbsp;'
            <Link className="disable" to={`/viewElection/${id}`}>
              View
            </Link>
          </div>
        ),
      });
    });
  }

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Election Status",
      dataIndex: "electionStatus",
      key: "electionStatus",
      filters: [
        {
          text: "Started",
          value: "Started",
        },
        {
          text: "Not Started",
          value: "Not Started",
        },
        {
          text: "Ended",
          value: "Ended",
        },
      ],
      onFilter: (value, record) => record.electionStatus.indexOf(value) === 0,
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
      <Link className="add" onClick={loadElections} to="#">
        Load Elections
      </Link>
    </Button>,
  ];
  return (
    // <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
    <Card title="All Elections">
      <div style={{ padding: 8 }}>
        <Navigation buttons={additionalNav} />
        <div>
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    </Card>
    // </div>
  );
}
