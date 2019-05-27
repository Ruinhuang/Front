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

class MyAds extends React.Component {
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
        this.adType = null
        this.adStatus = null
        this.formList = [
            {
                type: 'SELECT',
                label: '广告类型',
                field: 'type',
                placeholder: '买入',
                initialValue: 'BUY',
                width: 100,
                list: [{ id: 'BUY', name: '买入' }, { id: 'SELL', name: '卖出' }]
            },
            {
                type: 'SELECT',
                label: '广告状态',
                field: 'status',
                placeholder: '已发布',
                initialValue: 'PUBLISH',
                width: 100,
                list: [{ id: 'PUBLISH', name: '已发布' }, { id: 'UNPUBLISH', name: '未发布' },]
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
    unpublish = () => {
        Ajax.ajax(
            'get',
            '/ad/close',
            { "X-BM-USER-ID": this.props.user.userId },
            {
                adId: this.state.selectedItems[0].id
            },
            'http://45.76.146.27',
        )
            .then(() => {
                this.setState((prevState) => ({
                    dataSource: selectTag([...prevState.dataSource], prevState.selectedItems),
                    selectedItems: [], selectedRowKeys: []
                }))
            })
            .catch(
                () => message.error("下架失败")
            )
    }

    // 从 baseForm里提交的对象 formField
    request = (formField) => {
        if (formField) {
            this.adType = formField.type
            this.adStatus = formField.status
        }
        this.setState(
            () => ({
                loading: true,
            })
        )
        Ajax.ajax(
            'get',
            '/ad/page',
            { "X-BM-USER-ID": this.props.user.userId },
            {
                coinId: 1,
                type: this.adType,
                status: this.adStatus,
                currentPage: this.page

            },
            'http://45.76.146.27',
        )
            .then(
                data => {
                    //自己为每条数据制造唯一的key
                    data.data.data.forEach((item) => (item.key = item.id))
                    console.log(data.data.data)
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
            .catch(
                () => message.error("数据渲染失败")
            )
    }

    render = () => {
        const statusMap = {
            'PUBLISH': <Badge status="success" text="发布中" />,
            'UNPUBLISH': <Badge status="error" text="未发布" />,
        }
        const adTypeMap = {
            'BUY': <Badge status="success" text="买入" />,
            'SELL': <Badge status="default" text="卖出" />,
        }
        const columns = [
            {
                title: 'firstTraeTime',
                key: 'merchantInfoVO',
                width: 60,
                dataIndex: 'merchantInfoVO.firstTradeTime',
            },
            {
                title: 'count',
                key: 'count',
                width: 60,
                dataIndex: 'count',
            },
            {
                title: 'maxTradeAmount',
                key: 'maxTradeAmount',
                width: 60,
                dataIndex: 'maxTradeAmount',
            },
            {
                title: 'finishCount',
                key: 'finishCount',
                width: 60,
                dataIndex: 'finishCount',
            },
            {
                title: 'frozenCount',
                key: 'frozenCount',
                width: 60,
                dataIndex: 'frozenCount',
            },
            {
                title: 'price',
                key: 'price',
                width: 60,
                dataIndex: 'price',
            },
            {
                title: '广告类型',
                key: 'type',
                width: 60,
                dataIndex: 'type',
                render: (text) => {
                    return adTypeMap[text]
                },
            },
            {
                title: '状态',
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
                    <AdForm
                        adInfo={this.state.selectedItems}
                        wrappedComponentRef={(inst) => this.userForm = inst}
                    />
                </Modal>
                <Card>
                    {/* <Button
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
              </Button> */}
                    <Button
                        type="danger"
                        icon="delete"
                        onClick={
                            () => {
                                if (this.state.selectedItems.length < 1) return
                                Modal.confirm({
                                    title: "下架广告",
                                    // content: JSON.stringify(this.state.selectedItems),
                                    content: "确认要下架此条广告吗？",
                                    onOk: (() => this.unpublish()),
                                }
                                )
                            }
                        }
                    >
                        下架广告
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
                        广告详情
            </Button>
                </Card>
                <Card>
                    <BaseForm layout="inline" submitFunc={this.request} switchFunc={() => { }} formList={this.formList} />
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

class AdForm extends React.Component {

    render() {
        let adInfo = this.props.adInfo[0] || {};
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
                            initialValue: adInfo.status
                        })(
                            <Select>
                                <Option value='PUBLISH'>已发布</Option>
                                <Option value='UNPUBLISH'>未发布</Option>
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

MyAds = Form.create({})(MyAds);
// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(MyAds)
