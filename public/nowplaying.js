const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('현재 어떤 곡이 재생되고 있는지 알려줌니다.'),
	async execute(interaction) {
		const queue = player.getQueue(interaction.guild);
		try {
			const njson = queue.nowPlaying();
			
			const nowplaying = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(njson.title)
			.setURL(njson.url)
			.setAuthor({ name: '현재 재생되고 있는 곡' })
			.setDescription('유투브 채널: '+ njson.author + ' 총길이: '+ njson.duration)
			.setThumbnail(njson.thumbnail)
			.setTimestamp()
			interaction.reply({
				embeds: [nowplaying],
			});
        } catch (error) {
            interaction.reply("이 설정은 음악을 실행해야 설정할수 있습니다");
        };
	},
};