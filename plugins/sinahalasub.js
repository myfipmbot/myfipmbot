
const { fetchJson } = require('../lib/functions')
const config = require('../config')
const axios = require('axios');
const { cmd, commands } = require('../command')


const { sinhalaSub } = require('mrnima-moviedl'); // Make sure mrnima-moviedl is installed and supports search

cmd({
    pattern: "sinhalasub",
    react: '🎥',
    category: "movie",
    desc: "Search movies on sinhalasub and get download links",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('*ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ꜱᴇᴀʀᴄʜ Qᴜᴇʀʏ! (ᴇ.ɢ., ᴅᴇᴀᴅᴘᴏᴏʟ)*');
        
        var movie = await sinhalaSub();
        const results = await movie.search(q);
        const searchResults = results.result.slice(0, 10);
        
        if (!searchResults || searchResults.length === 0) {
            return await reply(`No results found for: ${q}`);
        }

        let resultsMessage = `📽️ *𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕𝒔 𝒇𝒐𝒓* "${q}":\n\n`;
        searchResults.forEach((result, index) => {
            resultsMessage += `*${index + 1}.* ${result.title}\n🔗 Link: ${result.link}\n\n`;
        });

        const sentMsg = await conn.sendMessage(from, { text: resultsMessage }, { quoted: mek });
        const messageID = sentMsg.key.id;

        conn.ev.on('messages.upsert', async (messageUpdate) => {
            const replyMek = messageUpdate.messages[0];
            if (!replyMek.message) return;
            const messageType = replyMek.message.conversation || replyMek.message.extendedTextMessage?.text;
            const isReplyToSentMsg = replyMek.message.extendedTextMessage && replyMek.message.extendedTextMessage.contextInfo.stanzaId === messageID;

            if (isReplyToSentMsg) {
                const selectedNumber = parseInt(messageType.trim());
                if (!isNaN(selectedNumber) && selectedNumber > 0 && selectedNumber <= searchResults.length) {
                    const selectedMovie = searchResults[selectedNumber - 1];

                    const apiUrl = `https://api-site-2.vercel.app/api/sinhalasub/movie?url=${encodeURIComponent(selectedMovie.link)}`;
                    try {
                        const response = await axios.get(apiUrl);
                        const movieData = response.data.result;

                        // Only use `dl_links1` for PixelDrain links
                        const pixelDrainLinks = movieData.dl_links || [];
                        if (pixelDrainLinks.length === 0) {
                            return await reply('No PixelDrain links found.');
                        }

                        let downloadMessage = `🎥 *${movieData.title}*\n\n`;
                        downloadMessage += `*Available PixelDrain Download Links:*\n`;

                        pixelDrainLinks.forEach((link, index) => {
                            downloadMessage += `*${index + 1}.* ${link.quality} - ${link.size}\n🔗 Link: ${link.link}\n\n`;
                        });

                        const pixelDrainMsg = await conn.sendMessage(from, { text: downloadMessage }, { quoted: replyMek });
                        const pixelDrainMessageID = pixelDrainMsg.key.id;

                        conn.ev.on('messages.upsert', async (pdUpdate) => {
                            const pdReply = pdUpdate.messages[0];
                            if (!pdReply.message) return;
                            const pdMessageType = pdReply.message.conversation || pdReply.message.extendedTextMessage?.text;
                            const isReplyToPixelDrainMsg = pdReply.message.extendedTextMessage && pdReply.message.extendedTextMessage.contextInfo.stanzaId === pixelDrainMessageID;

                            if (isReplyToPixelDrainMsg) {
                                const qualityNumber = parseInt(pdMessageType.trim());
                                if (!isNaN(qualityNumber) && qualityNumber > 0 && qualityNumber <= pixelDrainLinks.length) {
                                    const selectedPixelDrainLink = pixelDrainLinks[qualityNumber - 1];
                                    const fileId = selectedPixelDrainLink.link.split('/').pop();
                                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });

                                    const directDownloadUrl = `https://pixeldrain.com/api/file/${fileId}`;

                                    await conn.sendMessage(from, { react: { text: '⬆', key: mek.key } });

                                    await conn.sendMessage(from, {
                                        document: { url: directDownloadUrl },
                                        mimetype: "video/mp4",
                                        fileName: `${movieData.title} - ${selectedPixelDrainLink.quality}.mp4`,
                                        caption: `${movieData.title}\nQuality: ${selectedPixelDrainLink.quality}\nPowered by ᴋᴀᴠɪ ᴇxᴇ`,
                                        contextInfo: {
                                            mentionedJid: [],
                                            externalAdReply: {
                                                title: movieData.title,
                                                body: 'Download powered by ᴋᴀᴠɪ ᴇxᴇ',
                                                mediaType: 1,
                                                sourceUrl: selectedMovie.link,
                                                thumbnailUrl: movieData.image
                                            }
                                        }
                                    }, { quoted: pdReply });

                                    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
                                } else {
                                    await reply('Invalid selection. Please reply with a valid number.');
                                }
                            }
                        });

                    } catch (error) {
                        console.error('Error fetching movie details:', error);
                        await reply('An error occurred while fetching movie details. Please try again.');
                    }
                } else {
                    await reply('Invalid selection. Please reply with a valid number.');
                }
            }
        });

    } catch (error) {
        console.error('Error during search:', error);
        reply('*An error occurred while searching!*');
    }
});