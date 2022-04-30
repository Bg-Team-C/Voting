import React, { useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card, Modal, Input, Form } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";
import { decrypt } from "../../encryption";
import { decryptCandidateAddress } from "../../rsaEncryption";

export default function AllElections({ votingRead, votingWrite, tx, schoolRead }) {
  const [elections, setElections] = useState([]);
<<<<<<< HEAD
  const isChairman = async() => await schoolRead.checkRole("Chairman").wait();
  const isTeacher = () =>  schoolRead.checkRole("Teacher");
=======
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [compilingResult, setCompilingResult] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
>>>>>>> 4b8ed3f51d968780fe01e73d098312bed1d16488

  const startElection = async id => {
    alert("Starting Election");
    await tx(votingWrite.startElection(id));
  };

  const endElection = async id => {
    alert("Ending Election");
    await tx(votingWrite.stopElection(id));
  };

  const initResultCompilation = id => {
    setSelectedElectionId(id);
    showModal();
  };

  const compileResult = async values => {
    setCompilingResult(true);
    // Fetch full details about the election.
    const [startBlock, endBlock] = await votingRead.getBlockNumbers(selectedElectionId);
    const election = await votingRead.getElection(selectedElectionId);

    // Get the candidates into a mapping
    const candidates = election[1];
    console.log(election);
    let resultObj = {};
    console.log("election >>>>>>>> ", election);
    for (let i = 0; i < candidates.length; i++) {
      resultObj = { ...resultObj, [candidates[i]]: 0 };
    }
    // Go through all events since when the block was deployed until when it was stopped.
    const voteHistory = await votingRead.queryFilter({ name: "Voted" });
    console.log("History >>> ", voteHistory);
<<<<<<< HEAD
    voteHistory.forEach((data) => {
      // Get the candidate and electionId
      const electionId = data.args[0];
      const candidateAddress = decrypt(data.args[1]);

=======
    voteHistory.forEach(data => {
      // Get the candidate and electionId
      const electionId = data.args[0];
      const candidateAddress = decryptCandidateAddress(data.args[1], values.privateKey);
>>>>>>> 4b8ed3f51d968780fe01e73d098312bed1d16488

      if (electionId.eq(election[0])) {
        resultObj[candidateAddress] += 1;
        console.log(candidateAddress);
      }
    });

    // Call Smart contract to Publish election Results
    // Pass the array of Candidates and their results.
    const resultArr = candidates.map(candidate => {
      console.log(resultObj);
      return resultObj[candidate];
    });
<<<<<<< HEAD
    console.log(resultArr)
    await tx(votingWrite.publishResult(election[0], candidates, resultArr));
    alert("Result has been successfully Publish");
  };
=======
    console.log(resultArr);
    await tx(votingWrite.collateResult(election[0], candidates, resultArr));
    alert("Result has been successfully compiled");
>>>>>>> 4b8ed3f51d968780fe01e73d098312bed1d16488

    setCompilingResult(false);
    setIsModalVisible(false);
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
<<<<<<< HEAD
            { !isChairman() ? <Link className="disable" onClick={async () => await compileResult(id)} to="#">
              Publish Result
            </Link> : null}
=======
            <Link className="disable" onClick={() => initResultCompilation(id)} to="#">
              Compile Result
            </Link>
>>>>>>> 4b8ed3f51d968780fe01e73d098312bed1d16488
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
    <>
      <Card title="All Elections">
        <div style={{ padding: 8 }}>
          <Navigation buttons={additionalNav} />
          <div>
            <Table dataSource={dataSource} columns={columns} />;
          </div>
        </div>
      </Card>
      <Modal
        title="Set Private Key to Compile Results"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="compileResult" onFinish={compileResult}>
          <Form.Item name="privateKey" rules={[{ required: true, message: "Missing private key" }]}>
            <Input.TextArea placeholder="Paste Private Key here" />
          </Form.Item>
          <Form.Item>
            <div style={{ paddingTop: 8 }}>
              <Button loading={compilingResult} type="primary" htmlType="submit">
                Compile Result
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
