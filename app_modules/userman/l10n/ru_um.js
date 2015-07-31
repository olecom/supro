l10n.um = { lang: 'ru' //!!! локализация используется только в UI (для простоты обновления)
   ,modname: "Управление пользователями"
   ,tooltip: "Управление пользователями, правами доступа и т.п."
   ,user: "Пользователь"
   ,users: "Пользователи"
   ,role: "Должность"
   ,pass: "Пароль"

   ,shutdown: 'Выйти или блокировать'
   ,connection: 'Состояние сетевого соединения'
   ,userStatus: 'Рабочий статус пользователя'
   ,userStatusMenu: 'Статусы<br/>пользователя'
   ,userStatuses: { 'onli': 'Здесь','away': 'Нет на месте','busy':'Не беспокоить','offl':'Нету (совсем)' }

   ,chat:{
        title: "Чат",
        users: "Участники",
        messages: "== Сообщения ==",
        tooltip: "Открыть окно чата",
        keys:
"'ENTER' (ВВОД): отослать сообщение<br>" +
"'ESC' (слева вверху): очистить введённое (восстановить - кнопка DOWN(ВНИЗ))<br>" +
"'UP' (ВВЕРХ): текст предыдущего сообщения <br>" +
"'DOWN' (ВНИЗ): восстановить введённый текст (после ESC или UP)<br>" +
"'PAGE_UP/PAGE_DOWN' (страница вверх/вниз): прокрутка области чата",
        user_in: 'Появление',
        user_out: 'Выход',
        user_reload: 'Новый список пользователей',
        send: "отослать"
   }

   ,auth: "Получение доступа"
   ,deny: 'Нет прав'

   ,loginInfo:
'<b>Для входа получите:</b><br/>id пользователя, пароль<br/>' +
'должность - по необходимости'
   ,loginUserBlank: 'id пользователя'
   ,loginOk: 'Вход в систему'
   ,loginCurrentSession: 'Продолжить сессию'
   ,loginConflict: 'Сессия Активна!'
   ,logoutTitle: 'Сессия'
   ,logoutMsg: function(id, role, fact){
        return (fact ? 'Текущая сессия прекращена!' : 'Прекратить текущую сессию?') +
               '<br><br>' +
               'Пользователь: <b>"' + id + '"</b><br>' +
               'Роль: <b>"' + role + '"</b>'
    }

   ,l10n: 'Настройки локализации'
   ,l10nReset: 'Выбор локализации сбрасывается в значение конфигурации'
   ,Can: 'Права'
   ,Roles: 'Роли/Должности'
   ,Users: 'Пользователи'
   ,value: 'Значение'
   ,roles:{
        'admin.local':  "Администратор с физическим доступом к ПО"
       ,'admin.remote': "Администратор. Управление пользователями и правами доступа"
       ,'developer.local': "Разработчик ПО, имеющий доступа к мозгу программы физически"
       ,'developer':    "Разработчик ПО, не имеющий доступа к мозгу программы физически"

       ,boss:        "Шеф, Босс"
       ,manager:     "Управляющий"
       ,warehouse:   "Работник склада"
       ,shop:        "Продавец/Продавщица"
       ,accountant:  "Бухгалтер"
    }
   ,can:{
        'App.view.desktop.BackendTools':'Управление (запуск/остановка) основного проыесса (мозгов, node.js)'
       ,'App.backend.JS':              'Запуск кода в мозгах'
    }
   ,'!login': '!login'
   ,'!auth': '!auth'
   ,'!conflict': '!conflict'
   ,'!session_txt': 'Не создана сессия или не переданны учётные данные'
   ,'!access': "Доступ извне запрещён (не из `localhost`)"
   ,'!bad_upr': "Неверное имя пользователя, пароль или выбранная роль"
}
