import React from 'react';
import { Card, Table, Modal, Button, message, Badge } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag, removeFromArray } from '../../utils/index'
import '../../style/common.scss'

export default class userTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      tableType: 'checkbox',
      dataSource: [],
      selectedRowKeys: [],
      selectedItems: [],
      pagination: {},
      sortOrder: false,
    }
    this.page = 1
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
          this.setState(
            (prevState) => (
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

  componentDidMount = () => {
    this.request(this.page)
  }

  render() {
    const ButtonGroup = Button.Group

    const roleMap = {
      1: <Badge status="success" text="管理员" />,
      2: <Badge status="error" text="商户" />,
      3: <Badge status="default" text="普通用户" />,
    }

    const columns = [
      {
        title: 'id',
        key: 'id',
        width: 80,
        dataIndex: 'id',
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
        sorter: (a, b) => {
          return a.role - b.role
        },
        sortOrder: this.state.sortOrder,
        render: (text) => {
          return roleMap[text]
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
              <Button
                className="link-button"
                icon='edit'
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
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Card style={{ margin: '10px 0' }}>
          <ButtonGroup>
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
        </Card>
      </div >
    )
  }
}