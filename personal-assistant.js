// käy päätökset läpi, jos päätöstä ei ole tehty niin kysytään uudelleen
// toisetaan x ajan jälkeen

const { readAllFromDatabase } = require('./modules/database');
const { sendDM } = require('./modules/slack');
const moment = require('moment');
const config = require('./config')


const checking = async () => {
    const requests = await readAllFromDatabase();

    const reminder = [];

    for (let key of Object.keys(requests)) {
        const { timestamp, decision, item, userId } = requests[key]
        //console.log(key)
        // console.log(requests[key])
        if (!decision && moment().diff(timestamp, 'minutes') > 10) {
            reminder.push({
                item, userId,
            })
            //  console.log(timestamp, decision)
            // console.log(`väli hommilla ${item} was made ${moment().diff(timestamp, 'minutes')} minuuttia sitten, ja päätös oli ${decision}`)
        }
    }
    console.log('Näistä muistutetaan:')
    console.log(reminder)
    sendDM(config.ceoId, 'Moro nääs! Näihin pitäisi vielä tehdä päätös: ',
        reminder.map(remind => ({
            text: `*${remind.item}* requested by <@${remind.userId}>`
        }))
    )
}

checking();