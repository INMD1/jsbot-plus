const {SlashCommandBuilder} = require('@discordjs/builders');

//아래는 실행 코드
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('URL이나 타이틀를 입력해주면 음악을 틀어줘요.')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('검색할 내용을 넣어주십시오')
            .setRequired(true)),
    async execute(interaction) {
    if (!interaction.member.voice.channelId) return await interaction.reply({ content: "넌 보이스에 들어가 있지 않아요..", ephemeral: true });
            if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "당신은 지금 보이스에 들어가있지 않아요.. 들.어.가", ephemeral: true });
            const json = player.getQueue(interaction.guild);
            const query = interaction.options.get("text").value;
            const queue = player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                }
            });
            
            // verify vc connection
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return await interaction.reply({ content: "흠.. 이상하네요.. 봇이 안들어가지네요? 권한이나 아니면 봇상태를 확인해주세요.", ephemeral: true });
            }

            await interaction.deferReply();
            const track = await player.search(query, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });
            queue.play(track);
            if(!json){ //쉽게 재생되면 샡기는 json형식이 없으면 처음으로 간주함
                queue.play(track);
                return await interaction.followUp({ content: `✅ | 노래를 재생할게요 **${track.title}**!` });
            }else{ // 틀어져 있으면 추가하는 걸로 넘어감
                json.addTrack(track);
                return await interaction.followUp({ content: `✅ | 노래를 추가할게요 **${track.title}**!` });
            }
        }
}
