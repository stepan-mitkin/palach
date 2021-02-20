// Created with Drakon Tech https://drakon.tech/

function palach_mod() {

var module = {};

var common = arguments[0]
var sm = arguments[1]
var html = arguments[2]
var storage = arguments[3]
var config = arguments[4]

function App_onEvent(self, data) {
    switch (self.state) {
        case "8_wait":
            self.msg = data;
            self.state = "12";
            break;
        default:
            return;
    }
    App_run(self);
}

function App_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "34":
                module.sound = new Audio(config.distract)
                initStyles()
                self.screen = setUpScreen()
                sendEvent(self, {type: "main-menu"})
                self.state = "8";
                break;
            case "8":
                self.state = "8_wait";
                work = false;
                break;
            case "12":
                self._sw_12 = self.msg.type;
                if (self._sw_12 === "main-menu") {
                    sendShow(self, self.mainMenu)
                    self.state = "8";
                } else {
                    if (self._sw_12 === "help") {
                        sendShow(self, self.help)
                        self.state = "8";
                    } else {
                        if (self._sw_12 === "practice") {
                            sendShow(self, self.practice)
                            self.state = "8";
                        } else {
                            if (self._sw_12 === "practice-completed") {
                                storage.addReport(
                                    self.msg.report
                                )
                                sendShow(
                                    self,
                                    self.report,
                                    self.msg.report
                                )
                                self.state = "8";
                            } else {
                                if (self._sw_12 === "report") {
                                    sendShow(
                                        self,
                                        self.report,
                                        self.msg.report
                                    )
                                    self.state = "8";
                                } else {
                                    if (self._sw_12 === "practices") {
                                        sendShow(self, self.reports, {})
                                        self.state = "8";
                                    } else {
                                        if (self._sw_12 === "total-stats") {
                                            self.state = "26";
                                        } else {
                                            sm.handleError(self, new Error("Unexpected Choice value: " + self._sw_12));
                                            work = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case "26":
                self.totalStats = storage.getTotalStats()
                sendShow(
                    self,
                    self.stats,
                    self.totalStats
                )
                self.state = "8";
                break;
            default:
                return;
        }
    }
}

function App(parent) {
    var self = sm.createMachine("App");
    sm.addMethod(self, "onEvent", App_onEvent);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", App_run);
    self.state = "34";
    return self;
}

function Help(parent) {
    return SimpleScreen(parent, buildHelp)
}

function MainMenu(parent) {
    return SimpleScreen(
        parent,
        buildMainMenu
    )
}

function Practice_onEvent(self, data) {
    switch (self.state) {
        case "8_wait":
            self.msg = data;
            self.state = "9";
            break;
        case "11_wait":
            self.msg = data;
            self.state = "32";
            break;
        case "15_wait":
            self.msg = data;
            self.state = "16";
            break;
        default:
            return;
    }
    Practice_run(self);
}

function Practice_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "10":
                self.state = "8_wait";
                work = false;
                break;
            case "9":
                if (self.msg.type === "show") {
                    self.container = self.msg.container
                    self.state = "3";
                } else {
                    self.state = "10";
                }
                break;
            case "3":
                showPracticeStart(self)
                self.state = "13";
                break;
            case "13":
                self.state = "11_wait";
                work = false;
                break;
            case "32":
                self._sw_32 = self.msg.type;
                if (self._sw_32 === "start") {
                    self.start = getNow()
                    self.object = getSelectObject()
                    self.distractions = []
                    showConcentrate(self)
                    self.state = "24";
                } else {
                    if (self._sw_32 === "cancel") {
                        sendEvent(
                            self.parent,
                            {type: "main-menu"}
                        )
                        self.state = "10";
                    } else {
                        self.state = "13";
                    }
                }
                break;
            case "24":
                self.state = "15_wait";
                work = false;
                break;
            case "16":
                if (self.msg.type === "distract") {
                    flashDistract(undefined, self.flash).run()
                    self.distractions.push(getNow())
                    self.state = "24";
                } else {
                    if (self.msg.type === "stop") {
                        self.end = getNow()
                        self.state = "26";
                    } else {
                        self.state = "24";
                    }
                }
                break;
            case "26":
                self.report = {
                    start: self.start,
                    object: self.object,
                    distractions: self.distractions.slice(),
                    end: self.end
                }
                sendEvent(
                    self.channels.app,
                    {
                        type: "practice-completed",
                        report: self.report
                    }
                )
                self.state = "10";
                break;
            default:
                return;
        }
    }
}

function Practice(parent) {
    var self = sm.createMachine("Practice");
    sm.addMethod(self, "onEvent", Practice_onEvent);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", Practice_run);
    self.state = "10";
    return self;
}

function PracticeList_onEvent(self, data) {
    switch (self.state) {
        case "4_wait":
            self.msg = data;
            self.state = "5";
            break;
        case "11_wait":
            self.msg = data;
            self.state = "17";
            break;
        default:
            return;
    }
    PracticeList_run(self);
}

function PracticeList_onChildCompleted(self, data) {
    switch (self.state) {
        case "19_wait":
            self.remove = data;
            self.state = "20";
            break;
        default:
            return;
    }
    PracticeList_run(self);
}

function PracticeList_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "6":
                self.state = "4_wait";
                work = false;
                break;
            case "5":
                if (self.msg.type === "show") {
                    self.container = self.msg.container
                    buildPracticeList(self)
                    self.state = "11";
                } else {
                    self.state = "6";
                }
                break;
            case "11":
                self.state = "11_wait";
                work = false;
                break;
            case "17":
                if (self.msg.type === "remove") {
                    self.message = "Удалить отчёт " + formatDate(
                        self.msg.report.start
                    ) + "?"
                    self.state = "19_wait";
                    work = false;
                    var machine = showYesNo(self, self.message, 'Удалить', 'Отмена');
                    machine.run();
                } else {
                    sendEvent(self.parent, self.msg)
                    self.state = "6";
                }
                break;
            case "20":
                if (self.remove) {
                    storage.removeReport(
                        self.msg.report.start
                    )
                    html.clear(self.container)
                    buildPracticeList(self)
                    self.state = "11";
                } else {
                    self.state = "11";
                }
                break;
            default:
                return;
        }
    }
}

