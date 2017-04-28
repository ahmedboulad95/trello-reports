"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var trello_service_1 = require("../services/trello.service");
var ng2_charts_1 = require("ng2-charts/ng2-charts");
var GraphsComponent = (function () {
    function GraphsComponent(trelloService, ref) {
        this.trelloService = trelloService;
        this.ref = ref;
        //******************************************Pie Chart*********************************************//
        this.pieChartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };
        this.pieChartLabels = [];
        this.pieChartData = []; //[9, 3, 4, 8, 6, 1, 5, 4];
        this.pieChartType = 'pie';
        //*********************************************************************************************//
        //******************************************Bar Graph*****************************************//
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
            }
        };
        this.barChartLabels = [];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [{ data: [], label: 'Story Points Completed' }];
        //*******************************************************************************************//
        this.boards = [];
        this.boardID = '';
        this.currentBoardName = '';
        this.sprint = '';
        this.sprintLists = [];
        this.currentSprintLists = [];
        this.pieReady = false;
        this.chartType = "pie";
        this.completedBoardId = '';
        this.graphsReady = false;
        this.completedBoardName = '';
        this.numSprints = [];
        this.getBoards();
    }
    // events
    GraphsComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    GraphsComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    GraphsComponent.prototype.setCompletedBoard = function () {
        this.setBoards();
    };
    GraphsComponent.prototype.setReady = function () {
        this.graphsReady = true;
        this.setBoards();
    };
    GraphsComponent.prototype.refresh = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.chart && _this.chart.chart && _this.chart.chart.config) {
                _this.chart.chart.update();
            }
        });
    };
    GraphsComponent.prototype.changeChartType = function (type) {
        this.chartType = type;
    };
    //Retrieves all the boards belonging to the member that is logged in
    GraphsComponent.prototype.getBoards = function () {
        var _this = this;
        this.trelloService.trello.get('/member/me/boards?lists=all', function (boards) { return _this.boards = boards; }, function (error) { return console.log(error); });
    };
    //Sets an array of boards and the completed board and the current board we are interested in
    GraphsComponent.prototype.setBoards = function () {
        for (var _i = 0, _a = this.boards; _i < _a.length; _i++) {
            var board = _a[_i];
            if (board.name == this.completedBoardName)
                this.completedBoard = board;
            if (board.name == this.currentBoardName)
                this.currentBoard = board;
        }
        this.getData();
        this.getLists();
    };
    //Pie chart
    GraphsComponent.prototype.getData = function () {
        var _this = this;
        this.trelloService.trello.get('/boards/' + this.currentBoard.id + '/members', function (members) { return _this.setMembers(members); });
    };
    //Pie chart labels
    GraphsComponent.prototype.setMembers = function (members) {
        this.members = members;
        var m = [];
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            m.push(member.fullName);
            this.pieChartData.push(0);
        }
        this.pieChartLabels = m;
        this.ref.markForCheck();
    };
    GraphsComponent.prototype.getLists = function () {
        var _this = this;
        this.trelloService.trello.get('/boards/' + this.completedBoard.id + '/lists?cards=all', function (lists) {
            _this.numSprints = [];
            var count = 1;
            for (var _i = 0, lists_1 = lists; _i < lists_1.length; _i++) {
                var list = lists_1[_i];
                if (list.name.includes("Sprint") || list.name.includes("sprint")) {
                    _this.sprintLists.push(list);
                    _this.numSprints.push(count);
                    count++;
                }
            }
            _this.numSprints.push(count);
            _this.bargraphLists(lists);
            _this.trelloService.trello.get('/boards/' + _this.currentBoard.id + '/lists?cards=all', function (lists) {
                _this.pieChartData = [];
                for (var _i = 0, _a = _this.pieChartLabels; _i < _a.length; _i++) {
                    var item = _a[_i];
                    _this.pieChartData.push(0);
                }
                _this.currentSprintLists = [];
                for (var _b = 0, lists_2 = lists; _b < lists_2.length; _b++) {
                    var list = lists_2[_b];
                    if (list.name.includes("Sprint") || list.name.includes("sprint")) {
                        _this.currentSprintLists.push(list);
                    }
                }
                for (var _c = 0, _d = _this.currentSprintLists; _c < _d.length; _c++) {
                    var list = _d[_c];
                    _this.trelloService.trello.get('/list/' + list.id + '/cards?members=true', function (cards) { return _this.calculateStoryPoints(cards); });
                }
                _this.ref.markForCheck();
            });
        });
        this.refresh();
    };
    GraphsComponent.prototype.calculateStoryPoints = function (cards) {
        var _pieChartData = this.pieChartData;
        for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card = cards_1[_i];
            for (var _a = 0, _b = card.members; _a < _b.length; _a++) {
                var member = _b[_a];
                var currMember = this.findMember(member.fullName);
                _pieChartData[currMember] += Number(card.name.substring(1, card.name.indexOf(')')));
            }
        }
        this.pieChartData = _pieChartData;
    };
    GraphsComponent.prototype.findMember = function (name) {
        for (var i = 0; i < this.pieChartLabels.length; i++) {
            if (this.pieChartLabels[i] == name) {
                return i;
            }
        }
    };
    GraphsComponent.prototype.bargraphLists = function (lists) {
        var sprints = [];
        for (var _i = 0, lists_3 = lists; _i < lists_3.length; _i++) {
            var list = lists_3[_i];
            if (list.name.includes("Sprint"))
                sprints.push(list);
        }
        var points = [];
        var labels = [];
        for (var _a = 0, sprints_1 = sprints; _a < sprints_1.length; _a++) {
            var list = sprints_1[_a];
            var pointCount = 0;
            labels.push(list.name.substring(7, 8));
            for (var _b = 0, _c = list.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                pointCount += Number(card.name.substring(1, 2));
            }
            points.push(pointCount);
        }
        this.barChartLabels = labels;
        this.barChartData[0].data = points;
    };
    GraphsComponent.prototype.changeSprint = function () {
        this.pieChartData = [];
        for (var _i = 0, _a = this.pieChartLabels; _i < _a.length; _i++) {
            var item = _a[_i];
            this.pieChartData.push(0);
        }
        var newSprint = Number(this.sprint);
        if (newSprint == Number(this.numSprints.length)) {
            this.recalculatePieValues(this.currentSprintLists, 2);
        }
        else {
            this.recalculatePieValues(this.sprintLists[newSprint - 1], 1);
        }
        this.refresh();
    };
    GraphsComponent.prototype.recalculatePieValues = function (list, listSize) {
        var _this = this;
        if (listSize > 1) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                this.trelloService.trello.get('/list/' + item.id + '/cards?members=true', function (cards) { return _this.calculateStoryPoints(cards); });
            }
        }
        else {
            this.trelloService.trello.get('/list/' + list.id + '/cards?members=true', function (cards) { return _this.calculateStoryPoints(cards); });
        }
        this.ref.markForCheck();
    };
    return GraphsComponent;
}());
__decorate([
    core_1.ViewChild(ng2_charts_1.BaseChartDirective),
    __metadata("design:type", typeof (_a = typeof ng2_charts_1.BaseChartDirective !== "undefined" && ng2_charts_1.BaseChartDirective) === "function" && _a || Object)
], GraphsComponent.prototype, "chart", void 0);
GraphsComponent = __decorate([
    core_1.Component({
        selector: 'graphs',
        templateUrl: 'app/graphs/graphs.component.html',
        styleUrls: ['app/graphs/graphs.component.css'],
        providers: [trello_service_1.TrelloService]
    }),
    __metadata("design:paramtypes", [trello_service_1.TrelloService, typeof (_b = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _b || Object])
], GraphsComponent);
exports.GraphsComponent = GraphsComponent;
var _a, _b;
//# sourceMappingURL=graphs.component.js.map