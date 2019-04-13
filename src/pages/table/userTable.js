import React from 'react';
import { Card, Table, Modal, Button, message } from 'antd';
import Ajax from '../../components/Ajax'
import { selectTag } from '../../utils/index'
export default class HighTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      // radio or checkbox
      tableType: 'radio',
      dataSource: [],
      selectedRowKeys: [],
      selectedItems: [],
    }
  }

  request = (offset, limit) => {
    Ajax.ajax(
      'get',
      '/v1/users/',
      {
        offset,
        limit,
      },
      'https://mook.sunlin.fun/mock/9',
    )
      .then(
        res => {
          this.setState(
            (prevState) => (
              {
                dataSource: prevState.dataSource.concat(res.data),
                loading: false,
              }
            )
          )
        })
      .catch(
        () => message.error("数据渲染失败"))
  }

  componentDidMount = () => {
    this.request(1, 10)
  }

  warning = (items, method) => {
    Modal.confirm({
      title: `${method}`,
      content: `${JSON.stringify(items)}`,
      onCancel: () => { },
      onOk: () => { },
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
        dataIndex: 'id'
      },
      {
        title: '用户名',
        key: 'name',
        width: 80,
        dataIndex: 'name'
      },
      {
        title: '邮箱',
        key: 'email',
        width: 120,
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
            style={{ margin: 10 }}
            shape="round"
            onClick={
              () => {
                this.setState(() => ({ tableType: 'checkbox', }))
              }
            }
          >
            批量选择
            </Button>
          <ButtonGroup>
            <Button
              type="primary"
              icon="edit"
              onClick={
                () => {
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
                  this.warning(this.state.selectedItems, 'delete')
                }
              }
            >
              删除
          </Button>
            <Button
              onClick={
                () => {
                  this.request(2, 10)
                }
              }
            >
              加载更多
          </Button>

          </ButtonGroup>
          <Table
            size="small"
            bordered
            loading={this.state.loading}
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
                  注册时间：
                  活跃用户
                  `,
                  onCancel: () => { },
                  onOk: () => { },
                })
              },
            }
            )}
            columns={columns}
            dataSource={this.state.dataSource}
            pagination={false}
          />
        </Card>
      </div >
    )
  }
}