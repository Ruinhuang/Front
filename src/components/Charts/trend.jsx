import React from "react"
import { Card } from "antd"
import '../../style/common.scss'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";

export default class trend extends React.Component {
  render() {
    const data = [{ day: "1", value: 0.89 }, { day: "2", value: 0.99 }, { day: "3", value: 0.96 }, { day: "4", value: 1.12 }, { day: "5", value: 1.22 }, { day: "6", value: 0.88 }, { day: "7", value: 1.11 }, { day: "8", value: 1.09 }, { day: "9", value: 1.3 }];
    const cols = { value: { min: 0 }, day: { range: [0, 1] } };
    return (
      <div className="content-wrap">
        <Card title="走势">
          <Chart height={420} data={data} scale={cols} forceFit>
            <Axis name="day" />
            <Axis name="value" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="day*value" size={2} />
            <Geom
              type="point"
              position="day*value"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        </Card>
      </div>
    );
  }
}