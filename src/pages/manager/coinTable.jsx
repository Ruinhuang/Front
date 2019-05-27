import React from 'react';
import { connect } from "react-redux"
import { Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'

const FormItem = Form.Item

class CoinTable extends React.Component {
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
            selectedOrderDetail: {},
            modalContent: undefined,
        }
        this.page = 1
        this.orderType = null
        this.orderStatus = null
    }
    componentDidMount = () => {
        Ajax.ajax(
            'get',
            '/coin/list',
            {},
            {},
            'http://45.76.146.27',
        )
            .then(
                data => {
                    data.data.map(item => item.key = item.coinName)
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

    handleCoinDetailButtonClick = () => {
        if (this.state.selectedItems.length < 1) return
        this.setState(
            () => ({
                visibleModal: "Detail",
                modalContent: JSON.stringify(this.state.selectedItems[0]),
                cardLoading: false,

            }))
    }

    handleUpdateFeeButtonClick = () => {
        if (this.state.selectedItems.length < 1) return
        this.setState(
            () => ({
                visibleModal: 'feeRate',
                modalContent: <RateForm
                    coinName={this.state.selectedItems[0].coinName}
                    rateType='feeRate'
                    closeModal={() => this.setState(() => ({ visibleModal: null }))}
                />,
                cardLoading: false,
            }))
    }

    handleUpdateExchangeRateButtonClick = () => {
        if (this.state.selectedItems.length < 1) return
        this.setState(
            () => ({
                visibleModal: 'exchangeRate',
                modalContent: <RateForm
                    coinName={this.state.selectedItems[0].coinName}
                    rateType='exchangeRate'
                    closeModal={() => this.setState(() => ({ visibleModal: null }))}
                />,
                cardLoading: false,
            }))
    }


    render = () => {
        const columns = [
            {
                title: 'coinId',
                key: 'coinId',
                width: 30,
                dataIndex: 'coinId',
            },
            {
                title: 'coinName',
                key: 'coinName',
                width: 30,
                dataIndex: 'coinName',
            },
            {
                title: 'sortNo',
                key: 'sortNo',
                width: 30,
                dataIndex: 'sortNo',
            },
            {
                title: 'precision',
                key: 'precision',
                width: 30,
                dataIndex: 'precision',
            },
            {
                title: 'feeRate',
                key: 'feeRate',
                width: 30,
                dataIndex: 'feeRate',
            },
            {
                title: 'exchangeRate',
                key: 'exchangeRate',
                width: 30,
                dataIndex: 'exchangeRate',
            },
        ]
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
                    <Card loading={this.state.cardLoading}>
                        {this.state.modalContent}
                    </Card>
                </Modal>
                <Card>
                    <Button
                        type="primary"
                        onClick={this.handleUpdateFeeButtonClick}
                    >
                        修改費率
        </Button>
                    <Button
                        type="primary"
                        onClick={this.handleUpdateExchangeRateButtonClick}
                    >
                        修改汇率
        </Button>
                    <Button
                        type="info"
                        icon="info"
                        onClick={this.handleCoinDetailButtonClick}
                    >
                        COIN详情
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
                </div>
            </div>
        )
    }

}
CoinTable = Form.create({})(CoinTable);

class RateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            feeRate: 0,
            exchangeRate: 0,
        }
    }

    handleButtonClick = () => {//绑定提交事件进行校验
        let formInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
        // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const path = this.props.rateType === 'feeRate' ? '/coin/updateFee' : '/coin/updateExchangeRate'
                const data = {
                    coinName: this.props.coinName,
                }
                data[this.props.rateType] = formInfo[this.props.rateType]
                Ajax.ajax(
                    'get',
                    path,
                    {},
                    data,
                    'http://45.76.146.27',
                ).then(
                    (res) => {
                        message.info('修改成功')
                        this.props.closeModal()
                    })
            }
        })
    }

    componentDidMount = () => {
        Ajax.ajax(
            'get',
            '/coin/query',
            {},
            { coinName: this.props.coinName },
            "http://45.76.146.27",
        ).then((data) => {
            if (this.props.rateType === 'feeRate') {
                this.setState(() => {
                    return {
                        feeRate: data.data.feeRate,
                    }
                })
            }
            if (this.props.rateType === 'exchangeRate') {
                this.setState(() => {
                    return {
                        exchangeRate: data.data.exchangeRate,
                    }
                })
            }
        })
    }
    render = () => {
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: 4
            },
            wrapperCol: {
                xs: 24,
                sm: 12
            }
        }
        const { getFieldDecorator } = this.props.form;
        const rateTypeForm = this.props.rateType === 'feeRate' ?
            <FormItem label='feeRate' {...formItemLayout}>
                {getFieldDecorator('feeRate', {
                })(<Input type='number' />)}
            </FormItem>
            :
            <FormItem label='exchangeRate' {...formItemLayout}>
                {getFieldDecorator('exchangeRate', {
                })(<Input type='number' />)}
            </FormItem>
        return (<Form
            layout="horizontal"
        >
            {rateTypeForm}
            <FormItem
                style={{ marginLeft: 'auto', marginRight: 'auto', width: 200, }} >
                <Button type="primary" onClick={this.handleButtonClick}>确认修改</Button>
            </FormItem>
        </Form>
        )
    }
}
RateForm = Form.create()(RateForm)
// props 属性
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(CoinTable)