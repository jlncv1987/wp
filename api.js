const axios = require('axios');

// URL de la API
const host = "https://host.com.ar"
const apiUrl = `${host}/api/`;
const apiUrlTest = 'http://localhost:996/api/';


// Hacer la solicitud POST con los parámetros
async function post(endpoint, parametros) {
    return axios.post(`${apiUrl}${endpoint}`, parametros)
        .then(function (respuesta) {            
            console.log(`Response: ${JSON.stringify(respuesta.data)}`);
            return respuesta.data;
        })
        .catch(function (error) {
            console.error(`Error en la solicitud : ${endpoint} -> ${error}, ${parametros}`);
            return {Error :error, resultado:[]};
        });
}

async function executeDatatable(_sp, _params){    
    let parametros = {
        spName: _sp
        , parametros: _params
    }
    let res =  await post('EjecutarSP/DataTable/',parametros);
    errorHandler(res);
    return Promise.resolve(res);
}

function errorHandler(obj) { if (obj.Error && obj.Error != "") console.error(`Hubo un error ${obj.Error}`)};

module.exports = {
    post
    , executeDatatable
}
