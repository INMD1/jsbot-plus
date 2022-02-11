const { SlashCommandBuilder } = require('@discordjs/builders');
const { queue } = require('./play');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('현재 대기열 상태를 알려줌니다.!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		console.log(queue);
	},

};