function PracticeList(parent) {
    var self = sm.createMachine("PracticeList");
    sm.addMethod(self, "onEvent", PracticeList_onEvent);
    sm.addMethod(self, "onChildCompleted", PracticeList_onChildCompleted);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", PracticeList_run);
    self.state = "6";
    return self;
}

function PracticeReport(parent) {
    return SimpleScreen(
        parent,
        buildPracticeReport
    )
}

function SimpleScreen_onEvent(self, data) {
    switch (self.state) {
        case "4_wait":
            self.msg = data;
            self.state = "5";
            break;
        case "11_wait":
            self.msg = data;
            self.state = "12";
            break;
        default:
            return;
    }
    SimpleScreen_run(self);
}

function SimpleScreen_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "6":
                self.state = "4_wait";
                work = false;
                break;
            case "5":
                if (self.msg.type === "show") {
                    self.container = self.msg.container
                    self.data = self.msg.data
                    self.builder(self)
                    self.state = "11";
                } else {
                    self.state = "6";
                }
                break;
            case "11":
                self.state = "11_wait";
                work = false;
                break;
            case "12":
                sendEvent(self.parent, self.msg)
                self.state = "6";
                break;
            default:
                return;
        }
    }
}

function SimpleScreen(parent, builder) {
    var self = sm.createMachine("SimpleScreen");
    self.builder = builder;
    sm.addMethod(self, "onEvent", SimpleScreen_onEvent);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", SimpleScreen_run);
    self.state = "6";
    return self;
}

