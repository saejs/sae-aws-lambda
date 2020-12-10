const web = require('./web');
//const { queueRunMessages, isEventQueue } = require('./queue');
//const { cronRunJon, isEventCron } = require('./cron');

var serverWeb = null;

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 * Cmo Web, Queues, Cron, Invoke
 */
module.exports = function (app) {

    // Verificar se deve criar webserver
    if (!((process.env.WEB_SERVER == false) || (process.env.WEB_SERVER == 'false'))) {
        serverWeb = web.createServer(app);
    }

    return function (event, context) {
        // Verificar se eh web
        //-------------------------------------------------------------
        if (web.isEventWeb(event, context)) {
            return serverWeb.proxy(event, context);
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