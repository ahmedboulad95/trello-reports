import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { TrelloService } from '../services/trello.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
    selector: 'graphs',
    templateUrl: 'app/graphs/graphs.component.html',
    styleUrls: ['app/graphs/graphs.component.css'],
    providers: [TrelloService]
})

export class GraphsComponent {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective;

    //******************************************Pie Chart*********************************************//
    public pieChartOptions:any = {
        responsive: true,
        maintainAspectRatio: false
    };

    public pieChartLabels:string[] = [];
    public pieChartData:number[] = [];//[9, 3, 4, 8, 6, 1, 5, 4];
    public pieChartType:string = 'pie';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }
    //*********************************************************************************************//


    //******************************************Bar Graph*****************************************//
    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };

    public barChartLabels:string[] = [];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    public barChartData:any[] = [{data: [], label: 'Story Points Completed'}];
    //*******************************************************************************************//

    boards = [];
    boardID: string = '';
    currentBoardName: string = '';
    currentBoard: any;
    completedBoard: any;
    members: string[];
    sprint: string = '';
    sprintLists = [];
    currentSprintLists = [];
    pieReady: boolean = false;
    chartType: string = "pie";
    completedBoardId: string = '';
    graphsReady: boolean = false;
    completedBoardName: string = '';
    numSprints: number[] = [];

    constructor(public trelloService: TrelloService, public ref: ChangeDetectorRef){
        this.getBoards();
    }

    setCompletedBoard(){
        this.setBoards();
    }

    setReady(){
        this.graphsReady = true;
        this.setBoards();
    }

    refresh(){
        setTimeout(() => {
            if (this.chart && this.chart.chart && this.chart.chart.config) {
                this.chart.chart.update();
            }
        });
    }

    changeChartType(type: string){
        this.chartType = type;
    }

    //Retrieves all the boards belonging to the member that is logged in
    getBoards(){
        this.trelloService.trello.get('/member/me/boards?lists=all', (boards) => this.boards = boards, (error) => console.log(error));
    }

    //Sets an array of boards and the completed board and the current board we are interested in
    setBoards(){
        for(let board of this.boards){
            if(board.name == this.completedBoardName)
                this.completedBoard = board;
            if(board.name == this.currentBoardName)
                this.currentBoard = board;
        }
        this.getData();
        this.getLists();
    }

    //Pie chart
    getData(){
        this.trelloService.trello.get('/boards/' + this.currentBoard.id + '/members', (members) => this.setMembers(members));
    }

    //Pie chart labels
    setMembers(members){
        this.members = members;
        var m = [];
        for(let member of members){
            m.push(member.fullName);
            this.pieChartData.push(0);
        }
        this.pieChartLabels = m;
        this.ref.markForCheck();
    }

  getLists(){
    this.trelloService.trello.get('/boards/' + this.completedBoard.id + '/lists?cards=all',
      (lists) => {
        this.numSprints = [];
        var count: number = 1;
        for(let list of lists){
          if(list.name.includes("Sprint") || list.name.includes("sprint")){
            this.sprintLists.push(list);
            this.numSprints.push(count);
            count++;
          }
        }
        this.numSprints.push(count);
        this.bargraphLists(lists);
        this.trelloService.trello.get('/boards/' + this.currentBoard.id + '/lists?cards=all',
            (lists) => {
              this.pieChartData = [];
              for(let item of this.pieChartLabels)
                this.pieChartData.push(0);
              this.currentSprintLists = [];
              for(let list of lists){
                if(list.name.includes("Sprint") || list.name.includes("sprint")){
                  this.currentSprintLists.push(list);
                }
              }
              for(let list of this.currentSprintLists){
                this.trelloService.trello.get('/list/' + list.id + '/cards?members=true', (cards) => this.calculateStoryPoints(cards));
              }
              this.ref.markForCheck();
            });
      });
      this.refresh();
  }

    calculateStoryPoints(cards){
        var _pieChartData = this.pieChartData;
        for(let card of cards){
            for(let member of card.members){
                var currMember = this.findMember(member.fullName);
                _pieChartData[currMember] += Number(card.name.substring(1, card.name.indexOf(')')));
            }
        }
        this.pieChartData = _pieChartData;
    }

    findMember(name): number{
        for(var i = 0; i < this.pieChartLabels.length; i++){
            if(this.pieChartLabels[i] == name){
                return i;
            }
        }
    }

    bargraphLists(lists){
        var sprints = [];
        for(let list of lists){
            if(list.name.includes("Sprint"))
                sprints.push(list);
        }
        var points = [];
        var labels = [];
        for(let list of sprints){
            var pointCount: number = 0;
            labels.push(list.name.substring(7, 8));
            for(let card of list.cards){
                pointCount += Number(card.name.substring(1,2));
            }
            points.push(pointCount);
        }
        this.barChartLabels = labels;
        this.barChartData[0].data = points;
    }

    changeSprint(){
        this.pieChartData = [];
        for(let item of this.pieChartLabels)
            this.pieChartData.push(0);
        var newSprint:number = Number(this.sprint);
        if(newSprint == Number(this.numSprints.length)){
            this.recalculatePieValues(this.currentSprintLists, 2);
        }else{
            this.recalculatePieValues(this.sprintLists[newSprint-1], 1);
        }
        this.refresh();
    }

    recalculatePieValues(list, listSize){
        if(listSize > 1) {
          for (let item of list)
            this.trelloService.trello.get('/list/' + item.id + '/cards?members=true', (cards) => this.calculateStoryPoints(cards));
        }
        else {
          this.trelloService.trello.get('/list/' + list.id + '/cards?members=true', (cards) => this.calculateStoryPoints(cards));
        }
        this.ref.markForCheck();
    }
}
