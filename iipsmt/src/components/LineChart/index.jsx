import React, { Component } from 'react'
import { Line } from '@ant-design/charts';


import MainSheet from './index.module.css'


export default class LineChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{
                "x": 0,
                "value": 0.3442703576196164,
                "type": "training"
            }]
        }
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data
        }
    }

    render() {
        this.config = {
            data: this.state.data,
            xField: 'x',
            yField: 'value',
            seriesField: 'type',
            // label: {
            //     position: 'middle',
            //     style: {
            //         fill: '#FFFFFF',
            //         opacity: 0.6,
            //     },
            // },
            xAxis: {
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            meta: {
                name: { alias: '家族名' },
                value: {
                    alias: '数值',
                },
            },
            color: ['#1979C9', '#D62A0D'],
        };
        return (
            <div className={MainSheet.pageContainer}>
                <Line {...this.config} />
            </div>
        )
    }


}
