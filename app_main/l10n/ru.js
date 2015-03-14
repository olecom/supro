l10n = { lang: 'ru',//!!! локализация используется только в UI (для простоты обновления)
    app: 'СУПРО Демо'
    ,'': "пусто"
    ,welcome: 'Вас приветствует СУПРО:  Заказы/Приходы/Продажи'
    ,reload: 'перезагрузить',

    loading: 'Загрузка...'
    ,oops_rcif: 'УПС! Запрещённый вызов локального функционала!'
    ,errapi: 'Ошибка получения данных по API запросу:'
    ,errload: 'Загрузка прекращена из-за ошибок.'
    ,errload_no_app:
'Ошибка установки! Не найден файл "app_front.js".\n' +
'Нужно проверить конфигурацию и состав программы.'
    ,errload_config_read:
'Ошибка при чтении файла конфигурации! Смотреть в "log".\n' +
'(Возможно не стартанул Node.JS и/или MongoDB)'
    ,errload_config_log_not_dir:
'Ошибка: нельзя прочитать директорию логов.\n' +
'Опция в конфигурационном файле: '
    ,errload_config_log_mkdir: 'Ошибка: нельзя создать директорию логов.'
    ,errload_spawn_backend: 'Ошибка при запуске бэкэнда! Код ошибки: '
    ,errload_check_backend: '\n' +
'Ошибка! Основа системы запущена, но нет доступа по HTTP!\n' +
'Возможно файервол или антивирус блокирует работу портов TCP/IP.\n\n' +
'Необходимо вмешательство спецов: администратора или разработчика.'
    ,errun_title: 'ОШИБКА выполнения программы'
    ,errun_file: 'Файл: '
    ,errun_stack: 'Ошибка и стэк вызова функций: '
    ,tray:{
        title: 'СУПРО'
        ,winvis: 'СУПРО окно видно'
        ,wininv: 'СУПРО окно скрыто'
    }

    ,via_proxy:function(url){ return ''+
'Адрес подключения пользователей идёт через ПРОКСИ!' + '\n' +
'Могут возникнуть проблемы доступа к системе из сети.\nURL = ' + url
    }

    ,extjsNotFound:
        'Не найден или не загрузился "ExtJS" (визуальная библиотека).\n' +
        'Нужно проверить конфигурацию программы.'
    ,extjsPathNotFound: function(быстрый_файл_конфига, конфиг, ж){
        var пример_названия = '\n\n'+
'Пример названия директории релиза ExtJS 4.2.1: "ext-4.2.1.883".'
           ,о_файле = ''+
'Файл `' + быстрый_файл_конфига + '` в корне программы ' +
'отсуствует или содержит название директории которой нет.' +
пример_названия

        if(1 == ж){
            return ''+
'Конфигурация `config.extjs.path` = "' + конфиг +
'" не указывает место расположения ExtJS.\n\n' +
о_файле
        }
        if(2 == ж){
            return ''+
'Пустая конфигурация `config.extjs.path`.\n\n' +
о_файле
        }
        return '' +
'Ни локальный файл `' + быстрый_файл_конфига +
'`,\nни конфигурация `config.extjs.path` = "' + конфиг +
'"\nне указывают место расположения ExtJS.' +
пример_названия
    }
    ,uncaughtException: 'Неожиданная внутренняя ошибка! Обратитесь к разработчикам.\n'
    ,warn_js: 'Запуск различного JS кода на сервере разрешён для любого подключения!'

    ,stsSystem: 'Связь с основным процессом. Информация (Log).'
    ,stsHandleTipTitle: 'Что и как происходит внутри системы?'
    ,stsHandleTip: 'Двойной клик по шестерням раскрывает или скрывает содержимое'
    ,stsStart: 'ЗАПУСК основной `nodejs`'
    ,stsCheck: 'ПРОВЕРКА работы основной `nodejs`'
    ,stsRestarting: '(2 сек.) запускается новый основной `nodejs`'
    ,stsKilling: 'УБИТЬ основной `nodejs` (завис)'
    ,stsShutdown: 'ЗАВЕРШЕНИЕ работы основной `node.js`'
    ,stsBackendPid: function(pid){
        return '' + pid + ' - идентификатор основного процесса(nodejs) системы'
    }
    ,stsBackendXHR: "подключение к основному процессу(nodejs) системы"
    ,stsOK: 'OK'
    ,stsHE: 'НЕ'
    ,stsClean: 'Очистить'
    ,stsEcho: 'Запрос-проверка'
    ,stsRestart: 'Перезапустить'
    ,stsStopSystem: 'Завершить работу системы'
    ,stsKill: '"Убить" (завис)'
    ,stsKilled: 'основной процесс "убит"'
    ,stsKilledAlready: 'основной процесс уже "умер"'
    ,stsAlive: 'основной процесс "живой"'
    ,stsDead: 'Запрос проигнорирован. Нужно перезапустить основной процесс'
    ,stsMsg: 'Сообщений: '
    ,stsMarkRead: 'Пометить все сообщения как прочитанные'

    ,btnAdd: 'Добавить'
    ,btnCreate: 'Создать'
    ,btnEdit: 'Изменить'
    ,btnCancel: 'Отмена'

    ,copyCtrlC: 'CTRL+C скопирует ячейку'
    ,selectAll: 'Выделить всё строки'

    ,formNoChange: 'Нет изменений'
    ,formNoChangeMsg: 'В форме нет никаких изменеий!'

    ,time: 'Время'
    ,operation: 'Операция'
    ,description: 'Описание'
    ,result: 'Итог'

    /* DATA EXCHANGE */

    // fronend error messages
    ,emptyTextGrid: '--== Нет данных ==--'
    ,err_crud_proxy: 'Сетевой/серверный вызов функции не отработал! Фатально. Сообщите в поддержку.'

    // backend error codes
    ,'!session': 'Сессия работы окончилась. Нужно войти заново.<br>Несохранённые данные перенесите в Excel.'
    ,'!handler': 'На сервере (в мозгах) нет обработчика таких запросов.'
    ,'!auth': 'Нет доступа.'
    ,'!db': 'База данных недоступна. Фатально. Обратитесь к разработчику.'
    ,'!such_subapi': 'Несуществующий вызов функционала.'
    ,'!arr_json': 'Аргумент запроса не является массивом (array).'
    ,'!arr_one': 'Ожидается только один элемент массива.'

    ,store_save_err: 'Ошибка сохранения данных!'
    ,'!transs': 'Не возможно начать сохранение. База занята. Повторите попытку.'
    ,'!transe': 'Не возможно закончить сохранение. Фатально. Обратитесь к разработчику.'
    ,'!data': 'Нет данных из БД. Фатально. Обратитесь к разработчику.'
    ,'error index': 'Информация повторяется, что запрешено!<br><br>Артикулы при добавлении моделей (или другие ошибка индекса)!'
    ,MongoError: 'Фатальная программная ошибка! Обратитесь к разработчику.'
    ,TypeError: 'Программная ошибка (TypeError). Обратитесь к разработчику.'
    ,ReferenceError: 'Программная ошибка (ReferenceError). Обратитесь к разработчику.'
    ,Error: 'Программная ошибка (Error). Обратитесь к разработчику.'
    // backend ошибки приложения (пользовальский ввод, нефатальные) лучше хранить в своём app_module
    //,'~exists': 'Уже существует.'

// места для модулей
    ,um: null // user manager
}
