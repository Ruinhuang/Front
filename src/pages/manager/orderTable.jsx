import React from 'react';
import { Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'
import BaseForm from '../../components/BaseForm'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

export default class adTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: null,
            loading: true,
            tableType: "radio",
            dataSource: [],
            allSource: [],
            selectedRowKeys: [],
            selectedItems: [],
            pagination: {},
            sortOrder: false,
        }
        this.page = 1
        this.formList = [
            {
                type: 'SELECT',
                label: '订单类型',
                field: 'type',
                placeholder: '全部',
                initialValue: '',
                width: 100,
                list: [{ id: '', name: '全部' }, { id: '1', name: '买入' }, { id: '2', name: '卖出' }]
            },
            {
                type: 'SELECT',
                label: '订单状态',
                field: 'status',
                placeholder: '全部',
                initialValue: '1',
                width: 100,
                list: [{ id: '0', name: '全部' }, { id: '1', name: '待付款' }, { id: '2', name: '待确认' }, { id: '3', name: '已完成' }, { id: '4', name: '已过期' }]
            },
        ]
    }

    componentDidMount = () => {
        this.request()
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

    request = () => {
        Ajax.ajax(
            'get',
            '/v1/ads',
            { page: this.page },
            'https://mook.sunlin.fun/mock/9',
        )
            .then(
                data => {
                    this.setState(
                        () => (
                            {
                                dataSource: data.list,
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

    render = () => {
        const statusMap = {
            1: <Badge status="success" text="展示中" />,
            2: <Badge status="error" text="未展示" />,
        }
        const adTypeMap = {
            1: <Badge status="success" text="买入积分" />,
            2: <Badge status="default" text="卖出积分" />,
        }
        const columns = [
            {
                title: 'adID',
                key: 'key',
                width: 80,
                dataIndex: 'key',
            },
            {
                title: '商户',
                key: 'name',
                width: 80,
                dataIndex: 'name',
            },
            {
                title: 'price',
                key: 'price',
                width: 80,
                dataIndex: 'price',
            },
            {
                title: '商户广告类型',
                key: 'adType',
                width: 80,
                dataIndex: 'adType',
                render: (text) => {
                    return adTypeMap[text]
                },
            },
            {
                title: '状态',
                key: 'status',
                width: 80,
                dataIndex: 'status',
                render: (text) => {
                    return statusMap[text]
                },
                sorter: (a, b) => {
                    return a.status - b.status
                },
                sortOrder: this.state.sortOrder,
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
                    <UserForm
                        userInfo={this.state.selectedItems}
                        wrappedComponentRef={(inst) => this.userForm = inst}
                    />
                </Modal>
                <Card>
                    <BaseForm layout="inline" submitFunc={() => { }} switchFunc={() => { }} formList={this.formList} />
                </Card>
                <Card>
                    <Button
                        icon='edit'
                        type="primary"
                        disabled={this.state.selectedItems.length > 1}
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                this.setState(() => ({ visibleModal: 'edit' }))
                            }
                        }
                    >
                        编辑
              </Button>
                    <Button
                        type="danger"
                        icon="delete"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: 'delete',
                                    content: JSON.stringify(this.state.selectedItems),
                                    onOk: (callback = () => {
                                        message.info('删除成功')
                                        this.setState((prevState) => ({
                                            dataSource: selectTag([...prevState.dataSource], prevState.selectedItems),
                                            selectedItems: [], selectedRowKeys: []
                                        }))
                                    },
                                    ) => {
                                        message.warning('这里改写成向后端发送验证的流程// TODO')
                                        callback()
                                    },
                                }
                                )
                            }
                        }
                    >
                        删除
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

class UserForm extends React.Component {

    render() {
        let userInfo = this.props.userInfo[0] || {};
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
                <FormItem label="用户" {...formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            initialValue: userInfo.name
                        })(
                            <Input type="text" placeholder="请输入用户名" />
                        )
                    }
                </FormItem>
                <FormItem label="商户" {...formItemLayout}>
                    {
                        getFieldDecorator('names', {
                            initialValue: userInfo.role
                        })(
                            <RadioGroup>
                                <Radio value={1}>用户</Radio>
                                <Radio value={2}>商户</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status', {
                            initialValue: userInfo.status
                        })(
                            <Select>
                                <Option value={1}>已审核</Option>
                                <Option value={2}>未审核</Option>
                                <Option value={3}>已冻结</Option>
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

UserForm = Form.create({})(UserForm);

// 
class userTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.formList = [
            {
                type: 'SELECT',
                label: '订单类型',
                field: 'type',
                placeholder: '全部',
                initialValue: '',
                width: 100,
                list: [{ id: '', name: '全部' }, { id: '1', name: '买入' }, { id: '2', name: '卖出' }]
            },
            {
                type: 'SELECT',
                label: '订单状态',
                field: 'status',
                placeholder: '全部',
                initialValue: '1',
                width: 100,
                list: [{ id: '0', name: '全部' }, { id: '1', name: '待付款' }, { id: '2', name: '待确认' }, { id: '3', name: '已完成' }, { id: '4', name: '已过期' }]
            },
        ];
    }


    render = () => {
        const columns = [
            {
                title: 'id',
                dataIndex: 'id'
            }, {
                title: '用户名',
                dataIndex: 'username'
            }, {
                title: '性别',
                dataIndex: 'sex',
                render(sex) {
                    return sex === 1 ? '男' : '女';
                }
            }, {
                title: '状态',
                dataIndex: 'state',
                render(state) {
                    let config = {
                        '1': "咸🐟一条",
                    };
                    return config[state];
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday'
            }, {
                title: '联系地址',
                dataIndex: 'address'
            },
        ];

    }
}