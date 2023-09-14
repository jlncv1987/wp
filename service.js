const api = require("./api");


const confirmSentMessageWp = async (json) => {
    return api.executeDatatable("USP_MEDIOCONTACTO_WHATSAPP_CONFIRMA",{json:json});
}

const getWBPending = async (debug=false) => api.executeDatatable("USP_SEL_WHATSAPP_J",{debug})

const bot = async (idSession, Texto, idTiposMedioContacto, IdentificadorMedio) => {
    return api.executeDatatable("USP_BOT_DAM",{idSession, Texto, idTiposMedioContacto, IdentificadorMedio});
}

const addGroup = async (MESSAJE, idSession, Texto, phone) => {
    console.log("addGroup ",{MESSAJE, idSession, Texto , phone});
    return api.executeDatatable("USP_INS_GRUPO_WHATSAPP",{ MESSAJE, idSession, Texto , phone});
}


module.exports = {
    confirmSentMessageWp
    , getWBPending
    , bot
    , addGroup
}