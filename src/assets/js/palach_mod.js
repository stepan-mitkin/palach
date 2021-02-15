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
                sm.sendMessage(
                    self,
                    "onEvent",
                    {type: "main-menu"}
                )
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
                                        self.allReports = storage.getAllReports()
                                        self.allReports.reverse()
                                        sendShow(
                                            self,
                                            self.reports,
                                            self.allReports
                                        )
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
                    self.object = self.msg.object
                    self.distractions = []
                    showConcentrate(self)
                    self.state = "24";
                } else {
                    if (self._sw_32 === "cancel") {
                        sm.sendMessage(
                            self.parent,
                            "onEvent",
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
                sm.sendMessage(
                    self.parent,
                    "onEvent",
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

function PracticeList(parent) {
    return SimpleScreen(
        parent,
        buildPracticeList
    )
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
                sm.sendMessage(
                    self.parent,
                    "onEvent",
                    self.msg
                )
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
    var date, line, msg;
    msg = {type: "report", report: report}
    date = formatDate(report.start)
    line = html.addTag(
        self.container,
        "div",
        date,
        "report-line"
    )
    html.addEventListener(
        line,
        "click",
        function () {
            self.onEvent(msg)
        }
    )
}

function buildHelp(self) {
    var header, headerDiv, list, practice;
    function branch1() {
        html.clear(self.container)
        headerDiv = html.make(
            self.container,
            "div"
        )
        headerDiv.style.whiteSpace = "nowrap"
        headerDiv.style.padding = "20px"
        headerDiv.style.paddingTop = "40px"
        header = html.addTag(
            headerDiv,
            "div",
            "Как играть"
        )
        header.style.fontSize = "20px"
        header.style.fontWeight = "bold"
        practice = createButton(
            self.container,
            "В начало",
            makeSend(self, {type: "main-menu"})
        )
        practice.style.background = "#F39C12"
        return branch2();
    }

    function branch2() {
        html.addTag(
            self.container,
            "p",
            "\"Палач\" — упражнение на укрепление внимания и улучшение концентрации."
        )
        list = html.make(self.container, "ul")
        html.addTag(
            list,
            "li",
            "Остановите поток мыслей. Выключите \"внутренний диалог\"."
        )
        html.addTag(
            list,
            "li",
            "Как только заметите, что отвлеклись, нажмите на жёлтую часть экрана."
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
    var header, headerDiv, img, practice, site;
    html.clear(self.container)
    headerDiv = html.make(
        self.container,
        "div"
    )
    headerDiv.style.whiteSpace = "nowrap"
    headerDiv.style.padding = "20px"
    headerDiv.style.paddingTop = "40px"
    img = html.make(headerDiv, "img")
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
    practice = createButton(
        self.container,
        "Практика",
        makeSend(
            self,
            {type: "practice"}
        )
    )
    practice.style.background = "#F39C12"
    createButton(
        self.container,
        "Журнал",
        makeSend(
            self,
            {type: "practices"}
        )
    )
    createButton(
        self.container,
        "Как играть",
        makeSend(self, {type: "help"})
    )
    site = html.addTag(
        self.container,
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
    var _12_col, _12_it, _12_length, header, headerDiv, practice, report;
    function branch1() {
        html.clear(self.container)
        headerDiv = html.make(
            self.container,
            "div"
        )
        headerDiv.style.whiteSpace = "nowrap"
        headerDiv.style.padding = "20px"
        headerDiv.style.paddingTop = "40px"
        header = html.addTag(
            headerDiv,
            "div",
            "Журнал"
        )
        header.style.fontSize = "20px"
        header.style.fontWeight = "bold"
        practice = createButton(
            self.container,
            "В начало",
            makeSend(self, {type: "main-menu"})
        )
        practice.style.background = "#F39C12"
        return branch2();
    }

    function branch2() {
        _12_it = 0;
        _12_col = self.data;
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
    var average, date, end, header, headerDiv, practice, start;
    function branch1() {
        html.clear(self.container)
        headerDiv = html.make(
            self.container,
            "div"
        )
        headerDiv.style.whiteSpace = "nowrap"
        headerDiv.style.padding = "20px"
        headerDiv.style.paddingTop = "40px"
        date = formatDate(self.data.start)
        header = html.addTag(
            headerDiv,
            "div",
            "Отчёт по практике"
        )
        header.style.fontSize = "20px"
        header.style.fontWeight = "bold"
        html.addTag(self.container, "p", date)
        practice = createButton(
            self.container,
            "В начало",
            makeSend(self, {type: "main-menu"})
        )
        practice.style.background = "#F39C12"
        createButton(
            self.container,
            "Журнал",
            makeSend(self, {type: "practices"})
        )
        return branch2();
    }

    function branch2() {
        start = new Date(self.data.start)
        end = new Date(self.data.end)
        addNameValue(
            self.container,
            "Начало",
            formatDate(self.data.start)
        )
        addNameValue(
            self.container,
            "Конец",
            formatDate(self.data.end)
        )
        addNameValue(
            self.container,
            "Предмет",
            self.data.object
        )
        addNameValue(
            self.container,
            "Время концентрации",
            formatSpan(start, end)
        )
        addNameValue(
            self.container,
            "Отвлечения",
            self.data.distractions.length.toString()
        )
        average = (
            (end.getTime() - start.getTime()) / (
                self.data.distractions.length + 1
            )
        ) / 1000
        addNameValue(
            self.container,
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
    tree = {
        type: "App",
        capsule: true,
        children: {}
    }
    tree.children.practice = {
        type: "Practice",
        capsule: true,
        signals: {
            onCompleted: {
                target: "App",
                type: "practice-completed"
            }
        }
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
            "background:#F39C12",
            "color:black",
            "user-select:none",
            "cursor:pointer"
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
            "padding:10px"
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
}

function makeSend(self, msg) {
    return function () {
        sm.sendMessage(self, "onEvent", msg)
    }
}

function onStartPractice(self) {
    var value;
    value = getRadioValue("object")
    window.localStorage.setItem(
        "last-object",
        value
    )
    console.log(value)
    self.onEvent(
        {type: "start", object: value}
    )
}

function sendShow(app, view, data) {
    var msg;
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
    viewport = html.make(main, "div")
    viewport.style.maxWidth = "350px"
    viewport.style.maxWidth = "400px"
    viewport.style.overflowY = "auto"
    viewport.style.margin = "auto"
    viewport.style.paddingLeft = "10px"
    viewport.style.paddingRight = "10px"
    viewport.style.height = "100vh"
    viewport.style.position = "relative"
    viewport.style.background = "white"
    return viewport
}

function showConcentrate(self) {
    var big, headerDiv, message, stop;
    function branch1() {
        html.clear(self.container)
        headerDiv = html.make(
            self.container,
            "div"
        )
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
            self.container,
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
    var header, headerDiv, last, object, practice;
    html.clear(self.container)
    headerDiv = html.make(
        self.container,
        "div"
    )
    headerDiv.style.whiteSpace = "nowrap"
    headerDiv.style.padding = "20px"
    headerDiv.style.paddingTop = "40px"
    header = html.addTag(
        headerDiv,
        "div",
        "На чём концентрация?"
    )
    header.style.fontSize = "20px"
    header.style.fontWeight = "bold"
    object = html.make(self.container, "div")
    addRadio(
        object,
        "object",
        "Ни на чём",
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
    practice = createButton(
        self.container,
        "Начать",
        function () {
            onStartPractice(self)
        }
    )
    createButton(
        self.container,
        "Отмена",
        makeSend(self, {type: "cancel"})
    )
    practice.style.background = "#F39C12"
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
