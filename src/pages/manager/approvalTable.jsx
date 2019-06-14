import React from 'react';
import { connect } from "react-redux"
import { InputNumber, Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'


class ApprovalTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: null,
            loading: true,
            cardLoading: true,
            tableType: "radio",
            dataSource: [],
            selectedRowKeys: [],
            selectedItems: [],
            pagination: {},
            sortOrder: false,
            Fee: null,
            modalContent: undefined,
        }
        this.page = 1
        this.orderType = null
        this.orderStatus = null
    }

    request = () => {
        Ajax.ajax(
            'get',
            '/user/apply/query',
            {},
            { userId: this.props.user.userId },
            'http://207.148.65.10:8080',
            // 'http://192.168.0.105:8080',
        )
            .then(
                data => {
                    data.data.map(item => item.key = item.id)
                    this.setState(
                        () => (
                            {
                                dataSource: data.data,
                                loading: false,
                                pagination: pagination(data, (current) => {
                                    this.page = current
                                    this.request()
                                }),
                            }
                        )
                    )
                })
            .catch(
                () => message.error("数据渲染失败")
            )
    }

    componentDidMount = () => {
        this.request()
    }

    handleVerifyButtonClick = () => {
        Ajax.ajax(
            'post',
            '/user/apply/sale/post',
            {},
            { status: "2", userId: this.state.selectedItems[0].userId },
            "http://207.148.65.10:8080"
        ).then(
            () => {
                message.success("已同意申请")
                this.request()
            }
        )
    }

    handleResetButtonClick = () => {
        Ajax.ajax(
            'post',
            '/user/apply/sale/post',
            {},
            { status: "0", userId: this.state.selectedItems[0].userId },
            "http://207.148.65.10:8080",
            // "http://192.168.0.105:8080",
        ).then(
            () => {
                message.success("已重置")
                this.request()
            }
        )
    }

    handleRejectButtonClick = () => {
        Ajax.ajax(
            'post',
            '/user/apply/sale/post',
            {},
            { status: "3", userId: this.state.selectedItems[0].userId },
            "http://207.148.65.10:8080",
            // "http://192.168.0.105:8080",
        ).then(
            () => {
                message.success("已驳回申请")
                this.request()
            }
        )
    }

    render = () => {
        const statusMap = {
            "2": <Badge status="success" text="已通过" />,
            "1": <Badge status="default" text="待审批" />,
            "3": <Badge status="error" text="已驳回" />,
        }
        const columns = [
            {
                title: 'userName',
                key: 'userName',
                width: 30,
                dataIndex: 'userName',
            },
            {
                title: 'userId',
                key: 'userId',
                width: 30,
                dataIndex: 'userId',
            },
            {
                title: 'status',
                key: 'status',
                width: 30,
                dataIndex: 'status',
                render: (text) => {
                    return statusMap[text]
                }
            },
            {
                title: 'idCode',
                key: 'idCode',
                width: 30,
                dataIndex: 'idCode',
            },
        ]
        return (
            <div>
                <Card>
                    <Button
                        style={{ margin: 10 }}
                        onClick={this.handleResetButtonClick}
                    >
                        重置
                        </Button>
                    <Button
                        style={{ margin: 10 }}
                        type="primary"
                        onClick={this.handleVerifyButtonClick}
                    >
                        确认
                        </Button>
                    <Button style={{ margin: 10 }}
                        type="danger"
                        onClick={this.handleRejectButtonClick}
                    >
                        驳回
                    </Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        size="small"
                        bordered
                        loading={this.state.loading}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        onChange={(pagination, filters, sorter) => {
                            this.setState(() => ({
                                sortOrder: sorter.order
                            }))
                        }}
                        rowSelection={
                            {
                                type: this.state.tableType,
                                selectedRowKeys: this.state.selectedRowKeys,
                                // 点击行首小圆圈才能触发onChange事件
                                onChange: (selectedRowKeys, selectedItems) => {
                                    this.setState(() => ({
                                        selectedRowKeys,
                                        selectedItems,
                                    }),
                                    )
                                }
                            }
                        }
                        onRow={(selectedItem) => ({
                            onClick: () => {
                                if (this.state.tableType === 'checkbox') {
                                    let selectedItems = selectTag([...this.state.selectedItems], [selectedItem])
                                    let selectedRowKeys = selectTag([...this.state.selectedRowKeys], [selectedItem.key])
                                    this.setState(() => ({
                                        selectedRowKeys,
                                        selectedItems,
                                    }))
                                }
                                if (this.state.tableType === 'radio') {
                                    let selectedItems = [selectedItem]
                                    let selectedRowKeys = [selectedItem.key]
                                    this.setState(() => ({
                                        selectedRowKeys,
                                        selectedItems,
                                    }))
                                }
                            },
                            onMouseEnter: () => { },
                        }
                        )}
                    />
                </div >
            </div>
        )
    }
}
// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(ApprovalTable)