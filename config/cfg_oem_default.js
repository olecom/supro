// global config
config = {
/* NOTE: this is not JSON just JavaScript
 *       idea is taken from github.com/louischatriot/mongo-edit
 */
    __name: 'cfg_oem_default',

    /* standard configuration of extjs+[node nw].js application */
    lang: 'ru',// base localization, must be provided by any module as fallback
    data: '.data/',// directory for application data; defaults to '.data/'
    log: '.log/',// NOTE: this field is parsed by `_devel_backend.sh` && _prod_backend.sh

    /* parse, serve from '/.data/' directory 'app.htm', 'app-mini.htm' and
     * `l10n` files with replaced strings from this OEM config */

    oem:{
        htm:{// no localization applied
            icon: 'css/userman/shutdown.png',// URL
            logo: 'css/suproem.png',// URL
            title: 'SUPRO OEM v000&copy;2015-??-??'
        },
        l10n:{
            en:{
                welcome: 'OEM SUPRO welcomes: application development',
                app: 'OEM SUPRO Demo'
            },
            ru:{
                welcome: 'Вас приветствует OEM СУПРО!',
                app: 'OEM СУПРО Демо'
            }
        }
    },

    //TODO: uid gid new ids for process after start or partial init
    modules:{// cfg for stack of things from 'app_modules'
    // order matters: before auth module there are no restrictions to config

    // auth module overwrites default and sets up per-user auth module loading
        userman:{//#0: authentication and authorization (plus Chat)
            store: 'fs' // TODO: fs || db
           ,sess_puzl: 'puzzle-word$54321X'
           ,data: '.data/um/'// store fs: chat logs
           ,stat: true// enable module statistics, metrics, health for app
           ,rbac:{
               can:{// list of permissions with arbitrary positive value
                    'module.example': true
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
    },
    extjs:{
        path: 'extjs-4.2/',// find and provide this path; 'extjs/' is for web
        launch:  null,/*{ css:[ ], js:[ ]} loaded after ExtJS ready */
        modules: null,/*{ css:[ ], js:[ ]} */
        oem: null,/* copy of OEM config above */
        load: '',// 'lite' || ''/'all' see `load_config_then_check_ExtJS()`
        // for development `loadMiniInit` is overriden
        // by `localStorage.devSUPRO = '1'` in 'app.htm'
        // @loadMiniInit: '' || 'lite'
        // 'lite': all init files >>'ext-lite-nw.js'
        //          and  `defLoad` >>'ext-rest-nw.js'
        loadMiniInit: 'lite',
        'proxy.CRUD.timeout': 1 << 15,// for slow APIs
        fading:  true// visual effects for content appearance
    },
    backend:{
        file: 'app_main/app_back.js',
        job_port: 3005,
        ctl_port: 3006,
        ctl_on_done: null,// set app module handlers for ctl close/app exit
        init_timeout: 123
       ,extjs:{
            pathFile: 'extjs.txt'// search this file (extjs.txt)
       }
    }
}
