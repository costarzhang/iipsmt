import React, { Component } from 'react'
import axios from 'axios'
import MainSheet from './index.module.css'
import Chart from './chart.module.css'
import icon_train from '../../static/icons/icon_train.png'
import Loading from './loading.module.css'

import VerticalBar from '../../components/VerticalBar'
import Hotmap from '../../components/HotMap'
import LineChart from '../../components/LineChart'
import StairLine from '../../components/StairLine'


export default class PredictStep2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            data: {
                data_00: [],
                data_01: [],
                data_03: [],
                data_04: [],
            },
            img:''
        }
    }

    render() {
        const { data } = this.state;
        return (
            <div className={[MainSheet.pagePadding, 'zoomIn'].join(' ')}>
                <div className={MainSheet.pageContainer}>
                {
                        this.state.loading ? (
                            <div className={Loading.pageContainer}>
                                正在训练模型 请勿关闭页面
                                <div className={Loading.bar}></div>
                            </div>
                        ) : ''
                    }
                    <div className={MainSheet.chartContainer}>
                        <div className={Chart.verticalContainer}>

                            <div className={Chart.normalChart}>
                                <div className={Chart.normalVerticalChart}>
                                    <div className={Chart.normalChart}>
                                        <div className={Chart.chartTitle}>恶意流量家族时序图</div>
                                        <StairLine data={data.data_00} />
                                    </div>
                                </div>

                                <div className={Chart.normalVerticalChart}>
                                    <div className={Chart.normalChart}>
                                        <div className={Chart.chartTitle}>热力图</div>
                                        <Hotmap data={this.state.img}/>
                                    </div>
                                    <div className={Chart.normalChart}>
                                        <div className={Chart.chartTitle}>multi_logloss</div>
                                        <LineChart data={data.data_03} />
                                    </div>
                                    <div className={Chart.normalChart}>
                                        <div className={Chart.chartTitle}>multi_error</div>
                                        <LineChart data={data.data_04} />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={Chart.horizontalContainer} >
                            <div className={Chart.chartTitle}>属性与相关性</div>
                            <VerticalBar data={data.data_01} />
                        </div>

                    </div>
                    <div className={MainSheet.nextStepModule}>
                        <button className={MainSheet.modelTraining} onClick={() => this.handleTrainClick()}>
                            <img className={MainSheet.btnIcon} src={icon_train} alt="train" />
                            下一步
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    handleTrainClick = () => {
        this.props.history.push('/upload_file/step3')
    }

    componentDidMount = () => {//application/x-www-form-urlencoded 
        if (!document.cookie.length) {
            alert('此操作需要用户登录')
            this.props.history.push('/')
            return ;
        }
        axios.post('/predict_step2', {}, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).then(res => {
            console.log(res.data);
            this.setState({
                loading:false,
                data: res.data,
                img: '/pic'
            })
        })
    }

    // getData = async () => {

    //     return response.data;
    // }
}

