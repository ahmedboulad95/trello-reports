import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <nav class="navbar bg-faded">
            <a class="navbar-brand" routerLink="graphs">Graphs</a>
            <a class="navbar-brand" routerLink="team">Team</a>
            <a class="navbar-brand" routerLink="bugs">Bugs</a>
        </nav>

        <router-outlet></router-outlet>
    `,
    styles: [`
        .jumbotron { box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2); }
        .navbar-brand { color: white; }
        .navbar-brand:hover { color: grey; cursor: pointer; }
    `]
})

export class AppComponent {}
