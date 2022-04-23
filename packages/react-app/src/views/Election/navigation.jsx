import { Button, Col, Row } from "antd";
import { Link, useRouteMatch } from "react-router-dom";
import AddElection from "./Add";

export function Navigation() {
  return (
    <div>
      <Row gutter={20} align="middle">
        <Col>
          {" "}
          <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }}>
            <Link className="add" to="/AddElection">
              Add Election
            </Link>
          </Button>
        </Col>{" "}
        <Col>
          {" "}
          <Button type={"primary"} style={{ marginTop: 10, marginBottom: 10 }}>
            <Link className="add" to="/Election">
              View all
            </Link>
          </Button>
        </Col>
      </Row>
    </div>
  );
}
