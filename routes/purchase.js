const { sendDM } = require('../modules/slack');
const { savePurchaseRequest } = require('../modules/database');
const config = require('../config');

module.exports = app => {
    app.post('/purchase', async (req, res) => {
        const text = req.body.text;
        const userName = req.body.user_id;
        //console.log(req.body);
        res.json({
            text: 'pistetään tilaukseen `' + text + '`, ilmoitamme tästä eteenpäin.'
        });

        // Tallenna pyynto tietokantaan
        const key = await savePurchaseRequest(userName, text);
        console.log(key)
        sendDM(config.ceoId, 'Terve! Käyttäjä <@' + userName + '> haluaisi tilata `' + text + '`.',
            [ //NAPPULAT
                {
                    text: "Annatko luvan",
                    callback_id: 'purchase_request',
                    actions: [
                        {
                            "name": key, //SAMA NIMI MAHDOLLISTAA VAIN YHDEN nappulan painamisen
                            "text": "hyväksyn",
                            "type": "button",
                            "value": "approved"
                        },
                        {
                            "name": key,
                            "text": "Ei",
                            "type": "button",
                            "value": "declined"

                        }
                    ]
                }
            ])
    });
}