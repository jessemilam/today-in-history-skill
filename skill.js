// 1. Text strings =====================================================================================================
const languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Today In History!",
            'HELP'    : "",
            'ABOUT'   : "Today In History tells you about important historical events, birthdates, and deaths.",
            'STOP'    : "Okay, see you next time!"
        }
    }
};

const SKILL_NAME = "Today In History";
const endingPhrases = ["What else would you like to know?", "What else can I tell you about?", "Tell me what else you'd like to hear."];

// 2. Skill Code =======================================================================================================
const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);

    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        let say = 'Welcome to Today In History! ';
        getRandomEventFromToday( (dt, fact) => {
            
            say = say + 'On this day in ' + dt + ", " + fact + randomArrayElement(endingPhrases);
            this.response.speak(say).listen(say);
            this.emit(':responseReady');
        });
    },

    'BirthdayTodayIntent': function () {
        let say = '. What else would you like to know?';
        getBirthdaysForToday( (dt, text) => {
            
            say = text + 'was born today in the year ' + dt + say;
            this.response.speak(say).listen(say);
            this.emit(':responseReady');
        });
    },

    'EventTodayIntent': function () {
            let say = ' What else would you like to know?';
            getRandomEventFromToday( (dt, fact) => {
                
                say = 'On this day in ' + dt + ", " + fact + say;
                this.response.speak(say).listen(say);
                this.emit(':responseReady');
            });

    },

    'AboutIntent': function () {
        this.response.speak(this.t('ABOUT'));
        this.emit(':responseReady');
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t('HELP')).listen(this.t('HELP'));
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }

};

// 3. Helper Function  =================================================================================================
function getRandomEventFromToday(callback) {
    let http = require('http');

    let req = http.request('http://history.muffinlabs.com/date', res => {
        res.setEncoding('utf8');
        let returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            let channelObj = JSON.parse(returnData);
            let index = randomArrayElement(channelObj.data.Events)
            callback (channelObj.data.Events[index].year, channelObj.data.Events[index].text);

        });

    });
    req.end();
}

function getEventForSpecificDate(callback, dt) {
    let http = require('http');

    let req = http.request('http://history.muffinlabs.com/date', res => {
        res.setEncoding('utf8');
        let returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            let channelObj = JSON.parse(returnData);
            let index = randomArrayElement(channelObj.data.Events)
            callback (channelObj.data.Events[index].year, channelObj.data.Events[index].text);

        });

    });
    req.end();
}

function getBirthdaysForToday(callback) {
    let http = require('http');
    
        let req = http.request('http://history.muffinlabs.com/date', res => {
            res.setEncoding('utf8');
            let returnData = "";
    
            res.on('data', chunk => {
                returnData = returnData + chunk;
            });
            res.on('end', () => {
                let channelObj = JSON.parse(returnData);
                let index = randomArrayElement(channelObj.data.Births)
                callback (channelObj.data.Births[index].year, spliceBirthdayText(channelObj.data.Births[index].text));
    
            });
    
        });
        req.end();
}

function spliceBirthdayText(text) {
    let length = text.length;
    return text.slice(0, length - 9);
}

function randomArrayElement(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return i
}