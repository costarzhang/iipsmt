import React, { Component } from 'react'
// import { History } from 'react-router-dom';
import MainSheet from './index.module.css'


export default class IndexContent extends Component {
    constructor(props){
        super(props)
        console.log('IndexContent',Date().toLocaleString().substr(16,8));
    }

    render() {
        return (
            <div className={[MainSheet.pageContainer,'zoomIn'].join(' ')}>
                <div className={MainSheet.titleContainer}>
                    <div className={MainSheet.title_zh}>
                        智能识别预测恶意流量系统
                    </div>
                    <div className={MainSheet.title_en}>
                        Intelligent identification and prediction system of malicious traffic
                    </div>
                </div>
                <div className={MainSheet.interactContainer}>
                    <div>01 训练模型</div>
                    <button onClick={this.handleUploadStep1Click}>上传训练集</button>
                    <div>02 测试模型</div>
                    <button onClick={this.handleUploadStep2Click}>上传测试集</button>
                </div>
            </div>
        )
    }

    handleUploadStep1Click = () => {
        if (document.cookie.length) {
            this.props.history.push('/upload_file/step1')
        }else{
            alert('此操作需要用户登录')
        }
        
    }

    handleUploadStep2Click = () => {
        if (document.cookie.length) {
            this.props.history.push('/upload_file/step3')
        }else{
            alert('此操作需要用户登录')
        }
    }
}
