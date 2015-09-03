/*
 * Handle request body of 'text/plain' || 'application/javascript'
 * For real world use better get https://github.com/stream-utils/raw-body
 */
var limit, utils

limit = require('connect').limit('4mb')
utils = require('connect/lib/utils.js')

module.exports = function postTextPlain(req, res, next){
var mime, buf, len

    if(!req._body){
        mime = utils.mime(req)
        if('text/plain' == mime || 'application/javascript' == mime){
            req._body = true
            buf = [], len = 0
            return limit(req, res, collect)
        }
    }
    return next()

    function collect(err){
        if(err) return next(err)

        req.on('data', data)
        req.on('aborted', end)
        req.on('close', end)
        req.on('error', end)
        req.on('end', end)
    }
    function data(chunk){
        buf.push(chunk)
        len += chunk.length
    }
    function end(err){
        if(err) log('!postTextPlain: ', err)

        req.removeListener('data', data)
        req.removeListener('aborted', end)
        req.removeListener('close', end)
        req.removeListener('error', end)
        req.removeListener('end', end)

        req.txt = Buffer.concat(buf, len).toString()
        buf = void 0

        next()
    }
}
