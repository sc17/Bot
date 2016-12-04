var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var token = process.env.PAGE_ACCESS_TOKEN;
var messageData;
//var token = 'EAAFS7ZCIi6rkBACZCYnF4WsP9xeXNDternP1RGmqJ94DaTfDK05PthMKgu3zWX3t53R3qV3J4S21ZCDKg13jPwJpMg7ZC7SZC4eHr0Lg1zizWZBhGQkvCZCTqTzsPeJQnc4A8nkQIWRbT7XnWO3B1DOScMYaSTZBRJEx4v4FGrC47QZDZD'

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
    res.send('Hello world, I am a chat bot')
})


// for Facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'family_is_all') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})


app.post('/webhook/', function(req, res) {

    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        console.log(event);
        if (event.postback) {

            let text = JSON.parse(JSON.stringify(event.postback))

            switch (text.payload) {
                case "started":
                    getNameUser(sender, function resp(val) {
                        obj = JSON.parse(val);
                        if (obj.first_name) {
                            full_name = obj.first_name + " " + obj.last_name;
                            console.log(full_name);
                            setMessageData(0, 'Hola. ' + full_name + ' !!!');
                            processRequest(sender, function resp(val) {
                                if (val = 200) {
                                    sendAction(sender);
                                    setTimeout(function() {
                                        setMessageData(0, 'Esta es nuestra página Oficial para solicitar nuestros servicios.🌴🌴🏰🌴🌴  🚌  🚌 ');
                                        processRequest(sender, function resp(val) {
                                            setMessageData(1);
                                            if (val = 200) {
                                                sendAction(sender);
                                                processRequest(sender, function resp(val) {
                                                    if (val = 200) {
                                                        setTimeout(function() {
                                                            setMessageData(0, 'La solicitud inmediatamente se tramita y se da respuesta.');
                                                            processRequest(sender, function resp(val) {
                                                                if (val = 200) {
                                                                    sendAction(sender);
                                                                    setTimeout(function() {
                                                                        setMessageData(0, 'Muchas Gracias por escribirnos.\nQue tenga un buen día. 😃 😃');
                                                                        processRequest(sender, function resp(val) {
                                                                            if (val = 200) {
                                                                                setMessageData(2);
                                                                                processRequest(sender, function resp(val) {});
                                                                            }
                                                                        })
                                                                    }, 3000);
                                                                }
                                                            })

                                                        }, 2000);
                                                    }
                                                })
                                            }
                                        })
                                    }, 4000);

                                }
                            })
                        }
                    })


                    break;
                case "dudas_si":
                    setMessageData(3);
                    processRequest(sender, function resp(val) {})
                    break;

                case "dudas_no":
                    setMessageData(0, 'Es un gusto ayudarle');
                    processRequest(sender, function resp(val) {})
                    break;

            }

            break;

        }

        if (event.message && event.message.text) {



        }
    }
    res.sendStatus(200)
})



