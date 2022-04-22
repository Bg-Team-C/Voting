import { Select, Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from "react";


class CandidateField extends React.Component {
  
  formRef = React.createRef();


    onFinish = async (values) => {
        let name = [];
        let pos = [];
        for (let i = 0; i < values.length; i++) {
            name.push(values[i].name);
            pos.push(values[i].position);
            
        }
        let result = await this.props.tx(this.props.contract.setElectionCandidates(name, pos));
        await result.wait()
        this.formRef.current.resetFields();
    };


    render (){
    return (
            <Form ref={this.formRef} name="dynamic_form_nest_item" onFinish={this.onFinish} autoComplete="off">
                <Form.List name="candidates">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                            {...restField}
                            name={[name, 'Candidate Name']}
                            rules={[{ required: true, message: 'Missing name' }]}
                            >
                            <Input placeholder="Candidate Name" />
                            </Form.Item>
                            <Form.Item
                            {...restField}
                            name={[name, 'position']}
                            rules={[{ required: true, message: 'Missing position' }]}
                            >
                            <Input placeholder="Position" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                        ))}
                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
            </Form>
    );
                        }
}

export default CandidateField;