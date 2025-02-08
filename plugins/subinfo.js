const { runtime, fetchJson } = require('../lib/functions')
const config = require('../config');
const { cmd } = require('../command');
cmd({
    pattern: "subinfo",
    react: '⬆',    
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { reply, isDev, from, q, prefix }) => {
        try {
        

const data = await fetchJson(`https://apitest1-f7dcf17bd59b.herokuapp.com/movie/sinhalasub/movie?url=${q}`)


let  msg = `*_☘Title ➩ ${data.result.data.title}_*\n\n`
	 msg += `📽️ ━━━━━━━━━━━━━━━━━━━📽️\n\n`	
         msg += `	  📆  *Date* ➩ ${data.result.data.date}\n\n`
         msg += `	  🏷️  *Rate* ➩ ${data.result.data.tmdbRate}\n\n`
     	 msg += `	  🌍  *Country* ➩ ${data.result.data.country}\n\n`	
         msg += `	  🕘  *Vote* ➩ ${data.result.data.sinhalasubVote}\n\n`
         msg += `	  🕘  *Category* ➩ ${data.result.data.category}\n\n`
    	 msg += `*📍Link* ➩ ${q}\n\n`	
    	 msg += `📽️ ━━━━━━━━━━━━━━━━━━━📽️\n\n\n`	
         msg += `> ★❮• 𝗞𝗔𝗩𝗜 𝗘𝗫𝗘 𝗦𝗜𝗡𝗛𝗔𝗟𝗔𝗦𝗨𝗕 𝗠𝗢𝗩𝗜𝗘 𝗗𝗟 •❯★` 
		
return await conn.sendMessage(from, { image: { url:data.result.data.images[0] } , caption: msg } , { quoted: mek })
//await conn.sendMessage(from , { text: msg  }, { quoted: mek } )	
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*error!!*')
            console.log(e)
            }
    })       
