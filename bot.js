//modules
const Discord = require('discord.js');
const fs = require('fs')
const { token } = require('../Bot/token.json');
const { sticker } = require('./picture.json');

//constants
const prefix = '!';
const senPrefix = '>> ';

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
            fs.readFile('./data.txt', 'utf8' , (err, data) => {
                if (err) throw err;
                if (data != ''){
                    msg.channel.send('```\n------------------------------\n' + data + '------------------------------```').then(msg => {
                        setTimeout(() => msg.delete(), 15000)
                    });
                } 
                else{
                    msg.channel.send('The schedule are currently empty, you can add your own schedule! <@' + msg.member.id + '>\n```!schedule add <Date> <Content>\n\ne.g. 2024-1-16 Harry\'s birthday```').then(msg => {
                        setTimeout(() => msg.delete(), 10000)
                    });
                }
            });
        }
        else{
            var cmd = cmdList[1];
            var writeData = fs.createWriteStream('./data.txt', {flags: 'a'});
            if(cmd === 'add'){
                for(let i = 2; i < cmdList.length; i++){
                    writeData.write(cmdList[i] + ' ');
                }
                msg.channel.send('Sucessfully added! <:happycheems:885145695693201458>').then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
                writeData.end('\n');
            }
            else if(cmd === 'remove'){
                
            }
            else if(cmd === 'clear'){
                fs.writeFile('./data.txt', '', function(err){
                    if(err) throw err;
                    msg.channel.send('Schedule has been cleared!').then(msg => {
                        setTimeout(() => msg.delete(), 10000)
                    });
                })
            }
        } 
        msg.delete();
    }
    async joinChannel(msg){
        if (msg.member.voice.channel !== null) {
            await msg.member.voice.channel.join();
        } else {
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
    var cmd = msg.content.split(' ');
    if(!msg.guild) 
        return;
    if(cmd[0] === prefix + 'hi'){
        bot.hello(msg);
    }
    else if(cmd[0] === prefix + 'schedule'){
        bot.schedule(msg);
    }
    else if(cmd[0] === prefix + 'join'){
        bot.joinChannel(msg);
    }
    print(msg.author.username + ': ' + msg.content);
});


//LOGIN
client.login(token); 