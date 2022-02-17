const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageActionRow , MessageButton } = require('discord.js');
const yts = require('yt-search');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('유투브에서 검색을 합니다.')
		.addStringOption(option =>
			option.setName('string')
			.setDescription('검색할 내용을 넣어주십시오')
			.setRequired(true)),
	async execute(interaction) {
		const today = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
		const input = await yts(interaction.options.getString('string'));
		const json = player.getQueue(interaction.guild.id);
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
		let embed = [];

		//내 입맛으로 만들기
		function dataget() {
			const videos = input.videos.slice(0, 4)
			let json = [];
			for (let index = 0; index < 4; index++) {
				const videoj = {
					title: videos[index].title,
					url: videos[index].url,
					timestamp: videos[index].timestamp,
				}
				json[index] = videoj;
			}
			return json;
		};

		//embed 내용용 json 생성
		let reultapi = dataget();
		for (let index = 0; index < 4; index++) {
			embed[index] = {
				name: reultapi[index].title,
				value: "플레이 시간: " + reultapi[index].timestamp
			}
		}

		//embed 양식 작성
		const result = {
			color: '#FF0000',
			title: interaction.options.getString('string') + '검색 결과',
			fields: embed,
			timestamp: new Date(),
		};

		//버튼 양식 작성
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('one')
				.setEmoji("1️⃣")
				.setStyle('SECONDARY'),
				new MessageButton()
				.setCustomId('two')
				.setEmoji("2️⃣")
				.setStyle('SECONDARY'),
				new MessageButton()
				.setCustomId('three')
				.setEmoji("3️⃣")
				.setStyle('SECONDARY'),
				new MessageButton()
				.setCustomId('four')
				.setEmoji("4️⃣")
				.setStyle('SECONDARY'),
			);
		
		//값보내기
		await interaction.reply({
			embeds: [result],
			fetchReply: true,
			components: [row]
		});

		// 보이스채널에 접속 시도
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.reply({ content: "흠.. 이상하네요.. 봇이 안들어가지네요? 권한이나 아니면 봇상태를 확인해주세요.", ephemeral: true });
		}

		//버튼 id
		const filter = i => i.customId === 'one' || i.customId === 'two' || i.customId === 'three' || i.customId === 'four';
		//유지시간
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
		//array
		const A = ['one','two','three','four'];

		collector.on('collect', async i => {
			for (let index = 0; index < 4; index++) {
				if (i.customId === A[index]) {
					const track = await player.search(reultapi[index].title, {
						requestedBy: interaction.user
					}).then(x => x.tracks[0]);
					if (!track) return i.update({ content: `❌ | Track **${query}** not found!` , components: [], embeds: [] });
					if(!json){ //쉽게 재생되면 샡기는 json형식이 없으면 처음으로 간주함
						queue.play(track);
						console.log(today + " guild id: "+  interaction.guild.id +" 검색하고 음악을 바로 듣게 추가함");
						return  i.update({ content: `✅ | 노래를 재생할게요 **${track.title}**!`, components: [], embeds: []  });
					}else{ // 틀어져 있으면 추가하는 걸로 넘어감
						json.insert(track);
						console.log(today + " guild id: "+  interaction.guild.id +" 검색하고 음악을 대가열에 추가함");
						return  i.update({ content: `✅ | 노래를 추가 할게요 **${track.title}**!`, components: [], embeds: []  });
					}
				}	
			}
		});
	},
};