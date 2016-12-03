var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

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

var token = process.env.PAGE_ACCESS_TOKEN;



app.post('/webhook/', function(req, res) {

    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        console.log(event);
        if (event.postback) {
            text = JSON.stringify(event.postback)
                //text.payload

        }

        if (event.message && event.message.text) {

            getNameUser(sender, function resp(val) {
                obj = JSON.parse(val);
                if (obj.first_name) {
                    full_name = obj.first_name + " " + obj.last_name;
                    processRequest(sender, 'Hola. ' + full_name + ' !!!', function resp(val) {
                        if (val = 200) {
                            sendAction(sender);
                            setTimeout(function() {
                                processRequest(sender, 'Esta es nuestra página Oficial para solicitar nuestros servicios.🌴🌴🌅🌴🌴  🚌  🚌 ', function resp(val) {
                                    sendLink(sender);
                                    if (val = 200) {
                                        sendAction(sender);
                                        setTimeout(function() {
                                            processRequest(sender, 'La solicitud inmediatamente se tramita y se da respuesta.', function resp(val) {
                                                if (val = 200) {
                                                    sendAction(sender);
                                                    setTimeout(function() {
                                                        processRequest(sender, 'Muchas Gracias por escribirnos.\nQue tenga un buen día. 😃 😃', function resp(val) {})
                                                    }, 3000);
                                                }
                                            })

                                        }, 2000);
                                    }
                                })
                            }, 4000);

                        }
                    })
                }
            })

        }
    }
    res.sendStatus(200)
})



app.get('/test', function(req, res) {

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

function processRequest(sender, text, callback) {

    messageData = {
        text: text
    }
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


function sendLink(sender) {

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
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
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
})
