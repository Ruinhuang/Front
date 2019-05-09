import { Component } from 'react'
import { connect } from 'react-redux'
import {actionCreator} from '../redux/action'

class TodoList extends Component {
}

const mapStateToProps = (state) => ({user: state.user})

const mapDispatchToProps = (dispatch) => {
    return {
        changeInputValue(e) {
            dispatch(actionCreator.getInputAction(e.target.value))
        },
    }
}

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps, mapDispatchToProps)(TodoList)