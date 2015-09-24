var ctl, res, len
var http = require('http')

ctl = http.get(// requesting info from remote api
    process.argv[2],// 'url:port/cmd'
    getData
)

ctl.setTimeout(process.argv[3] || 2048)// timeout
ctl.on('socket', function(socket){ socket.emit('agentRemove')})
ctl.on('error', ret_data)
ctl.end()

function getData(ctlres){
    res = [], len = res.length
    ctlres.on('data', get_chunk)// collecting data chunks
    ctlres.on('aborted', ret_data)
    ctlres.on('error', ret_data)
    ctlres.on('end', ret_data)// end of processing
}
function get_chunk(chunk){
    len += chunk.length
    res.push(chunk)
}
function ret_data(e){
    e && console.log('!Error _http.js: ', e)
    setImmediate(function(){
        console.log('_http res:')
        res && (console.log(Buffer.concat(res, len).toString()), res = void 0)
        process.exit(e ? 1 : 0)
    }, 64)
}
