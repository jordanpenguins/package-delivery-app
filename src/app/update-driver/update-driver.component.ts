import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Driver } from '../models/driver';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-driver.component.html',
  styleUrl: './update-driver.component.css'
})
export class UpdateDriverComponent {

  driver = {
    id: '',
    driver_department: '',
    driver_licence: ''
  }

  constructor(private db: DatabaseService, private router: Router) { }

    updateDriver(){
      this.db.updateDriver(this.driver).subscribe((data:any) => {
        console.log(data);
        this.router.navigate(['list-driver']);
      },
      (error: any) => {
        this.router.navigate(['invalid-data']);
      }
    
     )
    }

    

}
