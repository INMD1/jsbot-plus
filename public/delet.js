const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('del')
		.setDescription('음악을 중지합니다.')
        .addStringOption(option =>
			option.setName('string')
			.setDescription('검색할 내용을 넣어주십시오')
			.setRequired(true)),
        
	async execute(interaction) {
        try {
            const queue = player.getQueue(interaction.guild);
            queue.destroy();
            await interaction.reply("음악을 정지시키고 대기열을 삭제 했습니다.");
        } catch (error) {
            await interaction.reply('봇이 실행 안한 상태로 이 커맨드를 입력하면 오류가 발생할수 있습니다.');
        }
    }
}