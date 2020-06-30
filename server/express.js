import express from "express"
const server = express()
import path from "path"
const expressStaticGzip = require("express-static-gzip")
import webpack from "webpack"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"

import configDevClient from "../config/webpack.dev-client.js"
import configDevServer from "../config/webpack.dev-server.js"
import configProdClient from "../config/webpack.prod-client.js"
import configProdServer from "../config/webpack.prod-server.js";
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import randomstring from 'randomstring';

import config from "./config";
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import User from './models/User';

const http = require('http');
const https = require('https');

require("dotenv").config();

const morgan = require("morgan");

mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD
  })
  .then(() => {
    console.log('Connection to DB successful');
  }).catch(err => {
    console.log(`Connection to DB Error: ${err}`);
  });

mongoose.set('useFindAndModify', false);
server.use(
  cors({
    origin: `${config.hostUrl}`,
    credentials: true
  })
); server.use(morgan("dev"));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const tokenType = authHeader.split(' ')[0];
  if (tokenType !== "Bearer") {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  let currentUser;
  try {
    currentUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!currentUser) {
    req.isAuth = false;
    return next();
  }
  req.currentUser = currentUser;
  req.isAuth = true;

  next();
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
}); server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
})); server.use('/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser, isAuth }) => ({
    schema,
    context: {
      User,
      currentUser,
      isAuth
    },
    formatError: (err) => {
      return err;
    }
  }))
);

server.use(fileUpload());
const getFileType = (fileType) => {
  let ext;
  if (fileType == 'image/jpeg') {
    ext = '.jpg';
  } else if (fileType == 'image/png') {
    ext = '.png';
  }
  return ext;
}

server.post('/upload', function (req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.');
  let dir = './public/user-profile/';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  var current_files = fs.readdirSync(dir);
  let profilePic = req.files.selectedFile;
  let file_ext = getFileType(profilePic.mimetype);
  let tempFileName = randomstring.generate(21) + file_ext;

  const fileExists = current_files.includes(tempFileName);

  while (fileExists) {
    let string = randomstring.generate(21);
    tempFileName = string + file_ext;

    if (!current_files.includes(tempFileName)) {
      break;
    }
  }

  let send_filePath = './public/user-profile/' + tempFileName;

  profilePic.mv(send_filePath, function (err) {

    if (err) return res.status(500).send(err);

    const res_dataObj = {
      "newFileName": tempFileName
    }

    res.send(res_dataObj);

  });

}); const nodemailer = require('nodemailer');
server.post("/send-email", (req, res, next) => {
  const form_email = req.body.email;
  const form_name = req.body.name;
  const form_messageHtml = req.body.messageHtml;
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_ADDRESS,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_ID,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from: form_email, to: process.env.ADMIN_EMAIL, subject: 'message from ssr-graphql-boilerplate',
    text: `${form_name} (${form_email})\n\n` + form_messageHtml
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      return res.status(404).json(err)
    } else {
      res.json({
        message: "email sent successfully"
      });
    }
  });
});
const isProd = process.env.NODE_ENV === "production"
const isDev = !isProd
const PORT = process.env.PORT || config.port;
let isBuilt = false

const public_path = path.resolve('wwwroot', '../public/');
server.use('/public', express.static(public_path));

const done = () => {
  if (isBuilt) return
  var socketServer;

  if (config.ssl) {
    socketServer = https.createServer({
      key: fs.readFileSync(config.ssl_key), cert: fs.readFileSync(config.ssl_cert)
    },
      server);
  } else {
    socketServer = http.createServer(server);
  }

  socketServer.listen(PORT, () => {
    isBuilt = true
    console.log(
      `Server listening on http${config.ssl ? 's' : ''}://*.localhost:${PORT}`
    )
  })

  const io = require('./socket').init(socketServer);
  io.on('connection', socket => { });
}

if (isDev) {
  const compiler = webpack([configDevClient, configDevServer])

  const clientCompiler = compiler.compilers[0]
  const serverCompiler = compiler.compilers[1]

  const webpackDevMiddleware = require("webpack-dev-middleware")(
    compiler,
    configDevClient.devServer
  )

  const webpackHotMiddlware = require("webpack-hot-middleware")(
    clientCompiler,
    configDevClient.devServer
  )

  server.use(webpackDevMiddleware)
  server.use(webpackHotMiddlware)

  server.use(webpackHotServerMiddleware(compiler))

  console.log("Middleware enabled")
  done()
} else {
  webpack([configProdClient, configProdServer]).run((err, stats) => {
    const clientStats = stats.toJson().children[0]
    const render = require("../build/prod-server-bundle.js").default
    console.log(
      stats.toString({
        colors: true
      })
    )

    server.use(
      expressStaticGzip("dist", {
        enableBrotli: true
      })
    )

    server.use(render({ clientStats }))
    done()
  })
}
