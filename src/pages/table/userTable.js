import React from 'react';
import { Card, Table, Modal, Button, message, Badge } from 'antd';
import Ajax from '../../components/Ajax'
import { selectTag } from '../../utils/index'
export default class HighTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      dataSource: [],
      selectedRowKeys: [],
      selectedItems: [],
    }
  }
  request = () => {
    Ajax.ajax(
      'get',
      '/v1/users/',
      {
        offset: 1,
        limit: 10,
      },
      'https://mook.sunlin.fun/mock/9',
    )
      .then(
        res => this.setState(() => ({ dataSource: res.data, loading: false })))
      .catch(
        () => message.error("数据渲染失败"))
  }

  componentDidMount = () => {
    this.request()
  }


  render() {
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
        <Card title="用户详单" style={{ margin: '10px 0' }}>
          <Table
            bordered
            loading={this.state.loading}
            rowSelection={
              {
                // type: 'radio',
                type: 'checkbox',
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
              // 点击一行的所有位置都能触发勾选操作
              onClick: () => {
                // 以下代码仅对checkbox多选有效
                var selectedItems = [...this.state.selectedItems]
                var selectedRowKeys = [...this.state.selectedRowKeys]
                selectTag(selectedItems, selectedItem)
                selectTag(selectedRowKeys, selectedItem.key)
                // 以下代码仅对radio单选有效
                // const selectedItems = [selectedItem]
                // const selectedRowKeys = [selectedItem.key]
                this.setState(() => ({
                  selectedRowKeys,
                  selectedItems,
                }))
              },
              onMouseEnter: () => { },
              onDoubleClick: () => {
                Modal.info({
                  title: '信息',
                  content: `${selectedItem.name}, ${roleMap[selectedItem.role]}`
                })
              },
            }
            )}
            columns={columns}
            dataSource={this.state.dataSource}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}