"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var graphs_component_1 = require("./graphs/graphs.component");
var team_component_1 = require("./team/team.component");
var bugs_component_1 = require("./bugs/bugs.component");
exports.router = [
    { path: '', redirectTo: 'graphs', pathMatch: 'full' },
    { path: 'graphs', component: graphs_component_1.GraphsComponent },
    { path: 'team', component: team_component_1.TeamComponent },
    { path: 'bugs', component: bugs_component_1.BugsComponent }
];
exports.routes = router_1.RouterModule.forRoot(exports.router);
//# sourceMappingURL=app.routes.js.map