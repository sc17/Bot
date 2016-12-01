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


app.post('/webhook/', function(req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text

            var msg = "https://recorridos-y-viajes-a6d8d.firebaseapp.com/"
            msg += "\n Para pedir un servicio ingresa a esta url y registra tu servicio, "
            msg += "\n La solicitud inmediatamente se tramita y se da respuesta."
            msg += "\n Muchas Gracias por escribirnos."


            sendTextMessage(sender, msg)
        }
    }
    res.sendStatus(200)
})

var token = "EAAX4AWm0Ew4BAJKZA21uyfHadY85RFPxwHysLWrYgyBBbH0Kg07nsnvidjpzrqIFtxY1iwJPKXiT3NS4mwRPpzlvN8DXJB8BQEaN2iRa9yOvCZB2MyT0tmqQ8zs8WE3e13jglg6b05mJc8AhkWHSu39V8c7jqZCZC8BBxTZBCRAZDZD";

function sendTextMessage(sender, text) {
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
