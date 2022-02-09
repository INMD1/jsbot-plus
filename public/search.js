const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const yts = require('yt-search');
const ytse = require("yt-search");
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
		let reultapi = dataget();
		for (let index = 0; index < 4; index++) {
			embed[index] = {
				name: reultapi[index].title,
				value: "플레이 시간: " + reultapi[index].timestamp
			}
		}

		const result = {
			color: '#FF0000',
			title: interaction.options.getString('string') + '검색 결과',
			fields: embed,
			timestamp: new Date(),
		};
		const message =  await interaction.reply({ embeds: [result], fetchReply: true  });
		message.react('1️⃣')
		.then(() => message.react('2️⃣'))
		.then(() => message.react('3️⃣'))
		.then(() => message.react('4️⃣'))
		.catch(error => console.error('오류가 생겨버렸서요.', error));
	},

};