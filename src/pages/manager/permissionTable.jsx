import React from "react";
import { Table, message, Card, Button, Form, Modal, Input, Select, Tree, Transfer } from "antd";
import Ajax from "../../components/Ajax"
import menuConfig from "./../../config/menuConfig";
import { selectTag, pagination } from "../../utils"

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
// 或 const TreeNode = Tree.TreeNode

export default class PermissionUser extends React.Component {
    state = {
        isRoleVisible: false,
        tableType: "radio",
        selectedItems: [],
    };

    request = () => {
        Ajax.ajax(
            'get',
            '/v1/roles',
            { page: this.page },
            'https://mook.sunlin.fun/mock/9',
        )
            .then(
                data => {
                    this.setState(
                        () => (
                            {
                                dataSource: data.list,
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

    componentWillMount() {
        // 通过生命周期函数加载接口
        this.request()
    }

    // 打开创建角色弹框
    handleRole = () => {
        this.setState({
            isRoleVisible: true
        });
    };

    // 角色提交
    handleRoleSubmit = () => {
        const data = this.roleForm.props.form.getFieldsValue();
        this.setState({
            isRoleVisible: false //关闭弹框
        });
        this.roleForm.props.form.resetFields(); // 调用表单重置(清空表单数据)
        this.request(); //刷新列表数据
    }

    // 权限设置
    handlePermission = () => {
        let item = this.state.selectedItems[0]; //取出当前选中的项
        this.setState({
            isPermVisible: true,
            detailInfo: item,
            menuInfo: item.menus
        });
    };

    handlePermEditSubmit = () => {
        // 获取表单的值 ,添加wrappedComponentRef属性
        let data = this.permForm.props.form.getFieldsValue();
        data.role_key = this.state.selectedItem.key; // 将角色key传回
        data.menus = this.state.menuInfo; // 需要将menus数据  传到接口

        this.setState({
            isPermVisible: false
        });
        this.request(); //刷新列表数据
    }

    // 用户授权
    handleUserAuth = () => {
        let item = this.state.selectedItems[0]; //取出当前选中的项,为了兼容checkbox 使用数组存取
        this.setState({
            isUserVisible: true,
            detailInfo: item
        });
        // 获取目标数据
        this.getRoleUserList(item.id);
    };

    // 获取用户角色列表
    getRoleUserList = id => {
        // id: 角色id , 获取角色id
        Ajax.ajax(
            'get',
            '/v1/role/users',
            { page: this.page },
            'https://mook.sunlin.fun/mock/9',
        )
            .then(res => {
                if (res) {
                    //请求成功,筛选目标用户
                    this.getAuthUserList(res.list);
                }
            });
    };

    // 筛选目标用户
    getAuthUserList = dataSource => {
        // 将数据(目标用户,全量用户)进行过滤的方法
        const roleUsers = [];
        const targetKeys = [];
        if (dataSource && dataSource.length > 0) {
            // 有数据
            for (let i = 0; i < dataSource.length; i++) {
                const data = {
                    key: dataSource[i].key,
                    title: dataSource[i].name,
                    role: dataSource[i].role
                };

                console.log(data.role, this.state.selectedItems[0])
                if (data.role === this.state.selectedItems[0].role) {
                    // 如果role相同，说明是目标用户,加到targetKeys数组
                    targetKeys.push(data.key);
                }
                //全量用户
                roleUsers.push(data)
                this.setState(() => ({
                    roleUsers,
                    targetKeys
                }))
            }
        }
    }

    // 用户授权提交
    handleUserSubmit = () => {
        let data = {};
        data.user_ids = this.state.targetKeys;
        data.role = this.state.selectedItems[0].role;
        this.setState({
            isUserVisible: false
        });
        this.request();
    }

    render() {
        const columns = [
            {
                title: "角色",
                dataIndex: "role_name",
            },
            {
                title: "使用状态",
                dataIndex: "status",
                render: (status) => {
                    return status === 0 ? "停用" : "启用";
                }
            },
            {
                title: "访问权限",
                dataIndex: "menus",
                render: (menus) => JSON.stringify(menus)
            },
        ];
        return (
            <div>
                <Card>
                    <Button
                        type="primary"
                        onClick={this.handleRole}>
                        添加新角色
          </Button>
                    <Button
                        type="primary"
                        style={{ marginLeft: 10, marginRight: 10 }}
                        onClick={this.handlePermission}
                        disabled={this.state.selectedItems.length < 1}
                    >
                        设置权限
          </Button>
                    <Button
                        type="primary"
                        onClick={this.handleUserAuth}
                        disabled={!(this.state.selectedItems.length > 0)}
                    >
                        用户授权
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
                        })
                        }
                    />
                </div>
                <Modal
                    title="添加新角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={() => {
                        this.roleForm.props.form.resetFields(); // 表单重置
                        this.setState({
                            isRoleVisible: false
                        });
                    }}
                >
                    <RoleForm
                        wrappedComponentRef={inst => {
                            this.roleForm = inst;
                        }}
                    />
                </Modal>
                <Modal
                    title="设置权限"
                    visible={this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={() => {
                        this.setState(() => ({
                            isPermVisible: false
                        }));
                    }}
                >
                    <PermEditForm
                        wrappedComponentRef={inst => {
                            this.permForm = inst;
                        }}
                        detailInfo={this.state.detailInfo}
                        menuInfo={this.state.menuInfo}
                        patchMenuInfo={checkedKeys => {
                            this.setState({
                                menuInfo: checkedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    title="用户授权"
                    visible={this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={() => {
                        this.setState({
                            isUserVisible: false
                        });
                    }}
                >
                    <RoleAuthForm
                        wrappedComponentRef={inst => {
                            this.userAuthForm = inst;
                        }}
                        detailInfo={this.state.detailInfo}
                        targetKeys={this.state.targetKeys}
                        roleUsers={this.state.roleUsers}
                        patchUserInfo={(targetKeys) => {
                            this.setState({ targetKeys });
                        }}
                    />
                </Modal>
            </div>
        );
    }
}

// 子组件一-------角色绑定
class RoleForm extends React.Component {
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
                <FormItem label="角色名称" {...formItemLayout}>
                    {getFieldDecorator("role")(
                        <Input type="text" placeholder="请输入角色名称" />
                    )}
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {getFieldDecorator("state")(
                        <Select>
                            <Option value={1}>开启</Option>
                            <Option value={2}>关闭</Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
        );
    }
}

RoleForm = Form.create({})(RoleForm);

// 子组件二---------设置权限
class PermEditForm extends React.Component {
    onCheck = checkedKeys => {
        // 将当前选中的项传回父组件  PermEditForm
        this.props.patchMenuInfo(checkedKeys);
    };

    // 递归渲染权限列表
    /**
     *
     * @param data:menuConfig.js 导入的权限列表
     */
    renderTreeNodes = data => {
        // 判断当前是否有子节点,如果有子节点children继续遍历,直到没有子节点为止
        return data.map(item => {
            if (item.children) {
                // 判断当前是否有子节点
                return (
                    <TreeNode title={item.title} key={item.key}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            } else {
                return <TreeNode title={item.title} key={item.key} />;
                // 也可写作
                // return <TreeNode {...item}/>
            }
        });
    };

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
        const detail_info = this.props.detailInfo;
        const menu_info = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.role_name} />
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {getFieldDecorator("status", {
                        initialValue: detail_info.status + ""
                    })(
                        <Select>
                            <Option value="1">启用</Option>
                            <Option value="0">停用</Option>
                        </Select>
                    )}
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={checkedKeys => {
                        // checkedKeys: 当前选中的节点
                        this.onCheck(checkedKeys);
                    }}
                    checkedKeys={menu_info}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNodes(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        );
    }
}

PermEditForm = Form.create({})(PermEditForm);

// 子组件三---------用户授权
class RoleAuthForm extends React.Component {
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    };

    handleChange = (targetKeys) => {
        this.props.patchUserInfo(targetKeys);
    };
    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        };
        const detail_info = this.props.detailInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.role_name} />
                </FormItem>

                <FormItem label="选择用户" {...formItemLayout}>
                    <Transfer
                        listStyle={{ width: 250, height: 400 }}
                        dataSource={this.props.roleUsers}
                        titles={["待选用户", "已选用户"]}
                        showSearch
                        filterOption={this.filterOption} //过滤选项
                        targetKeys={this.props.targetKeys} //目标数据源
                        onChange={this.handleChange} //控制目标数据源
                        render={item => item.title} //渲染数据
                    />
                </FormItem>
            </Form>
        );
    }
}
RoleAuthForm = Form.create({})(RoleAuthForm);