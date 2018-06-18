const client = require('./client');
const constants = require('../constants');

exports.createApplication = () => {
    return client.post('v1/applications', {
        data: {
            'api_key': '744834d3',
            'api_secret': 'TMH7JwL8Jwh3EhYX',
            'name' : 'Stitch Demo App',
            'type' : 'rtc',
            'answer_url' : 'https://example.com/answer',
            'event_url' : 'https://example.com/event'
        }
    }).then(res => {
        constants.APPLICATION_ID = res.id;
        constants.PRIVATE_KEY = res.keys.private_key;
    });
}