function TotalStats(parent) {
    return SimpleScreen(
        parent,
        buildTotalStats
    )
}

function addNameValue(parent, name, value) {
    var nameDiv, row, valueDiv;
    function branch1() {
        row = html.make(parent, "div")
        row.style.position = "relative"
        row.style.whiteSpace = "nowrap"
        return branch2();
    }

    function branch2() {
        nameDiv = html.make(row, "div")
        nameDiv.style.display = "inline-block"
        nameDiv.style.whiteSpace = "normal"
        nameDiv.style.width = "40%"
        nameDiv.style.padding = "10px"
        nameDiv.style.paddingLeft = "0px"
        nameDiv.style.textAlign = "right"
        nameDiv.style.color = "#7E5109"
        html.setText(nameDiv, name)
        return branch3();
    }

    function branch3() {
        valueDiv = html.make(row, "div")
        valueDiv.style.display = "inline-block"
        valueDiv.style.whiteSpace = "normal"
        valueDiv.style.width = "60%"
        valueDiv.style.padding = "10px"
        valueDiv.style.paddingRight = "0px"
        valueDiv.style.textAlign = "left"
        valueDiv.style.fontWeight = "bold"
        html.setText(valueDiv, value)
        return branch4();
    }

    function branch4() {
    }

    return branch1();
}

function addOption(select, text) {
    var option;
    option = html.addTag(
        select,
        "option",
        text
    )
    option.value = text
}

function addRadio(parent, name, text, checked) {
    var div, label, option;
    div = html.make(parent, "div")
    div.style.padding = "10px"
    option = html.make(div, "input")
    option.type = "radio"
    option.id = text
    option.name = name
    option.checked = !!checked
    label = html.addTag(div, "label", text)
    label.setAttribute("for", option.id)
}

function addReportLine(self, report) {
    var date, icon, label, line, msg, open, remove, trash;
    msg = {type: "report", report: report}
    open = function () {
        self.onEvent(msg)
    }
    remove = function () {
        self.onEvent(
            {type: "remove", report: report}
        )
    }
    date = formatDate(report.start)
    line = html.make(
        self.container,
        "div",
        "report-line"
    )
    icon = createIcon(line, config.report)
    label = html.make(line, "div")
    label.style.display = "inline-block"
    label.style.width = "calc(100% - 80px)"
    label.style.height = "40px"
    label.style.lineHeight = "40px"
    html.setText(label, date)
    trash = createIcon(line, config.trash)
    trash.className = "back-red"
    html.addEventListener(
        icon,
        "click",
        open
    )
    html.addEventListener(
        label,
        "click",
        open
    )
    html.addEventListener(
        trash,
        "click",
        remove
    )
}

function buildHelp(self) {
    var list, view;
    function branch1() {
        view = html.make(
            self.container,
            "div",
            "view"
        )
        createHeader(view, "Как играть")
        createScreenButton(
            self,
            view,
            "В начало",
            "main-menu",
            true
        )
        return branch2();
    }

    function branch2() {
        html.addTag(
            view,
            "p",
            "\"Палач\" — упражнение на укрепление внимания и улучшение концентрации."
        )
        list = html.make(view, "ul")
        html.addTag(
            list,
            "li",
            "Остановите поток мыслей. Выключите \"внутренний диалог\"."
        )
        html.addTag(
            list,
            "li",
            "Как только заметите, что отвлеклись, нажмите на центральную область экрана."
        )
        html.addTag(
            list,
            "li",
            "Снова сконцентрируйтесь." + " Когда мысли будут уводить в сторону, опять нажмите на экран, и так далее."
        )
        html.addTag(
            list,
            "li",
            "По окончании упражнения нажмите кнопку \"Стоп\"."
        )
        return branch3();
    }

    function branch3() {
    }

    return branch1();
}

