import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

  stats: any = {};

  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit() {
    this.db.getStats().subscribe((data:any)=>{
      this.stats=data;
    },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );

  }



}
