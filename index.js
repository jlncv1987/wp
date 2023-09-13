//import * as api from './api';
const service = require("./service");
const wp = require("whatsapp-web.js");
const Client = wp.Client;
const qrcode = require("qrcode-terminal");

let client;
const init = async () => {
    client = new Client({ authStrategy: new wp.LocalAuth({ clientId: "interbook" })});
    client.on('qr', (qr) => { qrcode.generate(qr, { small: true }); });   
    client.initialize();
    client.on('message', async message => {
        const { from, to, body, id } = message;
        let chat = await message.getChat();
        var isGroup = chat.isGroup;
        var estados = from.split("@")[1].includes("broadcast");
        if (body && !isGroup && !estados) {
            service.bot(from, body, 5, from.split("@")).then(async res => {
                await service.confirmSent(JSON.stringify(message));               
                let {resultado} = res; 
                if (resultado.length > 0) {       
                    let {Respuesta } = resultado[0]; 
                    if (Respuesta.includes("{")) {
                        let obj = JSON.parse(Respuesta)
                        let list = new List(obj.bodyList, obj.buttonText, obj.sections, obj.titleList);
                        client.sendMessage(from, list);
                        return;
                    }
                    client.sendMessage(from, Respuesta);
                }
            })
        }

        if (body && isGroup && !estados) 
            await service.addGroup(JSON.stringify(message), from, body, from.split("@"));

    });
    client.on('message_ack', async (msg, ack) => {
        const { from, to, body, id } = msg;
        const { id: unique } = id;
        /*
            == ACK VALUES ==
            ACK_ERROR: -1
            ACK_PENDING: 0
            ACK_SERVER: 1
            ACK_DEVICE: 2
            ACK_READ: 3
            ACK_PLAYED: 4
        */
        //dbSync.confirmSent(JSON.stringify(msg));
        await service.confirmSentMessageWp(JSON.stringify(msg));
    });
    client.on('ready', async () => {
        console.log('Client is ready!');
        setInterval( async () => {
            console.log("Iniciando get WhatsApp Pending ", new Date());
            let _data = (await service.getWBPending(true)).resultado;            
            if (_data.length > 0) {
                console.log("Iniciando Iteracion ...");
                for (let i = 0; i < _data.length; i++) {
                    console.log(`Intentando procesar indice ${i}`);
                    try {
                        let phone = _data[i].isGroup ? `${_data[i].phoneWhatsapp}@g.us` : `${_data[i].phoneWhatsapp}@c.us`
                        let result = await client.sendMessage(phone, `${_data[i].titleWhatsapp ? _data[i].titleWhatsapp : ""}\n${_data[i].bodyWhatsapp ? _data[i].bodyWhatsapp : ""}`);
                        console.log(`WhatsApp message sent to ${_data[i].phoneWhatsapp}`);
                        result.idWhatsapp = _data[i].idWhatsapp;
                        await service.confirmSentMessageWp(JSON.stringify(result));                        
                    } catch (err) {
                        let error = `Error WhatsApp message sent to ${_data[i].phoneWhatsapp} \n${err}`;
                        await service.confirmSentMessageWp(JSON.stringify({ Error: error, idWhatsapp: _data[i].idWhatsapp }));
                        console.log(error);
                    }
                    console.log(`Fin Intentando procesar indice ${i}`);
                }
                console.log("Fin Iniciando Iteracion ...");
            }
            console.log("Fin Iniciando get WhatsApp Pending ");
        }, 30000);
    });
}

init();