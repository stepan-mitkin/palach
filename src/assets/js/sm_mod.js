// Created with Drakon Tech https://drakon.tech/

function sm_mod() {

var module = {};



function addChild(parent, child) {
    child.parent = parent
}

function addMethod(machine, name, method) {
    machine[name] = function (a, b, c) {
        if (machine.state) {
            return method(machine, a, b, c)
        }
    }
}

function createMachine(type, parent) {
    var machine;
    machine = {
        type: type,
        state: "created",
        parent: parent
    }
    return machine
}

function delayCallback(machine, context, name, msg) {
    var handler;
    if (context.cancelled) {
    } else {
        handler = machine[name]
        if (handler) {
            handler(msg)
        }
    }
}

function handleError(machine, exception) {
    console.log(machine)
    module.handleException(exception)
}

function handleException(machine, exception) {
    console.error(machine, exception)
}

function killMachine(machine) {
    if (machine) {
        machine.state = undefined
    }
}

function remove(array, item) {
    var index;
    index = array.indexOf(item)
    if (index === -1) {
    } else {
        array.splice(index, 1)
    }
}

function sendMessage(machine, name, msg, timeout) {
    var action, callback, timerId;
    if (machine) {
        action = machine[name]
        if (action) {
            callback = function () {
                try {
                    action(msg)
                } catch (ex) {
                    module.handleException(
                        machine,
                        ex
                    )
                }
            }
            timeout = timeout || 0
            timerId = setTimeout(callback, timeout)
            return timerId
        }
    }
}

module.addChild = addChild;

module.addMethod = addMethod;

module.createMachine = createMachine;

module.handleError = handleError;

module.handleException = handleException;

module.killMachine = killMachine;

module.sendMessage = sendMessage;

return module;

}
