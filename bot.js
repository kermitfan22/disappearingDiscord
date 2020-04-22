// ---------------------------------------------------
// Discord disappearing messages
// See it in action @ https://discord.gg/XGvHW5D
// https://github.com/tylermammone/disappearingDiscord
// ---------------------------------------------------
// Settings
// ---

const privateBotToken = BOT_TOKEN;

const disappearingMessages = {
    '699902897319837779':'30', // #general 30mins (make sure you use your own channel ID number)
    '699954259323650140':'5' // #private 5mins (make sure you use your own channel ID number)
};

// ---------------------------------------------------
// System
// ---

const discord = require('discord.js');
const client = new discord.Client();

client.login(process.env.privateBotToken);

client.on('ready', async () => {
    setInterval(function(){expireMessages()},60000); // check for expiring messages once a minute
    expireMessages(); // expire old messages on bot startup
});

function expireMessages(){
    for(let [channelId,mins] of Object.entries(disappearingMessages)){      
        const expireFrom = client.channels.cache.get(channelId);
        expireFrom.messages.fetch({limit:100}).then(messages => {
            let previousMessages = messages.array();
            for(let i = 0; i < previousMessages.length; i++){
                minutesSince = ((parseInt(Date.now())-parseInt(previousMessages[i].createdTimestamp))/1000)/60;
                if(minutesSince>mins){
                    expireFrom.messages.fetch(previousMessages[i].id).then(msg => msg.delete()).catch(console.error);
                }
            }
        }).catch(console.error);
    }
}
