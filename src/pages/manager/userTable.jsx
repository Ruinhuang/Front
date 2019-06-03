import React from 'react';
import { Input, Radio, Card, Table, Form, Modal, Button, message, Badge, Select, Switch, InputNumber } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
import '../../style/common.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

// child component FilterFrom
class FilterForm extends React.Component {

  render = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="角色">
          {
            getFieldDecorator('userType',
              {
                initialValue: ""
              }
            )(
              <Select
                style={{ width: 100 }}
              >
                <Option value=''>全部</Option>
                <Option value="1">普通用户</Option>
                <Option value="2">管理员</Option>
                <Option value="3">商户</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem label="状态">
          {
            getFieldDecorator('status',
              {
                initialValue: ""
              }
            )(
              <Select
                style={{ width: 100 }}
              >
                <Option value='' >全部</Option>
                {/* <Option value={1}>已审批</Option> */}
                <Option value="1">已审批</Option>
                <Option value="2">未审批</Option>
                <Option value="3">冻结中</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem>
          <div style={{ display: "inline-block" }}>
            全局过滤
          <Switch
              checkedChildren="开"
              unCheckedChildren="关"
              onClick={(checked) => this.props.changeGlobalFilter(checked)}
            />
          </div>
          <Button
            type="primary"
            style={{ margin: '0 20px' }}
            onClick={() => {
              let ruleInfo = this.props.form.getFieldsValue()//object对象,包含表单中所有信息
              // 根据filterFrom提交的内容构建过滤规则
              let rules = item => (
                ((!ruleInfo.status) || (item.status === ruleInfo.status))
                &&
                ((!ruleInfo.userType) || (item.userType === ruleInfo.userType))
              )
              this.props.changeFilterRules(rules)
            }}
          >筛选结果
          </Button>
        </FormItem>
      </Form>
    );
  }
}

FilterForm = Form.create({})(FilterForm);

export default class userTable extends React.Component {
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
      globalFilter: false,
      defaultFilterRules: () => true,
    }
    this.page = 1
    this.point = 0
    this.filterRules = this.state.defaultFilterRules
  }

  handleChangePointButtonClick = () => {
    if (this.state.selectedItems.length < 1) return
    Ajax.ajax(
      'get',
      '/wallet/account/',
      {},
      {
        uid: this.state.selectedItems[0].userId,
        coinId: 1,
      },
      "http://207.148.65.10:8080",
    )
      .then(
        (res) => {
          this.point = res.data.count
          this.setState(() => ({
            visibleModal: 'changePoint',
          }))
        })
  }

  componentDidMount = () => {
    this.request()
  }
  componentDidUpdate = () => {
    if (!this.state.globalFilter) {
      this.filterForm.props.form.resetFields()
    }
  }

  changeFilterRules = rules => {
    this.filterRules = rules
    this.setState(prevState => ({ dataSource: prevState.allSource.filter(this.filterRules) }))
  }

