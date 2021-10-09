import React, { Component } from 'react'
// import { Heatmap } from '@ant-design/charts';
import MainSheet from './index.module.css'
// import pic_heatMap from '../../static/pics/heatmap.png'
// import axios from 'axios'


export default class Hotmap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ''
        }
    }

    static getDerivedStateFromProps(props) {
        // if(props.data){
        //     axios.post('/pic',{}).then((res)=>{
        //         console.log('hha');
        //         return { data : res.data}
        //     })
        // }
        return {
            data: props.data
        }
    }

    render() {
        return (
            <div className={MainSheet.pageContainer}>
                <img src={this.state.data} className={MainSheet.mapPic} alt="" />
            </div>
        )
    }



    // render() {
    //     this.config = {
    //         data: this.state.data,
    //         xField: 'y',
    //         yField: 'x',
    //         colorField:'value',
    //         autoFit: false,
    //         color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
    //         tooltip:{}
    //     };
    //     return (
    //         <div className={MainSheet.pageContainer}>
    //             <Heatmap {...this.config} />
    //         </div>
    //     )
    // }


}
