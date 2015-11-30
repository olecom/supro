// local vars to share in hash (kind of macro preprocessing)
var DB = 'supro_GLOB'// is used in shell, export, import scripts of `supromongod/etc/*`
var OBJ = 'GLOB'// differentiate instances of distributed SUPRO

// NOTE: this arrays `fastLoad` and `defLoad` are being processed
//        by `_ExtJS4_tools.sh` for `config.extjs.loadMiniInit == 'lite'`
var fastLoad = [
    'App',
    'App.backend.Connection',
    // NOTE: when disabling 'userman' update this by hands
    'app_modules/userman/crypto/SHA1.js',
    'app_modules/userman/Login.js'
]

var defLoad = [// `App` default classes to load without auth restrictions
    'App.proxy.CRUD',
    'App.model.Base',          // loading Models manually, then [M]VC
    'App.model.Status',
    'App.store.Status',
    'App.store.CRUD',          // our CRUD for `Ext.data.*`
    'Ext.uxo.BoxReorderer',
    'App.view.Window',         // provide core View Class(es)
    'App.view.Bar',
    'App.view.Desktop',
    'App.view.Viewport',       // provide view.Desktop with status
    'App.controller.Main'
]

// global config
config = {
/* NOTE: this is not JSON just JavaScript
 *       idea is taken from github.com/louischatriot/mongo-edit
 */
    __name: 'cfg_mongo_lftp',

    /* standard configuration of extjs+node[.js -webkit] application */
    lang: 'ru',// base localization, must be provided by any module as fallback
    data: 'data/',// directory for application data; defaults to 'data/'
    log: 'log/',

    //TODO: uid gid new ids for process after start or partial init
    //TODO: connect `fastLoad` with 'extjs-mini-init-files.txt'
    modules:{// cfg for stack of things from 'app_modules'
    // order matters: before auth module there are no restrictions to config

    // NOTE config: one level copy of this properties into default settings
        suprolftpd:{// hardcoded data path is '$PWD/data/suprolftpd/'
            OBJ:OBJ
        },
        supromongod:{
            db_path: '/data/supromongod/' + OBJ + '/',
            db_name: DB// as in depended modules
        },
    // auth module overwrites default and sets up per-user auth module loading
        userman:{//#0: authentication and authorization (plus Chat)
            store: 'fs' // TODO: fs || db
            //sess_maxage: //null: browser lifetime; default: ~9.3 hours one working day
           ,sess_puzl: 'puzzle-word$54321X'
           ,data: '/data/um/'// store fs: chat logs
           ,rbac:{
               can:{// list of permissions with arbitrary positive value
                    'module.example': true
                   ,'modile.shoesupro': true
                }
               ,roles:{
                    'user.test':[
                        'module.example'// select this `can`, etc.
                       ,'App.um.wes', '/um/lib/wes'// NOTE: include this for any role
                       ,'App.um.controller.Chat', 'App.um.view.Chat'
                       ,'/um/lib/chat'
                    ]
                }
               ,users:{
                    'utest':{
                        pass: '9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684',
                        roles:[ 'user.test' ],
                        name: 'Test User'
                    }
                }
            },
            extjs:{
                wes:{// wait events
                     // this in UI: `App.cfg.modules.userman.extjs.wes.timeout`
                    timeout: 7777777,// 2.16 hours vs max on backend: (1 << 23) = 2.33
                    defer: 77777// if error on minute and half
                }
            }
        }
       /* after auth anything can go in no particular order */
       ,example: true
       ,pingback: true
       ,shoesupro:{
           OBJ:OBJ,    // same as in `suprolftpd`
           db_name: DB,// same as in `supromongod`
           dependencies:{ userman: '+', supromongod: '+', suprolftpd: '+' }
        }
    },
    extjs:{
        path: 'extjs-4.2/',// find and provide this path; 'extjs/' is for web
        launch:  null,/*{ css:[ ], js:[ ]} loaded after ExtJS ready */
        modules: null,/*{ css:[ ], js:[ ]} */
        load: 'lite',// 'lite' || ''/'all' see `load_config_then_check_ExtJS()`
        // for development `loadMiniInit` is overriden
        // by `localStorage.devSUPRO = '1'` in 'app.htm'
        // @loadMiniInit: '' || 'lite'
        // 'lite': all init files >>'ext-lite-nw.js'
        //         and `defLoad`  >>'ext-rest-nw.js'
        loadMiniInit: 'lite',
        'proxy.CRUD.timeout': 1 << 11,
        fading:  true// visual effects for content appearance
    },
    backend:{
        file: 'app_main/app_back.js',
        job_port: 3007,
        ctl_port: 3008,
        ctl_on_done: null,// set app module handlers for ctl close/app exit
        init_timeout: 123
       ,extjs:{
            pathFile: 'extjs.txt'// search this file (extjs.txt)
       }
    }
}
