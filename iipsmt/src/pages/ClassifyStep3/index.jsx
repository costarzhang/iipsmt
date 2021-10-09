import React, { Component } from 'react'
import axios from 'axios'
import MainSheet from './index.module.css'
import Chart from './chart.module.css'
import Loading from './loading.module.css'

import HorizontalBar from '../../components/HorizontalBar'
import PieChart from '../../components/PieChart'


export default class ClassifyStep3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            data: []
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
                        <div className={Chart.normalVerticalChart}>
                            <div className={Chart.normalChart}>
                                <div className={Chart.chartTitle}>家族名与数</div>
                                <PieChart data={data} />
                            </div>
                            <div className={Chart.normalChart}>
                                <div className={Chart.chartTitle}>家族名与数</div>
                                <HorizontalBar data={data} />
                            </div>
                        </div>
                    </div>
                    {/* <div className={MainSheet.nextStepModule}>
                        <button className={MainSheet.modelTraining} onClick={() => this.handleTrainClick()}>
                            <img className={MainSheet.btnIcon} src={icon_train} alt="train" />
                            下一步
                        </button>
                    </div> */}
                </div>
            </div>
        )
    }

    // handleTrainClick = () => {
    //     this.props.history.push('/upload_file/classify_step3')
    // }

    componentDidMount = () => {//application/x-www-form-urlencoded 
        if (!document.cookie.length) {
            alert('此操作需要用户登录')
            this.props.history.push('/')
            return ;
        }
        axios.post('/classify_step3_result', {}, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).then(res => {
            // console.log(res.data);
            this.setState({
                loading:false,
                data: res.data
            })
        })
    }

    // getData = async () => {

    //     return response.data;
    // }
}

