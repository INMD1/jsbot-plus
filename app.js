const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const {token} = require('./jsonfile/config.json');
const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_BANS],
    partials: ["MESSAGE", "CHANNEL"],
})
const os = require('os');

//커맨드 명령어들 불러오는 코드
client.commands = new Collection();

const publicfile = fs.readdirSync('./public').filter(file => file.endsWith('.js'));

// 서버에서 사용할 명령어 준비
for (const file of publicfile) {
	const command = require(`./public/${file}`);
	client.commands.set(command.data.name, command);
}

// 콘솔에 나타날 로그들
client.once('ready', () => {
	client.user.setActivity("v13 업데이트! /를 입력해주세요.")
	console.log('-----------------');
	console.log('  운영체제 정보');
	console.log('-----------------');
	console.log('운영체제', os.arch());
	console.log('운영체제 os', os.type());
	console.log('운영체제 버전', os.release());

	console.log('-----------------');
	console.log("     봇 로그");
	console.log('-----------------');


	const moment = require('moment');
	require('moment-timezone');
	moment.tz.setDefault("Asia/Seoul");
	const time = moment().format('YYYY-MM-DD HH:mm:ss');
	setTimeout(function () {
		console.log(time + " 봇을 활성화 했습니다.");
	}, 1000);
	setTimeout(function () {}, 4000);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	interaction.options.ge
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: '오류가 발생했서요...\n관리자 또는 운영자한데 문의해주세요.',
			ephemeral: true
		});
	}

});

client.login(token);