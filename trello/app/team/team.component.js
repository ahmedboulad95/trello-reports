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
var TeamComponent = (function () {
    function TeamComponent(trelloService, ref) {
        this.trelloService = trelloService;
        this.ref = ref;
        this.boardID = 'rvPpS2c8';
        this.members = []; // array for the members
        this.boardData = []; // array for the board data
        this.cardData = []; // array for the card data
        this.comCard = []; // array for the completed cards data
        this.comSPcard = [];
        this.fName = "Test Name"; // string to hold a member's full Name
        this.isShow = false; // boolean variable to hide or show the <div> element in html
        this.userSP = 0; // A specific user's total assigned Story Points
        this.comSP = 0; // A specific user's completed Story Points
        this.ID = "test ID"; // A user's username that will be used as an ID for the Trello Get method
        this.trelloID = "test ID";
        this.comBoard = "Test Board"; // comBoard will store the completed Board's ID
        this.comLists = [];
        this.argChecker = 0;
        this.getTeam();
    }
    // Array used to store data retrieved from api
    /* getTeam function will grab the team members off of the boardID provided  */
    TeamComponent.prototype.getTeam = function () {
        var _this = this;
        this.trelloService.trello.get('/boards/' + this.boardID + '/members', function (members) {
            return _this.getNames(members);
        }, this.ref.markForCheck());
    };
    // getNames is called from getTeam which will store all team member names into members array
    TeamComponent.prototype.getNames = function (members) {
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            this.members.push(member);
        }
        console.log('Team Members');
        for (var _a = 0, _b = this.members; _a < _b.length; _a++) {
            var member = _b[_a];
            console.log(member);
        }
    };
    /* The clicked function  gets a specified member's username used for ID, and their fullname (clicknName)
      The ID is used to grab the member's boards that they are subscribed to and calls getDataBoard to store that information
      ID is also used to grab all cards that the user is assigned and calls getDataCard in order to store the card information
     */
    TeamComponent.prototype.clicked = function (id) {
        var _this = this;
        this.clearData();
        this.ID = id;
        this.trelloService.trello.get('/members/' + this.ID + '/boards', function (boardData) { return _this.getDataBoard(boardData); }, this.ref.markForCheck());
        this.trelloService.trello.get('/members/' + this.ID + '/cards', function (cardData) { return _this.getDataCard(cardData); }, this.ref.markForCheck());
        this.trelloService.trello.get('/members/' + this.ID + '/boards?lists=all', function (comList) { return _this.callComCard(comList); }, this.ref.markForCheck());
        this.trelloService.trello.get('/member/' + this.ID, function (getName) { return _this.getFullName(getName); }, this.ref.markForCheck());
        this.isShow = true; // the <div> element in the HTMl will now be displayed
    };
    TeamComponent.prototype.getFullName = function (getName) {
        this.fName = getName.fullName;
        this.trelloID = getName.id;
    };
    // getDataBoard will store all of the boards that the specified member is subscribed to, the information is stored into the boardData array
    TeamComponent.prototype.getDataBoard = function (boardData) {
        for (var _i = 0, boardData_1 = boardData; _i < boardData_1.length; _i++) {
            var data = boardData_1[_i];
            this.boardData.push(data);
        }
        console.log('boardData');
        for (var _a = 0, _b = this.boardData; _a < _b.length; _a++) {
            var data = _b[_a];
            console.log(data);
        }
    };
    // getDataCard will store all the card information that the specified member is assigned,
    // this information will be stored into cardData array
    TeamComponent.prototype.getDataCard = function (cardData) {
        for (var _i = 0, cardData_1 = cardData; _i < cardData_1.length; _i++) {
            var data = cardData_1[_i];
            this.cardData.push(data);
        }
        console.log('cardData');
        for (var _a = 0, _b = this.cardData; _a < _b.length; _a++) {
            var data = _b[_a];
            console.log(data);
        }
        this.userSP = 0; // initially set the assigned Story Points to zero
        this.calcStory(this.cardData); // calcStory will calculate the assigned Story Points
    };
    // calcStory will calculate the specified user's assigned Story Points
    TeamComponent.prototype.calcStory = function (cardData) {
        var tester = []; // temporary array to store the card name string as a character array
        for (var i = 0; i < cardData.length; i++) {
            tester = (cardData[i].name).split('');
            this.userSP += (tester[1]) / 1; // assigned the story points (must divide by 1 to turn into a number)
        }
    };
    // findCompleted
    TeamComponent.prototype.findCompleted = function () {
        var _this = this;
        this.trelloService.trello.get('/members/' + this.ID + '/boards?lists=all', function (comList) { return _this.callComCard(comList); }, this.ref.markForCheck());
    };
    // callComCard will calculate the completed Story Points for the specific member.
    TeamComponent.prototype.callComCard = function (comCard) {
        for (var _i = 0, comCard_1 = comCard; _i < comCard_1.length; _i++) {
            var data = comCard_1[_i];
            this.comLists.push(data.lists);
        }
        console.log('comLists');
        for (var _a = 0, _b = this.comLists; _a < _b.length; _a++) {
            var data = _b[_a];
            console.log(data);
        }
        this.fcalc(this.comLists);
    };
    //fcalc
    TeamComponent.prototype.fcalc = function (lists) {
        var _this = this;
        var placeholder = [];
        console.log('fcalc');
        for (var _i = 0, _a = this.comLists; _i < _a.length; _i++) {
            var data = _a[_i];
            for (var i = 0; i < data.length; i++) {
                placeholder = data[i].name.split(' ');
                console.log(placeholder);
                for (var j = 0; j < placeholder.length; j++) {
                    if (placeholder[j] === 'Complete') {
                        this.trelloService.trello.get('lists/' + data[i].id + '/cards', function (getCard) { return _this.completedCard(getCard); }, this.ref.markForCheck());
                    }
                }
            }
        }
        //  this.trelloService.trello.get('member/'+ this.ID, (test)=> this.finalCalc(test), this.ref.markForCheck());
    };
    TeamComponent.prototype.completedCard = function (getCard) {
        var pointCheck = [];
        for (var _i = 0, getCard_1 = getCard; _i < getCard_1.length; _i++) {
            var data = getCard_1[_i];
            if (data.idMembers[0] === this.trelloID) {
                this.comSPcard.push(data.name);
                pointCheck = this.comSPcard[this.argChecker].split('');
                console.log(pointCheck[1]);
                this.comSP += (pointCheck[1]) / 1;
                console.log(this.comSP);
                this.argChecker += 1;
            }
        }
        console.log('comSPcard');
        for (var _a = 0, _b = this.comSPcard; _a < _b.length; _a++) {
            var data = _b[_a];
            console.log(data);
        }
    };
    // clearData will reset all of the arrays, ID's, Story Points, in order to provide accurate information
    TeamComponent.prototype.clearData = function () {
        this.boardData.length = 0;
        this.cardData.length = 0;
        this.comCard.length = 0;
        this.comSPcard.length = 0;
        this.comLists.length = 0;
        this.argChecker = 0;
        this.ID = '';
        this.userSP = 0;
        this.comSP = 0;
    };
    return TeamComponent;
}());
TeamComponent = __decorate([
    core_1.Component({
        selector: 'team',
        templateUrl: 'app/team/team.component.html',
        //styleUrls: ['app/team/team.component.css'],
        providers: [trello_service_1.TrelloService]
    }),
    __metadata("design:paramtypes", [trello_service_1.TrelloService, typeof (_a = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _a || Object])
], TeamComponent);
exports.TeamComponent = TeamComponent;
var _a;
//# sourceMappingURL=team.component.js.map