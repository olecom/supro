#!/bin/sh

# * $1 == 'mongo' launch mongo shell with current config DB name and port
# * $1 == 'mongo-edit' launch mongo-edit current config DB name and port
# * any param "$1" will redirect node.js' output i.e:
#   1>>log/app_back_stdout.txt 2>>log/app_back_stderr.txt
# * if env $NODEJS_CONFIG is exported it is used and no hardcoded file is read
# * if env $NODEJS_BIN is exported then this binary name will be used instead of `node`
# * env $NODEJS_RELOAD app doesn't call `call_done_handlers()` when shuts down
#   i.e. doesn't stop `mongodb`

cd "${0%/*}" 2>/dev/null
set -e

# though git for windows is preferred a bundle of cygwin executables can be here
PATH=.:bin:$PATH

trap 'echo "
Unexpected Script Error! Use /bin/sh -x $0 to trace it.
"
set +e

trap "" 0
exit 0
' 0

normal_exit(){
    echo "
Normal Exit${1:- (backend is running)}
"
    set +e
    trap '' 0
    exit 0
}

trap 'normal_exit' HUP TERM INT

pecho(){
    echo '^ check && set exec permission for `'"$1"'`'
}

case "$OSTYPE" in
*cygwin* | *msys*) # MS Windows
    : skip
;;
*linux-gnu* | *linux_gnu* | *)
    echo
    [ -f 'node' -a ! -x 'node' ] && pecho 'node' && chmod u+x 'node'
    [ -f 'bin/node' -a ! -x 'bin/node' ] && pecho 'bin/node' && chmod u+x 'bin/node'
    A='app_modules/supromongod/bin'
    [ -f "$A/mongod" -a ! -x "$A/mongod" ] && pecho "$A/*" && chmod u+x $A/*
;;
esac

if [ "$NODEJS_CONFIG" ]
then
    echo '
^ config is already exported in "$NODEJS_CONFIG"'
else
    echo '
^ reading config in "$NODEJS_CONFIG" from file "./config/cfg_default.js"'
    NODEJS_CONFIG=`sed '' <./config/cfg_default.js`
    echo '^ exporting it for children'
    export NODEJS_CONFIG
fi

A=${NODEJS_CONFIG##*__name:}
A=${A%%,*}
echo "^ config name:$A"

case "$1" in
    mongo)
    sh app_modules/supromongod/etc/mongo-shell.sh
    trap '' 0
    exit 0
    ;;
    mongo-edit)
    sh app_modules/supromongod/etc/mongo-edit.sh
    trap '' 0
    exit 0
    ;;
esac

# JS config sample to parse:
#    backend:{
#        file: './app_main/app_back.js',
#        job_port: 3007,// app/api
# here>> ctl_port: 3008,// controlling
#        ctl_on_done: null,// set app module handlers for ctl close/app exit
#        init_timeout: 123
#    }
BACKEND_PORT=${NODEJS_CONFIG##*ctl_port:}
BACKEND_PORT=${BACKEND_PORT## }
BACKEND_PORT=${BACKEND_PORT%%,*}

A=${NODEJS_CONFIG##*backend:{}
A=${A##*file:[ \'\"][\'\"]}
A=${A%%[\'\"],*} # app_main/app_back.js

if [ "$NODEJS_BIN" ] # for `node-debug`
then echo '^ $NODEJS_BIN is set, run "'"$NODEJS_BIN"'"' && BACKEND="$NODEJS_BIN"
else echo '^ $NODEJS_BIN is not set, run `node`' && BACKEND=node
fi

echo '
^ running backend on Node.JS '"`$BACKEND -v`"'
^ command: `'"$BACKEND"'`
^ ctlport: "'"$BACKEND_PORT"'"
'

BACKEND="$BACKEND $A"
A=${A##*/}
A=${A%%.js*} # app_back

_http() { # $1=cmd $2=timeout
    [ "$OPENSHIFT_NODEJS_IP" ] && LOCALHOST=$OPENSHIFT_NODEJS_IP || LOCALHOST='127.0.0.1'
    node './_http.js' "http://$LOCALHOST:$BACKEND_PORT/$1" "$2"
}

# parse: log: '.log/',
NODEJS_LOG=${NODEJS_CONFIG##*log:}
NODEJS_LOG=${NODEJS_LOG%%,*}
NODEJS_LOG=${NODEJS_LOG%[\'\"]}
NODEJS_LOG=${NODEJS_LOG#*[\'\" ]}
echo "end: _${NODEJS_LOG}_"
[ "$1" ] && {
    echo "Logging in '$NODEJS_LOG'"
    [ -d "$NODEJS_LOG" ] || {
        echo "Creating '$NODEJS_LOG'"
        mkdir "$NODEJS_LOG"
    }
    exec 7>>$NODEJS_LOG/${A}_stdout.txt 8>>$NODEJS_LOG/${A}_stderr.txt
} || {
    exec 7>&1 8>&2
}
$BACKEND 1>&7 2>&8 &

while echo '
Press "Enter" key to reload, "CTRL+D" stop backend || "CTRL+C" to break...

NOTE: config is not reloaded (stop + start required)!
'
do
    read A || {
        echo '
Stop backend (y/n)? '
        read A && {
            [ 'y' = "$A" ] && {
                _http 'cmd_exit'
                A='.'
                normal_exit "$A"
            }
        } || normal_exit
    }

    _http 'cmd_reload' || :
    NODEJS_RELOAD='y' $BACKEND 1>&7 2>&8 &
done