function buildMainMenu(self) {
    var header, headerDiv, img, link, site, view;
    headerDiv = html.make(
        self.container,
        "div"
    )
    headerDiv.style.whiteSpace = "nowrap"
    headerDiv.style.padding = "20px"
    headerDiv.style.paddingTop = "40px"
    link = html.make(headerDiv, "a")
    link.href = "/"
    img = html.make(link, "img")
    img.src = config.logo
    img.width = 40
    img.height = 40
    img.style.verticalAlign = "bottom"
    header = html.addTag(
        headerDiv,
        "div",
        "Палач"
    )
    header.style.fontSize = "20px"
    header.style.fontWeight = "bold"
    header.style.display = "inline-block"
    header.style.paddingLeft = "20px"
    view = html.make(
        self.container,
        "div",
        "view"
    )
    createScreenButton(
        self,
        view,
        "Практика",
        "practice",
        true
    )
    createScreenButton(
        self,
        view,
        "Журнал",
        "practices",
        false
    )
    createScreenButton(
        self,
        view,
        "Как играть",
        "help",
        false
    )
    site = html.addTag(
        view,
        "div",
        "4way.info"
    )
    site.onclick = function () {
        window.open("https://4way.info")
    }
    site.style.color = "darkblue"
    site.style.textAlign = "center"
    site.style.cursor = "pointer"
}

function buildPracticeList(self) {
    var _12_col, _12_it, _12_length, allReports, report, view;
    function branch1() {
        view = html.make(
            self.container,
            "div",
            "view"
        )
        createHeader(view, "Журнал")
        createScreenButton(
            self,
            view,
            "В начало",
            "main-menu",
            true
        )
        return branch2();
    }

    function branch2() {
        allReports = storage.getAllReports()
        allReports.reverse()
        _12_it = 0;
        _12_col = allReports;
        _12_length = _12_col.length;
        while (true) {
            if (_12_it < _12_length) {
                report = _12_col[_12_it];
                addReportLine(self, report)
                _12_it++;
            } else {
                break;
            }
        }
        return branch3();
    }

    function branch3() {
    }

    return branch1();
}

function buildPracticeReport(self) {
    var average, date, end, start, view;
    function branch1() {
        view = html.make(
            self.container,
            "div",
            "view"
        )
        createHeader(view, "Отчёт по практике")
        date = formatDate(self.data.start)
        html.addTag(view, "p", date)
        createScreenButton(
            self,
            view,
            "В начало",
            "main-menu",
            true
        )
        createScreenButton(
            self,
            view,
            "Журнал",
            "practices",
            false
        )
        return branch2();
    }

    function branch2() {
        start = new Date(self.data.start)
        end = new Date(self.data.end)
        addNameValue(
            view,
            "Начало",
            formatDate(self.data.start)
        )
        addNameValue(
            view,
            "Предмет",
            self.data.object
        )
        addNameValue(
            view,
            "Время концентрации",
            formatSpan(start, end)
        )
        addNameValue(
            view,
            "Отвлечения",
            self.data.distractions.length.toString()
        )
        average = (
            (end.getTime() - start.getTime()) / (
                self.data.distractions.length + 1
            )
        ) / 1000
        addNameValue(
            view,
            "Среднее время удержания",
            average.toFixed(2) + " сек."
        )
        return branch3();
    }

    function branch3() {
    }

    return branch1();
}

function buildTotalStats() {
}

function buildTree() {
    var tree;
    tree = {type: "App", children: {}}
    tree.children.practice = {
        type: "Practice",
        channels: {app: "App"}
    }
    tree.children.mainMenu = {
        type: "MainMenu"
    }
    tree.children.help = {type: "Help"}
    tree.children.report = {
        type: "PracticeReport"
    }
    tree.children.reports = {
        type: "PracticeList"
    }
    tree.children.totalStats = {
        type: "TotalStats"
    }
    return tree
}

