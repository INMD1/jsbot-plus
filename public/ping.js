const { SlashCommandBuilder } = require('@discordjs/builders');
const {see} = require('../jsonfile/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('testing!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},

};