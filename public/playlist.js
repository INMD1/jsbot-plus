const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('유투브,애플 뮤직,스포티파이에서 만든 플레이리스트를 추가합니다.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		console.log(player.getQueue(interaction.guild));
	},
};