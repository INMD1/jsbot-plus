const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('현재 어떤 곡이 재생되고 있는지 알려줌니다.'),
	async execute(interaction) {
		var nowhr = 0 ; var nowmin = 0 ; var nowsec = 0
		var nowtoal = 0 ; var persent = 0; var parsent_gui = ""
		const queue = player.getQueue(interaction.guild);

		try {
			const now = queue.nowPlaying().duration.split(":")
			if(now.length == 3){
				nowtoal += parseInt(now[0])*3600000
				nowtoal += parseInt(now[1])*60000
				nowtoal += parseInt(now[2])*1000
			}else{
				nowtoal += parseInt(now[0])*60000
				nowtoal += parseInt(now[1])*1000
			}

			nowhr = parseInt((queue.streamTime/(1000*60*60))%24);
			nowmin = parseInt((queue.streamTime/(1000*60))%60)
            nowsec = parseInt((queue.streamTime/1000)%60)
			console.log(queue.streamTime);
			//백분율로 계산
			persent = (queue.streamTime / nowtoal) * 100

			//console.log(Math.ceil(parseInt(persent) / 10));
			for (let index = 0; index < Math.ceil(parseInt(persent) / 10); index++) {
				parsent_gui += "🟩"
			}
			for (let index = 0; index < 10 - Math.ceil(parseInt(persent) / 10); index++) {
				parsent_gui += "⬛"
			}

			const njson = queue.nowPlaying();
			const nowplaying = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(njson.title)
				.setURL(njson.url)
				.setAuthor({ name: '현재 재생되고 있는 곡' })
				.setDescription('유투브 채널: '+ njson.author + ' 총길이: '+ njson.duration)
				.addFields(
					{ name: '음악 재생시간 ' + `${nowhr}시 ${nowmin}분 ${nowsec}초`, value: parsent_gui},
					{ name: "재생률", value: +  persent.toFixed(2) + "%"}
				)
				.setThumbnail(njson.thumbnail)
				.setTimestamp()
				interaction.reply({
					embeds: [nowplaying],
				});
        } catch (error) {
			console.log(error);
            interaction.reply("이 설정은 음악을 실행해야 설정할수 있습니다");
        };
	},
};