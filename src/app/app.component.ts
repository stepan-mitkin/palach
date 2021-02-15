import { Component } from '@angular/core';

declare const common_mod: any;
declare const html_mod: any;
declare const sm_mod: any;
declare const pyramid_mod: any;
declare const palach_mod: any;
declare const palach_main: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ngAfterViewInit() {
    var common = common_mod()
    var html = html_mod()
    var sm = sm_mod()
    var pyramid = pyramid_mod(common, sm)
    var storage = palach_main(common)
    var config = {
      logo: "/assets/images/enneagram.png",
      distract: "/assets/sounds/button-10.mp3"
    }
    var palach = palach_mod(common, sm, html, storage, config)
    var tree = palach.buildTree()
    var app = pyramid.build(tree, palach)
    pyramid.traverseUp(app.root, "run")
  }
}
