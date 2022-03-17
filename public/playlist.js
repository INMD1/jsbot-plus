const {SlashCommandBuilder} = require('@discordjs/builders');
const apple = require('../module/applemoudle.js');
const { appletoken } = require('../jsonfile/config.json');
const ytpl = require('ytpl');
const { Collection } = require('discord.js');

module.exports = {
	//슬래시 커맨드 설정
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('유툽,애플,스포의 플레이리스트를 추가합니다.(최대 200개)')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('input')
			.setRequired(true)),

	async execute(interaction) {
		//로그 시간 생성
		const today = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');

		//유조 보이스에 들어와 있는지 확인
		if (!interaction.member.voice.channelId) return await interaction.reply({
			content: "넌 보이스에 들어가 있지 않아요..",
			ephemeral: true
		});
		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({
			content: "당신은 지금 보이스에 들어가있지 않아요.. 들.어.가",
			ephemeral: true
		});

		// //주소 가지고 오기
		const query = interaction.options.getString("url");
		
		//플레이리스트 정보 가지고 오기(여기로 다 값이 받고 내보내기함)
		if (query.includes('music.apple.com')) {
			console.log('================================================');
			console.log("애플 뮤직 플레이 리스트링크:" + query);
			console.log('================================================');
	
			//애플 토큰 아무것도 없으면 0으로 설정함
			if(appletoken == 0) {
				return interaction.reply("혹시 애플 토큰을 안넣으면 넣어주세요. 넣지않으면 애플 뮤직과 연관된 기능은 작동하지 않습니다.");
			}else {
				//아래에 코드는 나중에 유투브도 넣어야 되기 때문에 수정을 좀더 할거임
				const asdf = new URL(query)
				const asdfasdf = asdf.pathname.split('/')
				let id
				//애플 플레이리스트 함수로 id들
				if (asdfasdf.some(a => a === 'album')) {
					let songID = asdf.searchParams.get('i')
					if (songID == null) {
						id = asdfasdf[asdfasdf.length - 1]
						play(await apple.albume(id));
					}
				} else if (asdfasdf.some(a => a === 'playlist')) {
					id = asdfasdf[asdfasdf.length - 1]
					play(await apple.playlist(id));
				} else {
					return interaction.reply("플레이스트 또는 플레이리스트인 앨범 링크를 넣어주세요.");
				}	
			}
		}else if(query.includes('music.apple.com')){
			try {
				const ytdl_url = new URLSearchParams(query);
				const firstResultBatch = await ytpl(ytdl_url.get("https://www.youtube.com/playlist?list"), {pages: 3 })	
				play(firstResultBatch.items);
			} catch (error) {
				console.log("error!");
				return interaction.reply("현재 유투브는 유투브에 만든 플레이리스트는 재생이 안됨니다.");	
			}
		}

		//이런 json형식으로 가져와야함
		// [
		// 	{ "artist":"EmoCosine","title":"Cutter"},
		//  ... n
		// ]
		
		//애플 전용
		async function play(input) {

			//처음시작일때만
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


			//verify vc connection
			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel);
			} catch {
				queue.destroy();
				return  interaction.reply({
					content: "흠.. 이상하네요.. 봇이 안들어가지네요? 권한이나 아니면 봇상태를 확인해주세요.",
					ephemeral: true
				});
			}
						
				//재생시키는 코드
			for (let index = 0; index < input.length; index++) {
					let music ="";
					let SNS = 0
					if (input[index].artist != undefined) {
						//애플 음악정보 조합
						 music = input[index].artist + ' ' + input[index].title	
						 SNS = 1			
					}else{
						//유투브 음악정보 조합
						 music = input[index].title
					}
					
					//youtube에서 정보를 가져옴
					const track = await player.search(music, {
						requestedBy: interaction.user
					}).then(x => x.tracks[0]);
					
					//만약 처음부타 시작이면
				if (index == 0) {
					queue.play(track);
					if(SNS == 1){
						if (!(input.length < 100)) {
							await interaction.reply({
								content: `✅ | ${track.title} 노래를 재생하고 그다음 최대 200개 까지 추가 할게요!\n추가하는데 시간이 걸릴수 있서요 `
							});
						} else {
							//100개 미만이면 이런 메세지를 전달함
							await interaction.reply({
								content: `✅ | ${track.title} 노래를 재생하고 그다음 ${input.length - 1} 개를 추가 할게요!\n추가하는데 시간이 걸릴수 있서요`
							});
						}
					}else{
						if (!(input.length < 100)) {
							await interaction.reply({
								content: `✅ | ${track.title} 노래를 재생하고 그다음 최대 300개 까지 추가 할게요!\n추가하는데 시간이 걸릴수 있서요 `
							});
						} else {
							//100개 미만이면 이런 메세지를 전달함
							await interaction.reply({
								content: `✅ | ${track.title} 노래를 재생하고 그다음 ${input.length - 1} 개를 추가 할게요!\n추가하는데 시간이 걸릴수 있서요`
							});
						}
					}
					console.log(today + " guild id: " + interaction.guild.id + " 플레이리스트를 추가함");
				} else if (index < 200) {
					//track 이슈로 이렇게 수정 조치함
					if (track != undefined) {
						//나중일때
						const before = player.getQueue(interaction.guild.id);
						if (before != undefined) {
							before.insert(track);
						} else {
							//사용자가 취소하면 반복문을 멈춤
							console.log(today + " 음악 추가중 사용자의 요청으로 삭제 완료");
							break;
						}
					}
				}
			 }
		}
	}
};
