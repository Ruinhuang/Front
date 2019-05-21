import React from 'react';
import { connect } from "react-redux"
import { actionCreator } from "../../redux/action"
import { Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'
import BaseForm from '../../components/BaseForm'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class orderTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: null,
            loading: false,
            tableType: "radio",
            dataSource: [],
            allSource: [],
            selectedRowKeys: [],
            selectedItems: [],
            pagination: {},
            sortOrder: false,
        }
        this.page = 1
        this.orderType = null
        this.orderStatus = null
        this.formList = [
            {
                type: 'SELECT',
                label: '订单类型',
                field: 'type',
                placeholder: '买入',
                initialValue: 'BUY',
                width: 100,
                list: [{ id: 'BUY', name: '买入' }, { id: 'SELL', name: '卖出' }]
            },
            {
                type: 'SELECT',
                label: '订单状态',
                field: 'status',
                placeholder: '等待支付',
                initialValue: 'WAIT_PAY',
                width: 100,
                list: [
                    { id: 'NEW', name: "新建" },
                    { id: 'WAIT_PAY', name: "等待支付" },
                    { id: 'WAIT_RELEASE', name: "等待放币" },
                    { id: 'FINISH', name: "订单完成" },
                    { id: 'CANCEL', name: "订单取消" },
                    { id: 'HOLD', name: "订单挂起" },
                    { id: 'INIT_FAIL', name: "下单失败" },
                ]
            },
        ]
    }

    changeTableType = checked => {
        this.setState(
            () => ({
                selectedRowKeys: [],
                selectedItems: [],
                tableType: checked ? "checkbox" : "radio",
            })
        )
    }
    cancelOrder = () => {
        Ajax.ajax(
            'get',
            '/order/cancel_order',
            { "X-BM-USER-ID": this.props.user.userId.toString() },
            {
                orderId: this.state.selectedItems[0].id
            },
            'http://45.76.146.27',
        )
            .then(() => {
                this.setState((prevState) => ({
                    dataSource: selectTag([...prevState.dataSource], prevState.selectedItems),
                    selectedItems: [], selectedRowKeys: []
                }))
            })
    }

    paidOrder = () => {
        Ajax.ajax(
            'get',
            '/order/paid',
            { "X-BM-USER-ID": this.props.user.userId.toString() },
            {
                orderId: this.state.selectedItems[0].id
            },
            'http://45.76.146.27',
        )
            .then(() => {
                this.setState((prevState) => ({
                    dataSource: selectTag([...prevState.dataSource], prevState.selectedItems),
                    selectedItems: [], selectedRowKeys: []
                }))
            })
    }

    releaseCoin = () => {
        Ajax.ajax(
            'get',
            '/order/release_coin',
            { "X-BM-USER-ID": this.props.user.userId.toString() },
            {
                orderId: this.state.selectedItems[0].id
            },
            'http://45.76.146.27',
        )
            .then(() => {
                this.setState((prevState) => ({
                    dataSource: selectTag([...prevState.dataSource], prevState.selectedItems),
                    selectedItems: [], selectedRowKeys: []
                }))
            })
    }
    // 从 baseForm里提交的对象 formField
    request = (formField) => {
        if (formField) {
            this.orderType = formField.type
            this.orderStatus = formField.status
        }
        this.setState(
            () => ({
                loading: true,
            })
        )
        Ajax.ajax(
            'get',
            '/order/query_order_conditions',
            {},
            {
                coinId: 1,
                type: this.orderType,
                status: this.orderStatus,
                currentPage: this.page

            },
            'http://45.76.146.27',
        )
            .then(
                data => {
                    //自己为每条数据制造唯一的key
                    data.data.data.forEach((item) => (item.key = item.id))
                    this.setState(
                        () => (
                            {
                                dataSource: data.data.data,
                                loading: false,
                                pagination: pagination(data.data, (current) => {
                                    this.page = current
                                    this.request()
                                }),
                            }
                        )
                    )
                })
    }

    render = () => {
        const statusMap = {
            'NEW': "新建",
            'WAIT_PAY': "等待支付",
            'WAIT_RELEASE': "等待放币",
            'FINISH': "订单完成",
            'CANCEL': "订单取消",
            'HOLD': "订单挂起",
            'INIT_FAIL': "下单失败",
        }
        const orderTypeMap = {
            'BUY': <Badge status="success" text="买入" />,
            'SELL': <Badge status="default" text="卖出" />,
        }
        const columns = [
            {
                title: '订单ID',
                key: 'id',
                width: 30,
                dataIndex: 'id',
            },
            {
                title: '用户ID',
                key: 'uid',
                width: 30,
                dataIndex: 'uid',
            },
            {
                title: '商户ID',
                key: 'merchantId',
                width: 30,
                dataIndex: 'merchantId',
            },
            {
                title: '广告ID',
                key: 'adId',
                width: 30,
                dataIndex: 'adId',
            },
            {
                title: '订单编号',
                key: 'orderNo',
                width: 30,
                dataIndex: 'orderNo',
            },

            {
                title: '下单时间',
                key: 'orderTime',
                width: 30,
                dataIndex: 'orderTime',
            },
            {
                title: '支付时间',
                key: 'payTime',
                width: 60,
                dataIndex: 'payTime',
            },
            {
                title: '放币时间',
                key: 'releaseTime',
                width: 60,
                dataIndex: 'releaseTime',
            },
            {
                title: '数量',
                key: 'count',
                width: 60,
                dataIndex: 'count',
            },
            {
                title: '单价',
                key: 'price',
                width: 60,
                dataIndex: 'price',
            },
            {
                title: '订单类型',
                key: 'type',
                width: 60,
                dataIndex: 'type',
                render: (text) => {
                    return orderTypeMap[text]
                },
            },
            {
                title: '订单状态',
                key: 'status',
                width: 60,
                dataIndex: 'status',
                render: (text) => {
                    return statusMap[text]
                },
                // sorter: (a, b) => {
                //     return a.status - b.status
                // },
                // sortOrder: this.state.sortOrder,
            },
            // 行内操作按钮
            // {
            //   title: 'operation',
            //   key: 'operation',
            //   width: 80,
            //   render: (text, item, index, ) => {
            //     return (
            //       <div>
            //         <Button
            //           className="link-button"
            //           icon='edit'
            //           type="primary"
            //           onClick={
            //             () => {
            //               Modal.confirm({
            //                 title: 'edit',
            //                 content: JSON.stringify(item),
            //                 onOk: (callback = () => {
            //                   message.info('修改成功')
            //                 },
            //                 ) => {
            //                   message.warning('这里改写成向后端发送验证的流程// TODO')
            //                   callback()
            //                   if (this.state.tableType === "checkbox") {
            //                     this.setState((prevState) => ({
            //                       selectedItems: selectTag([...prevState.selectedItems], [item]),
            //                       selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
            //                     }))
            //                   }
            //                 },
            //                 onCancel: () => {
            //                   if (this.state.tableType === "checkbox") {
            //                     this.setState((prevState) => ({
            //                       selectedItems: selectTag([...prevState.selectedItems], [item]),
            //                       selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
            //                     }))
            //                   }
            //                 }
            //               },
            //               )
            //             }
            //           }
            //         >
            //           编辑
            //         </Button>
            //         <Button
            //           className="link-button"
            //           type="danger"
            //           icon='delete'
            //           onClick={
            //             () => {
            //               Modal.confirm({
            //                 title: 'delete',
            //                 content: JSON.stringify(item),
            //                 onOk: (callback = () => {
            //                   message.info('删除成功')
            //                   this.setState((prevState) => ({
            //                     dataSource: removeFromArray([...prevState.dataSource], [item]),
            //                     selectedItems: removeFromArray([...prevState.selectedItems], [item]),
            //                     selectedRowKeys: removeFromArray([...prevState.selectedRowKeys], [item.key])
            //                   }))
            //                 },
            //                 ) => {
            //                   message.warning('这里改写成向后端发送验证的流程// TODO')
            //                   callback()
            //                 },
            //                 onCancel: () => {
            //                   if (this.state.tableType === "checkbox") {
            //                     this.setState((prevState) => ({
            //                       selectedItems: selectTag([...prevState.selectedItems], [item]),
            //                       selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
            //                     }))
            //                   }
            //                 }
            //               }
            //               )
            //             }
            //           }
            //         >
            //           删除
            //         </Button>

            //       </div>
            //     )
            //   }
            // },
        ];

        return (
            <div>
                <Modal
                    visibleModal={this.state.visibleModal}
                    title={this.state.visibleModal}
                    visible={this.state.visibleModal !== null}
                    onCancel={() => {
                        this.setState(() => ({ visibleModal: null }))
                    }}
                    footer={null}
                >
                    <OrderForm
                        orderInfo={this.state.selectedItems}
                        wrappedComponentRef={(inst) => this.userForm = inst}
                    />
                </Modal>
                <Card>
                    <BaseForm layout="inline" submitFunc={this.request} switchFunc={() => { }} formList={this.formList} />
                </Card>
                <Card>
                    <Button
                        type="danger"
                        icon="delete"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: "取消订单",
                                    // content: JSON.stringify(this.state.selectedItems),
                                    content: "取消订单？",
                                    onOk: (() => this.cancelOrder()),
                                }
                                )
                            }
                        }
                    >
                        取消订单
            </Button>
                    <Button
                        type="primary"
                        icon="delete"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: "确认付款",
                                    // content: JSON.stringify(this.state.selectedItems),
                                    content: "已到账?",
                                    onOk: (() => this.paidOrder()),
                                }
                                )
                            }
                        }
                    >
                        确认付款
            </Button>
                    <Button
                        type="primary"
                        icon="finish"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: "放币",
                                    // content: JSON.stringify(this.state.selectedItems),
                                    content: "确认发货?",
                                    onOk: (() => this.releaseCoin()),
                                }
                                )
                            }
                        }
                    >
                        放币
            </Button>
                    <Button
                        type="info"
                        icon="info"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: "查看详情",
                                    content: JSON.stringify(this.state.selectedItems),
                                }
                                )
                            }
                        }
                    >
                        订单详情
            </Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        size="small"
                        bordered
                        loading={this.state.loading}
                        columns={columns}
                        // 关闭列表 滚动
                        // scroll={{ 
                        //   x: 1440,
                        //   y: 580 
                        // }}  
                        dataSource={this.state.dataSource}
                        //若没有pagination属性，会根据antd中table的默认样式，每页显示10个数据，将这一次请求获得的数据进行纯前端样式的静态的分页，*点击切换页面按钮不会发送请求
                        // 若 有 pagination={false}的 设定，table不会分页， 此次请求获得的所有数据会全部显示出来
                        pagination={this.state.pagination}
                        // pagination={false}
                        // onChange 事件会自动传入这三个参数
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
                            onDoubleClick: () => {
                                Modal.confirm({
                                    title: '详细信息',
                                    content: `
                  ${selectedItem.name}
                  ${selectedItem.email}
                `,
                                    onCancel: () => { },
                                    onOk: () => { },
                                })
                            },
                        }
                        )}
                    />
                </div>
            </div >
        )
    }
}

class OrderForm extends React.Component {

    render() {
        let orderInfo = this.props.orderInfo[0] || {};
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        };

        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal">
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status', {
                            initialValue: orderInfo.status
                        })(
                            <Select>
                                <Option value='NEW'> "新建"</Option>
                                <Option value='WAIT_PAY'> "等待支付"</Option>
                                <Option value='WAIT_RELEASE'> "等待放币"</Option>
                                <Option value='FINISH'> "订单完成"</Option>
                                <Option value='CANCEL'> "订单取消"</Option>
                                <Option value='HOLD'> "订单挂起"</Option>
                                <Option value='INIT_FAIL'> "下单失败"</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button
                        onClick={() => { message.warning('这里改写成向后端发送验证的流程// TODO') }}
                    >
                        提交
          </Button>
                </FormItem>
            </Form>
        );
    }
}

orderTable = Form.create({})(orderTable);
// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(orderTable)
