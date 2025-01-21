import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { KgToGPipe } from '../kg-to-g.pipe';


@Component({
  selector: 'app-list-package',
  standalone: true,
  imports: [KgToGPipe],
  templateUrl: './list-package.component.html',
  styleUrl: './list-package.component.css'
})
export class ListPackageComponent {

  packages: any = [];

  selectedPackageDrivers: any = []
  selectedPackageID : string | null = null
  noDriverFound: boolean = false; 

  constructor(private db: DatabaseService, private router: Router) {}

  setPackageIdAndDelete(packageId: String) {
    this.db.removePackage(packageId).subscribe((data:any) => {
      this.packages = this.packages.filter((aPackage: any) => aPackage._id != packageId)
    })

  }

  ngOnInit(){
    this.db.getPackage().subscribe((data:any)=>{
      this.packages=data;
    },
      (error: any) => {
        console.error('There was an error!', error);
      }
    );
  }

  fetchDriver(driverId: string) {
    this.db.getDriver().subscribe((data:any) => {
      console.log(data,"yeh")
      console.log(driverId)
      const selectedDrivers= data.filter((driver: any) => driver._id === driverId)
      console.log(selectedDrivers, "yuh") 
      if (selectedDrivers.length != 0) {
        this.selectedPackageDrivers = selectedDrivers || []
        this.selectedPackageID = driverId
        this.noDriverFound = false
        console.log(selectedDrivers)
      } else{
        this.selectedPackageDrivers = []
        this.selectedPackageID = null
        this.noDriverFound = true
      }
    })
  }










}
