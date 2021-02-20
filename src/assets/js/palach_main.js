// Created with Drakon Tech https://drakon.tech/

function palach_main() {

var module = {};

function addReport(report) {
    var key, list;
    key = report.start
    list = getReportsList()
    list.push(key)
    saveReportsList(list)
    window.localStorage.setItem(
        key,
        JSON.stringify(report)
    )
}

function getAllReports() {
    var _9_col, _9_it, _9_length, key, list, report, result, str;
    list = getReportsList()
    result = []
    _9_it = 0;
    _9_col = list;
    _9_length = _9_col.length;
    while (true) {
        if (_9_it < _9_length) {
            key = _9_col[_9_it];
            str = window.localStorage.getItem(key)
            report = JSON.parse(str)
            result.push(report)
            _9_it++;
        } else {
            break;
        }
    }
    return result
}

function getReportsList() {
    var list, listStr;
    listStr = window.localStorage.getItem(
        "reports"
    ) || "[]"
    list = JSON.parse(listStr)
    return list
}

function removeReport(key) {
    var index, reports;
    reports = getReportsList()
    index = reports.indexOf(key)
    if (index == -1) {
    } else {
        reports.splice(index, 1)
        saveReportsList(reports)
        window.localStorage.setItem(
            key,
            undefined
        )
    }
}

function saveReportsList(reports) {
    window.localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    )
}

module.addReport = addReport;

module.getAllReports = getAllReports;

module.removeReport = removeReport;

return module;

}
