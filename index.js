require('dotenv').config();
const nodemailer = require('nodemailer');

const teleapi = require('node-telegram-bot-api');

const token = '6016377142:AAFq9SIlCe98spSmbBaVK_kw3rZUI3HiOU4';
const bot = new teleapi(token, {polling:true});

let sendEmail = false;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Ակտիվացնել բոտը'},
        {command: '/openlesson', description: 'Գրանցվել բաց դասին'}
    ]);

    bot.on('message', msg => {
        console.log(msg);
    
        const text = msg.text;
        const chatid = msg.chat.id;
        const n = msg.from.first_name;

        if(text === '/start'){
            return bot.sendMessage(chatid, `Բարև Ձեզ 👋, բարի գալուստ Magical բոտ, Բաց Դասին գրանցվելու համար գրեք /openlesson հրամանը☺️, հարցերի դեպքում կարող եք զանգահարել +37494673735, +37443333215 հեռախոսահամարին`);
        }
        if(text === '/openlesson'){
            sendEmail = true;
            bot.sendMessage(chatid, '⚠️ Ուշադրություն, Discord ֊ ի username ֊ ը գրելիս նաև նշեք Ձեր այդին (դրանք username ֊ ի կողքի 4 թվերն են), օրինակ User#1234, գրանցումը դադարեցնելու համար գրեք exit։');
            return  bot.sendMessage(chatid, `${n}, Բաց Դասին գրանցվելու համար ուղարկեք Ձեր տվյալները հետևյալ կերպ (Անուն Ազգանուն, Տարիք, Discord - ի username-ը (Username#0000), Հեռախոսահամար և գրեք ինչ գիտելիքներ ունեք ծրագրավորումից։`);
        }
        if(sendEmail){
            sendEmail = false;
            if(text === 'exit'){
                return bot.sendMessage(chatid,'Գրանցումը դադարեցվել է ❌');
            }else {
                const mailOptions = {
                    from: 'davit.manukyan.d@tumo.org',
                    to: 'magicalcompanyofficial@gmail.com',
                    subject: 'openlesson',
                    text: text
                }
                
                transporter.sendMail(mailOptions);
                return bot.sendMessage(chatid,'Դուք գրանցվեցիք Բաց Դասին ✅');
            }
        }
        return bot.sendMessage(chatid,'⚠️ Սխալ հրաման ⚠️');
    });
}
 start();