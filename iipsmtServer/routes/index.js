// var data = require('./data')
var express = require('express');
// const {resolve} = require('path')
var fs = require('fs')
var router = express.Router();
const formidable = require('formidable');
const child_process = require('child_process')

const users = new Array();
users.push({
    id: 'admin',
    pass: 'nimda'
})

/* GET home page. */
router.post('/data', function (req, res, next) {
    console.log('Post data');
    // console.log(req.headers);

    let data_00 = [];
    for (const iterator in data[0]) {
        let temp = {};
        temp['name'] = iterator;
        temp['value'] = data[0][iterator];
        data_00.push(temp);
    }

    let data_01 = JSON.parse(data[1]);
    data_01 = Object.keys(data_01).map(e => {
        return data_01[e];
    });
    data_01.sort((a, b) => {
        return b['corr_values'] - a['corr_values'];
    })

    // let data_02 = JSON.parse(data[2]);
    // var tempData_02 = [];
    // Object.keys(data_02).forEach(e=>{
    //     var esArgs = Object.keys(data_02[e]);
    //     for( arg of esArgs){
    //         let tempObj = {};
    //         tempObj.x = e;
    //         tempObj.y = arg;
    //         tempObj.value = data_02[e][arg];
    //         tempData_02.push(tempObj);
    //     }
    // });

    let tempData_03 = data[3];
    let data_03 = [];
    let data_04 = [];
    tempData_03['training']['multi_logloss'].forEach((value, index) => {
        data_03.push({
            x: index,
            value,
            type: 'training'
        })
    })
    tempData_03['valid_1']['multi_logloss'].forEach((value, index) => {
        data_03.push({
            x: index,
            value,
            type: 'valid'
        })
    })
    tempData_03['training']['multi_error'].forEach((value, index) => {
        data_04.push({
            x: index,
            value,
            type: 'training'
        })
    })
    tempData_03['valid_1']['multi_error'].forEach((value, index) => {
        data_04.push({
            x: index,
            value,
            type: 'valid'
        })
    })

    res.header("Access-Control-Allow-Origin", 'http://loaclhost:9000/');
    res.send({
        data_00,
        data_01,
        // data_02:tempData_02,
        data_03,
        data_04
    })
});

router.get('/', function (req, res, next) {
    // req.setTimeout(1)
    console.log('Get data');
    // console.log(req.headers);


    let data_00 = [];
    for (const iterator in data[0]) {
        let temp = {};
        temp['name'] = iterator;
        temp['value'] = data[0][iterator];
        data_00.push(temp);
    }

    let data_01 = JSON.parse(data[1]);
    data_01 = Object.keys(data_01).map(e => {
        return data_01[e];
    });
    data_01.sort((a, b) => {
        return b['corr_values'] - a['corr_values'];
    })

    let data_02 = JSON.parse(data[2]);
    var tempData_02 = [];
    Object.keys(data_02).forEach(e => {
        var esArgs = Object.keys(data_02[e]);
        for (arg of esArgs) {
            let tempObj = {};
            tempObj.x = e;
            tempObj.y = arg;
            tempObj.value = data_02[e][arg];
            tempData_02.push(tempObj);
        }
    });


    let tempData_03 = data[3];
    let data_03 = [];
    let data_04 = [];
    tempData_03['training']['multi_logloss'].forEach((value, index) => {
        data_03.push({
            x: index,
            value,
            type: 'training'
        })
    })
    tempData_03['valid_1']['multi_logloss'].forEach((value, index) => {
        data_03.push({
            x: index,
            value,
            type: 'valid'
        })
    })
    tempData_03['training']['multi_error'].forEach((value, index) => {
        data_04.push({
            x: index,
            value,
            type: 'training'
        })
    })
    tempData_03['valid_1']['multi_error'].forEach((value, index) => {
        data_04.push({
            x: index,
            value,
            type: 'valid'
        })
    })

    // res.header("Access-Control-Allow-Origin", 'http://loaclhost:9000/');
    res.send({
        // data_00,
        // data_01,
        // data_02:tempData_02,
        data_03,
        data_04
    })
});

