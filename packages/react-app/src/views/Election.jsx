import React, { useState } from "react";
import { utils } from "ethers";

import { CandidateField } from "../components";
import { Table, Button } from "antd";

export default function Election({
  votingRead,
  votingWrite,
  tx
    }) {

    let [dataSource, setFiles] = useState([]);


    const columns = [
    {
        title: 'CandidateId',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Candidate Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
    },
    ];

    const loadFiles = async () => {
        const candidatesList = await tx(votingRead.getCandidates());
        setFiles(
        () => {
            for (let i = 0; i < candidatesList[0].length; i++) {
                dataSource.push(
                    {
                        "id": candidatesList[0][i],
                        "name": candidatesList[1][i],
                        "position": candidatesList[2][i]
                    }
                )
                    console.log(dataSource)
            }
        });
    };

    return (
    
    <div>
        <div>
            <CandidateField contract={votingWrite} tx={tx}></CandidateField>
        </div>
        <div>
            <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }} onClick={loadFiles}>
                Load Files
            </Button>{" "}
            <Table dataSource={dataSource} columns={columns} />;
        </div>
    </div>
    );
}
