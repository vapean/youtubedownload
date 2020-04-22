const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
// creamos una funcion autoejecutada para tener un contexto asincrono
(async () => {
    // obtenemos el html de la página con axios
    const response = await axios.get('https://www.youtube.com/results?search_query=calle+13')
    // const response = await axios.get('https://www.youtube.com/feed/trending')

    // iniciamos cheerio pasando el html obtenido de axios
    const $ = cheerio.load(response.data);
    // obtenemos la lista de videos
    const listaVideos = $('.yt-lockup-content');

    const videos = [];
    // iteramos la lista de videos
    listaVideos.each((i, elem) => {
        // de cada uno de los elementos html buscamos los elementos con la clase que tiene el título (de ellos sacamos el texto )
        const title = $(elem).find('.yt-uix-tile-link').text().trim();
        // controlamos si es algun elemento intercalado que no corresponda
        if (!title) return
        const url = $(elem).find('.yt-uix-tile-link').attr('href')
        const chanel = $(elem).find('.yt-lockup-byline').children('a').text().trim()

        videos.push({
            title: title,
            url: 'http://www.youtube.com' + url,
            chanel: chanel
        })



    })

    
    inquirer.prompt([
        {
            type: 'list',
            name: 'selectedVideo',
            message: 'selecciona el video que quieras descargar',
            choices: videos.map((item, i) => ({
                name: `Video ${i + 1} - ${item.title} - ${item.chanel}`,
                value: item
            }))
        }
    ]).then(answers => {
        console.log(answers['selectedVideo']);
        
    })

})()