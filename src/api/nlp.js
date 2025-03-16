import request from '@/axios/request.js'

const AK = process.env.VUE_APP_AK
const SK = process.env.VUE_APP_SK

function getAccessToken() {
    let options = {
        'method': 'POST',
        'url': 'baiduApi/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        request(options)
            .then(res => {
                resolve(res.data.access_token)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export default {
    async getKeyWords(text) {
        const url = 'baiduApi/rpc/2.0/nlp/v1/txt_keywords_extraction?access_token=' + await getAccessToken()
        return request.post(url, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'text': [text]
        });
    }
}