import React, { Component } from 'react'
import MainSheet from './index.module.css'


export default class AboutModule extends Component {
    constructor(props) {
        super(props)
        console.log('AboutModule', Date().toLocaleString().substr(16, 8));
    }

    render() {
        return (
            <div className={MainSheet.pageContainer}>
                <div className={MainSheet.titleContainer}>
                    <div className={MainSheet.title_zh}>
                        模型与系统介绍
                    </div>
                    <div className={MainSheet.title_en}>
                        模型与系统介绍
                    </div>
                </div>
            </div>
        )
    }
}
