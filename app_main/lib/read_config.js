var cfg

if(!process.env.NODEJS_CONFIG) throw ''
+'`process.env.NODEJS_CONFIG` is undefined; `export` it from OS shell for Node.JS.'

try {//TODO: read config from file every require()
    cfg = JSON.parse(process.env.NODEJS_CONFIG)
} catch(ex){
    cfg = (new Function(
        'var config;/* one global variable, any local can be in read file */\n' +
        process.env.NODEJS_CONFIG +
        '; return config ;'
    ))(ex)
}
(cfg.extjs) && (cfg.extjs.launch = { css:[ ], js:[ ]})// setup arrays

module.exports = cfg
