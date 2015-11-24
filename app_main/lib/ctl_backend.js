/*
==============================================================================
\  / Process control HTTP channel on `localhost` (i.e. 127.*.*.*):
 \/  URL: 'http://' + cfg.backend.ctl_host + ':' + cfg.backend.ctl_port
 /\  This scheme: child.kill([signal]), where signals can be 'SIGTERM' or 'SIGHUP'
 \/  is very old non cross platform way of child process control.
 /\  Here is HTTP server on controlling port
/  \
================================================================================
*/

module.exports = ctl_backend

function ctl_backend(cfg, stat, uncaughtExceptions, run_backend){
var ipt  = require('util').inspect
var J = JSON, B = Buffer, p = process// cache global names
var LOCALHOST = cfg.backend.ctl_host || '127.0.0.1'

var ctl = require('http').createServer(
function proc_ctl_http_serv(req, res){
var body = ''

    res.on('close', proc_ctl_res_unexpected_close)

    log('ctl req url:' + req.url)
    if ('/sts_running' == req.url){
        body += uncaughtExceptions.join('\n====\n')
    } else if('/cmd_reload' == req.url){
        body += '$ is reloading\n'
        the_end(0)// fall thru
    } else if('/cmd_exit' == req.url){
        return call_done_handlers(req, res, done_handlers)
    } else if ('/cmd_stat' == req.url){
        stat.uptime = p.uptime()
        body += J.stringify(stat)// stats, health, monitoring, metrics
    } else {// show some info about this
        body += '? pid: ' + p.pid +
        '\ncontrol channel resourses:\n' +
        '\n"sts_running", "cmd_stat", "cmd_exit"' +
        '\n\n' +
        'application under control is at HTTP port: ' + cfg.backend.job_port + '\n'
    }
    // use vanilla `res` (no `res.json` or `res.txt`)
    res.writeHead(200,{'Content-Length': B.byteLength(body),'Content-Type':'text/plain'})
    return res.end(body)
})

ctl.on('listening',
function proc_ctl_http_serv_listening(){
    ctl = stat.started = new Date()// fill `ctl` as running flag
    log(
        '^ backend http proc ctl @ http://' + LOCALHOST + ':' + cfg.backend.ctl_port + '\n' +
        ctl.toISOString()
    )
    // strict chaining: listening -> app run -> etc...
    setImmediate(run_backend)// schedule this call to throw errors outside
})

ctl.on('error',
function proc_ctl_http_serv_error(e){
// NOTE: net error handler must not be inside init(listen) callback!!!
    if('EADDRINUSE' == e.code){// 'EADDRNOTAVAIL'?
        log(
            "!!! FATAL(ctl): can't listen host:port='" + LOCALHOST + "':" + cfg.backend.ctl_port +
            "\n" + ipt(e) +
            "\nNOTE: check config 'ctl_port' option collision"
        )
    } else {//FIXME: handle all fatal errors to unset `ctl` and process.exit()
        log("! ERROR(ctl) controlling http channel: " + ipt(e))
    }
    if (!ctl) the_end(1)
})

ctl.on('clientError',
function proc_ctl_client_error(e, sock){
    log("! ERROR(ctl) in client connection: " + ipt(e))
})

function proc_ctl_res_unexpected_close(){
    log('! ERROR(ctl) aborted request')
}

var done_handlers = [ ], allow = true

cfg.backend.ctl_on_done = function ctl_on_done(handler){
    if(!handler || 'function' != typeof handler){
        allow = false// stop accepting done callbacks
        return
    }
    if(allow){
        done_handlers.push(handler)
    }
    return
}

function call_done_handlers(req, res, arr, signum){
var i, n, code, call

    n = arr.length, code = signum, call = ''

    // setup res, write partials in callbacks
    res && (
        res.writeHead(200, {'Content-Type': 'text/plain'}),
        res.write('$ application is going down\n')
    )

    if(0 == n){
        res && res.end()
        the_end(0)
        return
    }

    for(i = 0; i < n; ++i) try {
        arr[i](callback)
    } catch(ex){
        code += 1 + i
        call += '! exception in called: ' + (arr[i] && arr[i].name) + '\n'
        log(call, ex)
    }
    return call && callback()

    function callback(err, data){
        err  && log('! end error at #' + (code = n) + ': ', err)
        data && res && res.write(data) && res.write('\n')
        call && (call = '', res && res.write(call))
        if(0 === --n){
            res && res.end()
            the_end(code)
        }
    }
}

function the_end(code){
    setTimeout(function(){
        log((code ? '!' : '') + '$ application exit with code: ' + (code || 0))
        p.exit(code || 0)
    }, 16)
}

ctl.listen(cfg.backend.ctl_port, LOCALHOST)
ctl.unref()// "allow the program to exit if this is the only active server in the event system"
ctl = null// setup is over, waiting for 'listening' event, `ctl` is running flag

p.once('SIGTERM', function SIGTERM(){
    log('! got SIGTERM')//SIGTERM 15
    call_done_handlers(null, null, done_handlers, 128 + 15)
})

p.once('SIGINT', function SIGINT(){
    log('! got SIGINT')//SIGINT 2
    call_done_handlers(null, null, done_handlers, 128 + 2)
})

p.once('SIGHUP', function SIGHUP(){
    log('! got SIGHUP')//SIGHUP 1
    call_done_handlers(null, null, done_handlers, 128 + 1)
})

}
