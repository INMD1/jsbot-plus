const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('testing!')
        .addStringOption(option =>
            option.setName('number')
            .setDescription('1~150까지의 숫자를 입력하십시오.')
            .setRequired(true)),
	async execute(interaction) {
        const volum = parseInt(interaction.options.get("number").value);
        const queue = player.getQueue(interaction.guild.id);
        const maxVol = 200; //볼륨 한계치
        const vol = parseInt(volum);
        try {
            if(volum <= maxVol){
                if(queue.setVolume(vol)){
                    interaction.reply(queue.volume + '에서' + volum + '으로 볼륨 조정을 했습니다.');
                }
            }else{
                interaction.reply('저희 봇은 최대 200까지 설정이 가능 합니다. 다시 시도해 주십시오.');
            }
        } catch (error) {
            interaction.reply("이 설정은 음악을 실행해야 설정할수 있습니다");
        };
    },
};
