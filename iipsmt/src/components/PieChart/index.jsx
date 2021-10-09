import React, { Component } from 'react'
import { Pie } from '@ant-design/charts';

import MainSheet from './index.module.css'

export default class PieChart extends Component {
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
            angleField: 'value',
            colorField: 'name',
            radius: 0.8,
            label: {
                type: 'inner',
                offset: '-30%',
                content: '',
                style: {
                  fontSize: 10,
                  textAlign: 'center',
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
                <Pie {...this.config} />
            </div>
        )
    }


}
