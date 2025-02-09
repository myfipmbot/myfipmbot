const { runtime, fetchJson } = require('../lib/functions')
const config = require('../config');
const { cmd } = require('../command');
cmd({
    pattern: "in",
    react: '⬆',    
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { reply, isDev, from, q, prefix }) => {
        try {
        
        if (!q) return await reply('*Please Give Me Link..! 🖊️*')

		
const data = await fetchJson(`${config.API}/api/sinhalasubs/movie?url=${q}&apikey=${config.APIKEY}`)
const msg = `*_☘ Title: ${data.data.data.mainDetails.maintitle}_*


- 📅 *Year:* ➩ ${data.data.data.mainDetails.dateCreated}
- 🕛 *Rating:* ➩ ${data.data.data.mainDetails.runtime}
- 🌍 *ImdbRating* ➩ ${data.data.data.moviedata.imdbRating}
- ⏳ *ImdbvotesCount* ➩ ${data.data.data.moviedata.imdbvotesCount}
             
                         
*📍 Link:* ${q}

ᴘᴏᴡᴇʀᴇᴅ.ʙʏ ᴋᴀᴠɪ-ᴇxᴇ`
		
return await conn.sendMessage(from, { image: { url:data.data.data.moviedata.imageUrls[0] } , caption: msg } , { quoted: mek })
} catch (e) {
reply('*_First activate location sender_*\n\n- Eg:- .activate\n- Then reply 1.1')
            console.log(e)
            }
    })
