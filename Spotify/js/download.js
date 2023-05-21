const options = {
    headers: {
        'Content-Type': 'application/json'
    }
};
let dow_num = 0
let act;
let checkResponse;
async function download(id) {
    if (dow_num == 0) {
        alert(`Вы точно хотите скачать песню: ${active_obj.name}?`)
        act = active_obj
        dow_num = 1
        const trackInfo = await axios.get(`https://api.soundloaders.com/spotify/track?url=https://open.spotify.com/track/${id}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "authorization": "Basic bjZfLUg3eDJuc2VVcUhOcG9DY2FNS2dmOk5oVVA0NyFRc0NKeUhzSnhUblZtLkJWaw=="
            },
        });
        const downloadResponse = await axios.post('https://api.soundloaders.com/download/track', {
            downloader: "spotify",
            metadata: trackInfo.data
        }, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "authorization": "Basic bjZfLUg3eDJuc2VVcUhOcG9DY2FNS2dmOk5oVVA0NyFRc0NKeUhzSnhUblZtLkJWaw=="
            },
        });
        let izbranyItem
        let checkInterval = setInterval(async () => {
            checkResponse = await axios.get(`https://api.soundloaders.com/download/check/${downloadResponse.data.id}?type=track`, {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "authorization": "Basic bjZfLUg3eDJuc2VVcUhOcG9DY2FNS2dmOk5oVVA0NyFRc0NKeUhzSnhUblZtLkJWaw=="
                },
            });
            let path = checkResponse.data.data.path;
            if (path !== undefined) {
                download_src = path
                clearInterval(checkInterval);
                clear()
                clearInterval(checkInterval);
                let response = await axios.get(path, {
                    responseType: 'blob',
                });
                downloadMusic(response.data, trackInfo.data.name, path)
            }
        }, 2000);
        function clear() {
            clearInterval(checkInterval);
        }
        async function downloadMusic(dataurl, name, fullurl) {
            clearInterval(checkInterval);
            const url = window.URL.createObjectURL(dataurl);
            const a = document.createElement('a');
            a.href = url;
            a.download = `I provide you: ${name}`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            delete a;
            window.URL.revokeObjectURL(url);
            alert(`Песня ${name} скачана !`)
            dow_num = 0
            download_music_arr.unshift(act)
            download_music_arr[0].album.release_date = date()
            download_music_arr[0].preview_url = download_src
            if (download_music_arr.length > 0) {
                download_music_arr = remove_duplicates(download_music_arr)
                localStorage.setItem('Download Songs', JSON.stringify(download_music_arr))
            }
        }
    } else {
        console.log(checkResponse.data.position);
        if (checkResponse.data.position != null) {
            alert(`Пожалуйса подождите, песня ${act.name} скачивается.\n Ваша очередь: ${checkResponse.data.position}`)
        }else {
            alert(`Пожалуйса подождите, песня ${act.name} скачивается.\n Ваша очередь: 0`)
        }
    }
}
