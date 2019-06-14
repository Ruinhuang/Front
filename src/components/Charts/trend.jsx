import React from "react"
import '../../style/common.scss'
import Ajax from '../../components/Ajax'
import { Chart, Geom, Axis, Tooltip, } from "bizcharts";

export default class Trend extends React.Component {

  state = {
    date: [],
  }

  componentDidMount = () => {
    Ajax.ajax(
      'post',
      '/query/market',
      {},
      {},
      "http://207.148.65.10:8080").then(
        (res) => {
          this.setState(
            () => ({
              data: res.data,
            })
          )
        }
      )

  }
  render() {
    // const cols = { marketPrice: { min: 0 }, marketDate: { range: [0, 1] } };
    const cols = { marketPrice: { range: [0.1, 1] } };
    return (
      <div className="content-wrap">
        <Chart height={420} data={this.state.data} scale={cols} forceFit>
          <Axis name="marketDate" />
          <Axis name="marketPrice" />
          <Tooltip crosshairs={{ type: "y" }} />
          <Geom type="line" position="marketDate*marketPrice" size={2} />
          <Geom type="point" position="marketDate*marketPrice" size={2} shape={"circle"}
            style={{ stroke: "#fff", lineWidth: 1 }}
          />
        </Chart>
      </div>
    );
  }
}