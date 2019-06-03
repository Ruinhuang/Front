
import React from "react";
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { goToUrl } from "../../utils"
import { message } from "antd";

class Logout extends React.Component {
    componentDidMount = () => {
        // 安全退出 需要清空本地缓存的token
        sessionStorage.removeItem("token")
        localStorage.removeItem("token")
        this.props.clearLoginData()
        message.info('已安全登出')
    }
    render = () => {
        return (
            goToUrl('/home')
        )
    }
}

const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

const mapDispatchToProps = (dispatch) => {
    return {
        clearLoginData() {
            dispatch(actionCreator.clearLoginData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)