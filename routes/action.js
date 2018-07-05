const { sendDM } = require('../modules/slack');
const { readFromDatabase, recordPurchaseRequestDecision } = require('../modules/database');

module.exports = app => {
    app.post('/action', async (req, res) => {
        const interactiveMessage = JSON.parse(req.body.payload)
        const requestApproved = interactiveMessage.actions[0].value === 'approved'
        const databaseKey = interactiveMessage.actions[0].name;
        const originalTextMessage = interactiveMessage.original_message.text
        //console.log('CCCCCCCCCCCCCCCCCCCCCC', interactiveMessage.original_message)
        //console.log('QQQQQQQQQQQQQQQQQQQ', originalTextMessage)

        // käyttäjän varmistus
        res.json(
            {
                text: originalTextMessage,
                attachments: [
                    {
                        text:
                            requestApproved
                                ? 'You approved this.'
                                : 'you cancelled request.'
                    }
                ]
            }
        );

        // tallenna päätös tietokantaan
        recordPurchaseRequestDecision(databaseKey, interactiveMessage.actions[0].value);

        const purchaseRequest = await readFromDatabase(databaseKey);
        console.log('firebasesta: ', purchaseRequest)

        // alkuperäiselle lähettäjälle palautetta
        // HUOM regexssä on ` ` koska haluttava homma on slackiin tummennettu kivasti
        //const matches = originalTextMessage.match(/@(.+)>.+\`(.+)\`/);
        // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: ',matches);
        console.log('UUUUUUUUUUUUUUUUU ', purchaseRequest.userId)
        sendDM(
            //matches[1],
            //'Moro, ostoksesi ' + matches[2] + ' on ' + requestApproved ? 'approved' : 'denied' + '.'
            purchaseRequest.userId,
            `Moro! Pyytämäsi ${purchaseRequest.item} on ${requestApproved ? 'approved' : 'denied'}.`
        );
    });
}