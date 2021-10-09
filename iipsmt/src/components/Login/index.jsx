import React, { Component } from 'react'

import SignIn from '../../containers/SignIn'
import SignUp from '../../containers/SignUp'

import login from './index.module.css'

export default class Login extends Component {
    state = {
        isSignIn: true,
        isActive: true,
    }
    // constructor(props) {
    //     super(props)
    // }

    render() {
        const { isSignIn, isActive } = this.state
        return (
            <div className={[login.pageContainer, isActive ? 'blur_background' : 'blur_background_dismiss'].join(' ')}
                onClick={this.handleBGClick} onAnimationEnd={this.handleAnimationEnd}>
                <div className={login.loginContainer} onClick={this.handleContainerClick}>
                    <div className={login.title}>
                        <div className={login.titleName}>IIPSMT</div>
                        <div className={login.sign} onClick={this.handelSwitchClick} style={{ color: (isSignIn ? "rgb(0, 122, 204)" : "") }}>登录</div>|
                        <div className={login.sign} onClick={this.handelSwitchClick} style={{ color: (isSignIn ? "" : "rgb(0, 122, 204)") }}>注册</div>
                    </div>
                    {isSignIn ? <SignIn handleBGClick={this.handleBGClick}/> : ""}
                    {!isSignIn ? <SignUp changeIsSignIn={this.changeIsSignIn} /> : ""}
                    {/* <img className={login.login_pic} src={login_pic} alt="" /> */}
                </div>
            </div>

        )
    }

    handelSwitchClick = (node) => {
        let { isSignIn } = this.state;
        if (node.target.innerText === "登录") {
            if (!isSignIn) {
                this.setState({
                    isSignIn: true
                })
            }
        } else {
            if (isSignIn) {
                this.setState({
                    isSignIn: false
                })
            }
        }
    }

    handleContainerClick = (event) => {
        event.stopPropagation();
    }

    changeIsSignIn = () => {
        this.setState({
            isSignIn: true
        })
    }

    handleHistoryReplace = (url) => {
        this.props.history.replace(url);
    }

    handleBGClick = () => {
        this.setState({
            isActive: false
        })
    }

    handleAnimationEnd = () => {
        if (!this.state.isActive) {
            this.props.handleBGClick();
        }
    }

}
