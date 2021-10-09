import React, { Component } from 'react'
import { Line } from '@ant-design/charts';


import MainSheet from './index.module.css'


export default class Stair extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{
                "name": 0,
                "value": 1,
            }]
        }
    }

    static getDerivedStateFromProps(props) {
        console.log(props.data);
        return {
            data: props.data
        }
    }

    render() {
        this.config = {
            data: this.state.data,
            xField: 'name',
            yField: 'value',
            // label: {
            //     position: 'middle',
            //     style: {
            //         fill: '#FFFFFF',
            //         opacity: 0.6,
            //     },
            // },
            // xAxis: {
            //     label: {
            //         autoHide: true,
            //         autoRotate: false,
            //     },
            // },
            stepType: 'vh',
            meta: {
                name: { alias: '家族名' },
                value: {
                    alias: '数值',
                },
            },
        };
        return (
            <div className={MainSheet.pageContainer}>
                <Line {...this.config} />
            </div>
        )
    }


}
