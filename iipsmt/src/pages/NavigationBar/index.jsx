import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MainSheet from './index.module.css'

import Login from '../../components/Login'

export default class NavigationBar extends Component {
    state = {
        login: false
    }
    constructor(props) {
        super(props)
        this.user = '登录 / 注册'
        this.login = false;
        if (document.cookie.length) {
            this.user = document.cookie.split('=')[1];
            this.login = true;
        }

    }

    render() {
        const { login } = this.state;
        return (
            <ul className={MainSheet.barContainer}>
                <li className={MainSheet.style_logo} >
                    <Link to='/'>IIPSMT</Link>
                </li>
                <li ><Link to='/about_module'>模型与系统介绍</Link></li>
                <li ><Link to='/about_team'>队员介绍</Link></li>
                <li className={MainSheet.btn_language} onClick={this.handleLoginClick}>{this.user}</li>
                {login ? <Login handleBGClick={this.handleLoginClick} /> : ''}
            </ul>
        )
    }

    handleLoginClick = () => {
        if (this.login) {
            alert('账号已退出')
            var myDate = new Date();
            myDate.setTime(-1000);//设置时间 
            document.cookie = "user=''; expires=" + myDate.toGMTString();
            this.user = '登录 / 注册';
            this.login = false
            this.setState({})
        } else {
            const { login } = this.state;
            this.setState({
                login: !login
            })
        }

    }
}
