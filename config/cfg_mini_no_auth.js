// global config
config = {
/* NOTE: this is not JSON just JavaScript
 *       idea is taken from github.com/louischatriot/mongo-edit
 */
    __name: 'cfg_mini_no_auth',

    /* standard configuration of extjs+node.jst] application */
    lang: 'ru',// base localization, must be provided by any module as fallback
    data: '.data/',// directory for application data; defaults to '.data/'
    log: '.log/',

    modules:{// cfg for stack of things from 'app_modules'
       pingback: true,
       example: true
    },
    extjs:{
        path: 'extjs-4.2/',// find and provide this path; 'extjs/' is for web
        launch:  null,/*{ css:[ ], js:[ ]} loaded after ExtJS ready */
        modules: null,/*{ css:[ ], js:[ ]} */
        fading:  true// visual effects for content appearance
    },
    backend:{
        file: 'app_main/app_back.js',
        job_port: 3003,
        ctl_port: 3004,
        ctl_on_done: null,// set app module handlers for ctl close/app exit
        init_timeout: 123
       ,extjs:{
            pathFile: 'extjs.txt'// search this file (extjs.txt)
       }
    }
}
