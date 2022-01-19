//constants
const DATA_PATH = './data.json';
const prefix = '!';
const senPrefix = '>> ';
const line = '-------------------';

//modules
const Discord = require('discord.js');
const fs = require('fs')
const { token } = require('../Bot/token.json');
const DATA = require(DATA_PATH);

//objects
const client = new Discord.Client();

//external operations
function print(msg){
	console.log(senPrefix + msg);
}

//Bot
class Bot{
    async hello(msg){
        msg.reply('Hello!');
    }
    async schedule(msg){
        var cmdList = msg.content.split(' ');
        if(cmdList.length === 1){
            let schedule_list = DATA[msg.member.id]['schedule'];
            if (schedule_list.length === 0){
                msg.channel.send('The schedule are currently empty, you can add your own schedule <:doge:885145742203842632>! <@' + msg.member.id + '>\n```!schedule add <Date> <Content>\n\ne.g. 2024-1-16 Harry\'s birthday```').then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            } 
            else{
                var output = '```\n';
                output += line + msg.author.username + '\'s Schedule' + line + '\nDate      Content\n';
                for(let i = 0; i < schedule_list.length; i++){
                    output += schedule_list[i] + '\n';
                }
                output += '```' ;
                msg.channel.send(output).then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });
            }
        }
        else{
            var cmd = cmdList[1];
            let json = DATA, input;
            if(cmd === 'add'){
                json[msg.member.id]['schedule'].push(msg.content.substring(14));
                input = JSON.stringify(json);
                msg.channel.send(`<@${msg.member.id}>'s schedule has been updated <:happycheems:885145695693201458>!`).then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                });
            }
            else if(cmd === 'clear'){
                json[msg.member.id]['schedule'] = [];
                input = JSON.stringify(json);
                msg.channel.send(`<@${msg.member.id}>'s schedule has been cleared <:shycheems:885145732020043786>!`).then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                });
            }
            fs.writeFile(DATA_PATH, input, ()=>{
                print(`${msg.author.username}'s schedule updated.`);
            });
        } 
        msg.delete();
    }
    async joinChannel(msg){
        if(msg.member.voice.channel !== null) {
            await msg.member.voice.channel.join();
        } 
        else{
            msg.channel.send('Please join the voice channel first! <@' + msg.member.id + '>');
        }
    }
}

//Bot instance
const bot = new Bot();

client.on('ready', () => {
    print('Bot is ready!');
});

client.on('message', async (msg) => {
    if(!msg.guild) return;
    let json = DATA;
    //construct discord users basic information
    if(json[msg.member.id] == null){
        json[msg.member.id] = {
            username : msg.author.username,
            schedule : [],
            exp : 0,
            level : 1,
            tag : msg.author.tag
        }
        let jsonStr = JSON.stringify(json);
        fs.writeFile(DATA_PATH, jsonStr, function(err){
            if(err) throw err;
        });
    }

    //bot command operations
    if(msg.content.startsWith(prefix)){
        var cmd = msg.content.split(' ')[0].substring(prefix.length);
        if(cmd === 'hi'){
            bot.hello(msg);
        }
        else if(cmd === 'schedule'){
            bot.schedule(msg);
        }
        else if(cmd === 'join'){
            bot.joinChannel(msg);
        }
    }
    

    //print out message on terminal
    print(msg.author.username + ': ' + msg.content);
});


//LOGIN
client.login(token); 