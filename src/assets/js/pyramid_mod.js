// Created with Drakon Tech https://drakon.tech/

function pyramid_mod() {

var module = {};

var common = arguments[0]
var sm = arguments[1]

function addArrayAdd(node, name, childSchema, context) {
    var methodName;
    methodName = "add" + common.initCap(name)
    node[methodName] = function () {
        return addToArray(
            childSchema,
            context,
            node,
            name
        )
    }
}

function addMapAdd(node, name, childSchema, context) {
    var methodName;
    methodName = "add" + common.initCap(name)
    node[methodName] = function (key) {
        return addToMap(
            childSchema,
            context,
            node,
            name,
            key
        )
    }
}

function addSignal(node, name, target, type) {
    var callback;
    callback = function (self, data) {
        var msg = {type: type, data: data}
        sm.sendMessage(
            target,
            "onEvent",
            msg
        )
    }
    sm.addMethod(node, name, callback)
}

function addToArray(childSchema, context, node, name) {
    var array, childNode;
    childNode = buildNode(
        childSchema,
        context,
        node
    )
    array = node.below[name]
    array.push(childNode)
    buildAboveLinks(childNode)
    return childNode
}

function addToMap(childSchema, context, node, name, key) {
    var childNode, map;
    if (key.toLowerCase() === "id") {
        throw new Error(
            "Cannot use \"Id\" as a key"
        )
    } else {
        childNode = buildNode(
            childSchema,
            context,
            node
        )
        map = node.below[name]
        map[key] = childNode
        buildAboveLinks(childNode)
        return childNode
    }
}

function build(schema, factories) {
    var capsule, context, parent;
    parent = undefined
    capsule = {state: "created"}
    context = {
        factories: factories,
        nextId: 1,
        capsule: capsule
    }
    capsule.root = buildNode(
        schema,
        context,
        parent
    )
    buildAboveLinks(capsule.root)
    return capsule
}

function buildAboveForNode(node) {
    var _8_col, _8_it, _8_keys, _8_length, channels, propName, targetName;
    if (node.channels) {
        channels = {}
        _8_it = 0;
        _8_col = node.channels;
        _8_keys = Object.keys(_8_col);
        _8_length = _8_keys.length;
        while (true) {
            if (_8_it < _8_length) {
                propName = _8_keys[_8_it];
                targetName = _8_col[propName];
                channels[propName] = findNode(
                    node,
                    targetName
                )
                _8_it++;
            } else {
                break;
            }
        }
        node.channels = channels
    }
}

function buildAboveLinks(node) {
    traverseWithAction(
        node,
        buildAboveForNode
    )
}

function buildNode(schema, context, parent) {
    var _59_col, _59_it, _59_keys, _59_length, builder, child, childSchema, name, node;
    function branch1() {
        if (schema.type) {
            builder = context.factories[schema.type]
            if (builder) {
                node = builder(parent)
                return branch2();
            } else {
                throw new Error(
                    "Builder \"" + schema.type + "\" not found"
                )
            }
        } else {
            node = {}
            return branch2();
        }
    }

    function branch2() {
        if (schema.channels) {
            node.channels = schema.channels
        }
        node.id = context.nextId.toString()
        context.nextId++
        if (node.parent) {
        } else {
            node.parent = parent
        }
        return branch3();
    }

    function branch3() {
        if (schema.children) {
            _59_it = 0;
            _59_col = schema.children;
            _59_keys = Object.keys(_59_col);
            _59_length = _59_keys.length;
            while (true) {
                if (_59_it < _59_length) {
                    name = _59_keys[_59_it];
                    childSchema = _59_col[name];
                    child = buildNode(
                        childSchema,
                        context,
                        node
                    )
                    node[name] = child
                    _59_it++;
                } else {
                    break;
                }
            }
        }
        return branch4();
    }

    function branch4() {
        if (schema.data) {
            common.copyProps(schema.data, node)
        }
        return branch5();
    }

    function branch5() {
        return node
    }

    return branch1();
}

function connectChannel(capsule, node, channel) {
    capsule[channel] = function (arg) {
        return (node[channel])(arg)
    }
}

function findNode(node, target) {
    var found;
    function branch1() {
        while (true) {
            if (nodeMatches(node, target)) {
                found = node
                return branch3();
            } else {
                if (node.parent) {
                    node = node.parent
                } else {
                    return branch2();
                }
            }
        }
    }

    function branch2() {
        found = findNodeBelow(node, target)
        if (found) {
            return branch3();
        } else {
            throw new Error(
                "Target node \"" + target + "\" not found up in the tree"
            )
        }
    }

    function branch3() {
        return found
    }

    return branch1();
}

function findNodeBelow(node, target) {
    var _19_col, _19_it, _19_keys, _19_length, found, name, prop;
    if (nodeMatches(node, target)) {
        return node
    } else {
        _19_it = 0;
        _19_col = node;
        _19_keys = Object.keys(_19_col);
        _19_length = _19_keys.length;
        while (true) {
            if (_19_it < _19_length) {
                name = _19_keys[_19_it];
                prop = _19_col[name];
                if (isNode(name, prop)) {
                    found = findNodeBelow(prop, target)
                    if (found) {
                        return found
                    } else {
                        _19_it++;
                    }
                } else {
                    _19_it++;
                }
            } else {
                return undefined
            }
        }
    }
}

function isNode(name, obj) {
    if ((!((name === "parent") || (name === "channels"))) && ((obj) && (obj.id))) {
        return true
    } else {
        return false
    }
}

function nameAction(node, name, input) {
    var action;
    action = node[name]
    if (action) {
        return action(node, input)
    } else {
        return input
    }
}

function nodeMatches(node, target) {
    if (node.type === target) {
        return node
    } else {
        return undefined
    }
}

function traverse(node, name, input, lowOnly) {
    var action;
    action = function (node, prevInput) {
        return nameAction(
            node,
            name,
            prevInput
        )
    }
    module.traverseWithAction(
        node,
        action,
        input,
        lowOnly
    )
}

function traverseChildren(node, action, input) {
    var _5_col, _5_it, _5_keys, _5_length, child, childName;
    _5_it = 0;
    _5_col = node;
    _5_keys = Object.keys(_5_col);
    _5_length = _5_keys.length;
    while (true) {
        if (_5_it < _5_length) {
            childName = _5_keys[_5_it];
            child = _5_col[childName];
            if (isNode(childName, child)) {
                traverseCore(child, action, input)
            }
            _5_it++;
        } else {
            break;
        }
    }
}

function traverseCore(node, action, input) {
    var output;
    output = action(node, input)
    traverseChildren(node, action, output)
}

function traverseUp(node, name) {
    var action;
    action = function (node) {
        return nameAction(
            node,
            name,
            undefined
        )
    }
    module.traverseWithActionUp(node, action)
}

function traverseWithAction(node, action, input, lowOnly) {
    if (lowOnly) {
        traverseChildren(node, action, input)
    } else {
        traverseCore(node, action, input)
    }
}

function traverseWithActionUp(node, action) {
    var _5_col, _5_it, _5_keys, _5_length, child, childName;
    _5_it = 0;
    _5_col = node;
    _5_keys = Object.keys(_5_col);
    _5_length = _5_keys.length;
    while (true) {
        if (_5_it < _5_length) {
            childName = _5_keys[_5_it];
            child = _5_col[childName];
            if (isNode(childName, child)) {
                traverseWithActionUp(child, action)
            }
            _5_it++;
        } else {
            break;
        }
    }
    action(node)
}

module.build = build;

module.traverse = traverse;

module.traverseUp = traverseUp;

module.traverseWithAction = traverseWithAction;

module.traverseWithActionUp = traverseWithActionUp;

return module;

}
