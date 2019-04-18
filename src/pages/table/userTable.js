import React from 'react';
import { Card, Table, Modal, Button, message } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag } from '../../utils/index'
export default class HighTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      tableType: 'checkbox',
      dataSource: [],
      selectedRowKeys: [],
      selectedItems: [],
      pagination: {},
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

  warning = (items, method, ok = () => { }, cancel = () => { }, ) => {
    Modal.confirm({
      title: `${method}`,
      content: `${JSON.stringify(items)}`,
      onCancel: cancel,
      onOk: ok,
    })
  }


  render() {
    const ButtonGroup = Button.Group

    const roleMap = {
      1: "管理员",
      2: "商户",
      3: "普通用户",
    }

    const columns = [
      {
        title: 'id',
        key: 'id',
        width: 80,
        dataIndex: 'id',
        fixed: 'left',
      },
      {
        title: '用户名',
        key: 'name',
        width: 80,
        dataIndex: 'name',
        fixed: 'left',
      },
      {
        title: '邮箱',
        key: 'email',
        width: 80,
        dataIndex: 'email'
      },
      {
        title: '邮箱',
        key: 'email',
        width: 80,
        dataIndex: 'email'
      },
      {
        title: '邮箱',
        key: 'email',
        width: 80,
        dataIndex: 'email'
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
        render(role) {
          return roleMap[role]
        }
      },
    ];


    return (
      <div>
        <Card style={{ margin: '10px 0' }}>
          <Button
            onClick={
              () => {
                this.setState(() => ({
                  selectedRowKeys: [],
                  selectedItems: [],
                }))
              }
            }
          >
            取消所选项
          </Button>
          <ButtonGroup>
            <Button
              type="primary"
              icon="edit"
              onClick={
                () => {
                  if (this.state.selectedItems.length < 1) return
                  Modal.info({
                    title: '编辑',
                    content: `${this.state.selectedItems.name}, ${roleMap[this.state.selectedItem.role]}`,
                  })
                }
              }
              disabled={this.state.selectedItems.length > 1}
            >
              编辑
            </Button>
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
                  this.warning(this.state.selectedItems, 'delete',
                    () => {
                      message.info('删除成功')
                      this.setState(() => ({ selectedItems: [], selectedRowKeys: [] }))
                    }
                  )
                }}
            >
              删除
            </Button>
          </ButtonGroup>
          <Table
            size="small"
            bordered
            loading={this.state.loading}
            columns={columns}
            scroll={{ x: 1440, y: 580 }}
            dataSource={this.state.dataSource}
            //若没有pagination属性，会根据antd中table的默认样式，每页显示10个数据，将这一次请求获得的数据进行纯前端样式的静态的分页，*点击切换页面按钮不会发送请求
            // 若 有 pagination={false}的 设定，table不会分页， 此次请求获得的所有数据会全部显示出来
            pagination={this.state.pagination}
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
                  let selectedItems = selectTag([...this.state.selectedItems], selectedItem)
                  let selectedRowKeys = selectTag([...this.state.selectedRowKeys], selectedItem.key)
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