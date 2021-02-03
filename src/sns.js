/**
 * Verificar se o evento do lambda é um solicição SNS.
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

    if ((event.Records.length > 0) && (event.Records[0].EventSource == 'aws:sns')) {
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
    var messageId     = msg.Sns.MessageId;
    var topicArn      = msg.Sns.TopicArn;
    var topicArnParts = topicArn.split(':');
    var data          = JSON.parse(msg.Sns.Message);

    // Montar objeto do comando
    var cmd = {
        id     : topicArnParts[topicArnParts.length-1],
        origem : 'sns',
        data,
        messageId,
    };

    await app.events.emit('command', cmd);
    
    return true;
}

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 */
module.exports = {
    runMessages,
    isEvent
};