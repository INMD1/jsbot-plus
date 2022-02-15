const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('testing!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		console.log(interaction.member.voice.channel);
		const json = player.getQueue(interaction.guild.id);
		console.log(json);
	},

};