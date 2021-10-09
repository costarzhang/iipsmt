import axios from 'axios';
import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { } from 'react-router-dom'

import signIn from './index.module.css'

export default class SignIn extends Component {

    constructor(props){
        super(props)
        this.id = React.createRef();
        this.pass = React.createRef();
    }

    render() {
        return (
            <div >
                <form className={signIn.pageContainer} action="">
                    <div className={signIn.userInfo} >账号</div>
                    <input className={signIn.userInput} placeholder="邮箱或ID" type="text" ref={this.id}/>
                    <div className={signIn.userInfo}>密码</div>
                    <input className={signIn.userInput} placeholder="密码" type="password" ref={this.pass}/>
                    <input className={signIn.signInButton} type="button" value="登录" onClick={(e) => { this.handleSigninClick(e) }} />
                </form>
            </div>
        )
    }

    handleSigninClick = (e) => {
        axios.post('/login',{
            id: this.id.current.value,
            pass: this.pass.current.value,
        }).then((res)=>{
            if( res.data.code ){
                e.target.defaultValue = '登陆成功';
                setTimeout(() => {
                    window.location.reload()
                    // this.props.handleBGClick();
                }, 800);
            }else{
                e.target.defaultValue = '账号或密码错误';
                setTimeout(() => {
                    e.target.defaultValue = '登录';
                }, 800);
            }
        })   
    }



}
