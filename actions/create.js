"use strict";
let datafire = require('datafire');
const setup = require('./setup.js');
let config = require('./config.json');
let logger = require('./winston');

module.exports = new datafire.Action({
    description: "Creates a new item in the spreadsheet",
    inputs: [{
        title: "name",
        type: "string"
    }, {
        type: "string",
        title: "Email"
    }, {
        type: "string",
        title: "phone"
    }, {
        type: "string",
        title: "City"
    }, {
        type: "string",
        title: "organization"
    },
        // add your columns in order from left to right above this line
        {
            type: "string",
            title: "spreadsheetId",
            default: "1G_LTW3K-0ta_ZRMV0KPNSHi4-2H8dUE6TO7yTV-2Tus"
        }, {
            type: "string",
            title: "accountName",
            default: "sheets1"
        }],
    handler: async (input, context) => {
        let google_sheets = null;
        config.database = await setup.getSchema("abc");
        let database = new setup.database(config);
        try {
            logger.accessLog.info("Getting Credentials in google_Sheets for " + input.accountName);
            await database.query("SELECT AccessToken,RefreshToken,ClientId,ClientSecret FROM AccessKeys WHERE IntegrationName = 'google_sheets' AND Active = 1 AND AccountName = ?", input.accountName).then(result => {
                result = result[0];
                google_sheets = require('@datafire/google_sheets').create({
                    access_token: result.AccessToken,
                    refresh_token: result.RefreshToken,
                    client_id: result.ClientId,
                    client_secret: result.ClientSecret,
                });
            }).catch(e => {
                logger.errorLog.error("Error selecting from credentials in google_sheet for " + input.accountName + " " + e);
            });
        } finally {
            try {
                await database.close();
            } catch (e) {
                logger.errorLog.error("Error closing database in create.js " + e);
            }
        }
        if (google_sheets === null) {
            logger.errorLog.warn("Integration disabled or invalid accountName in google_sheets for " + input.accountName);
            return {error: "Invalid AccountName or integration disabled"};
        }

        INPUTS = INPUTS.slice(0, INPUTS.length - 2);
        return datafire.flow(context)
            .then(_ => google_sheets.spreadsheets.values.append({
                spreadsheetId: input.spreadsheetId,
                range: "A1:A" + INPUTS.length,
                body: {
                    values: [
                        INPUTS.map(i => input[i.title])
                    ],
                },
                valueInputOption: "RAW",
            }, context))
            .then(_ => "Success")
    },
});

let INPUTS = module.exports.inputs;
