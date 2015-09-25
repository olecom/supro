Ext.define('App.view.desktop.StatusGrid',{
    extend: Ext.grid.Panel,
    singleton: true,
    title: l10n.stsSystem,
    /* config for stretching `grid` to fit container correctly: */
    height: '100%', width: 123, flex: 1,//+ { layout: 'hbox', align: 'stretch' }
    viewConfig:{
        deferEmptyText: false
       ,emptyText: '--== ? ? ? ? ==--'
       ,getRowClass: function(record){
            return record.get('n') ? 'new-bold-row' : ''
        }
    },
    listeners:{
       itemclick: function(g___, rec){
           rec.get('n') && rec.set('n', false)
       }
    },
    dockedItems:[{
        xtype: 'toolbar',
        dock: 'top',
        items:[
            'var:'
            ,{
            text: l10n.btnAdd + ' <b>app_module</b>'
           ,iconCls: 'btn-add'
           ,handler: function(){

                }
            },'-'
        ]
    },{
        xtype: 'toolbar',
        dock: 'top',
        items:[
            'log: ',
            {
            text: l10n.stsMarkRead
           ,iconCls: 'sg-m'
           ,handler: function(){
                    this.up('grid').getStore().markAllAsRead()
                }
            },'->',
            {
            text: l10n.stsClean
           ,iconCls: 'sg-c'
           ,handler: function(){
                    this.up('grid').getStore().removeAll()
                }
            }
        ]
    },
        Ext.create('App.view.desktop.BackendTools')
    ],
    // combine two static column configs
    columns: Ext.Array.merge(App.cfg.modelBase.fields, App.cfg.modelStatus.fields),
    store: App.store.Status// is also singleton
})

Ext.define('App.view.desktop.Status',{
    xtype: 'app-status-bubble',
    extend: Ext.container.Container,
    layout: 'hbox',
    align: 'stretch',
    width: 7, height: 7,// it is being resized and animated, when created
    floating: true,
    constrain: true,
    draggable: true,
    resizable: true,

    style: 'padding: 4px; box-shadow: 0px 10px 20px #111; text-align: center;',
    items:[{
        xtype: 'container'
        ,layout: 'vbox'
        ,width: 77
        ,align: 'strech'
        ,defaults:{
            width: '100%'
        }
        ,items:[
            Ext.create(Ext.Img,{
                src: 'css/extdeskrun.gif',
                style: 'cursor:move;',
                height: 61// fix first layout
            }),
        {
            xtype: 'component'
           ,html: (l10n.stsMsg + '<b id="stscount">0/0</b><br><div id="versions">' +
'-= versions =-\n'+
'extjs:,' + Ext.versions.extjs.version + '\n' +
           (App.backendURL ?
'nodejs:,' + App.cfg.backend.versions.node +
'connectjs:,' + App.cfg.backend.versions.connectjs +
'nw.js:,'+ App.cfg.backend.versions.nw : '')
            ).replace(/\n/g,'</b><br>').replace(/,/g, '<br><b>') +
'</div><br><a ' + (
    App.backendURL ?
        'onclick="extjs_doc()" href="#">HTTP Remote Application' :
        'target="blank" href="/extjs/docs/index.html">ExtJS SUPRO Docs'
    ) +
'</a>'
        }
        ]
    }
        ,App.view.desktop.StatusGrid
    ]
})
