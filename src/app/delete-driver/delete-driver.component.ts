import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UppercasePipe } from '../uppercase.pipe';


@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [FormsModule, UppercasePipe],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css'
})
export class DeleteDriverComponent {

  // used any type because of new attributes that are not listed in the model
  drivers: any = [];

  selectedDriverPackages: any[] = []
  selectedDriverID: null | string = null
  noPackagesFound: boolean = false;

  constructor(private db: DatabaseService, private router: Router) { }

  setDriverIdAndDelete(driverId: String) {
    this.db.removeDriver(driverId).subscribe((data:any) => {
      this.drivers = this.drivers.filter((driver:any) => driver._id != driverId)
    });
  }

  fetchDriverPackages(driverId:string){
    this.db.getDriver().subscribe((data:any) => {
      const selectedDriver = data.find((driver: any) => driver._id === driverId)
      if (selectedDriver){
        this.selectedDriverID = driverId;
        this.selectedDriverPackages = selectedDriver.assigned_packages || [];
        this.noPackagesFound = this.selectedDriverPackages.length === 0;
        console.log(this.noPackagesFound)
      } else {
        this.selectedDriverID = null;
        this.selectedDriverPackages = [];
        this.noPackagesFound = true;
      }
    })
  }

  ngOnInit(){
    this.db.getDriver().subscribe((data:any)=>{
      this.drivers=data;
    },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );
  }


}
