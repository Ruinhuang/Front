import React from 'react';
import { pagination, selectTag, goToUrl } from '../../utils'
import { NavLink } from 'react-router-dom'
import { connect } from "react-redux"
import { Card, Input, Radio, Table, Form, Modal, Button, message, Badge, Select } from 'antd';
import BaseForm from '../../components/BaseForm'
import StepForm from '../../components/StepForm'
import Ajax from '../../components/Ajax'
import '../../style/common.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class Ads extends React.Component {
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
      formKey: Math.random().toString(18).substr(2),
    }
    this.page = 1
    this.adType = 'SELL'
    this.adStatus = null
    this.receivedOrderInfo = {}
    this.formList = [
      {
        type: 'SELECT',
        label: '广告类型',
        field: 'type',
        placeholder: '卖出',
        initialValue: 'SELL',
        width: 100,
        list: [{ id: 'BUY', name: '买入' }, { id: 'SELL', name: '卖出' }]
      },
    ]
  }

  componentWillMount = () => {
    //  初始化载入ads页面时， 将路由跳转到ads/index
    goToUrl('/ads/index')
  }

  componentDidMount = () => {
	  this.request()
  }

  changeFormKey = () => {
    this.setState(() => ({
      formKey: Math.random().toString(18).substr(2),
    }))
  }

  changeTableType = checked => {
    this.setState(
      () => ({
        selectedRowKeys: [],
        selectedItems: [],
        tableType: checked ? "checkbox" : "radio",
      }
      )
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
  // 取消下单
  cancelOrder = () => {
    Ajax.ajax(
      'get',
      '/order/cancel_order',
      { "X-BM-USER-ID": this.props.user.userId },
      {
        orderId: this.receivedOrderInfo.id
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
  formConfirmSubmit = (formConfirm) => {
    const payInfo = {
      // payTypeId, 付款人付款方式ID, int64
      payTypeId: formConfirm.payTypeId,
      // payeeTypeId, 收款人收款方式ID, int64
      payeeTypeId: formConfirm.payeeTypeId,
      orderId: this.receivedOrderInfo.id,
    }
    Ajax.ajax(
      'post',
      '/order/paying',
      { "X-BM-USER-ID": this.props.user.userId },
      payInfo,
      'http://45.76.146.27',
    )
      .then(
        data => {
          Modal.success({
            title: "请等待商户确认"
          })
          goToUrl('/ads/index')
        }
      )
      .catch(
        () => goToUrl("/ads/index")
      )
  }

  formInfoSubmit = (formInfo) => {
    let orderPath = this.state.selectedItems[0].type === "SELL" ? "/order/buy_order" : "/order/sell_order"
    console.log(formInfo)
    Ajax.ajax(
      'post',
      orderPath,
      { "X-BM-USER-ID": this.props.user.userId },
      formInfo,
      'http://45.76.146.27',
    )
      .then(
        data => {
          this.receivedOrderInfo = data.data
          if (this.state.selectedItems[0].type === "SELL") return goToUrl("/ads/confirm")
          else {
            Modal.success({
              title: "请等待商户确认"
            })
            return goToUrl("/ads/index")
          }
        }
      )
  }

  render = () => {
    const statusMap = {
      'PUBLISH': <Badge status="success" text="发布中" />,
      'UNPUBLISH': <Badge status="error" text="未发布" />,
    }
    const adTypeMap = {
      'BUY': <Badge status="success" text="商户买入" />,
      'SELL': <Badge status="default" text="商户卖出" />,
    }
    const columns = [
      {
        title: '商户',
        key: 'merchantInfoVO',
        width: 60,
        dataIndex: 'merchantInfoVO.uid',
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

    this.formInfosubmit = (formInfo) => { console.log('submit') }
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
          <BaseForm layout="inline" submitFunc={this.request} switchFunc={() => { }} formList={this.formList} />
        </Card>
        <Modal
          visible={
            this.state.selectedItems.length > 0
            &&
            (
              this.props.match.params.page === "info"
              ||
              this.props.match.params.page === "confirm"
            )
          }
          // 退出下单界面， 广告信息需要更新
          onCancel={
            () => {
              //根据当前所在路由判断进入的付款流程
              if (window.location.href.split('#')[1].includes('confirm')) {
                // 取消下单
                message.loading('正在取消订单...')
                this.cancelOrder()
              }
              goToUrl('/ads/index')
              this.request()
            }
          }
          afterClose={this.changeModalKey}
          footer={null}
        >
          <StepForm
            key={this.state.formKey}
            selectedItem={this.state.selectedItems[0]}
            refreshData={this.request}
            changeModalKey={this.changeMormKey}
            infoSubmitFunc={this.formInfoSubmit}
            confirmSubmitFunc={this.formConfirmSubmit}
          />
        </Modal >
        <Card>
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
          <Button
            type="primary"
          >
            <NavLink to="/ads/info">下单</NavLink>
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

Ads = Form.create({})(Ads);
// props 属性
const mapStateToProps = (state) => ({
  isLogin: state.isLogin,
  user: state.user
})

// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(Ads)
