import React  from 'react';
import { Card } from 'antd';
import BaseForm from '../../components/BaseForm'
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
        return (
            <div>
                <Card>
                    <BaseForm submitFunc={() => { }} switchFunc={() => { }} formList={this.formList} />
                </Card>
            </div>
        )
    }
}