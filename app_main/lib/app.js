/*
 * Business logic HTTP API served by `connectjs` for node-webkit(local UI)
 * and for browsers(remote UI)
 */

module.exports = runApp

function runApp(cfg, uncaughtExceptions){
var api      = require('./api.js')
   ,sendFile = require('./middleware/sendFile.js')
   ,_404     = require('./middleware/404.js')
   ,connect  = api.connect = require('connect')
   ,app      = api.app = connect()
   ,rootPrefix = "", l10nFiles = [ ]
   ,mwConfig, Modules

    // provide api to assign final handlers
    if(cfg.backend.ctl_on_done){
        api.ctl_on_done = cfg.backend.ctl_on_done
        cfg.backend.ctl_on_done = null
    }
    /* `l10n` files middleware factory for app modules */
    api.mwL10n = require('./middleware/l10n.js')
    /* UI/ExtJS per-user/role config changer */
    api.set_mwConfig = set_mwConfig
    set_mwConfig()// setup the simplest one

    /* Add own middlewares */

    connect.sendFile = sendFile
    connect._404 = _404

    /* Application middleware setup */

    app.use(connect.cookieParser())
    app.use(connect.json())
    app.use(require('./middleware/postTextPlain.js'))

    /* ExtJS for HTTP users */
    remote_extjs_cfg()

    app.use('/app_back.js' , _404)// hide
    app.use('/app_front.js' , sendFile('app_front_http.js'))// switch to web UI

    require('../../app_modules/')(cfg, api)

    /* backend static files for HTTP users */
    cfg.oem && oem_files()
    app.use('/l10n/configured.js', sendFile('/l10n/' + cfg.lang + '.js'))
    app.use('/', connect['static'](__dirname + '/../', {
        index: cfg.extjs.loadMiniInit ? 'app-mini.htm' : 'app.htm'
    }))

    app.use('/uncaughtExceptions', mwUncaughtExceptions)
    app.use('/test.js', sendFile('test.js'))
    /* final stage: error path */
    app.use(require('./middleware/errorHandler.js'))
       .use(_404)// no middleware handled request
    .listen(cfg.backend.job_port, function app_is_up_and_running(){
        log('^ app is up and running @ port ' + cfg.backend.job_port + '\n' +
            new Date().toISOString()
        )
    })
    .timeout = (1 << 23)// default timeout for long events waitings requests

    if(api.getModules){// default reference to all (being loaded later) modules
        Modules = api.getModules()
    }

    return

    // apply oem config (see 'cfg_default.js') to files with text to change
    function oem_files(){
    var f, i, c, k, s, fs = require('fs')

        rootPrefix = (s = require('path').normalize(
            __dirname + '/../../' + (cfg.data || '.data/')
        )) + (cfg.__name || '') + '_'
        // check data dir
        f = "D"
        try {
            if(fs.statSync(s).isDirectory()){
                f = ""// OK
            } else {
                log('!ERROR data dir is not a directory')
                process.exit(1)
            }
        } catch(ex){ }
        // create if needed
        if(f) try {
            fs.mkdirSync(s)
        } catch(ex){
            log('!ERROR creating data dir')
            process.exit(1)
        }
if(cfg.oem.htm){
        // read 'app.htm'
        f = __dirname + '/../app.htm'
        s = fs.readFileSync(f).toString()
        // replace oem strings
        cfg.oem.htm.title && (s = s.replace(/<title>[^<]*<[/]title>/g, '<title>'+ cfg.oem.htm.title +'</title>'))
        cfg.oem.htm.logo && (s = s.replace(/url[(]css[/]supro.png[)]/, 'url('+ cfg.oem.htm.logo +')'))
        if(cfg.oem.htm.icon){
            s = s.replace(/<!-- "Yellow[^>]*>/g,'')// remove credit
            s = s.replace(/<link rel="icon"[^>]*>/g,'<link rel="icon" href="' + cfg.oem.htm.icon + '"/>')
        }
        // compare old and new files
        f = rootPrefix + 'app.htm'
        try {
            c = fs.readFileSync(f).toString()
        } catch(ex) { }
        // write to /data dir if changed
        if(c !== s){
            log('^ Write new OEM "app.htm"')
            fs.writeFileSync(f, s)
        }

        // read 'app-mini.htm'
        // NOTE: copy + paste of the above
        f = __dirname + '/../app-mini.htm'
        s = ""
        try{
            s = fs.readFileSync(f).toString()
        } catch(ex){ }
    if(s){
        // replace oem strings
        cfg.oem.htm.title && (s = s.replace(/<title>[^<]*<[/]title>/, '<title>'+ cfg.oem.htm.title +'</title>'))
        cfg.oem.htm.logo && (s = s.replace(/url[(][/]css[/]supro.png[)]/, 'url('+ cfg.oem.htm.logo +')'))
        if(cfg.oem.htm.icon){
            s = s.replace(/<!-- "Yellow[^>]*>/,'')// remove credit
            s = s.replace(/<link rel="icon"[^>]*>/,'<link rel="icon" href="' + cfg.oem.htm.icon + '"/>')
        }
        // compare old and new files
        f = rootPrefix + 'app-mini.htm'
        try {
            c = fs.readFileSync(f).toString()
        } catch(ex) { }
        // write to /data dir if changed
        if(c !== s){
            log('^ Write new OEM "app-mini.htm"')
            fs.writeFileSync(f, s)
        }
    }
}

if(cfg.oem.l10n){
        // l10n
        k = Object.keys(cfg.oem.l10n)
        for(i = 0; i < k.length; ++i){
            f = __dirname + '/../l10n/' + k[i] + '.js'
            s = fs.readFileSync(f).toString()
            c = cfg.oem.l10n[k[i]].welcome
            c && (s = s.replace(/welcome: '[^']*/, "welcome:'" + c))
            c = cfg.oem.l10n[k[i]].app
            c && (s = s.replace(/app: '[^']*/, "app:'" + c))

            // compare old and new files
            f = rootPrefix + k[i] + '.js'
            try {
                c = fs.readFileSync(f).toString()
            } catch(ex) { }
            // write to /data dir if changed
            if(c !== s){
                log('^ Write new OEM l10n "'+ k[i] +'.js"')
                fs.writeFileSync(f, s)
            }
            l10nFiles.push('/l10n/' + k[i] +'.js')
        }
}
        // send them if requested in mw stack from /data dir
        app.use('/', mwRootDir)
        // send oem config into ui for background reset if needed
        cfg.oem && (cfg.extjs.oem = cfg.oem)
    }

    function mwRootDir(req, res, next){
        if('/' == req.url){
            return sendFile(rootPrefix + (
                cfg.extjs.loadMiniInit ? 'app-mini.htm' : 'app.htm'
            ), true)(req, res, next)
        }
        if('/app.htm' == req.url){
            return sendFile(rootPrefix + 'app.htm', true)(req, res, next)
        }

        if(~l10nFiles.indexOf(req.url)){
            return sendFile(rootPrefix + req.url.slice(6), true)(req, res, next)
        } else if('/l10n/configured.js' == req.url){
            return sendFile(rootPrefix + cfg.lang + '.js', true)(req, res, next)
        }
        return next()
    }

    function set_mwConfig(mw){
        mwConfig = mw || addModulesConfigs

        return cfg// return global config to (any) auth module

        function addModulesConfigs(req, res){
        var i, j, k

            if(Modules){// default all-for-all setup (auth module overwrites this)
                cfg.extjs.modules = { }
                for(i in Modules){
                    k = Modules[i]
                    if(k.css) for(j = 0; j < k.css.length; ++j){
                        cfg.extjs.launch.css.push(k.css[j])
                    }
                    if(k.js) for(j = 0; j < k.js.length; ++j){
                        cfg.extjs.launch.js .push(k.js[j])
                    }
                    cfg.extjs.modules[i] = { extjs:{ }}
                    for(j in k.cfg.extjs){
                        cfg.extjs.modules[i].extjs[j] = k.cfg.extjs[j]
                    }
                }
                Modules = null
            }

            return res.json(cfg.extjs)
        }
    }

    function use_mwConfig(req, res, next){
        return mwConfig(req, res, next)
    }

    function mwUncaughtExceptions(req, res){
        if(req.json){
            return res.json(
                'clear' == req.json ? uncaughtExceptions.splice(0):
                                      uncaughtExceptions
            )
        }
        return res.txt(uncaughtExceptions.join('\n====\n'))
    }

    function remote_extjs_cfg(){
        if(cfg.backend.extjs.pathFile){
            cfg.extjs.path = require('fs').readFileSync(cfg.backend.extjs.pathFile)
                                          .toString().trim()
        }
        cfg.extjs.path = __dirname + '/../../' + cfg.extjs.path
        app.use('/extjs/',                  connect['static'](cfg.extjs.path))
        app.use('/extjs/docs/extjs-build/', connect['static'](cfg.extjs.path))
        cfg.extjs.path = '/extjs/'// switch local to external http path
        app.use('/app.config.extjs.json', use_mwConfig)// provide isolated cfg
    }
}
