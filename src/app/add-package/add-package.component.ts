import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Driver } from '../models/driver';
import { Package } from '../models/package';

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.css'
})
export class AddPackageComponent {

  //list of drivers
  drivers: any[] = []

  package = new Package()

  constructor(private db: DatabaseService,private router: Router ) {}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.db.getDriver().subscribe((data: any) => {
      this.drivers = data;
    });
  }

  addPackage() {
    console.log(this.package)
    this.db.createPackage(this.package).subscribe((data:any) => {
      console.log(data,"hello")
      this.router.navigate(['list-package']);
    },
    (error: any) => {
      this.router.navigate(['invalid-data'])
    }
  
  );

  }





}
