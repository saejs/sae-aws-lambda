const web = require('./web');
const sns = require('./sns');
const s3  = require('./s3');
//const { queueRunMessages, isEventQueue } = require('./queue');
//const { cronRunJon, isEventCron } = require('./cron');

var serverWeb = null;

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 * Cmo Web, SNS, SQS, CRON e Invoke
 */
module.exports = function (app) {

    // Verificar se deve criar webserver
    if (!((process.env.WEB_SERVER == false) || (process.env.WEB_SERVER == 'false'))) {
        serverWeb = web.createServer(app.$route);
    }

    return function (event, context) {
        // Verificar se eh web
        //-------------------------------------------------------------
        if (web.isEvent(event, context)) {
            return serverWeb.proxy(event, context);
        }
        
        // Verificar se eh SNS
        //-------------------------------------------------------------
        if (sns.isEvent(event, context)) {
            return sns.runMessages(app, event, context);
        }

        // Verificar se eh S3
        //-------------------------------------------------------------
        if (s3.isEvent(event, context)) {
            return s3.runMessages(app, event, context);
        }

        // Verificar se eh queue
        //-------------------------------------------------------------
        //if (isEventQueue(event, context)) {
        //    return queueRunMessages(app.jobs(), event, context);
        //}
        
        // Verificar se eh cron
        //-------------------------------------------------------------
        //if (isEventCron(event, context)) {
        //    return cronRunJon(app.jobs(), event, context);
        //}
        
        // Registrar log e ignorar
        //-------------------------------------------------------------
        console.log('INVOKE NAO MAPEADO');
        console.log('EVENT', event);
        console.log('CONTEXT', context);

        return {};
    };
};