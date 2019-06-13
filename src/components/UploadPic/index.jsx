import React from 'react'
import { connect } from "react-redux"
import { Button, Upload, Icon, message } from 'antd';
import Ajax from '../Ajax'
import './../../style/common.scss'

class UploadPic extends React.Component {
    state = {
        loading: false,
        imageUrl: "",
        id: 0,
        hasQrCode: false,
    };

    method = ''

    getPayTypeInfo = () => {
        Ajax.ajax(
            'get',
            "/user/paytype/list",
            { "X-BM-USER-ID": this.props.user.userId },
            {},
            'http://45.76.146.27',
        ).then(
            res => {
                for (let item in res.data) {
                    if (res.data[item].type === this.props.payType) {
                        this.setState(() => (
                            {
                                imageUrl: res.data[item].qrCodeUrl,
                                id: res.data[item].id,
                                hasQrCode: true
                            }
                        ),
                        )
                    }
                }
            }).then(
                () => {
                    this.method = this.state.hasQrCode ? 'update' : 'add'
                }
            )
    }

    componentDidMount = () => {
        if (this.props.payType === "WECHAT_PAY") this.payType = 'WechatPay'
        if (this.props.payType === "ALI_PAY") this.payType = 'AliPay'
        this.getPayTypeInfo()
    }

    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('Image must smaller than 1MB!');
        }
        return isJPG && isLt1M;
    }

    customRequest = (option) => {
        const img = option.file
        this.setState({ loading: true });
        const formData = new FormData();
        formData.append('smfile', img);
        formData.append('filename', img);
        Ajax.ajax(
            'post',
            '/api/upload',
            {},
            formData,
            "https://sm.ms",
        ).then(data => this.setState(
            () => ({
                imageUrl: data.data.url,
                loading: false,
            })
        )
        ).then(() => Ajax.ajax(
            'post',
            `/user/paytype/${this.method}${this.payType}Account`,
            { "X-BM-USER-ID": this.props.user.userId },
            {
                "accountName": this.props.payType,
                "accountNo": this.props.payType,
                "address": this.props.payType,
                "bank": this.props.payType,
                "branch": this.props.payType,
                "id": this.state.id,
                "qrCodeUrl": this.state.imageUrl,
                "subBranch": this.props.payType
            },
            'http://45.76.146.27',
        )).then(
            () => {
                this.setState({ loading: false })
                this.getPayTypeInfo()
            }
        )
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={this.customRequest}
                    beforeUpload={this.beforeUpload}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                </Upload>
                <Button
                    icon="delete"
                    onClick={
                        () => {
                            Ajax.ajax(
                                'get',
                                `/user/paytype/delete${this.payType}Account`,
                                { "X-BM-USER-ID": this.props.user.userId },
                                {
                                    "paytypeId": this.state.id,
                                },
                                'http://45.76.146.27',
                            ).then(
                                () => {
                                    this.method = ''
                                    this.setState(() => (
                                        {
                                            imageUrl: "",
                                            hasQrCode: false,
                                        }
                                    ))
                                    this.getPayTypeInfo()
                                }
                            )
                        }
                    }
                >
                    删除
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})

export default connect(mapStateToProps)(UploadPic)