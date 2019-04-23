import React from 'react';
import { Card, Table, Form, Modal, Button, message, Badge, Select, Switch } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag, removeFromArray } from '../../utils/index'
import '../../style/common.scss'

const FormItem = Form.Item;
const Option = Select.Option;

// child component FilterFrom
class FilterForm extends React.Component {

  render = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <FormItem label="角色">
          {
            getFieldDecorator('role',
              {
                initialValue: ""
              }
            )(
              <Select
                style={{ width: 100 }}
              >
                <Option value="">全部</Option>
                <Option value="1">管理员</Option>
                <Option value="2">商户</Option>
                <Option value="3">普通用户</Option>
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
                <Option value="">全部</Option>
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
              onClick={(checked) => this.props.openGlobalFilter(checked)}
            />
          </div>
          <Button
            type="primary"
            style={{ margin: '0 20px' }}
            onClick={() => {
              let ruleInfo = this.props.form.getFieldsValue()//object对象,包含表单中所有信息
              // 根据filterFrom提交的内容构建过滤规则
              let rules = item => (((!ruleInfo.status) || (item.status === parseInt(ruleInfo.status))) && (((!ruleInfo.role) || (item.role === parseInt(ruleInfo.role)))))
              this.props.changeFilterRules(rules)
            }}
          >过滤一下
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
      loading: true,
      tableType: 'checkbox',
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
    this.filterRules = this.state.defaultFilterRules
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

  openGlobalFilter = checked => {
    this.setState(
      () => ({
        globalFilter: checked,
      })
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
      1: "管理员",
      2: "商户",
      3: "普通用户",
    }
    const statusMap = {
      1: <Badge status="success" text="已审批" />,
      2: <Badge status="default" text="未审批" />,
      3: <Badge status="error" text="冻结中" />,
    }
    const columns = [
      {
        title: 'id',
        key: 'id',
        width: 80,
        dataIndex: 'id',
        sorter: (a, b) => {
          return a.id - b.id
        },
        sortOrder: this.state.sortOrder,
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
      {
        title: 'operation',
        key: 'operation',
        width: 80,
        render: (text, item, index, ) => {
          return (
            <div>
              <Button
                className="link-button"
                icon='edit'
                type="primary"
                onClick={
                  () => {
                    this.setState((prevState) => ({
                      selectedItems: selectTag([...prevState.selectedItems], [item]),
                      selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
                    }))
                    Modal.confirm({
                      title: 'edit',
                      content: JSON.stringify(item),
                      onOk: (callback = () => {
                        message.info('修改成功')
                      },
                      ) => {
                        message.warning('这里改写成向后端发送验证的流程// TODO')
                        callback()
                        this.setState((prevState) => ({
                          selectedItems: removeFromArray([...prevState.selectedItems], [item]),
                          selectedRowKeys: removeFromArray([...prevState.selectedRowKeys], [item.key])
                        }))
                      },
                      onCancel: () => {
                        this.setState((prevState) => ({
                          selectedItems: selectTag([...prevState.selectedItems], [item]),
                          selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
                        }))
                      }
                    },
                    )
                  }
                }
              >
                编辑
              </Button>
              <Button
                className="link-button"
                type="danger"
                icon='delete'
                onClick={
                  () => {
                    Modal.confirm({
                      title: 'delete',
                      content: JSON.stringify(item),
                      onOk: (callback = () => {
                        message.info('删除成功')
                        this.setState((prevState) => ({
                          dataSource: removeFromArray([...prevState.dataSource], [item]),
                          selectedItems: removeFromArray([...prevState.selectedItems], [item]),
                          selectedRowKeys: removeFromArray([...prevState.selectedRowKeys], [item.key])
                        }))
                      },
                      ) => {
                        message.warning('这里改写成向后端发送验证的流程// TODO')
                        callback()
                      },
                      onCancel: () => {
                        this.setState((prevState) => ({
                          selectedItems: selectTag([...prevState.selectedItems], [item]),
                          selectedRowKeys: selectTag([...prevState.selectedRowKeys], [item.key])
                        }))
                      }
                    }
                    )
                  }
                }
              >
                删除
              </Button>

            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Card>
          <FilterForm
            changeFilterRules={this.changeFilterRules}
            openGlobalFilter={this.openGlobalFilter}
            // 将子组件实例关联到父组件属性上, 方便调用子组件成员变量和函数
            wrappedComponentRef={(inst) => { this.filterForm = inst }} />
        </Card>
        <Card style={{
          marginTop: '10px',
        }}>
          <ButtonGroup style={{ padding: '0', float: 'right' }}>
            <Button
              type="primary"
              icon="plus"
              href="/#/register"
              target="_black"
            >
              新增
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
              批量删除
            </Button>
          </ButtonGroup>
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
      </div >
    )
  }
}