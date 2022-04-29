// Place your server entry point code here
var args = require('minimist')(process.argv.slice(2))

if(args.help || args.h){
    console.log(`
    server.js [options]
    
    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
    
    --debug	If set to true, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                false.
    
    --log		If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
    
    --help	Return this message and exit.
    `)
    process.exit(0)
}

args['port'] 

const port = args.port || process.env.port || 5000

const morgan = require('morgan')

const fs = require('fs')

const logdb = require('./src/services/database.js')

const express = require('express')

const app = express()

const log = args.log || 'true'

if(log == true){
    const accesslog = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: accesslog }))
}
    
app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = logdb.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, 
        method, url,  protocol, httpversion, status, 
        referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    const info = stmt.run(logdata.remoteaddr.toString(), 
    logdata.remoteuser, logdata.time, logdata.method.toString(), 
    logdata.url.toString(), logdata.protocol.toString(), logdata.httpversion.toString(), 
     logdata.status.toString(), logdata.referer,
     logdata.useragent.toString())
    next()
})

if (args.debug){
    app.get('/app/log/access', (req, res) =>{
        try{
            const stmt = logdb.prepare(`SELECT * from accesslog`).all()
            res.status(200).json(stmt)
        } catch (e){
            console.log(e)
        }
    })
}

app.get('/app/error', (req, res) => {
    throw new Error('Error test was successful') 
})

app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
})

function coinFlip() {
    let num = Math.random()
    if(num > 0.50){
      return "heads"
    }
    return "tails"
}

function coinFlips(flips) {
    let result = [] 
    for(let i = 0; i < flips; i++){
      let num = Math.random()
      if(num > 0.50){
        result[i] = "heads"
  
      } else {
        result[i] = "tails"
      }
    }
    return result
}

function countFlips(array) {
    let count = {heads: 0, tails: 0}
    for(let i =0; i < array.length; i++){
      if(array[i] == "heads"){
        count.heads += 1
      } else {
        count.tails += 1
      }
    }
    return count
}

function flipACoin(call) {
    let toss = coinFlip()
    let outcome = ""
    if(toss == call){
      outcome = "win"
    } else {
      outcome = "lose"
    }
    return {call: call, flip: toss, result: outcome}
}

//a02 functions end

//app endpoints start

app.get('/app/flip/call/tails', (req, res) => {
    const resultFlip = flipACoin('tails')
    res.status(200).json({ 'call' : resultFlip.call, 'flip': resultFlip.flip, 'result': resultFlip.result})
})

app.get('/app/flip/call/heads', (req, res) => {
    const resultFlip = flipACoin('heads')
    res.status(200).json({ 'call' : resultFlip.call, 'flip': resultFlip.flip, 'result': resultFlip.result})
})

app.get('/app/flips/:number', (req, res)=> {
    const resultFlips = coinFlips(req.params.number)
    res.status(200).json( {'raw' : resultFlips, 'summary' : countFlips(resultFlips)})
})

app.get('/app/flip/', (req, res) => {
    res.status(200).json({'flip': coinFlip()})
})