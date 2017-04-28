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
var AtRiskCardsComponent = (function () {
    function AtRiskCardsComponent(trelloService, ref) {
        this.trelloService = trelloService;
        this.ref = ref;
        this.boards = [];
        this.currentBoardName = '';
        this.riskCards = [];
        this.tableReady = false;
        this.setBoards();
    }
    AtRiskCardsComponent.prototype.setBoards = function () {
        var _this = this;
        this.trelloService.trello.get('/members/me/boards', function (boards) { return _this.boards = boards; });
    };
    AtRiskCardsComponent.prototype.setReady = function () {
        this.setCurrentBoard();
        this.getBoard();
        this.tableReady = true;
    };
    AtRiskCardsComponent.prototype.setCurrentBoard = function () {
        for (var _i = 0, _a = this.boards; _i < _a.length; _i++) {
            var board = _a[_i];
            if (board.name == this.currentBoardName)
                this.currentBoard = board;
        }
    };
    AtRiskCardsComponent.prototype.getBoard = function () {
    };
    return AtRiskCardsComponent;
}());
AtRiskCardsComponent = __decorate([
    core_1.Component({
        selector: 'atRiskCards',
        templateUrl: 'app/atRiskCards/atRiskCards.component.html',
        styleUrls: ['app/atRiskCards/atRiskCards.component.css'],
        providers: [trello_service_1.TrelloService]
    }),
    __metadata("design:paramtypes", [trello_service_1.TrelloService, typeof (_a = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _a || Object])
], AtRiskCardsComponent);
exports.AtRiskCardsComponent = AtRiskCardsComponent;
var _a;
//# sourceMappingURL=atRiskCards.component.js.map