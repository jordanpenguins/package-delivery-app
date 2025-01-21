import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-calculate-distance',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calculate-distance.component.html',
  styleUrl: './calculate-distance.component.css'
})
export class CalculateDistanceComponent {

  packages: any[] = [];
  selectedPackageLocation = '';
  socket: any;
  msg: string | null = null;


  constructor (private db: DatabaseService, private router: Router) {
    this.socket = io();

    this.socket.on('generate-text-success', (data: any) => {
      console.log(data);
      this.msg = data;
    });

    this.socket.on('generate-text-fail', (error: any) => {
      console.log(error);
      this.msg = error;
    });


  }


  ngOnInit() {
    this.db.getPackage().subscribe((data: any) => {
      console.log(data);
      this.packages = data;
    });
  }

  calculateDistance(destination: string) {
    console.log(destination);
    this.socket.emit('get-distance', destination);
  }




}
