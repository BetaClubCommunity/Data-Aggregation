"use strict";
let datafire = require('datafire');
let stripe = require('@datafire/stripe').actions;
//TODO in the future
module.exports = new datafire.Action({
  handler: async (input, context) => {
    let account = await stripe.v1.account.get({}, context);
    return account;
  },
});