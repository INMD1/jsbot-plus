const {SlashCommandBuilder} = require('@discordjs/builders');
const {createAudioResource, createAudioPlayer} = require('@discordjs/voice');
const apple = require('../module/applemoudle.js')
const { appletoken } = require('../jsonfile/config.json');
//아래는 실행 코드
module.exports = {
    //슬래시 커맨드 설정
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
            //로그 시간 생성이랑 기타 설정 함수들
            const today = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
            const json = player.getQueue(interaction.guild.id);
            const query = interaction.options.getString("text");
            const queue = player.createQueue(interaction.guild.id, {
                ytdlOptions: {
                    filter: 'audioonly',
                    highWaterMark: 1 << 30,
                    dlChunkSize: 0,
                },
                metadata: {
                    channel: interaction.channel
                }
            });

            // verify vc connection
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return  interaction.reply({ content: "흠.. 이상하네요.. 봇이 안들어가지네요? 권한이나 아니면 봇상태를 확인해주세요.", ephemeral: true });
            }

            if(query.includes('music.apple.com')){
                if(appletoken == 0) {
                    return  interaction.reply("혹시 애플 토큰을 안넣으면 넣어주세요. 넣지않으면 애플 뮤직과 연관된 기능은 작동하지 않습니다.");
                }
                const asdf = new URL(query)
                const asdfasdf = asdf.pathname.split('/')
                let id
                //애플 앨범 플레이 커맨드로 보낼거
                if (asdfasdf.some(a => a === 'album')) {
                    let songID = asdf.searchParams.get('i')
                    if (songID !== null) {
                        id = songID
                        const track = await player.search(await apple.albume_song(id), {
                            requestedBy: interaction.user
                        }).then(x => x.tracks[0]);
                        if (!track) return  interaction.reply({ content: `❌ | Track **${await apple.albume_song(id)}** not found!\n이건 애플에서 유투브로 정보가 이관 되는 과정에서 오류가 났서요.` });
                        queue.play(track);
                        if(!json){ //쉽게 재생되면 샡기는 json형식이 없으면 처음으로 간주함
                            queue.play(track);
                            console.log(today + "guild id: "+  interaction.guild.id +" 음악을 추가함");
                            return  interaction.reply({content: `✅ | 노래를 재생할게요 **${track.title}**!\n이건 애플에서 유투브로 정보가 이관되서 정확한 음악이 안나올수 있서요` });
                        }else{ // 틀어져 있으면 추가하는 걸로 넘어감
                            json.insert(track);
                            console.log(today + "guild id: "+  interaction.guild.id +" 음악을 추가함");
                            return   interaction.reply({ content: `✅ | 노래를 추가할게요 **${track.title}**!\n이건 애플에서 유투브로 정보가 이관되서 정확한 음악이 안나올수 있서요` });
                        }
                    }else{
                        return interaction.reply({ content: `싱글 앨범을 넣어주세요.` });
                    }
                    }
                }else{
                    //유투브 재생 커맨드
                    const track = await player.search(query, {
                        requestedBy: interaction.user
                    }).then(x => x.tracks[0]);
                    if (!track) return  interaction.reply({ content: `❌ | Track **${query}** not found!` });
                    if(!json){ //쉽게 재생되면 샡기는 json형식이 없으면 처음으로 간주함
                        queue.play(track);
                        console.log(today +" guild id: "+  interaction.guild.id +" 음악을 재생함");
                        return   interaction.reply({ content: `✅ | 노래를 재생할게요 **${track.title}**!` });
                    }else{ // 틀어져 있으면 추가하는 걸로 넘어감
                        json.insert(track); 
                        console.log(today +" guild id: "+  interaction.guild.id +" 음악을 추가함");
                        return   interaction.reply({ content: `✅ | 노래를 추가 할게요 **${track.title}**!` });
                    }
                }
        }
}
