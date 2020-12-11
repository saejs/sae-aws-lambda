const binaryMimeTypes = require('./webMimeTypes');
const serverlessExpress = require('@vendia/serverless-express');

/**
 * Criar server web para expor o app no lambda.
 * 
 * @param {App} app Objeto da aplicacao.
 * @returns {Object}
 */
const createServer = (app) => {

    const server = serverlessExpress.createServer(app, null, binaryMimeTypes)

    return {
        proxy: (event, context) => {
            return serverlessExpress.proxy(server, event, context);
        }
    };
}

/**
 * Verificar se o evento do lambda é um solicição web (api).
 * 
 * @param {Object} event Evento do gatilho do lambda
 * @param {Object} context Objeto contexto da função do lambda
 * @returns {Boolean}
 */
const isEventWeb = (event, context) => {
    if (!(typeof event == 'object')) {
        return false;
    }

    if ('httpMethod' in event) {
        return true;
    }

    return false;
}

/**
 * Prepara e exporta um aplicativo rhinoJs para ser utilizaod no AWS Lambda.
 */
module.exports = {
    createServer,
    isEventWeb
};