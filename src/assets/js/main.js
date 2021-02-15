(function () {
    var common = common_mod()
    var html = html_mod()
    var sm = sm_mod()
    var pyramid = pyramid_mod(common)
    var storage = palach_main(common)
    var config = {
        logo: "/assets/images/enneagram.png",
        distract: "/assets/sounds/button-10.mp3"
    }
    var palach = palach_mod(common, sm, html, storage, config)
    var tree = palach.buildTree()
    var app = pyramid.build(tree, palach)
    pyramid.traverseUp(app.root, "run")
})()