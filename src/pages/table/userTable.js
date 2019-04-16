import React from 'react';
import { Card, Table, Modal, Button, message} from 'antd';
import Ajax from '../../components/Ajax'
import { pagination ,selectTag } from '../../utils/index'
export default class HighTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      tableType: 'radio',
      dataSource: [],
      selectedRowKeys: [],
      selectedItems: [],
      pagination: {},
    }
  }

  request = () => {
    Ajax.ajax(
      'get',
      '/v1/users/',
      {
        params: {},
        body: {},
      },
      'https://mook.sunlin.fun/mock/9',
    )
      .then(
        data => {
          this.setState(
            (prevState) => (
              {
                dataSource: data.list,
                loading: false,
                pagination: pagination(data, (current)=>{
                  console.log(`按到了${current}页`)
                  this.request()
                }),
              }
            )
          )
        })
      .catch(
        () => message.error("数据渲染失败"))
  }

  componentDidMount = () => {
    this.request()
  }

  warning = (items, method, ok = () => { }, cancel = () => { },) => {
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
            columns={columns}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
          />
        </Card>
      </div >
    )
  }
}