function createButton(parent, text, action) {
    var button, ttext;
    ttext = text
    button = html.addTag(
        parent,
        "div",
        ttext,
        "wide-button"
    )
    html.addEventListener(
        button,
        "click",
        action
    )
    return button
}

function createHeader(container, text) {
    var header, headerDiv;
    headerDiv = html.make(container, "div")
    headerDiv.style.whiteSpace = "nowrap"
    headerDiv.style.padding = "20px"
    headerDiv.style.paddingTop = "40px"
    header = html.addTag(
        headerDiv,
        "div",
        text
    )
    header.style.fontSize = "20px"
    header.style.fontWeight = "bold"
}

function createIcon(parent, src) {
    var icon;
    icon = html.make(parent, "img")
    icon.draggable = false
    icon.style.width = "40px"
    icon.style.height = "40px"
    icon.style.display = "inline-block"
    icon.style.verticalAlign = "bottom"
    icon.src = src
    return icon
}

function createScreenButton(self, parent, text, type, isDefault) {
    var button;
    button = createButton(
        parent,
        text,
        makeSend(self, {type: type})
    )
    if (isDefault) {
        button.style.background = "#F39C12"
    }
}

function createVerticalMid(parent) {
    var mid;
    mid = html.make(parent, "div")
    mid.style.display = "inline-block"
    mid.style.width = "100%"
    mid.style.left = "0px"
    mid.style.top = "50%"
    mid.style.transform = "translateY(-50%)"
    mid.style.position = "absolute"
    return mid
}

function createViewport(main) {
    var viewport;
    viewport = html.make(main, "div")
    viewport.style.maxWidth = "450px"
    viewport.style.overflowY = "auto"
    viewport.style.margin = "auto"
    viewport.style.height = "100vh"
    viewport.style.position = "relative"
    viewport.style.background = "white"
    return viewport
}

function flashDistract_onTimeout(self, data) {
    switch (self.state) {
        case "5_wait":
            self.state = "3";
            break;
        default:
            return;
    }
    flashDistract_run(self);
}

function flashDistract_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "6":
                module.sound.play()
                self.flash.style.transition = "none"
                self.flash.style.opacity = 1
                self.state = "5_wait";
                work = false;
                sm.sendMessage(self, "onTimeout", undefined, 200);
                break;
            case "3":
                self.flash.style.transition = "opacity 2s"
                self.flash.style.opacity = 0
                self.state = undefined;
                sm.sendMessage(self.parent, "onChildCompleted", undefined);
                work = false;
                break;
            default:
                return;
        }
    }
}

function flashDistract(parent, flash) {
    var self = sm.createMachine("flashDistract");
    self.flash = flash;
    sm.addMethod(self, "onTimeout", flashDistract_onTimeout);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", flashDistract_run);
    self.state = "6";
    return self;
}

function formatDate(isoDate) {
    var date;
    date = new Date(isoDate)
    return date.toLocaleString()
}

function formatSpan(date1, date2) {
    var mins, ms1, ms2, secs, tsecs;
    ms1 = date1.getTime()
    ms2 = date2.getTime()
    tsecs = (ms2 - ms1) / 1000
    mins = Math.floor(tsecs / 60)
    secs = Math.floor(tsecs % 60)
    if (mins === 0) {
        return tsecs.toFixed(2) + " сек."
    } else {
        return mins + " мин. " + secs + " сек."
    }
}

function getNow() {
    var now;
    now = new Date()
    return now.toISOString()
}

function getRadioValue(name) {
    var _5_col, _5_it, _5_length, input, inputs;
    inputs = document.getElementsByTagName(
        "input"
    )
    _5_it = 0;
    _5_col = inputs;
    _5_length = _5_col.length;
    while (true) {
        if (_5_it < _5_length) {
            input = _5_col[_5_it];
            if (((input.type === "radio") && (input.name === name)) && (input.checked)) {
                return input.id
            } else {
                _5_it++;
            }
        } else {
            return undefined
        }
    }
}

