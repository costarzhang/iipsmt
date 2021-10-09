import React, { Component } from 'react'
import axios from 'axios';

import signUp from './index.module.css'


export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.id = React.createRef();
        this.pass = React.createRef();
        this.passDouble = React.createRef();
    }


    render() {
        return (
            <div >
                <form className={signUp.pageContainer} action="">
                    <div className={signUp.userInfo} >账号</div>
                    <input className={signUp.userInput} placeholder="邮箱或ID" type="text" ref={this.id} />
                    <div className={signUp.userInfo} >密码</div>
                    <input className={signUp.userInput} placeholder="您的密码" type="password" ref={this.pass} />
                    <div className={signUp.userInfo}>确认密码</div>
                    <input className={signUp.userInput} placeholder="与上方一致" type="password" ref={this.passDouble} />
                    <input className={signUp.signUpButton} type="button" value="注册" onClick={this.handleSignupClick} />
                </form>
            </div>
        )
    }


    handleSignupClick = (e) => {
        if (this.pass.current.value === this.passDouble.current.value) {
            axios.post('/register', {
                id: this.id.current.value,
                pass: this.pass.current.value
            }).then((res) => {
                if (res.data.code) {
                    e.target.defaultValue = '注册成功';
                    setTimeout(() => {
                        this.props.changeIsSignIn();
                    }, 800);
                } else {
                    e.target.defaultValue = '账号已被注册';
                    setTimeout(() => {
                        e.target.defaultValue = '注册';
                    }, 800);
                }
            })
        }else{
            e.target.defaultValue = '两次密码不同';
            setTimeout(() => {
                e.target.defaultValue = '注册';
            }, 800);
        }


    }
}
