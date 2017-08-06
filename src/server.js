// https://socket.io/get-started/chat/
const app = require('express')();
const http = require('http').Server(app);
const io = require('../node_modules/socket.io')(http);
const _ = require('lodash');

const slack = require('slack')
const apiKeys = require('../apiKeys.js');
const token = apiKeys.SLACK_API_TOKEN;
const bot = slack.rtm.client();


const IO_EVENT_INITIAL_PAYLOAD = 'initial payload';
const IO_EVENT_CHAT_MESSAGE = 'chat message';
const IO_EVENT_MEMBER_JOINED_CHANNEL = 'member_joined_channel';
const IO_EVENT_MEMBER_LEFT_CHANNEL = 'member_left_channel';



// logs: ws, started, close, listen, etc... in addition to the RTM event handler methods
// console.log(Object.keys(bot));

// io.on('connection', function(socket){
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });
// });


let initialPayload = {};
// do something with the rtm.start payload
bot.started((payload) => {
    // console.log('payload from rtm.start', payload);

    initialPayload = payload;
    // console.log("bot started successfully!!!");
    io.emit(IO_EVENT_INITIAL_PAYLOAD, payload);
});

// start listening to the slack team associated to the token
bot.listen({token});

bot.message((msg) => {
    // console.log('message.channels', msg);
    io.emit(IO_EVENT_CHAT_MESSAGE, msg);
});

// not working for some reason
// bot.member_left_channel((context) => {
//     // let user = this.getUserFromId(memberJoinedContext.user);
//     console.log('member left!', context);
//     io.emit(IO_EVENT_MEMBER_LEFT_CHANNEL, context);
// });

bot.member_joined_channel((context) => {
    // let user = this.getUserFromId(memberJoinedContext.user);
    // console.log('member joined!', context);

    let userInfo = slack.users.info({token, user: context.user}, (err, data) => {
        console.log('userInfo', data);

        var mappedUsersState = _.pick(data.user, ['id', 'name', 'real_name', 'team_id', 'profile.image_32']);
        console.log('userInfo: mappedUsersState', mappedUsersState);

        io.emit(IO_EVENT_MEMBER_JOINED_CHANNEL, mappedUsersState);
    });

});


// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    io.emit(IO_EVENT_INITIAL_PAYLOAD, initialPayload);

    // bot.message((msg) => {
    //     console.log('message.channels', msg);
    //     io.emit('chat message', msg);
    // });


    // socket.on('chat message', function(msg){
    //     // console.log('message: ' + msg);
    //     io.emit('chat message', msg);
    // });
});

const port = 3001;
http.listen(3001, function(){
    console.log(`listening on *:{3001}`);

});


// // respond to a user_typing message
// bot.user_typing(function(msg) {
//     console.log('several people are coding', msg)
// })

