/**
 * Verificar se o evento do lambda é um solicição S3.
 * 
 * @param {Object} event Evento do gatilho do lambda
 * @param {Object} context Objeto contexto da função do lambda
 * @returns {Boolean}
 */
const isEvent = (event, context) => {
    if (!(typeof event == 'object')) {
        return false;
    }

    if (!('Records' in event)) {
        return false;
    }

    if (!('length' in event.Records)) {
        return false;
    }

    if ((event.Records.length > 0) && (event.Records[0].EventSource == 'aws:s3')) {
        return true;
    }

    return false;
}

/**
 * Executar mensagens da lista de notificação.
 * 
 * @param {App} app Objeto da aplicacao.
 * @param {Object} event Evento do gatilho do lambda
 * @param {Object} context Objeto contexto da função do lambda
 * @returns {Object}
 */
const runMessages = async (app, event, context) => {
    var records = event.Records;

    for (var i in records) {
        await runMessageItem(app, records[i]);
    }

    return {};
}

/**
 * Executar uma mensagem da lista.
 * 
 * @param {App} app Objeto da aplicacao.
 * @param {Object} event Evento do gatilho do lambda
 * @param {Object} context Objeto contexto da função do lambda
 * @returns {Object}
 */
const runMessageItem = async (app, msg) => {

    // Tratar parametros
    var bucket        = msg.s3.bucket;
    var object        = msg.s3.object;
    var eventName     = msg.eventName;
    var awsRegion     = msg.awsRegion;

    // Montar objeto do comando
    var cmd = {
        origem : 's3',
        bucket,
        object,
        eventName,
        awsRegion,
        source: msg
    };

    await app.events.emit('command.' + cmd.origem);
    
    return true;
}

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 */
module.exports = {
    runMessages,
    isEvent
};