/**
 * Verificar se o evento do lambda é um solicição SQS.
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

    if ((event.Records.length > 0) && (event.Records[0].eventSource == 'aws:sqs')) {
        return true;
    }

    return false;
}

/**
 * Executar mensagens da lista da fila.
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
    var messageId      = msg.messageId;
    var sourceArn      = msg.eventSourceARN;
    var sourceArnParts = sourceArn.split(':');
    var data           = JSON.parse(msg.body);

    // Montar objeto do comando
    var cmd = {
        origem : 'sqs',
        id     : sourceArnParts[sourceArnParts.length-1],
        data,
        messageId,
        sourceArn
    };

    await app.events.emit('command.' + cmd.origem + '.' + cmd.id, cmd);
    
    return true;
}

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 */
module.exports = {
    runMessages,
    isEvent
};