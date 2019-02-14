require('dotenv').load();


[
    'NODE_ENV',
    'PORT',
    'HOST',
    'USERNAME',
    'PASSWORD'
].forEach((name) => {
    if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
    }
});



const config = () => {
    const env = process.env.NODE_ENV;
    //server
    const port = Number(process.env.PORT);
    //DB
    const me = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const url = `https://${me}:${password}@${process.env.HOST}`;

    return {
        env,
        server: {
            port
        },
        url
    };
};

module.exports = Object.assign({},
    config()
);