  changeGlobalFilter = checked => {
    this.setState(
      () => ({
        globalFilter: checked,
      })
    )
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
      '/query-all',
      {},
      { page: this.page },
      'http://207.148.65.10:8080',
    )
      .then(
        data => {
          data.data.forEach(item => item.key = item.userId)
          if (!this.state.globalFilter) {
            this.filterRules = this.state.defaultFilterRules
          }
          this.setState(
            () => (
              {
                allSource: data.data,
                dataSource: data.data.filter(this.filterRules),
                loading: false,
                pagination: pagination(data, (current) => {
                  this.page = current
                  if (!this.state.globalFilter) {
                    // 翻页时将子组件标记重置
                    this.filterForm.props.form.resetFields()
                  }
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
    const ButtonGroup = Button.Group
    const roleMap = {
      1: "普通用户",
      2: "商户",
      3: "管理员",
    }
    const statusMap = {
      "1": <Badge status="success" text="已审批" />,
      "2": <Badge status="default" text="未审批" />,
      "3": <Badge status="error" text="冻结中" />,
    }
    const columns = [
      {
        title: 'userId',
        key: 'userId',
        width: 80,
        dataIndex: 'userId',
        sorter: (a, b) => {
          return a.userId - b.userId
        },
        sortOrder: this.state.sortOrder,
        // 横向滚动头部锁定
        // fixed: 'left',
      },
      {
        title: '电话号码',
        key: 'phone',
        width: 80,
        dataIndex: 'phone',
        // fixed: 'left',
      },
      {
        title: '用户名',
        key: 'userName',
        width: 80,
        dataIndex: 'userName',
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
        key: 'userType',
        width: 80,
        dataIndex: 'userType',
        render: (text) => {
          return roleMap[text]
        }
      },
      {
        title: '状态',
        key: 'status',
        width: 80,
        dataIndex: 'status',
        render: (text) => {
          return statusMap[text]
        }
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
            userInfo={this.state.selectedItems[0]}
            wrappedComponentRef={(inst) => this.userForm = inst}
            point={this.point}
            closeModal={() => this.setState(() => ({ visibleModal: null }))}
          />
        </Modal>
        <Card>
          <FilterForm
            changeFilterRules={this.changeFilterRules}
            changeGlobalFilter={this.changeGlobalFilter}
            // 将子组件实例关联到父组件属性上, 方便调用子组件成员变量和函数
            wrappedComponentRef={(inst) => { this.filterForm = inst }} />
        </Card>
        <Card
          className="operate-wrap"
          style={{
            marginTop: '10px',
          }}>
          多选模式
             <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked={this.state.tableType === "checkbox"}
            onClick={(checked) => this.changeTableType(checked)}
          />
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
          <Button disabled={this.state.selectedItems.length > 1}>确认申请</Button>
          <Button
            icon='edit'
            type="primary"
            disabled={this.state.selectedItems.length > 1}
            onClick={this.handleChangePointButtonClick}
          >
            充值积分
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
            // 若 有 pagination={false}的 设定，tab le不会分页， 此次请求获得的所有数据会全部显示出来
            // pagination={this.state.pagination}
            pagination={false}
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
                  ${selectedItem.userName}
                  ${roleMap[selectedItem.userType]}
                  ${selectedItem.email}
                  ${selectedItem.createdAt}
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

// class UserForm extends React.Component {
//   render() {
//     let userInfo = this.props.userInfo[0] || {};
//     const formItemLayout = {
//       labelCol: {
//         span: 5
//       },
//       wrapperCol: {
//         span: 19
//       }
//     };
//     const { getFieldDecorator } = this.props.form;
//     return (
//       <Form layout="horizontal">
//         <FormItem label="用户名" {...formItemLayout}>
//           {
//             getFieldDecorator('userName', {
//               initialValue: userInfo.userName
//             })(
//               <Input type="text" placeholder="请输入用户名" />
//             )
//           }
//         </FormItem>
//         <FormItem label="角色" {...formItemLayout}>
//           {
//             getFieldDecorator('userType', {
//               initialValue: userInfo.userType
//             })(
//               <RadioGroup>
//                 <Radio value="1">用户</Radio>
//                 <Radio value="2">商户</Radio>
//               </RadioGroup>
//             )
//           }
//         </FormItem>
//         <FormItem label="状态" {...formItemLayout}>
//           {
//             getFieldDecorator('status', {
//               initialValue: userInfo.status
//             })(
//               <Select>
//                 <Option value="1">已审核</Option>
//                 <Option value="2">未审核</Option>
//                 <Option value="3">已冻结</Option>
//               </Select>
//             )
//           }
//         </FormItem>
//         <FormItem>
//           <Button
//             onClick={() => { message.warning('这里改写成向后端发送验证的流程// TODO') }}
//           >
//             提交
//           </Button>
//         </FormItem>
//       </Form>
//     );
//   }
// }
class UserForm extends React.Component {
  handleButtonClick = () => {
    let formInfo = this.props.form.getFieldsValue();//object对象,包含表单中所有信息
    // 校验表单输入是否符合规则， 不符合err会包含信息, 校验通过err为空
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Ajax.ajax(
          'post',
          '/user-point-modify',
          {},
          {
            phone: this.props.userInfo.phone,
            point: formInfo.point,
            token: sessionStorage.getItem('token'),
          },
          "http://207.148.65.10:8080",
        ).then(
          () => {
            message.success('充值成功')
            this.props.closeModal()
          }
        )
      }
    })
  }

  render() {
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
        <FormItem label="当前积分" {...formItemLayout}>
          {
            getFieldDecorator('oldPoint', {
              initialValue: this.props.point
            })(
              <InputNumber step='0.01' disabled={true} />
            )
          }
        </FormItem>
        <FormItem label="充值积分" {...formItemLayout}>
          {
            getFieldDecorator('point', {
              initialValue: 0
            })(
              <InputNumber step='0.01' />
            )
          }
        </FormItem>
        <FormItem
          style={{ marginLeft: 'auto', marginRight: 'auto', width: 200, }} >
          <Button type="primary" onClick={this.handleButtonClick}> 确认充值 </Button>
        </FormItem>
      </Form>
    );
  }
}

UserForm = Form.create({})(UserForm);