import React from 'react';
import { connect } from "react-redux"
import { InputNumber, Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import BaseForm from '../../components/BaseForm'
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'


class ApprovalTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: null,
            // loading: true,
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

    request = (status) => {
        Ajax.ajax(
            'get',
            '/get/postcode',
            {},
            {
                userId: this.props.user.userId,
                status: status > 0 ? status : ""
            },
            'http://207.148.65.10:8080',
        )
            .then(
                data => {
                    data.data.map(item => item.key = item.id)
                    data.data.map(item => item.userCode = item.postCode.slice(6, 8))
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
    generateInvitationCode = (s) =>
        (
            Math.random().toString(11).substr(2).slice(2, 8)
            + s +
            Math.random().toString(11).substr(2).slice(2, 4)
        ).toUpperCase()


    handleFormButtonClick = (fieldsValue) => {
        const userCode = fieldsValue.userCode
        const userCodePattern = /^[A-Z][0-9]$/
        if (!userCodePattern.test(userCode)) {
            message.info("请输入正确的推广员代码")
        } else {
            Ajax.ajax(
                'get',
                '/create/postcode',
                {},
                {
                    userId: this.props.user.userId,
                    postCode: this.generateInvitationCode(userCode)
                },
                "http://207.148.65.10:8080"
            ).then(
                () => {
                    message.success("推广码已生成")
                    this.request()
                }
            )
        }
    }
    formList = [
        {
            type: 'INPUT',
            label: '请输入推广员代码',
            field: 'userCode',
            placeholder: null,
            initialValue: null,
            width: 100,
        },
    ]


    render = () => {
        const statusMap = {
            "2": <Badge status="success" text="已使用" />,
            "1": <Badge status="default" text="未使用" />,
        }
        const columns = [
            {
                title: '推广码',
                key: 'postcode',
                width: 30,
                dataIndex: 'postCode',
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
                title: '推广员',
                key: 'userCode',
                width: 30,
                dataIndex: 'userCode',
            },
            {
                title: "生成时间",
                key: 'time',
                width: 30,
                dataIndex: 'createdAt',
            },
        ]
        return (
            <div>
                <Card>
                    <BaseForm layout="inline" submitFunc={this.handleFormButtonClick} formList={this.formList} />
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