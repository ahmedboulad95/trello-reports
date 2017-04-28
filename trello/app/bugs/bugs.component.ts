import { Component, ChangeDetectorRef } from '@angular/core';
import { TrelloService } from '../services/trello.service';

@Component({
    selector: 'bugs',
    templateUrl: 'app/bugs/bugs.component.html',
    styleUrls: ['app/bugs/bugs.component.css'],
    providers: [TrelloService]
})

export class BugsComponent{

    boards = [];
    bugsBoardName: string = '';
    bugCards: BugCards[] = [];
    tableReady: boolean = false;
    bugsBoard: any;

    constructor(public trelloService: TrelloService, public ref: ChangeDetectorRef){
        this.setBoards();
    }

    setReady(){
        this.setBugsBoard();
        this.getBoard();
        this.tableReady = true;
    }

    setBoards(){
        this.trelloService.trello.get('/members/me/boards', (boards) => this.boards = boards);
    }

    setBugsBoard(){
        for(let board of this.boards){
            if(board.name == this.bugsBoardName)
                this.bugsBoard = board;
        }
    }

    getBoard(){
        this.trelloService.trello.get('/board/' + this.bugsBoard.id + '/lists',
            (lists) => {
                var _bugCards = [];
                for(let list of lists){
                    this.trelloService.trello.get('/lists/' + list.id + '/cards?actions=createCard',
                        (cards) => {
                            for(let card of cards){
                                var newCard: BugCards = {title:card.name, date:card.actions[0].date.substring(0, card.actions[0].date.indexOf('T')), detector:card.actions[0].memberCreator.fullName,
                                    listTitle:list.name, dateFixed:''};
                                _bugCards.push(newCard);
                            }
                        });
                }
                this.bugCards = _bugCards;
                this.ref.markForCheck();
            }, (error) => console.log(error));
    }
}

interface BugCards{
    title: string;
    date: string;
    detector: string;
    listTitle: string;
    dateFixed: string;
}
