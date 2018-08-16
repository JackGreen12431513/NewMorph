const discord = require('discord.js');
const repeat = require('repeat');
const fs = require('fs')
var client = new discord.Client();
var statusPlay = 0;

const userData = JSON.parse(fs.readFileSync("userData.json", "utf8"));
const guildData = JSON.parse(fs.readFileSync("joinedGUilds.json", "utf8"));

const conf = require('./config.json', 'utf8');

client.login(conf.botToken);

client.on('guildCreate', guild => {
    console.log(`Joined ${guild}`)
    if(!guildData[guild.id]) guildData[guild.id] = {
        guildPrefix: prefix,
        adminRole: ""
      }
      writeToGuildData();
      guild.owner.send("Woah! A new server?\n\nHey! Thanks for having me!\n\nRun `k!setAdmin <Admin Role>` to set the administrator role!")
})

client.on('ready', () => {
    client.user.setActivity("k!help")
    repeat(changePlaying());
})

client.on('message', message => {
    var guild = message.guild;
    var sender = message.author;

    if(message.guild === null) {

    }

    if(!userData[sender.id]) userData[sender.id] = {
        partner: "",
        coins: 0,
        realName: sender.username,
        profileBio: "",
      }

      userData[sender.id].coins++;

      writeToUserData();

      const prefix = guildData[guild.id].guildPrefix;

    if (prefix != "k!") {
        if(message.content == "k!help") {
            var helpEmb = new discord.RichEmbed()
            .setTitle("Kyon Commands")
            .setDescription("Kyon is a multi use bot made by `Jack | Wasp Framework#7908`\nPrefix: `" + prefix + "`")
            .addField("📜 Basic Commands:", "`none`", true)
            .addField("🎪 Fun Commands:", "`none`", true)
            .addField("💍 Roleplay Commads:", "`none`", true)
            .addField("🎵 Music Commands:", "`none`", true)
            .addField("🔨 Moderation Commands:", "`none`", true)
            .addField("⚙ Settings:", "`prefix` `setAdmin`", true)
            message.channel.send(helpEmb)
        }
    } else {

    }

    if(message.author.equals(client.user) || !message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch(args[0]) {

        case "help":
        var helpEmb = new discord.RichEmbed()
        .setTitle("Kyon Commands")
        .setDescription("Kyon is a multi use bot made by `Jack | Wasp Framework#7908`\nPrefix: `" + prefix + "`")
        .addField("📜 Basic Commands:", "`none`", true)
        .addField("🎪 Fun Commands:", "`tord`", true)
        .addField("💍 Roleplay Commads:", "`marry` `divorce`", true)
        .addField("🎵 Music Commands:", "`none`", true)
        .addField("🔨 Moderation Commands:", "`purge`", true)
        .addField("⚙ Settings:", "`prefix` `setAdmin`", true)
        .setColor(0x06B4B5)
        message.channel.send(helpEmb)
        break;

        case "ping":
        message.channel.send(`Bot ping: \`${Math.floor(client.ping)}ms\``)
        break;

        case "profile":
        //💸
        let userProfile = message.mentions.members.first();
        if (userProfile == "" || userProfile == null) {
            message.reply("Please mention a user!")
        } else {
            if (userData[userProfile.id] != null) {
                if (userData[userProfile.id].partner != "") {
                    var profileEmb = new discord.RichEmbed()
                    .setTitle("Profile for " + userProfile.user.username)
                    .setDescription(`Bio: ${marrData[userProfile.id].profileBio}`)
                    .addField("📜 Roles:", userProfile.roles.map(role => role.name).join(", "))
                    .addField("💍 Relationship:", "Married to: <@" + marrData[userProfile.id].partner + ">")
                    .addField("⛏ Mining Stats:", `Pickaxe: ${marrData[userProfile.id].pickaxe}\nEmojis: ${marrData[userProfile.id].emojis}`)
                    .addField("🏆 Stats:", `Wins: ${marrData[userProfile.id].wins}\nCoins: ${marrData[userProfile.id].coins}`)
                    .addField("🕙 Joined Guild:", `User joined: ${userProfile.joinedAt}`)
                    .setThumbnail(userProfile.user.avatarURL)
                    .setColor(0x06B4B5)
                    message.channel.send(profileEmb)
                } else {
                    var profileEmb3 = new discord.RichEmbed()
                    .setTitle("Profile for " + userProfile.user.username)
                    .setDescription(`Bio: '${marrData[userProfile.id].profileBio}'`)
                    .addField("📜Roles:", userProfile.roles.map(role => role.name).join(", "))
                    .addField("💍Relationship:", "Married to: no-one!")
                    .addField("⛏ Mining Stats:", `Pickaxe: ${marrData[userProfile.id].pickaxe}\nEmojis: ${marrData[userProfile.id].emojis}`)
                    .addField("🏆 Stats:", `Wins: ${marrData[userProfile.id].wins}\nCoins: ${marrData[userProfile.id].coins}`)
                    .addField("🕙 Joined Guild:", `User joined: ${userProfile.joinedAt}`)
                    .setThumbnail(userProfile.user.avatarURL)
                    .setColor(0x06B4B5)
                    message.channel.send(profileEmb3)
                }
            } else {
                var profileEmb2 = new discord.RichEmbed()
                .setTitle("Profile for " + userProfile.user.username)
                .addField("Roles:", userProfile.roles.map(role => role.name).join(", "))
                .addField("Joined Guild:", `User joined: ${userProfile.joinedAt}`)
                .setThumbnail(userProfile.user.avatarURL)
                .setColor(0x06B4B5)
                message.channel.send(profileEmb2)
            }
        }
        break;

        case "purge":
        let purgeAmt = message.content.replace(prefix + "purge", "").replace(" ", "");
        console.log(purgeAmt);
        if (guildData[guild.id].adminRole == "") {
            message.changePlaying.send("Admin Role not set!")
        } else {
            if (message.member.roles.find('id', guildData[guild.id].adminRole)) {
                if (!isNaN(purgeAmt)) {
                    message.channel.bulkDelete(purgeAmt)
                } else {

                }
            } else {
                message.reply("you do not have the permissions to run this!");
            }
        }
        break;

        case "setAdmin":
        let mentionedAdminRole = message.mentions.roles.first().id;
        guildData[guild.id].adminRole = mentionedAdminRole;
        message.reply(`role ${"<@" + mentionedAdminRole + ">"} set to admin role!`);
        writeToGuildData();
        break;

        case "prefix":
        let newPrefix = message.content.replace(prefix + "prefix", "").replace(" ", "");
        if (guildData[guild.id].adminRole == "") {
            message.changePlaying.send("Admin Role not set!")
        } else {
            if (message.member.roles.find('id', guildData[guild.id].adminRole)) {
                guildData[guild.id].guildPrefix = newPrefix;
                writeToGuildData();
                message.reply("prefix set to: " + newPrefix)
            } else {
                message.reply("you do not have the permissions to edit this!");
            }
        }
        break;

    }

})

function changePlaying() {
    console.dir(statusPlay);
        setInterval(function(){
            if (statusPlay > 0) {
                statusPlay -= 1;
                client.user.setActivity(`on ${client.guilds.size} server(s)`)
            } else {
                statusPlay += 1;
                client.user.setActivity("k!help")
            }
        }, 10000)
}

function writeToGuildData() {
    fs.writeFile('joinedGuilds.json', JSON.stringify(guildData), (err) => {
        if (err) console.log(err);
      })
}

function writeToUserData() {
    fs.writeFile('userData.json', JSON.stringify(userData), (err) => {
        if (err) console.log(err);
      })
}
