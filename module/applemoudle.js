const axios = require('axios');
const { appletoken } = require('../jsonfile/config.json');


exports.playlist =  async function (inpout) {
    let json = []
    let baseurl = "https://api.music.apple.com/v1/catalog/kr/playlists/";
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + appletoken
      }
    baseurl = baseurl.concat(inpout);
    try {
        for (let index = 0; ; index++) {
            const test = await axios.get(baseurl, {headers})
            if(index == 0){
                try {
                    const off = test.data.data[0].relationships.tracks.next.replace('/v1/catalog/kr/playlists/' + id ,'');
                    baseurl = baseurl.concat(off);
                    for (let index = 0; index < test.data.data[0].relationships.tracks.data.length; index++) {
                        json.push({
                            artist : test.data.data[0].relationships.tracks.data[index].attributes.artistName,
                            title : test.data.data[0].relationships.tracks.data[index].attributes.name
                        })
                    }
                }catch{
                    for (let index = 0; index < test.data.data[0].relationships.tracks.data.length; index++) {
                        json.push({
                            artist : test.data.data[0].relationships.tracks.data[index].attributes.artistName,
                            title : test.data.data[0].relationships.tracks.data[index].attributes.name
                        })
                    }
                    break;
                }
            }else{
                try {
                    const off = test.data.next.replace('/v1/catalog/kr/playlists/' + id   ,'').replace(baseurl,'');
                    const baseurld = "https://api.music.apple.com/v1/catalog/kr/playlists/" + id;
                    baseurl = baseurld.concat(off);
                    for (let index = 0; index < test.data.data.length ; index++) {
                        json.push({
                            artist : test.data.data[index ].attributes.artistName,
                            title : test.data.data[index ].attributes.name
                        })
                    }
                } catch (error) {
                    for (let index = 0; index < test.data.data.length ; index++) {
                        json.push({
                            artist : test.data.data[index ].attributes.artistName,
                            title : test.data.data[index ].attributes.name
                        })
                    }
                    break;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
    return json
}

exports.albume_song =  async function (input) {
    let json = []
    let baseurl = "https://api.music.apple.com/v1/catalog/kr/songs/";
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + appletoken
    }
    baseurl = baseurl.concat(input);
    const test = await axios.get(baseurl, {headers})

    json = test.data.data[0].attributes.artistName + ' '+ test.data.data[0].attributes.name
    return json
}


exports.albume =  async function (input) {
    let json = []
    let baseurl = "https://api.music.apple.com/v1/catalog/kr/albums/";
    const headers = {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + appletoken
    }
    baseurl = baseurl.concat(input);
    const test = await axios.get(baseurl, {headers})
    for (let index = 0; index < test.data.data[0].relationships.tracks.data.length; index++) {
        json.push({
            artist : test.data.data[0].relationships.tracks.data[index].attributes.artistName,
            title : test.data.data[0].relationships.tracks.data[index].attributes.name
        })
    }
    return json
}