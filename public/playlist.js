const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const apple = require('../module/applemoudle.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('유툽,애플,스포의 플레이리스트를 추가합니다.(최대 200개)')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('input')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.voice.channelId) return await interaction.reply({
			content: "넌 보이스에 들어가 있지 않아요..",
			ephemeral: true
		});
		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({
			content: "당신은 지금 보이스에 들어가있지 않아요.. 들.어.가",
			ephemeral: true
		});

		//주소 가지고 오기
		const query = interaction.options.getString("url");
		console.log('================================================');
		console.log("애플 뮤직 플레이 리스트링크:" +  query);
		console.log('================================================');

		//처음시작일때만
		const queue = player.createQueue(interaction.guild, {
			metadata: {
				channel: interaction.channel
			}
		});

		//verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.getString({
				content: "흠.. 이상하네요.. 봇이 안들어가지네요? 권한이나 아니면 봇상태를 확인해주세요.",
				ephemeral: true
			});
		}

		//이건 몰류?
		await interaction.deferReply();

		//플레이리스트 정보 가지고 오기
		//아래에 코드는 나중에 유투브도 넣어야 되기 때문에 수정을 좀더 할거임
		const apijson = await apple.playlist(query);

		//이런 json형식으로 가져와야함
		// [
		// 	{ "artist":"EmoCosine","title":"Cutter"},
		//  ... n
		// ]

		//재생시키는 코드
		for (let index = 0; index < apijson.length; index++) {
			//음악정보 조합
			const music = apijson[index].artist + ' ' + apijson[index].title
			
			//youtube에서 정보를 가져옴
			const track = await player.search(music, {
				requestedBy: interaction.user
			}).then(x => x.tracks[0]);

			//만약 처음부타 시작이면
			if (index == 0) {
				const before = player.getQueue(interaction.guild);
				queue.play(track);
				if(apijson.length < 100){
					await interaction.followUp({
						content: `✅ | ${track.title} 노래를 재생하고 그다음 최대 300개 까지 추가 할게요! `
					});
				}else{
					//100개 미만이면 이런 메세지를 전달함
					await interaction.followUp({
						content: `✅ | ${track.title} 노래를 재생하고 그다음 ${apijson.length} 개를 추가 할게요! `
					});
				}
			} else if (index < 100) {
				//track 이슈로 이렇게 수정 조치함
				if (track != undefined) {
					//나중일때
					const before = player.getQueue(interaction.guild);
					if(before != undefined){
						before.addTrack(track);
					}else{
						//사용자가 취소하면 반복문을 멈춤
						console.log("음악 추가중 사용자의 요청으로 삭제 완료");
						break;
					}
				}
			}
		}
	},
};