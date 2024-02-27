const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());

const port = 3000;

const url = 'https://www.mediotiempo.com/futbol/liga-mx/calendario';

app.get('/resultados', async (req, res) => {
    let response = await responsex();
    response.shift();
    res.send(response);
  });
  
  app.listen( port , () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });

  let responsex = async function () {

    const dataAux = [];
    const rowData = [];
    
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const tabla = $('body').find('table');


        if (tabla.length > 0) {
            tabla.find('tr').each((index, row) => {

                const cells = $(row).find('td');

                cells.each((cellIndex, cell) => {
                    $(cell).find("span").each((i,name)=>{
                            rowData.push($(name).text());
                     })
                });
                dataAux.push(dataObject(rowData));
                rowData.splice(0, rowData.length);
            });
            
            return dataAux;

        } else {
            return [{"equipo1":"","equipo2":"","resultado":""}];
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        return [{"equipo1":"","equipo2":"","resultado":""}];
    }
};


let dataObject = (data) => {
    switch(data.length){
        case 8:
            return {"equipo1":data[3],"equipo2":data[5],"resultado":data[4]}
        default:
            return {"equipo1":data[2],"equipo2":data[4],"resultado":data[3]}
    }

}