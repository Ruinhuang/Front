import React, { Component } from 'react'
import { Input, Select, Form, Checkbox, Switch, Button, DatePicker } from 'antd'
import { getOptionList } from '../../utils'
const FormItem = Form.Item

class BaseForm extends Component {

    initFormList = () => {
        const { getFieldDecorator } = this.props.form
        const formList = this.props.formList
        const formItemList = []
        if (formList && formList.length > 0) {
            formList.forEach(
                (item, i) => {
                    let label = item.label
                    let field = item.field
                    let initialValue = item.initialValue || ""
                    let placeholder = item.placeholder
                    let width = item.width
                    let list = item.list
                    let type = item.type
                    let switchFunc = item.switchFunc
                    if (type === "SWITCH") {
                        formItemList.push(
                            <FormItem label={label} key={field} >
                                {
                                    getFieldDecorator(field, {
                                        initialValue,
                                    })(
                                        <Switch
                                            checkedChildren="开"
                                            unCheckedChildren="关"
                                            onClick={(checked) => switchFunc(checked)}
                                        />
                                    )
                                }
                            </FormItem>
                        )
                    }
                    if (type === "INPUT") {
                        formItemList.push(
                            <FormItem label={label} key={field} >
                                {
                                    getFieldDecorator(field, {
                                        initialValue,
                                    })(
                                        <Input type="text" placeholder={placeholder} />
                                    )
                                }
                            </FormItem>
                        )
                    }
                    if (type === "CHECKBOX") {
                        formItemList.push(
                            <FormItem label={label} key={field} >
                                {
                                    getFieldDecorator(field, {
                                        valuePropName: 'checked',
                                        initialValue,// true|false
                                    })(
                                        <Checkbox>
                                            {label}
                                        </Checkbox>
                                    )
                                }
                            </FormItem>
                        )
                    }
                    if (item.type === 'TIME') {
                        formItemList.push(
                            <FormItem label="时间" key={field}>
                                {
                                    getFieldDecorator('begin_time')(
                                        <DatePicker
                                            showTime={true}
                                            placeholder={placeholder}
                                            format="YYYY-MM-DD HH:mm:ss" />
                                    )
                                }
                            </FormItem >
                        )
                        formItemList.push(
                            <FormItem label="~" colon={false} key={field}>
                                {
                                    getFieldDecorator('end_time')(
                                        <DatePicker
                                            showTime={true}
                                            placeholder={placeholder}
                                            format="YYYY-MM-DD HH:mm:ss" />
                                    )
                                }
                            </FormItem>
                        )
                    }
                    if (type === "SELECT") {
                        formItemList.push(
                            <FormItem label={label} key={field} >
                                {
                                    getFieldDecorator(field, {
                                        initialValue,
                                    })(
                                        <Select
                                            style={{ width }}
                                            placeholder={placeholder}
                                        >
                                            {getOptionList(list)}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        )
                    }
                }
            )
        }
        return formItemList
    }

    handleSubmit = () => {
        let fieldsValue = this.props.form.getFieldsValue()
        console.log(fieldsValue)
        this.props.submitFunc(fieldsValue)
    }

    render() {
        return (
            <Form layout="inline">
                {this.initFormList()}
                <Button type="primary" onClick={() => this.handleSubmit()}>
                    Done
                </Button>
            </Form>
        )
    }
}

export default Form.create()(BaseForm)