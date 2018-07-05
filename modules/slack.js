const axios = require('axios');
const config = require('../config');

const sendDM = async (userId, message, attachments) => {
    try {
        const conversationResponse = await axios.post(
            'https://slack.com/api/conversations.open',
            {
                users: userId
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.botToken}`
                }
            }
        );
        //console.log(conversationResponse);

        const postResponse = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: conversationResponse.data.channel.id,
                text: message,
                attachments: JSON.stringify(attachments)
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.botToken}`
                }
            }
        );
        //console.log(postResponse);

    } catch (error) {
        throw err;
    }
}

module.exports = {
    sendDM
};