function setMessageData(val, text) {

    switch (val) {
        case 0:
            messageData = {
                text: text
            }
            break;

        case 1:

            messageData = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Pedir servicio",
                            "subtitle": "mensaje 1 ----- #",
                            "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://www.messenger.com",
                                "title": "Abrir Página"
                            }],
                        }, {
                            "title": "Catálogo de Servicios",
                            "subtitle": "mensaje 2 ----- #",
                            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://www.messenger.com",
                                "title": "Abrir Página"
                            }],
                        }, {
                            "title": "Contáctanos",
                            "subtitle": "mensaje 3 ----- #",
                            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://www.messenger.com",
                                "title": "Abrir Página"
                            }],
                        }]
                    }
                }
            }

            break;

        case 2:
            messageData = {
                "text": "Tienes dudas ❔❔❔",
                "quick_replies": [{
                    "content_type": "text",
                    "title": "Si",
                    "payload": "dudas_si"
                }, {
                    "content_type": "text",
                    "title": "No",
                    "payload": "dudas_no"
                }]
            }

            break;
        case 3:

            messageData = {
                "recipient": {
                    "id": "RECIPIENT_ID"
                },
                "message": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "list",
                            "elements": [{
                                "title": "Classic T-Shirt Collection",
                                "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                                "subtitle": "See all our colors",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                },
                                "buttons": [{
                                    "title": "View",
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/collection",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                }]
                            }, {
                                "title": "Classic White T-Shirt",
                                "image_url": "https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png",
                                "subtitle": "100% Cotton, 200% Comfortable",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                },
                                "buttons": [{
                                    "title": "Shop Now",
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/shop?item=100",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                }]
                            }, {
                                "title": "Classic Blue T-Shirt",
                                "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
                                "subtitle": "100% Cotton, 200% Comfortable",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                },
                                "buttons": [{
                                    "title": "Shop Now",
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                }]
                            }, {
                                "title": "Classic Black T-Shirt",
                                "image_url": "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
                                "subtitle": "100% Cotton, 200% Comfortable",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                },
                                "buttons": [{
                                    "title": "Shop Now",
                                    "type": "web_url",
                                    "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                }]
                            }],
                            "buttons": [{
                                "title": "View More",
                                "type": "postback",
                                "payload": "payload"
                            }]
                        }
                    }
                }

            }

            break;

    }
}


app.get('/test', function(req, res) {
    sender = "1141060232679322";

    getNameUser(sender, function resp(val) {
        obj = JSON.parse('{"first_name":"Sebastian","last_name":"Chalarca"}');
        if (obj.first_name) {
            full_name = obj.first_name + " " + obj.last_name;
            console.log(full_name);
            setMessageData(0, 'Hola. ' + full_name + ' !!!');
            processRequest(sender, function resp(val) {
                if (val = 200) {
                    sendAction(sender);
                    setTimeout(function() {
                        setMessageData(0, 'Esta es nuestra página Oficial para solicitar nuestros servicios.🌴🌴🏰🌴🌴  🚌  🚌 ');
                        processRequest(sender, function resp(val) {
                            setMessageData(1);
                            if (val = 200) {
                                sendAction(sender);
                                processRequest(sender, function resp(val) {
                                    if (val = 200) {
                                        setTimeout(function() {
                                            setMessageData(0, 'La solicitud inmediatamente se tramita y se da respuesta.');
                                            processRequest(sender, function resp(val) {
                                                if (val = 200) {
                                                    sendAction(sender);
                                                    setTimeout(function() {
                                                        setMessageData(0, 'Muchas Gracias por escribirnos.\nQue tenga un buen día. 😃 😃');
                                                        processRequest(sender, function resp(val) {
                                                            if (val = 200) {
                                                                setMessageData(2);
                                                                processRequest(sender, function resp(val) {});
                                                            }
                                                        })
                                                    }, 3000);
                                                }
                                            })

                                        }, 2000);
                                    }
                                })
                            }
                        })
                    }, 4000);

                }
            })
        }
    })

    res.sendStatus(200)
})


function getNameUser(sender, callback) {

    request.get({
        url: 'https://graph.facebook.com/v2.6/' + sender,
        qs: {
            access_token: token
        }
    }, function(error, response, body) {
        if (error) {
            callback(400)
        } else if (response.body.error) {
            callback(400)
        } else {
            callback(body);
        }
    })

}

function processRequest(sender, callback) {


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
            notification_type: "REGULAR"
        }
    }, function(error, response, body) {
        if (error) {
            callback(400)
        } else if (response.body.error) {
            callback(400)
        } else {
            callback(200)
        }
    })
}

function sendAction(sender) {

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            sender_action: "typing_on"
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Spin up the server
app.listen(app.get('port'), function() {
console.log('running on port', app.get('port'))
}), response.body.error)
}
})
}


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
