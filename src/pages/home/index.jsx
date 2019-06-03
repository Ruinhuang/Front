import React from "react"
import { Carousel } from 'antd';
import '../../style/common.scss'
class Home extends React.Component {
  render = () => (
    <Carousel
      autoplay
    >
      <h1>这里放第一张图</h1>
      <h1>这里放第2张图</h1>
      <h1>这里放第3张图</h1>
    </Carousel>
  )
}
export default Home;