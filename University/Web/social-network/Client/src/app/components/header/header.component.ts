import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})

export class Header{
    @Input() quote : string
    @Input() exit: boolean
    
    constructor(private router: Router){}

    Exit(){
        this.router.navigate([''])
    }
}

