"use strict";
let datafire = require('datafire');

let google_calendar = require('@datafire/google_calendar').actions;
module.exports = new datafire.Action({
  inputs: [{
    type: "string",
<<<<<<< HEAD
    title: "id",
    default: "lincoln@sublimeapp.com"
=======
    title: "id"
>>>>>>> c845b79326b42b0d730161fedb2ef3e1a33103e0
  }, {
    type: "string",
    title: "start",
    default: "2018-05-01T13:00:00-00:00"
  }, {
    type: "string",
    title: "end",
    default: "2018-06-29T00:00:00-00:00"
  }, {
    type: "string",
    title: "timeZone",
    default: "UTC"
  }],
  handler: async (input, context) => {
<<<<<<< HEAD
    //return all events in the calendar, can add addition timeMax and timeMin params in RFC3339 timeStamp
    const events = new Promise((resolve, reject) => {
      const temp = google_calendar.events.list({
        calendarId: input.id
        //timeMax: 
        //timeMin: 
      }, context);
      resolve(temp);
    });
    //return when the user is free/busy
    const freeBusy = new Promise((resolve, reject) => {
      const temp1 = google_calendar.freebusy.query({
        body: {
          timeMin: input.start,
          timeMax: input.end,
          items: [{
            id: input.id,
          }],
          timeZone: input.timeZone,
        },
        alt: "json",
      }, context);
      resolve(temp1);
    });
    try {
      return await Promise.all([events, freeBusy]);
    } catch (e) {
      return e;
    }
  },
});
=======
    let result = []
    result.push(await google_calendar.events.list({
      calendarId: input.id,
    }, context));
    result.push (await google_calendar.freebusy.query({
      body: {
        timeMin: input.start,
        timeMax: input.end,
        items: [{
          id: input.id,
        }],
        timeZone: input.timeZone,
      },
      alt: "json",
    }, context));
    return result;
  },
});
>>>>>>> c845b79326b42b0d730161fedb2ef3e1a33103e0
