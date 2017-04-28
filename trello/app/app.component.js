"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n        <nav class=\"navbar bg-faded\">\n            <a class=\"navbar-brand\" routerLink=\"graphs\">Graphs</a>\n            <a class=\"navbar-brand\" routerLink=\"team\">Team</a>\n            <a class=\"navbar-brand\" routerLink=\"bugs\">Bugs</a>\n        </nav>\n\n        <router-outlet></router-outlet>\n    ",
        styles: ["\n        .jumbotron { box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2); }\n        .navbar-brand { color: white; }\n        .navbar-brand:hover { color: grey; cursor: pointer; }\n    "]
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map