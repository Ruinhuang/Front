import React from 'react';
import { Card } from 'antd';
import BaseForm from '../../components/BaseForm'
import BaseTable from '../../components/BaseTable'
import '../../style/common.scss'


export default class userTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.formList = [
            {
                type: 'INPUT',
                label: '模式',
                field: 'mode',
                placeholder: '请输入模式',
                width: 100,
            },
            {
                type: 'SELECT',
                label: '订单状态',
                field: 'order_status',
                placeholder: '全部',
                initialValue: '1',
                width: 100,
                list: [{ id: '0', name: '全部' }, { id: '1', name: '进行中' }, { id: '2', name: '结束行程' }]
            },
        ];
    }


    render = () => {
        const columns = [
            {
                title: 'id',
                dataIndex: 'id'
            }, {
                title: '用户名',
                dataIndex: 'username'
            }, {
                title: '性别',
                dataIndex: 'sex',
                render(sex) {
                    return sex === 1 ? '男' : '女';
                }
            }, {
                title: '状态',
                dataIndex: 'state',
                render(state) {
                    let config = {
                        '1': "咸🐟一条",
                        '2': '风华浪子',
                        '3': '北大才子一枚',
                        '4': '百度FE',
                        '5': '创业者',
                    };
                    return config[state];
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday'
            }, {
                title: '联系地址',
                dataIndex: 'address'
            }, {
                title: '早起时间',
                dataIndex: 'time'
            },
        ];

        return (
            <div>
                <Card>
                    <BaseForm submitFunc={() => { }} switchFunc={() => { }} formList={this.formList} />
                </Card>
                <BaseTable
                    columns={columns}
                // updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                // selectedRowKeys={this.state.selectedRowKeys}
                // selectedItem={this.state.selectedItem}
                // dataSource={this.state.list}
                // pagination={this.state.pagination}
                />
            </div>
        )
    }
}