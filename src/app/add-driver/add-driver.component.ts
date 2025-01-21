import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import e from 'cors';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css'
})
export class AddDriverComponent {

  driver: Driver = new Driver();

  constructor(private db: DatabaseService, private router:Router) { }

  addDriver() {
    this.db.createDriver(this.driver).subscribe((data:any) => {
      this.router.navigate(['list-driver']);
    },
    (error: any) => {
      // if theres error navigate them to the 400
      this.router.navigate(['invalid-data']);
      
    }
  );
  }


}