router.post('/classify_step1', (req, res) => {

    var form = new formidable.IncomingForm({
        uploadDir: './Module/data',
    });
    form.parse(req, (err, fields, files) => {
        var file = files.file;
        var result = '';
        fs.rename(file.path, './Module/data/' + file.name, err => {
            if (err) console.log(err)
            else {
                console.log(file.name + ' saved');
                var pyProcess = child_process.exec('python ./Module/all_code.py classify step1', (error, stdout, stderr) => {
                    if (error) {
                        console.log('error', error);
                        result = error;
                    }
                    else if (stderr) {
                        console.log('stderr', stderr);
                        result = stderr;
                    }
                    else {
                        console.log('here');
                        result = stdout;
                    }
                    res.send({ result })
                })
            }
        })

    })

})

router.post('/classify_step2', function (req, res, next) {
    req.setTimeout(120 * 1000);
    console.log('Post classify_step2');
    // console.log(req.headers);
    var pyProcess = child_process.exec('python ./Module/all_code.py classify step2', { maxBuffer: 900000 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.log('error', error);
            result = error;
            res.send(result);
        }
        else if (stderr) {
            console.log('stderr', stderr);
            result = stderr;
            res.send(result);
        }
        else {
            let data_00 = [];
            let data = JSON.parse(stdout);
            console.log(typeof data);
            for (const iterator in data[0]) {
                let temp = {};
                temp['name'] = iterator;
                temp['value'] = data[0][iterator];
                data_00.push(temp);
            }

            let data_01 = JSON.parse(data[1]);
            data_01 = Object.keys(data_01).map(e => {
                return data_01[e];
            });
            data_01.sort((a, b) => {
                return b['corr_values'] - a['corr_values'];
            })

            let tempData_03 = data[3];
            let data_03 = [];
            let data_04 = [];
            tempData_03['training']['multi_logloss'].forEach((value, index) => {
                data_03.push({
                    x: index,
                    value,
                    type: 'training'
                })
            })
            tempData_03['valid_1']['multi_logloss'].forEach((value, index) => {
                data_03.push({
                    x: index,
                    value,
                    type: 'valid'
                })
            })
            tempData_03['training']['multi_error'].forEach((value, index) => {
                data_04.push({
                    x: index,
                    value,
                    type: 'training'
                })
            })
            tempData_03['valid_1']['multi_error'].forEach((value, index) => {
                data_04.push({
                    x: index,
                    value,
                    type: 'valid'
                })
            })

            res.header("Access-Control-Allow-Origin", 'http://loaclhost:9000/');
            res.send({
                data_00,
                data_01,
                // data_02:tempData_02,
                data_03,
                data_04
            })
        }
    })
});

router.post('/classify_step3', (req, res) => {
    var form = new formidable.IncomingForm({
        uploadDir: './Module/temp',
    });
    form.parse(req, (err, fields, files) => {
        var file = files.file;
        var result = '';
        fs.rename(file.path, './Module/temp/' + file.name, err => {
            if (err) res.send(err)
            else {
                console.log(file.name + ' saved');
                res.send()
            }
        })

    })
})

router.post('/classify_step3_result', function (req, res, next) {
    req.setTimeout(120 * 1000);
    console.log('Post classify_step3');
    // console.log(req.headers);
    var pyProcess = child_process.exec('python ./Module/all_code.py classify step3', { maxBuffer: 900000 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.log('error', error);
            result = error;
            res.send(result);
        }
        else if (stderr) {
            console.log('stderr', stderr);
            result = stderr;
            res.send(result);
        }
        else {
            let data_00 = [];
            let data = JSON.parse(stdout);
            let pic;
            for (const iterator in data) {
                let temp = {};
                temp['name'] = iterator;
                temp['value'] = data[iterator];
                data_00.push(temp);
            }
            res.send(data_00);
        }
    })
});


router.post('/predict_step1', (req, res) => {

    var form = new formidable.IncomingForm({
        uploadDir: './Module/data',
    });
    form.parse(req, (err, fields, files) => {
        var file = files.file;
        var result = '';
        fs.rename(file.path, './Module/data/' + file.name, err => {
            if (err) console.log(err)
            else {
                console.log(file.name + ' saved');
                var pyProcess = child_process.exec('python ./Module/all_code.py predict step1', (error, stdout, stderr) => {
                    if (error) {
                        console.log('error', error);
                        result = error;
                    }
                    else if (stderr) {
                        console.log('stderr', stderr);
                        result = stderr;
                    }
                    else {
                        console.log('here');
                        result = stdout;
                    }
                    res.send({ result })
                })
            }
        })

    })

})

