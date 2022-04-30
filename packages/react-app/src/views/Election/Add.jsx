import React, { useCallback, useEffect, useState } from "react";
import { utils } from "ethers";

import { CandidateField } from "../../components";
import { Table, Button, Input, Pagination, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import { Navigation } from "./navigation";
import { decrypt, encrypt } from "../../encryption";

export default function AddElection({ role, schoolRead, votingRead, votingWrite, tx }) {
  const { path } = useRouteMatch();

  const [stakeholders, setStakeHolders] = useState([]);
  const [electionPosition, setPositionInput] = useState("");
  const [howMany, setHowMany] = useState(5);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  // const loadStakeholders = id => {
  //   alert("Starting Election");
  //   const fetchedStakeHolders = [];
  //   if (fetchedStakeHolders.length === 0) {
  //     alert("All Stakeholders have been loaded");
  //     return false;
  //   }
  //   setStakeHolders(prev => prev.concat(fetchedStakeHolders));
  //   setCursorPosition(prev => prev + howMany - 1);
  //   setCurrentPage(prev => prev + 1);
  // };

  const loadStakeholders = useCallback( async () => {
    setStakeHolders(await schoolRead.getStakeholders());
  });

  useEffect(() => {
    loadStakeholders();
  })

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCandidates(selectedRowKeys);
    },
  };

  // const handlePageNumberChange = value => {
  //   if (value > currentPage || value * howMany > cursorPosition + 1) {
  //     loadStakeholders();
  //   }
  // };

  // Get all stakeholders

  const dataSource = [];

  // const dataSource = [
  //   {
  //     key: "0x679090889779897987",
  //     name: "John",
  //     address: "0x679090889779897987",
  //     role: "Teacher",
  //   },
  //   {
  //     key: "0x679090889779897989",
  //     name: "John",
  //     address: "0x679090889779897987",
  //     role: "Teacher",
  //   },
  //   {
  //     key: "40x679090889779897987",
  //     name: "John",
  //     address: "0x679090889779897987",
  //     role: "Teacher",
  //   },
  // ];

  if (stakeholders && stakeholders.length && stakeholders[0].length) {
    stakeholders[0].map((address, index) => {
      const name = stakeholders[1][index];
      const role = stakeholders[2][index];
      return dataSource.push({
        key: address,
        name: <div>{name}</div>,
        address: <div>{address}</div>,
        role: <div>{role}</div>,
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  const additionalNav = [
    <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }}>
      {/* <Link className="add" onClick={loadStakeholders} to="#">
        Load Stakeholders
      </Link> */}
    </Button>,
  ];
  return (
    <Card title="Add an Election">
      <div style={{ padding: 8 }}>
        <Navigation buttons={additionalNav} />
        <div>
          <Input
            size="large"
            placeholder="Type Position of Leadership"
            onChange={e => setPositionInput(e.target.value)}
          />
        </div>
        <div>
          <p> Choose candidates. Filter and Search to quickly find them </p>

          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            // pagination={{
            //   defaultCurrent: currentPage,
            //   // onChange: { handlePageNumberChange },
            //   pageSize: 10,
            //   total: "dummy",
            //   showSizeChanger: false,
            //   current: currentPage,
            //   hideOnSinglePage: true,
            // }}
          />
        </div>
        <div style={{ padding: 8 }}>
          <Button
            type={"primary"}
            loading={submitting}
            onClick={async () => {
              setSubmitting(true);
              console.log("Selected Candidates >>> ", selectedCandidates);
              await tx(votingWrite.addElection(selectedCandidates, electionPosition));
              setSubmitting(false);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}