function getSelectObject() {
    var value;
    value = getRadioValue("object")
    window.localStorage.setItem(
        "last-object",
        value
    )
    return value
}

function initStyles() {
    html.addStyle(
        ".wide-button",
        [
            "padding:10px",
            "font-size:16px",
            "border-radius:3px",
            "background:#F9E79F",
            "color:black",
            "cursor:pointer",
            "user-select:none",
            "margin:40px",
            "margin-top:20px",
            "margin-bottom:20px",
            "text-align:center"
        ]
    )
    html.addStyle(
        ".wide-button:active",
        ["transform:translateY(2px)"]
    )
    html.addStyle(
        "label",
        ["padding:10px", "user-select:none"]
    )
    html.addStyle(
        "input[type=\"radio\"]",
        ["transform:scale(2)"]
    )
    html.addStyle(
        ".big-button",
        [
            "display:inline-block",
            "position:absolute",
            "bottom:0px",
            "left:0px",
            "width:100%",
            "height:calc(100% - 150px)",
            "background:black",
            "color:black",
            "user-select:none",
            "cursor:pointer"
        ]
    )
    html.addStyle(
        ".view",
        [
            "padding-left:20px",
            "padding-right:20px"
        ]
    )
    html.addStyle(
        ".mid",
        [
            "display:inline-block",
            "position:absolute",
            "max-width:60%",
            "top:50%",
            "left:50%",
            "transform:translate(-50%, -50%)",
            "text-align:center"
        ]
    )
    html.addStyle(
        "p",
        [
            "margin-bottom: 10px",
            "line-height:1.6"
        ]
    )
    html.addStyle(
        ".flash",
        [
            "display:inline-block",
            "position:absolute",
            "left:0px",
            "top:0px",
            "width:100%",
            "height:100%",
            "background:white",
            "opacity:0",
            "pointer-events: none"
        ]
    )
    html.addStyle(
        ".report-line",
        [
            "background:white",
            "user-select:none",
            "cursor:pointer",
            "padding-top:10px",
            "padding-bottom:10px",
            "border-bottom: solid 1px #aaaaaa"
        ]
    )
    html.addStyle(
        ".report-line:hover",
        ["background:#F7DC6F"]
    )
    html.addStyle(
        "ul",
        [
            "list-style-type: circle",
            "margin-left:20px"
        ]
    )
    html.addStyle(
        "li",
        [
            "text-align:justify",
            "line-height:1.6",
            "margin-bottom: 10px"
        ]
    )
    html.addStyle(
        ".back-red:hover, .back-red:active",
        ["background: darkred"]
    )
}

function makeSend(self, msg) {
    return function () {
        sendEvent(self, msg)
    }
}

function sendEvent(target, msg) {
    sm.sendMessage(target, "onEvent", msg)
}

function sendShow(app, view, data) {
    var msg;
    html.clear(app.screen)
    msg = {
        type: "show",
        container: app.screen,
        data: data
    }
    view.onEvent(msg)
}

function setUpScreen() {
    var main, viewport;
    main = html.get("main")
    main.style.height = "100vh"
    main.style.background = "grey"
    viewport = createViewport(main)
    return viewport
}

function showConcentrate(self) {
    var back, big, headerDiv, message, stop;
    function branch1() {
        html.clear(self.container)
        back = html.make(self.container, "div")
        back.style.background = "black"
        back.style.height = "100vh"
        headerDiv = html.make(back, "div")
        headerDiv.style.whiteSpace = "nowrap"
        headerDiv.style.padding = "20px"
        headerDiv.style.paddingTop = "40px"
        headerDiv.style.height = "140px"
        stop = createButton(
            headerDiv,
            "Стоп",
            makeSend(self, {type: "stop"})
        )
        stop.style.background = "darkred"
        stop.style.color = "white"
        return branch2();
    }

    function branch2() {
        big = html.addTag(
            back,
            "div",
            "",
            "big-button"
        )
        message = html.addTag(
            big,
            "div",
            "Отвлёкся? Нажми здесь",
            "mid"
        )
        message.style.color = "#F39C12"
        html.addEventListener(
            big,
            "click",
            function () {
                self.onEvent({type: "distract"})
            }
        )
        return branch3();
    }

    function branch3() {
        self.flash = html.make(
            big,
            "div",
            "flash"
        )
        return branch4();
    }

    function branch4() {
    }

    return branch1();
}

