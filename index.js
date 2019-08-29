const Discord = require('discord.js');
const mysql = require('mysql');
const config = require('./config.json');

const client = new Discord.Client();

client.login(config.config.token);

var con = mysql.createConnection(config.mysql);

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql");
});

client.on('ready', () => {
    console.log("Connected to discord");
});

client.on('message', msg => {
    if (msg.content.startsWith('!userInfo')) {
      console.log("checking")
      if (msg.member.roles.has(config.config.adminRole)) {

        let args = msg.content.slice(1).trim().split(/ +/g);

        let userid = args[1];
        console.log(userid)
        let usingSteam = userid.startsWith('steam:');
        if (!usingSteam) {
          userid = "steam:"+userid;
        };

        sql = "SELECT * FROM users WHERE identifier = ?";
        con.query(sql, userid, function(err, result) {
          if (err) throw err;
          let user = result[0]
          msg.channel.send({embed: {
            color: 3447003,
            fields: [
              {
                name: "Player Information",
                value: "**__SteamName__** : "+user.name+", **__RP__** : "+user.firstname+" "+user.lastname+", **__data of birth__** : "+user.dateofbirth+", **__sex__** : "+user.sex+", **__height__** : "+user.height+" cm"
              },
              {
                name: "RP information",
                value: "**👷** : *"+user.job+"*, **📱** : *"+user.phone_number+"*, **🚗** : *"+user.DmvTest+"*"
              },
              {
                name: "Money Information",
                value: "**💵** : "+user.money+", **💳** : "+user.bank
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "© Simple ESX discord bot coded by LH_Lawliet, version "+config.information.version
            }
          }});
      })
    }
    }
});
