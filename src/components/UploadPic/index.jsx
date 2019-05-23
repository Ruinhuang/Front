import React from 'react'
import { connect } from "react-redux"
import { Upload, Icon, message } from 'antd';
import Ajax from '../Ajax'
import './../../style/common.scss'

class UploadPic extends React.Component {
    componentDidMount = () => {
        if (this.props.payType === "WechatPay") this.payPath = '/user/paytype/addWechatPayAccount'
        if (this.props.payType === "AliPay") this.payPath = '/user/paytype/addAliPayAccount'
    }


    state = {
        loading: false,
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
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


    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState(() => ({
                    imageUrl,
                    loading: false,
                }),
                    // 這裏需要一個回調函數
                    () => Ajax.ajax(
                        'post',
                        this.payPath,
                        { "X-BM-USER-ID": this.props.user.userId },
                        {
                            "accountName": this.props.payType,
                            "accountNo": this.props.payType,
                            "address": this.props.payType,
                            "bank": this.props.payType,
                            "branch": this.props.payType,
                            "id": 0,
                            "qrCodeUrl": this.props.payType,
                            "subBranch": this.props.payType
                        },
                        'http://45.76.146.27',
                    )
                ),
            );
        }
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
        );
    }
}

// import React from 'react'
// import { Upload, Icon, message } from 'antd';
// import oss from 'ali-oss';
// import moment from 'moment';
// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

// const client = (self) => {
//   const {token} = self.state
//   console.log(token);
//   // 当时使用的插件版本为5.2
//   /*
//   return new oss.Wrapper({
//     accessKeyId: token.access_key_id,
//     accessKeySecret: token.access_key_secret,
//     region: '', //
//     bucket: '',//
//   });
//   */
//   // 2018-12-29更新
//   // ali-oss v6.x版本的写法
//   return new oss({
//     accessKeyId: token.access_key_id,
//     accessKeySecret: token.access_key_secret,
//     region: '', //
//     bucket: '',//
//   });
// }

// const uploadPath = (path, file) => {
//   // 上传文件的路径，使用日期命名文件目录
//   return `${moment().format('YYYYMMDD')}/${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`
// }
// const UploadToOss = (self, path, file) => {
//   const url = uploadPath(path, file)
//   return new Promise((resolve, reject) => {
//     client(self).multipartUpload(url, file).then(data => {
//       resolve(data);
//     }).catch(error => {
//       reject(error)
//     })
//   })
// }

// class Example extends React.Component {
//   state = {
//     loading: false,
//     token: {
//       access_key_id: '', // oss的key_id
//       access_key_secret: '', // oss的secret
//       OSS_ENDPOINT: '',  // 自己oss服务器的配置信息
//       OSS_BUCKET: '', // 自己oss服务器的配置信息
//     }
//   };
//   handleChange = (info) => {
//     if (info.file.status === 'uploading') {
//       this.setState({ loading: true });
//       return;
//     }
//     if (info.file.status === 'done') {
//       // Get this url from response in real world.
//       getBase64(info.file.originFileObj, imageUrl => this.setState({
//         imageUrl,
//         loading: false,
//       }));
//     }
//   }
//   beforeUpload = (file) => {
//     const isJPG = file.type === 'image/jpeg';
//     if (!isJPG) {
//       message.error('You can only upload JPG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must smaller than 2MB!');
//     }
//     let reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       // 使用ossupload覆盖默认的上传方法
//       UploadToOss(this, '上传路径oss配置信息', file).then(data => {
//         console.log(data.res.requestUrls)

//         this.setState({ imageUrl: data.res.requestUrls });
//       })
//     }
//     return false; // 不调用默认的上传方法
//   }
//   render() {
//     const uploadButton = (
//       <div>
//         <Icon type={this.state.loading ? 'loading' : 'plus'} />
//         <div className="ant-upload-text">Upload</div>
//       </div>
//     );
//     const imageUrl = this.state.imageUrl;
//     return (
//       <Upload
//         name="avatar"
//         listType="picture-card"
//         className="avatar-uploader"
//         showUploadList={false}
//         beforeUpload={this.beforeUpload}
//         onChange={this.handleChange}
//       >
//         {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
//       </Upload>
//     );
//   }
// }
const mapStateToProps = (state) => ({
    isLogin: state.isLogin,
    user: state.user
})


// 把逻辑方法与UI组件连接起来变成新容器组件
export default connect(mapStateToProps)(UploadPic)