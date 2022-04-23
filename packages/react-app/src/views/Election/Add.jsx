import React, { useState } from "react";
import { utils } from "ethers";

import { CandidateField } from "../../components";
import { Table, Button, Input, Pagination, Card } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Navigation } from "./navigation";

export default function AddElection({ role, schoolRead, votingRead, votingWrite, tx }) {
  const { path } = useRouteMatch();

  const [stakeholders, setStakeHolders] = useState([]);
  const [electionPosition, setPositionInput] = useState("");
  const [howMany, setHowMany] = useState(5);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const loadStakeholders = id => {
    alert("Starting Election");
    const fetchedStakeHolders = [];
    if (fetchedStakeHolders.length === 0) {
      alert("All Stakeholders have been loaded");
      return false;
    }
    setStakeHolders(prev => prev.concat(fetchedStakeHolders));
    setCursorPosition(prev => prev + howMany - 1);
    setCurrentPage(prev => prev + 1);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCandidates(selectedRowKeys);
    },
  };

  const handlePageNumberChange = value => {
    if (value > currentPage || value * howMany > cursorPosition + 1) {
      loadStakeholders();
    }
  };

  // Get all stakeholders

  // const dataSource = [];

  const dataSource = [
    {
      key: "0x679090889779897987",
      name: "John",
      address: "0x679090889779897987",
      role: "Teacher",
    },
    {
      key: "0x679090889779897989",
      name: "John",
      address: "0x679090889779897987",
      role: "Teacher",
    },
    {
      key: "40x679090889779897987",
      name: "John",
      address: "0x679090889779897987",
      role: "Teacher",
    },
  ];

  if (stakeholders && stakeholders.length !== 0) {
    stakeholders.map((stakeholder, key) => {
      const { name, address, role } = stakeholder;
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

  return (
    <Card title="All Elections">
      <div style={{ padding: 8 }}>
        <Navigation />
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
            pagination={{
              defaultCurrent: currentPage,
              onChange: { handlePageNumberChange },
              pageSize: 10,
              total: "dummy",
              showSizeChanger: false,
              current: currentPage,
              hideOnSinglePage: true,
            }}
          />
        </div>
        <div style={{ padding: 8 }}>
          <Button
            type={"primary"}
            loading={submitting}
            onClick={async () => {
              setSubmitting(true);
              // await tx(writeContracts.Nxt.batchTokenTransfer(addresses, names, roles));
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
