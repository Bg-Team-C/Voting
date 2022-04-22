import React, { useState } from "react";
import { utils } from "ethers";

import { CandidateField } from "../components";
import { Table, Button } from "antd";

export default function Election({
  votingRead,
  votingWrite,
  tx
    }) {

    let [files, setFiles] = useState([]);


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
        const files = await tx(votingRead.getCandidates());
        // setFiles(
        // () => {
        //     if(candidatesList == undefined) return
        //     for (let i = 0; i < candidatesList[0].length; i++) {
        //         dataSource.push(
        //             {
        //                 //"id": candidatesList[0][i],
        //                 "name": candidatesList[1][i],
        //                 "position": candidatesList[2][i]
        //             }
        //         )
        //             console.log(dataSource)
        //     }
        // });
       setFiles(
      files[0].map((id, index) => {
        return {
          id,
          name: files[1][index],
          position: files[2][index],
        };
      }),
    ); 
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
            <Table dataSource={files} columns={columns} />;
        </div>
    </div>
    );
}
