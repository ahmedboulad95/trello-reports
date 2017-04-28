import { Component, ChangeDetectorRef } from '@angular/core';
import { TrelloService } from '../services/trello.service';

@Component({
    selector: 'atRiskCards',
    templateUrl: 'app/atRiskCards/atRiskCards.component.html',
    styleUrls: ['app/atRiskCards/atRiskCards.component.css'],
    providers: [TrelloService]
})

export class AtRiskCardsComponent{
    boards = [];
    currentBoardName: string = '';
    currentBoard: any;
    riskCards = [];
    tableReady: boolean = false;

    constructor(public trelloService: TrelloService, public ref: ChangeDetectorRef){
        this.setBoards();
    }

    setBoards(){
        this.trelloService.trello.get('/members/me/boards', (boards) => this.boards = boards);
    }

    setReady(){
        this.setCurrentBoard();
        this.getBoard();
        this.tableReady = true;
    }

    setCurrentBoard(){
        for(let board of this.boards){
            if(board.name == this.currentBoardName)
                this.currentBoard = board;
        }
    }

    getBoard(){
        
    }
}
