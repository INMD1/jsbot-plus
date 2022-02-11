const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('현재 대기열 상태를 알려줌니다.'),
	async execute(interaction) {
		const queue = player.getQueue(interaction.guild);
		let Description = '';
		try{
			if(queue.tracks.length != 0){
				for (let index = 0; index < queue.tracks.length - 1; index++) {
					if(index <= 8){
						Description = Description.concat(`${index + 1}: ${queue.tracks[index].author}-${queue.tracks[index].title}\n`)
					}
				}
				const playlistem = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('앞으로 재생할 음악들')
					.setDescription(Description)
					.setTimestamp()
					.setFooter({ text: '최대 7개까지 표시합니다.'});
				interaction.reply({ 
					embeds: [playlistem],
				});
			}else{
				interaction.reply("추가한 노래가 없서요.. 어서 추가해주세요!");		
			}
		} catch {
			interaction.reply("재생을 하시고 입력해주세요");
		}
	},
};