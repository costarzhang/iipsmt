import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.css';

import NavigationBar from './pages/NavigationBar';
import IndexContent from './pages/IndexContent';
import AboutModule from './pages/AboutModule';

import './static/css/animation.css'
import UploadTest from './pages/UploadTest';
import TestResult from './pages/TestResult';
import ClassifyStep3 from './pages/ClassifyStep3'
import PredictStep2 from './pages/PredictStep2'
import PredictStep3 from './pages/PredictStep3'

export default class App extends Component {
    render() {
        return (
            <div className={'pageContainer'}>
                <NavigationBar />
                <Switch>
                    <Route exact path='/' component={IndexContent} />
                    <Route path='/about_module' component={AboutModule} />
                    <Route path='/upload_file/:file_type' component={UploadTest} />
                    <Route path='/test_result' component={TestResult} />
                    <Route path='/classify_step3' component={ClassifyStep3} />
                    <Route path='/predict_step2' component={PredictStep2} />
                    <Route path='/predict_step3' component={PredictStep3} />
                    <Redirect to='/' />
                </Switch>
            </div>
        )
    }
}
