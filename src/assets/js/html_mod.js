// Created with Drakon Tech https://drakon.tech/

function html_mod() {

var module = {};

function addAfter(before, tag, className) {
    var element;
    element = document.createElement(tag)
    element.className = className || ""
    before.parentNode.insertBefore(
        element,
        before.nextSibling
    )
    return element
}

function addEventListener(element, name, action) {
    element.addEventListener(name, action)
}

function addStyle(header, lines) {
    var addSemi, body, content, styleSheet;
    addSemi = function (line) {
        return "    " + line.trim() + ";"
    }
    body = lines.map(addSemi).join("\n")
    content = "\n" + header + " {\n" + body +
    "\n}\n"
    styleSheet = document.createElement(
        "style"
    )
    styleSheet.type = "text/css"
    styleSheet.innerHTML = content
    document.head.appendChild(styleSheet)
}

function addTag(parent, tag, text, className) {
    var element;
    element = make(parent, tag, className)
    setText(element, text)
    return element
}

function addText(div, text) {
    var node;
    node = document.createTextNode(text)
    div.appendChild(node)
}

function buildXhrCallback(self, xhr, requestId, onError) {
    return function () {
        try {
            onRequestStatusChange(
                self,
                xhr,
                requestId
            )
        } catch (ex) {
            onError(self, ex)
        }
    }
}

function centerDiv(div) {
    div.style.position = "absolute"
    div.style.display = "inline-block"
    div.style.left = "50%"
    div.style.top = "50%"
    div.style.transform = "translate(-50%, -50%)"
}

function clear(element) {
    element.innerHTML = ""
}

function copyHeaders(options, xhr) {
    var _5_col, _5_it, _5_keys, _5_length, header, headers, value;
    headers = options.headers
    if (headers) {
        _5_it = 0;
        _5_col = headers;
        _5_keys = Object.keys(_5_col);
        _5_length = _5_keys.length;
        while (true) {
            if (_5_it < _5_length) {
                header = _5_keys[_5_it];
                value = _5_col[header];
                xhr.setRequestHeader(header, value)
                _5_it++;
            } else {
                break;
            }
        }
    }
}

function get(id) {
    var element;
    element = document.getElementById(id)
    if (element) {
        return element
    } else {
        throw new Error("get: element not found. id: " + id)
    }
}

function getDocRoot() {
    return document.body
}

function getLSItem(key) {
    return window.localStorage.getItem(key)
}

function getLocation() {
    var _14_col, _14_it, _14_length, key, keyValue, location, part, parts, query, search, value;
    function branch1() {
        location = window.location
        query = {}
        search = location.search || ""
        if (search) {
            search = search.substring(1)
            parts = search.split("&")
            return branch2();
        } else {
            return branch3();
        }
    }

    function branch2() {
        _14_it = 0;
        _14_col = parts;
        _14_length = _14_col.length;
        while (true) {
            if (_14_it < _14_length) {
                part = _14_col[_14_it];
                keyValue = part.split("=")
                key = decodeURI(keyValue[0])
                value = decodeURI(keyValue[1])
                query[key] = value
                _14_it++;
            } else {
                break;
            }
        }
        return branch3();
    }

    function branch3() {
        return {
            href: location.href,
            port: location.port,
            host: location.host,
            hostname: location.hostname,
            origin: location.origin,
            pathname: location.pathname,
            query: query
        }
    }

    return branch1();
}

function getRect(element) {
    var height, rect, width;
    rect = element.getBoundingClientRect()
    width = rect.right - rect.left
    height = rect.bottom - rect.top
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
    }
}

function goTo(url) {
    window.location.href = url
}

function make(parent, tag, className) {
    var element;
    element = document.createElement(tag)
    element.className = className || ""
    parent.appendChild(element)
    return element
}

function makeRandomCookie() {
    var cookie;
    cookie = Math.round(
        Math.random() * 1000000000
    )
    return cookie
}

function noSelect() {
    return "-webkit-user-select: none;" + "-moz-user-select: none;"
    + "-ms-user-select: none;" + "user-select: none"
}

function onRequestStatusChange(self, request, requestId) {
    var result;
    if ((request.readyState === 4) && (self.requestId === requestId)) {
        result = {
            responseText: request.responseText,
            status: request.status,
            type: "data"
        }
        if (request.responseText) {
            try {
                result.body = JSON.parse(
                    request.responseText
                )
            } catch (ex) {}
        }
        self.onEvent(result)
    }
}

function registerShortcut(handler) {
    document.addEventListener(
        "keydown",
        handler,
        true
    )
}

function removeElement(element) {
    element.parentNode.removeChild(element)
}

function setCollectionContent(parent, items, maker) {
    parent.innerHTML = ""
    if (items) {
        items.forEach(
            function (item) {
                maker(parent, item)
            }
        )
    }
}

function setLSItem(key, value) {
    return window.localStorage.setItem(
        key,
        value
    )
}

function setText(div, text) {
    div.innerHTML = ""
    addText(div, text)
}

function setTitle(title) {
    document.title = title
}

function startApiCall(self, options, onError) {
    var json, xhr;
    function branch1() {
        xhr = new XMLHttpRequest()
        self.requestId = makeRandomCookie()
        xhr.onreadystatechange = buildXhrCallback(
            self,
            xhr,
            self.requestId,
            onError
        )
        xhr.open(
            options.method || "POST",
            options.url,
            true
        )
        return branch2();
    }

    function branch2() {
        copyHeaders(options, xhr)
        if (options.body) {
            xhr.setRequestHeader(
                "Content-Type",
                "application/json"
            )
            json = JSON.stringify(options.body)
            xhr.send(json)
        } else {
            xhr.send()
        }
        return branch3();
    }

    function branch3() {
    }

    return branch1();
}

module.addAfter = addAfter;

module.addEventListener = addEventListener;

module.addStyle = addStyle;

module.addTag = addTag;

module.addText = addText;

module.centerDiv = centerDiv;

module.clear = clear;

module.get = get;

module.getDocRoot = getDocRoot;

module.getLSItem = getLSItem;

module.getLocation = getLocation;

module.getRect = getRect;

module.goTo = goTo;

module.make = make;

module.makeRandomCookie = makeRandomCookie;

module.noSelect = noSelect;

module.registerShortcut = registerShortcut;

module.removeElement = removeElement;

module.setCollectionContent = setCollectionContent;

module.setLSItem = setLSItem;

module.setText = setText;

module.setTitle = setTitle;

module.startApiCall = startApiCall;

return module;

}
