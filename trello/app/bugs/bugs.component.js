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
var BugsComponent = (function () {
    function BugsComponent(trelloService, ref) {
        this.trelloService = trelloService;
        this.ref = ref;
        this.boards = [];
        this.bugsBoardName = '';
        this.bugCards = [];
        this.tableReady = false;
        this.setBoards();
    }
    BugsComponent.prototype.setReady = function () {
        this.setBugsBoard();
        this.getBoard();
        this.tableReady = true;
    };
    BugsComponent.prototype.setBoards = function () {
        var _this = this;
        this.trelloService.trello.get('/members/me/boards', function (boards) { return _this.boards = boards; });
    };
    BugsComponent.prototype.setBugsBoard = function () {
        for (var _i = 0, _a = this.boards; _i < _a.length; _i++) {
            var board = _a[_i];
            if (board.name == this.bugsBoardName)
                this.bugsBoard = board;
        }
    };
    BugsComponent.prototype.getBoard = function () {
        var _this = this;
        this.trelloService.trello.get('/board/' + this.bugsBoard.id + '/lists', function (lists) {
            var _bugCards = [];
            var _loop_1 = function (list) {
                _this.trelloService.trello.get('/lists/' + list.id + '/cards?actions=createCard', function (cards) {
                    for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
                        var card = cards_1[_i];
                        var newCard = { title: card.name, date: card.actions[0].date.substring(0, card.actions[0].date.indexOf('T')), detector: card.actions[0].memberCreator.fullName,
                            listTitle: list.name, dateFixed: '' };
                        _bugCards.push(newCard);
                    }
                });
            };
            for (var _i = 0, lists_1 = lists; _i < lists_1.length; _i++) {
                var list = lists_1[_i];
                _loop_1(list);
            }
            _this.bugCards = _bugCards;
            _this.ref.markForCheck();
        }, function (error) { return console.log(error); });
    };
    return BugsComponent;
}());
BugsComponent = __decorate([
    core_1.Component({
        selector: 'bugs',
        templateUrl: 'app/bugs/bugs.component.html',
        styleUrls: ['app/bugs/bugs.component.css'],
        providers: [trello_service_1.TrelloService]
    }),
    __metadata("design:paramtypes", [trello_service_1.TrelloService, typeof (_a = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _a || Object])
], BugsComponent);
exports.BugsComponent = BugsComponent;
var _a;
//# sourceMappingURL=bugs.component.js.map