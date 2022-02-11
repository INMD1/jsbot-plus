const {SlashCommandBuilder} = require('@discordjs/builders');
const { Player } = require("discord-player");

//대기열 만들떄 사용함
const queue = new Map()

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

    }
}
