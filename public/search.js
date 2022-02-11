const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageActionRow , MessageButton } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, generateDependencyReport  } = require('@discordjs/voice');

const yts = require('yt-search');
const ytdl = require('ytdl-core-discord');
const fs = require('fs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('유투브에서 검색을 합니다.')
		.addStringOption(option =>
			option.setName('string')
			.setDescription('검색할 내용을 넣어주십시오')
			.setRequired(true)),
	async execute(interaction) {
		const input = await yts(interaction.options.getString('string'));
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

		//embed양식 작성
		const result = {
			color: '#FF0000',
			title: interaction.options.getString('string') + '검색 결과',
			fields: embed,
			timestamp: new Date(),
		};

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
		
		//보내기
		await interaction.reply({
			embeds: [result],
			fetchReply: true,
			components: [row]
		});

		//답변
		const filter = i => i.customId === 'one' || i.customId === 'two' || i.customId === 'three' || i.customId === 'four';
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		const A = ['one','two','three','four'];
		collector.on('collect', async i => {
			for (let index = 0; index < 4; index++) {
				if (i.customId === A[index]) {
					// await i.update({ content: reultapi[index].url, components: [] });
					await i.reply({ content: "🎵 `" + reultapi[index].title + "`" + "를 재생 할게요" });
				}	
			}
		});
	},

};