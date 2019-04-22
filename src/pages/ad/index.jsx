import React from 'react';
import { Table, Modal, Button, message, Badge,  } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag, removeFromArray } from '../../utils/index'
import '../../style/common.scss'

export default class adTable extends React.Component {
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
      isInitial: false,
      globalFilter: false,
      defaultFilterRules: () => true,
    }
    this.page = 1
    this.filterRules = this.state.defaultFilterRules
  }

  componentDidMount = () => {
      this.request()
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
                  if (!this.state.globalFilter) {
                    // 翻页时将子组件标记重置
                    this.resetFields = true
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
                        message.info('下单成功')
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
               下单 
              </Button>
            </div>
          )
        }
      },
    ];

    return (
      <div>

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
