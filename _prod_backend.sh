#!/bin/sh
Usage(){
# skip usage for further checks if this file is sourced/included
[ "$SUPRO_SOURCED" ] && return
cat >&2 <<'__'
Usage:

# * if env $NODEJS_CONFIG is exported it is used and no hardcoded file is read
# * if env $NODEJS_BIN is exported then this binary name will be used instead of `node`
# * $1 == "prod" || "prod_start": spawn `node`,
# * $1 == "prod_reload": stop/start just `node` and no other spawned programm(s)/daemon(s),
# * env $NODEJS_RELOAD app doesn't call `call_done_handlers()` when shuts down
#   i.e. doesn't stop `mongodb`
# * $1 == "prod_stop": full production stop.
#### ## Production Run Exit Status: ##
#### 0 - OK
#### 1 - no $1 argument, read usage
#### 2 - is running already (prod)
#### 3 - is not running (prod_reload, prod_stop)
#### 4 - still runs after exit cmd (prod_stop)
#### ##
# tools:
# * $1 == 'mongo' launch mongo shell with current config DB name and port
# * $1 == 'mongo-edit' launch mongo-edit current config DB name and port
__
}

cd "${0%/*}" 2>/dev/null
set -e

# though git for windows is preferred a bundle of cygwin executables can be here
PATH=.:bin:$PATH

trap '
A=$?
echo "
Unexpected Script Error! Use /bin/sh -x $0 to trace it.
"
set +e

trap "" 0
exit "$A"
' 0

normal_exit(){
    # skip exit for further checks if this file is sourced/included
    [ "$SUPRO_SOURCED" ] && return || :
    echo "
Normal Exit${1:- (backend is running)}
"
    set +e
    trap '' 0
    exit 0
}

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
fi
# export it if this script is `sourced/included` or after assignment above
export NODEJS_CONFIG

case "$1" in
    mongo)
    echo '
^ Production run of mongo shell.
'
    sh app_modules/supromongod/etc/mongo-shell.sh
    trap '' 0
    exit 0
    ;;
    me | mongo-edit)
    echo '
^ Production run of mongo-edit.
'
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
NODEJS_LOG=${NODEJS_LOG#*[\'\"]}

[ "$1" ] && {
    echo "Logging in '$NODEJS_LOG'"
    [ -d "$NODEJS_LOG" ] || {
        echo "Creating '$NODEJS_LOG'"
        mkdir "$NODEJS_LOG"
    }
    exec 7>>$NODEJS_LOG/${A}_stdout.txt 8>>$NODEJS_LOG/${A}_stderr.txt
}

# 'prod' || 'prod_start': start in production
[ 'prod' = "$1" -o 'prod_start' = "$1" ] && {
    _http 'cmd_stat' 1>/dev/null && {
        echo '
^ is running already, skip start, use "prod_reload" or "prod_stop"'
        exit 2
    }
    # waiting `node` to start can be done by requesting '/cmd_cfg' on ctl port
    $BACKEND 1>&7 2>&8 &
    exec 7>&- 8>&-
    # wait a bit for node.js to start
    NUMTRIES=8
    while [ $NUMTRIES -gt 0 ]
    do  printf '.'
        _http cmd_stat >/dev/null && echo && break || sleep 1s
        NUMTRIES=$(($NUMTRIES - 1))
    done

    if _http 'cmd_stat'
    then echo '
^ started.'
    else echo '! failed to start. See log tail: '
         tail -n 32 ".log/${A}_stdout.txt"
         false
    fi
    normal_exit
}
# 'prod_reload': stop/start just `node` and no spawned programms
[ 'prod_reload' = "$1" ] && {
    # don't `call_done_handlers()` thus stopping i.e. MongoDB daemon(s)
    _http 'cmd_reload' || {
        echo '
! is not running.'
        exit 3
    }
    NODEJS_RELOAD='y' $BACKEND 1>&7 2>&8 &
    exec 7>&- 8>&-
    # wait a bit for node.js to start
    NUMTRIES=8
    while [ $NUMTRIES -gt 0 ]
    do  printf '.'
        _http cmd_stat >/dev/null && echo && break || sleep 1s
        NUMTRIES=$(($NUMTRIES - 1))
    done

    if _http 'cmd_stat'
    then echo '
^ reloaded.'
    else echo '! failed to start after reload.'
         tail -n 32 ".log/${A}_stdout.txt"
         false
    fi
    normal_exit
}
# 'prod_stop': full production stop.
[ 'prod_stop' = "$1" ] && {
    _http 'cmd_exit' 1>/dev/null || {
        echo '
! is not running.'
        exit 3
    }
    if _http 'cmd_stat' 1>/dev/null
    then echo '
! still runs...' && exit 4
    else normal_exit ' (full production stop).'
    fi
}

Usage
