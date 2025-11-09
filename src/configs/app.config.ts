export default {
    //
    isProd: true,
    api: {
        url: Number(process.env.REACT_APP_IS_PROD) ? "https://deliverybackend-production-300a.up.railway.app" : "http://localhost:5000",
        api: "/api"
    },
    // urls: {
    //     prod: 'https://bringa.me',
    //     // dev: 'https://dev.bringa.me',
    //     dev: 'https://localhost:5000',
    //     api: '/api'
    // },
    // backend: {
    //     api: '/api',
    //     prod: {url: 'https://bringa.me'},
    //     dev: {url: 'https://dev.bringa.me'},
    //     // prod: {url: 'http://192.168.1.45:5000'}
    // },
    google: {
        maps: {
            apiKey: 'AIzaSyCjC6fjRhFxNS__wDGytq-xINSYOwt-EwQ'
        },
        captcha: {
            id: '6Lf2MVAhAAAAAIgEejk2ohSrK48oCWTEc4rJEQ3i',
            siteKey: '6LcoKlEhAAAAAHr4Chv37XysguCrsVt0UEIkmiux',
            secretkey: '6LcoKlEhAAAAAAGJ8lJROleORRUOm-HSfzGjBnB-'
        }
    }
}
