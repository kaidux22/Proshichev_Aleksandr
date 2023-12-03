import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})

export class Header{
    @Input() quote : string
    @Input() exit: boolean
    
    constructor(private router: Router, private route : ActivatedRoute){}

    HomePage(){
        this.router.navigate(['user', this.route.snapshot.params['id']])
    }

    Exit(){
        this.router.navigate([''])
    }
}

