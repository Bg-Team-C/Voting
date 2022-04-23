import React, { useState } from "react";
import { utils } from "ethers";

import { Table, Button, Row, Col, Card, Upload, message } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Stakeholders({ schoolWrite, votingRead, votingWrite, tx }) {
  const [stakeholdersCSV, setCustomersCsvFile] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [names, setNames] = useState([]);
  const [roles, setRoles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    // const list = [];
    const csvAddresses = [];
    const csvNames = [];
    const csvRoles = [];

    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          // list.push(obj);
          csvAddresses.push(obj["address"]);
          csvNames.push(obj["name"]);
          csvRoles.push(obj["role"]);
        }
      }
    }
    if (csvAddresses.length > 200) {
      message.info("You have more than 200. It should be atmost 200 per batch");
      setCustomersCsvFile([]);
      return;
    }

    setAddresses(csvAddresses);
    setNames(csvNames);
    setRoles(csvRoles);
  };

  const handleChange = ({ fileList }) => {
    setCustomersCsvFile(fileList);

    // Parse through CSV files
    if (fileList.length === 0) {
      setAddresses([]);
      setNames([]);
      setRoles([]);

      return;
    }

    const file = fileList[0].originFileObj;
    const reader = new FileReader();
    reader.onload = evt => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
      <Card title="Upload Stakeholders">
        <div style={{ padding: 8 }}>
          <Upload
            accept=".csv,.xlsx,.xls"
            action="#"
            listType="picture-card"
            fileList={stakeholdersCSV}
            onChange={handleChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            {stakeholdersCSV.length === 0 && (
              <div>
                <div style={{ marginTop: 8 }}>Upload csv</div>
              </div>
            )}
          </Upload>
          <div style={{ padding: 8 }}>
            <Button
              type={"primary"}
              loading={uploading}
              onClick={async () => {
                setUploading(true);
                await tx(schoolWrite.addStakeholders(addresses, names, roles));
                setUploading(false);
                setCustomersCsvFile([]);
              }}
              disabled={stakeholdersCSV.length === 0}
            >
              Upload
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
