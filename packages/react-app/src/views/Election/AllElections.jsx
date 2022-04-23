import React, { useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";

export default function AllElections({ votingRead, votingWrite, tx }) {

  const [elections, setElections] = useState([]);

  const startElection = id => {
    alert("Starting Election");
  };

  const endElection = id => {
    alert("Ending Election");
  };
  const enableVoting = id => {
    alert("Enable Voting");
  };
  const disableVoting = id => {
    alert("Disable Vdoting");
  };
  const compileResult = async id => {
    // Fetch full details about the election.
    const election = {};
    // Get the candidates into a mapping
    const candidates = [];
    let resultObj = {};
    candidates.foreach(candidate => {
      resultObj = { ...resultObj, candidate: 0 };
    });

    // Go through all events since when the block was deployed until when it was stopped.
    const voteHistory = await votingRead.queryFilter("voteEvent", election.startBlockNum, election.stopBlockNum);

    voteHistory.forEach(data => {
      // Get the candidate and electionId
      const candidateAddress = data.args[0];
      const electionId = data.args[1];

      if (electionId === election.id) {
        resultObj[candidateAddress] += 1;
      }
    });

    // Call Smart contract to Publish election Results
    // Pass the array of Candidates and their results.
    const resultArr = candidates.map(candidate => resultObj[candidate]);

  };

  // Get My Role

  // Get all Elections

  // const dataSource = [];
  const dataSource = [
    {
      key: "1",
      position: "Mike",
      electionStatus: "Started",
      votingStatus: "Enabled",
      action: (
        <div className="table-actions">
          <Link className="view" onClick={() => enableVoting(5)} to="#">
            Start
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="edit" onClick={() => enableVoting(5)} to="#">
            End
          </Link>
          ' &nbsp;&nbsp;&nbsp; '
          <Link className="delete" onClick={() => enableVoting(5)} to="#">
            Enable Voting
          </Link>
          ' &nbsp;&nbsp;&nbsp; '
          <Link className="delete" onClick={() => enableVoting(5)} to="#">
            Disable Voting
          </Link>
          ' &nbsp;&nbsp;&nbsp; '
          <Link className="delete" onClick={() => compileResult(5)} to="#">
            Compile Result
          </Link>
          ' &nbsp;&nbsp;&nbsp; '
          <Link className="delete" onClick={() => compileResult(5)} to="#">
            View
          </Link>
        </div>
      ),
    },
    {
      key: "2",
      position: "John",
      electionStatus: "Stopped",
      votingStatus: "Disabled",
      action: (
        <div className="table-actions">
          <Link className="view" onClick={() => enableVoting(5)} to="#">
            Start
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="edit" onClick={() => enableVoting(5)} to="#">
            End
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="delete" onClick={() => enableVoting(5)} to="#">
            Enable Voting
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="delete" onClick={() => enableVoting(5)} to="#">
            Disable Voting
          </Link>
          ' &nbsp;&nbsp;&nbsp; '
          <Link className="delete" onClick={() => compileResult(5)} to="#">
            Compile Result
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link className="delete" onClick={() => compileResult(5)} to="#">
            View
          </Link>
        </div>
      ),
    },
  ];

  if (elections && elections.length) {
    elections.map((election, key) => {
      const { id, position, electionStatus, votingStatus } = election;
      return dataSource.push({
        key: key + 1,
        position: <div>{position}</div>,
        electionStatus: <div>{electionStatus}</div>,
        votingStatus: <div>{votingStatus}</div>,
        action: (
          <div className="table-actions">
            <Link className="view" onClick={() => startElection(id)} to="#">
              Start
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="edit" onClick={() => endElection(id)} to="#">
              End
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="delete" onClick={() => enableVoting(id)} to="#">
              Enable Voting
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="disable" onClick={() => disableVoting(id)} to="#">
              Disable Voting
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link className="disable" onClick={() => compileResult(id)} to="#">
              Compile Result
            </Link>
            ' &nbsp;&nbsp;&nbsp;'
            <Link className="disable" onClick={() => compileResult(id)} to="#">
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
          text: "Stopped",
          value: "Stopped",
        },
      ],
      onFilter: (value, record) => record.electionStatus.indexOf(value) === 0,
    },
    {
      title: "Voting Status",
      dataIndex: "votingStatus",
      key: "votingStatus",
      filters: [
        {
          text: "Enabled",
          value: "Enabled",
        },
        {
          text: "Disabled",
          value: "Disabled",
        },
      ],
      onFilter: (value, record) => record.votingStatuss.indexOf(value) === 0,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "300px",
    },
  ];

  return (
    // <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
    <Card title="All Elections">
      <div style={{ padding: 8 }}>
        <Navigation />
        <div>
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    </Card>
    // </div>
  );
}
