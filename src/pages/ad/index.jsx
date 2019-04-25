import React, { Component } from 'react';
import { Form, Card, Input, Icon, Table, Modal, Button, message, Badge, } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag, } from '../../utils/index'
import { Route, NavLink, HashRouter, Switch } from 'react-router-dom'
import '../../style/common.scss'

class StepForm extends Component {
  render() {
    return (
      <HashRouter >
        <div>
          <Route path="/admin/ads"
            render={() =>
              <div>
                <div>
                  <Switch>
                    <Route
                      exact={true}
                      path="/admin/ads/info"
                      render={() => <Info selectedItem={this.props.selectedItem} />}
                    />
                    <Route
                      path="/admin/ads/confirm"
                      render={() => <Confirm />}
                    />
                  </Switch>
                </div>
              </div>
            }
          />
        </div>
      </HashRouter >
    );
  }
}

const FormItem = Form.Item;
class FormInfo extends React.Component {
  handleSubmit = () => {//绑定提交事件进行校验
    let userInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
    // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
    this.props.form.validateFields((err, values) => {
      if (!err) {// ${}  是变量
        message.success("正在下单")
        // 前端验证完毕, 向后端发起调用
        window.location.href = window.location.href.split('#')[0] + '#/admin/ads/confirm'
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 4
      },
      wrapperCol: {
        xs: 24,
        sm: 12
      }
    };
    return (
      <div>
        <Card title="下单"
        >
          <Form
            layout="horizontal"
          >
            <FormItem>
              <p>{JSON.stringify(this.props.selectedItem)}</p>
            </FormItem>
            <FormItem
              label="交易量"
              {...formItemLayout}
            >
              {
                getFieldDecorator('userName', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '金额不能为空'
                    },
                    {
                      min: 1, max: 8,
                      message: '长度不在范围内'
                    },
                    {
                      pattern: new RegExp('^\\d+$', 'g'),
                      message: '必须为数字'
                    },
                  ]
                })(
                  <Input prefix={<Icon type="money-collect" />} placeholder="请输入交易金额" />
                )
              }
            </FormItem>
            <FormItem
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 200,
              }}
            >
              <Button
                type="primary"
                onClick={
                  () => {
                    this.handleSubmit()
                  }
                }
              >
                确认订单
            </Button>
            </FormItem>
          </Form>
        </Card>
      </div >
    )
  }
}
const Info = Form.create()(FormInfo)

class Confirm extends React.Component {
  handleSubmit = () => message.success(`请等待商户确认`)
  render() {
    return (
      <Card title="付款码">
        <img style={{ display: "block" }} alt="Cierra01.jpg" src="https://img.moegirl.org/common/thumb/a/aa/Cierra01.jpg/260px-Cierra01.jpg" width="260" height="260" />
        <Button
          type="primary"
          onClick={
            () => {
              this.handleSubmit()
              Modal.success({
                title: 'success',
                content: 'success',
                onOk: () => {
                  // 需要跳转到我的订单详情页
                  window.location.href = window.location.href.split('#')[0] + '#/admin/ads/index'
                  // 刷新页面以更新数据
                  window.location.reload()
                },
                onCancel: () => {
                  window.location.href = window.location.href.split('#')[0] + '#/admin/ads/index'
                  window.location.reload()
                }
              })
            }
          }
        >
          我已付款
        </Button>
      </Card>
    )
  }
}

export default class adTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      tableType: 'radio',
      dataSource: [],
      allSource: [],
      selectedRowKeys: [],
      selectedItems: [],
      pagination: {},
      sortOrder: false,
      isInitial: false,
      globalFilter: false,
      formKey: Math.random().toString(18).substr(2),
      defaultFilterRules: () => true,
    }
    this.page = 1
    this.filterRules = this.state.defaultFilterRules
  }

  componentDidMount = () => {
    this.request()
  }

  changeFormKey = () => {
    this.setState(() => ({
      formKey: Math.random().toString(18).substr(2),
    }
    )
    )
  }

  request = () => {
    Ajax.ajax(
      'get',
      '/v1/users',
      { page: this.page },
      'https://mook.sunlin.fun/mock/9',
    )
      .then(
        data => {
          if (!this.state.globalFilter) {
            this.filterRules = this.state.defaultFilterRules
          }
          this.setState(
            () => (
              {
                allSource: data.list,
                dataSource: data.list.filter(this.filterRules),
                loading: false,

                isInitial: true,
                pagination: pagination(data, (current) => {
                  this.page = current
                  this.request()
                })
              }))
        }).catch(() => message.error("数据渲染失败")
        )
  }


  render() {
    const roleMap = {
      1: "管理员",
      2: "商户",
      3: "普通用户",
    }

    const statusMap = {
      1: <Badge status="success" text="已审批" />,
      2: <Badge status="default" text="未审批" />,
      3: <Badge status="error" text="冻结中" />,
    }

    const columns = [{
      title: 'id',
      key: 'id',
      width: 80,
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      SortOrder: this.state.sortOrder,
      // 横向滚动头部锁定
      // fixed: 'left',
    },
    {
      title: '用户名',
      key: 'name',
      width: 80,
      dataIndex: 'name',
      // fixed: 'left',
    },
    {
      title: '邮箱',
      key: 'email',
      width: 80,
      dataIndex: 'email'
    },
    {
      title: '角色',
      key: 'role',
      width: 80,
      dataIndex: 'role',
      render: (text) => {
        return roleMap[text]
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      dataIndex: 'status',
      render: (text) => statusMap[text],
    },
    {
      title: 'operation',
      key: 'operation',
      width: 80,
      render: (text, item, index, ) => (
        <div>
          <Button
            className="link-button"
          >
            <NavLink to="/admin/ads/info">下单</NavLink>
          </Button>
        </div>
      )
    },
    ]

    return (
      <div className="content-wrap">
        <Modal
          visible={this.props.match.params.page === "info" || this.props.match.params.page === "confirm"}
          title={this.props.match.params.page}
          onCancel={() => window.location.href = window.location.href.split('#')[0] + '#/admin/ads/index'}
          afterClose={this.changeModalKey}
          footer={null}
        >
          <StepForm
            key={this.state.formKey}
            selectedItem={this.state.selectedItems[0]}
            changeModalKey={this.changeMormKey} />
        </Modal >
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
          // 若 有 pagination={false}的 设定，tab le不会分页， 此次请求获得的所有数据会全部显示出来
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
                  ${roleMap[selectedItem.role]}
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
    )
  }
}