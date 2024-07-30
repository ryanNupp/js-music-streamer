import axios from 'axios';
import Bottleneck from 'bottleneck';
import 'dotenv/config';

const APP_NAME = process.env.APP_NAME;
const APP_VERSION = process.env.APP_VERSION;
const APP_MAIL = process.env.APP_MAIL;
const limiter = new Bottleneck({
    minTime: 1000   // 1 request per second (as per MusicBrainz API rules)
});

export async function mbApiSearch(queryType, query) {
    const response = await limiter.schedule(() => {
        return axios.get(`https://musicbrainz.org/ws/2/${queryType}/?query=${query}&fmt=json`, {
            headers: { 'User-Agent':`${APP_NAME}/${APP_VERSION} ( ${APP_MAIL} )` }
        });
    });
    return response.data;
}

export async function mbApiLookup(lookupRequest, id, ...inc) {
    // all inc to string, to go in url
    let incString = "";
    inc.forEach(incVal => {
        incString+=incVal
        incString+='+'
    });
    incString = incString.slice(0, -1);

    const response = await limiter.schedule(() => {
        return axios.get(`https://musicbrainz.org/ws/2/${lookupRequest}/${id}?inc=${incString}&fmt=json`, {
            headers: { 'User-Agent':`${APP_NAME}/${APP_VERSION} ( ${APP_MAIL} )` }
        });
    });
    return response.data;
}

// TODO: write function to download images from Cover Art Archive API (reduce package count & reliance on musicbrainz-api since it doesn't work half the time)