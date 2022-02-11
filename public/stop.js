const {SlashCommandBuilder} = require('@discordjs/builders');
const { createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('음악을 중지합니다.'),
	async execute(interaction) {
        interaction.reply("음악을 중지했서요!");
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.member.guild.id,
            adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
        });
        connection.subscribe(player)
        const player = createAudioPlayer();
        player.stop();
    }
}