router.post('/predict_step2', function (req, res, next) {
    req.setTimeout(120 * 1000);
    console.log('Post predict_step2');
    // console.log(req.headers);
    var pyProcess = child_process.exec('python ./Module/all_code.py predict step2', { maxBuffer: 900000 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.log('error', error);
            result = error;
            res.send(result);
        }
        else if (stderr) {
            console.log('stderr', stderr);
            result = stderr;
            res.send(result);
        }
        else {
            let data_00 = [];
            let data = JSON.parse(stdout);
            // res.send(data)
            data[0] = JSON.parse(data[0])

            // console.log( typeof data);
            for (const iterator in data[0]) {
                let temp = {};
                temp['name'] = iterator;
                temp['value'] = data[0][iterator];
                data_00.push(temp);
            }

            let data_01 = JSON.parse(data[1]);
            data_01 = Object.keys(data_01).map(e => {
                return data_01[e];
            });
            data_01.sort((a, b) => {
                return b['corr_values'] - a['corr_values'];
            })

            let tempData_03 = data[3];
            let data_03 = [];
            let data_04 = [];
            tempData_03['training']['multi_logloss'].forEach((value, index) => {
                data_03.push({
                    x: index,
                    value,
                    type: 'training'
                })
            })
            tempData_03['valid_1']['multi_logloss'].forEach((value, index) => {
                data_03.push({
                    x: index,
                    value,
                    type: 'valid'
                })
            })
            tempData_03['training']['multi_error'].forEach((value, index) => {
                data_04.push({
                    x: index,
                    value,
                    type: 'training'
                })
            })
            tempData_03['valid_1']['multi_error'].forEach((value, index) => {
                data_04.push({
                    x: index,
                    value,
                    type: 'valid'
                })
            })

            // res.header("Access-Control-Allow-Origin", 'http://loaclhost:9000/');
            res.send({
                data_00,
                data_01,
                // data_02:tempData_02,
                data_03,
                data_04
            })
        }
    })
});

router.post('/predict_step3', (req, res) => {
    var form = new formidable.IncomingForm({
        uploadDir: './Module/temp',
    });
    form.parse(req, (err, fields, files) => {
        var file = files.file;
        var result = '';
        fs.rename(file.path, './Module/temp/' + file.name, err => {
            if (err) res.send(err)
            else {
                console.log(file.name + ' saved');
                res.send()
            }
        })

    })
})

router.post('/predict_step3_result', function (req, res, next) {
    req.setTimeout(120 * 1000);
    // console.log(req.headers);
    var pyProcess = child_process.exec('python ./Module/all_code.py predict step3', { maxBuffer: 900000 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.log('error', error);
            result = error;
            res.send(result);
        }
        else if (stderr) {
            console.log('stderr', stderr);
            result = stderr;
            res.send(result);
        }
        else {
            let data_00 = [];
            let data = JSON.parse(stdout);
            for (const iterator in data) {
                let temp = {};
                temp['name'] = iterator;
                temp['value'] = data[iterator];
                data_00.push(temp);
            }
            res.send(data_00);
        }
    })
});

router.post('/login', (req, res) => {
    var sent = false;
    const { id, pass } = req.body;
    users.forEach(user => {
        if (user.id === id) {
            if (user.pass === pass) {
                res.cookie('user', user.id, { maxAge: 1000 * 60 * 30, httpOnly: false })
                res.send({ code: 1 })
            } else {
                res.send({ code: 0 })
            }
            sent = true;
        }
    })
    if (!sent) res.send({ code: 0 })
})

router.post('/register', (req, res) => {
    var sent = false;
    const { id, pass } = req.body;
    users.forEach(user => {
        if (user.id === id) {
            res.send({ code: 0 })
            sent = true;
        }
    });
    if (!sent) {
        users.push({
            id,
            pass
        });
        res.send({ code: 1 })
    }
})

router.get('/pic', (req, res) => {
    fs.readFile('./Module/temp/corr_hot.jpg', (err, data) => {
        if (err) {
            res.send(err)
        } else {
            // res.header("Content—type","image/jpg")
            res.header("Content-type","image/jpg")
            res.send(data)
        }
    })
})

module.exports = router;
