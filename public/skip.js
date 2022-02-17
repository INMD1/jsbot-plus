const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('현재 플레이하는 음악을 중지하고 다음 대기열에 있는 음악을 실행합니다.'),
	async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id);
        if(!queue.play){
             interaction.reply("이 설정은 음악을 실행해야 설정할수 있습니다")
        }else{
            if(queue.skip()){
                  interaction.reply("음악을 스킵했습니다.");
            }
        };
    },
};
