import React, { Component } from 'react'
import { Bar } from '@ant-design/charts';


import MainSheet from './index.module.css'


export default class VerticalBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ col_labels: "dreambot123", corr_values: 0 }]
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
            xField: 'corr_values',
            yField: 'col_labels',
            legend: { position: 'top_left' },

            xAxis: {
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            meta: {
                corr_values: { alias: '数值' },
                col_labels: {
                    alias: '数值',
                },
            },
        };
        return (
            <div className={MainSheet.pageContainer}>
                <Bar {...this.config} />
            </div>
        )
    }


}
