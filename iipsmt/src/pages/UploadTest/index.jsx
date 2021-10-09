import React, { Component } from 'react'
import MainSheet from './index.module.css'
import Loading from './loading.module.css'

import icon_file from '../../static/icons/icon_file.png'
import icon_train from '../../static/icons/icon_train.png'
import axios from 'axios'

export default class UploadTest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileName: '未上传',
            content: '文件预览区域',
            loading: false,
            uploaded:false,
        }
        this.resultFile = '';
        this.classifyButton = this.props.match.params.file_type === 'step1' ? '选择训练集' : '选择测试集'
    }

    render() {
        return (
            <div className={[MainSheet.pagePadding, 'zoomIn'].join(' ')}>

                <div className={MainSheet.pageContainer}>
                    {
                        this.state.loading ? (
                            <div className={Loading.pageContainer}>
                                正在上传文件 请勿关闭页面
                                <div className={Loading.bar}></div>
                            </div>
                        ) : ''
                    }
                    <div className={MainSheet.fileUploadModule}>
                        <div className={MainSheet.filePath}>{this.state.fileName}</div>
                        <label htmlFor="file" className={MainSheet.fileUploadLable}>
                            <img className={MainSheet.btnIcon} src={icon_file} alt="file" />
                            {this.classifyButton}
                        </label>
                        <button className={MainSheet.modelClassifying} onClick={() => this.handleClassifyClick()}>
                            <img className={MainSheet.btnIcon} src={icon_train} alt="train" />恶意流量分类任务
                        </button>
                        <button className={MainSheet.modelPredicting} onClick={() => this.handlePredictClick()}>
                            <img className={MainSheet.btnIcon} src={icon_train} alt="train" />恶意流量预测任务
                        </button>
                        <input id='file' className={MainSheet.fileUpload} type="file" accept='.csv' onChange={(e) => this.handleFileUpload(e)} />
                    </div>
                    <span className={MainSheet.fileOverview}>{this.state.content}</span>
                </div>
            </div>
        )
    }

    handleClassifyClick = () => {
        if( !this.state.uploaded ){
            alert("未上传数据文件");
            return;
        }
        this.setState({
            loading: true
        })
        // this.props.history.push('/test_result')
        // console.log(this.resultFile);
        let form = new FormData();
        form.append('file', this.resultFile);
        form.append('chunk', '0');
        axios.post('/classify_' + this.props.match.params.file_type, form, { headers: { "Content-Type": "multipart/form-data" } })
            .then(res => {
                console.log('upload successfully', res);
                switch (this.props.match.params.file_type) {
                    case 'step1':
                        this.props.history.push('/test_result')
                        break;
                    case 'step3':
                        this.props.history.push('/classify_step3')
                        break;
                    default:
                        this.props.history.push('/test_result')
                }

            })
    }

    handlePredictClick = () => {
        if( !this.state.uploaded ){
            alert("未上传数据文件");
            return;
        }
        this.setState({
            loading: true
        })
        // this.props.history.push('/test_result')
        // console.log(this.resultFile);
        let form = new FormData();
        form.append('file', this.resultFile);
        form.append('chunk', '0');
        axios.post('/predict_' + this.props.match.params.file_type, form, { headers: { "Content-Type": "multipart/form-data" } })
            .then(res => {
                console.log('upload successfully', res);
                switch (this.props.match.params.file_type) {
                    case 'step1':
                        this.props.history.push('/predict_step2')
                        break;
                    case 'step3':
                        this.props.history.push('/predict_step3')
                        break;
                    default:
                        this.props.history.push('/predict_step2')
                }

            })
    }

    handleFileUpload = (e) => {
        var self = this;
        var resultFile = e.target.files[0];
        this.resultFile = e.target.files[0];
        if (resultFile) {
            self.setState({
                loading: true
            })
            var reader = new FileReader();
            reader.readAsText(resultFile, 'UTF-8');
            reader.onloadend = function () {
                var content = this.result.substr(0,this.result.length/10).replace(/[,]/g, '\t');
                self.setState({
                    uploaded:true,
                    // content: this.result.replace(/[,]/g, '\t'),
                    content,
                    fileName: e.target.value,
                    loading: false
                })
            };
        }
    }

    componentDidMount = () => {
        if (!document.cookie.length) {
            alert('此操作需要用户登录')
            this.props.history.push('/')
            return;
        }
    }


}

