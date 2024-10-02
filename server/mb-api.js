import axios from 'axios';
import Bottleneck from 'bottleneck';
import 'dotenv/config';

const APP_NAME = process.env.APP_NAME;
const APP_VERSION = process.env.APP_VERSION;
const APP_MAIL = process.env.APP_MAIL;
const limiter = new Bottleneck({
    minTime: 1000   // 1 request per second (as per MusicBrainz API rules)
});

// get data from a search request on musicbrainz api
// (rate limited 1 req/sec according to their rules using Bottleneck)
export async function mbApiSearch(queryType, query) {
    const response = await limiter.schedule(() => {
        return axios.get(`https://musicbrainz.org/ws/2/${queryType}/?query=${query}&fmt=json`, {
            headers: { 'User-Agent':`${APP_NAME}/${APP_VERSION} ( ${APP_MAIL} )` }
        });
    });
    return response.data;
}

// get data from a lookup request on musicbrainz api
// (rate limited 1 req/sec according to their rules using Bottleneck)
export async function mbApiLookup(lookupRequest, id, ...inc) {
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

// get cover art archive api info on a release given it's MBID
// for time being, no rate limiting for cover art archive (CAA has no rate limiting rules)
export async function caaApiGetCovers(id) {
    const response = await axios.get(`https://coverartarchive.org/release/${id}`);
    return response.data;
}