function showPracticeStart(self) {
    var last, object, view;
    view = html.make(
        self.container,
        "div",
        "view"
    )
    createHeader(
        view,
        "На чём концентрация?"
    )
    object = html.make(view, "div")
    addRadio(
        object,
        "object",
        "Ни на чём",
        true
    )
    addRadio(
        object,
        "object",
        "На пустоте",
        true
    )
    addRadio(object, "object", "На дыхании")
    addRadio(
        object,
        "object",
        "На позвоночнике"
    )
    addRadio(
        object,
        "object",
        "На межбровии"
    )
    addRadio(object, "object", "На сердце")
    addRadio(
        object,
        "object",
        "На точке во внешнем мире"
    )
    last = window.localStorage.getItem(
        "last-object"
    )
    if (last) {
        html.get(last).checked = true
    }
    createScreenButton(
        self,
        view,
        "Начать",
        "start",
        true
    )
    createScreenButton(
        self,
        view,
        "Отмена",
        "cancel",
        false
    )
}

function showYesNo_onEvent(self, data) {
    switch (self.state) {
        case "19_wait":
            self.msg = data;
            self.state = "22";
            break;
        default:
            return;
    }
    showYesNo_run(self);
}

function showYesNo_run(self) {
    var work = true;
    while (work) {
        switch (self.state) {
            case "3":
                self.main = html.get("main")
                self.container = html.make(
                    self.main,
                    "div"
                )
                self.container.style.display = "inline-block"
                self.container.style.position = "fixed"
                self.container.style.left = "0px"
                self.container.style.top = "0px"
                self.container.style.width = "100vw"
                self.container.style.height = "100vh"
                self.container.style.background = "white"
                self.container.style.zIndex = 10
                self.viewport = createViewport(
                    self.container
                )
                self.state = "15";
                break;
            case "15":
                self.mid = createVerticalMid(
                    self.viewport
                )
                self.qu = html.addTag(
                    self.mid,
                    "p",
                    self.question
                )
                self.qu.style.margin = "40px"
                createScreenButton(
                    self,
                    self.mid,
                    self.yes,
                    "yes",
                    true
                )
                createScreenButton(
                    self,
                    self.mid,
                    self.no,
                    "cancel",
                    false
                )
                self.state = "19";
                break;
            case "19":
                self.state = "19_wait";
                work = false;
                break;
            case "22":
                html.removeElement(self.container)
                if (self.msg.type === "yes") {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", true);
                    work = false;
                } else {
                    self.state = undefined;
                    sm.sendMessage(self.parent, "onChildCompleted", false);
                    work = false;
                }
                break;
            default:
                return;
        }
    }
}

function showYesNo(parent, question, yes, no) {
    var self = sm.createMachine("showYesNo");
    self.question = question;
    self.yes = yes;
    self.no = no;
    sm.addMethod(self, "onEvent", showYesNo_onEvent);
    sm.addChild(parent, self);
    sm.addMethod(self, "run", showYesNo_run);
    self.state = "3";
    return self;
}

module.App = App;

module.Help = Help;

module.MainMenu = MainMenu;

module.Practice = Practice;

module.PracticeList = PracticeList;

module.PracticeReport = PracticeReport;

module.TotalStats = TotalStats;

module.buildTree = buildTree;

return module;

}
