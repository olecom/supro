function errorHandler(err, req, res, next){
var idx

    if(!err) return next()
    if (err.status) res.statusCode = err.status
    if (res.statusCode < 400) res.statusCode = 500

    log(new Date().toISOString() + ' errorHandler: ', err.stack || err)
    log('URL: ', req.originalUrl)// magic place in `connect` for original URL (actual can be parsed)
    log('data: ', req.json || 'null')// log JSON data (from stores, etc.)

    if('string' == typeof err){
        // action err + raw (double error)
        if(0 < (idx = err.indexOf('error index:'))){
            err = err.slice(idx)
        }
    }
    /*else if(('MongoError' == err.name) ||
     *         (err.stack && 0 == err.stack.indexOf('MongoError'))){
     *   // raw DB errors
     *   err = String(err.err)// use short message
     *   if(0 < (idx = err.indexOf('error index:'))){
     *       err = err.slice(idx)
     *   }
    }*/

    if(res._header || res.finished){// `res` was sent already
        res.json = pushUncaughtException
    }

    return res.json({
        url: req.originalUrl,
        err: '' + (err.stack || err)// compatible with 'App.proxy.CRUD'
        //data: undefined [not used]
        //success: undefined [not used]
    })
}

module.exports = errorHandler
