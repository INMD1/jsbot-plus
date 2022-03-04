const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('사용자가 지정을 하여 대기열에 있는 곡을 삭제합니다.'),
	async execute(interaction) {
        try {
            const queue = player.getQueue(interaction.guild);
            let seletmenu = [];
            if(queue.tracks.length != 0){
				for (let index = 0; index < queue.tracks.length; index++) {
					if(index < 20){
                        seletmenu.push({label: queue.tracks[index].title, description:queue.tracks[index].author, value: `${index}`,})
					}
				}
                const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                        .addOptions(seletmenu),
                );
                console.log(seletmenu);
                interaction.reply({content: '삭제하고 싶은 곡을 선택해 주세요.',components: [row]});
                // console.log(interaction.author);
                const filter = i => 
                    i.isSelectMenu() 
                    // && i.user.id == i.author.id;
                
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
                collector.on('collect', async i => {
                    try {
                        queue.tracks.splice(i.values[0])
                        i.reply(seletmenu[i.values[0]].label + '이가 삭제되었습니다');                    
                    } catch (error) {
                        console.log(error);
                        i.reply('⚠️삭제도중 오류가 발생했습니다. 봇 제작자한데 오류를 알려주세요')
                    }
                });
                }
        } catch (error) {
            console.log(error);
            await interaction.reply('봇이 실행 안한 상태로 이 커맨드를 입력하면 오류가 발생할수 있습니다.');
        }
    }
}