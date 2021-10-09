import React, { Component } from 'react'
import { Column } from '@ant-design/charts';


import MainSheet from './index.module.css'


export default class HorizontalBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ name: "dreambot123", value: 0 }]
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
            xField: 'name',
            yField: 'value',
            label: {
                position: 'middle',
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
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
        };
        return (
            <div className={MainSheet.pageContainer}>
                <Column {...this.config} />
            </div>
        )
    }


}
