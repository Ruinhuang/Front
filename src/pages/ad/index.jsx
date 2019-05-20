import React, { Component } from 'react';
import {Card, Table, Modal, Button, message, Badge, } from 'antd';
import Ajax from '../../components/Ajax'
import { pagination, selectTag, goToUrl } from '../../utils'
import { NavLink } from 'react-router-dom'
import '../../style/common.scss'
import StepForm from '../../components/StepForm'

export default class adTable extends Component {
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
    this.userForm = undefined
    this.filterRules = this.state.defaultFilterRules
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
    }
    )
    )
  }

  request = () => {
    Ajax.ajax(
      'get',
      '/v1/users',
      {},
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
    ]

    return (
      <div className="content-wrap">
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
              message.warning('下单中断')
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
            changeModalKey={this.changeMormKey} />
        </Modal >
        <Card>
          <Button
            type="primary"
          >
            <NavLink to="/ads/info">下单</NavLink>
          </Button>
        </Card>
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
