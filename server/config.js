module.exports = {
    // common setting
    port: 4001,
    ssl_key: "privkey.pem",
    ssl_cert: "fullchain.pem",

    // localhost example
    ssl: false,
    server_address: "http://localhost:4001",
    domain: "localhost",

    // domain example
    // ssl: true,
    // server_address: "https://example.com",
    // domain: "example.com",
};