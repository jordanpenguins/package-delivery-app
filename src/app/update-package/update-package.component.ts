import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-package.component.html',
  styleUrl: './update-package.component.css'
})
export class UpdatePackageComponent {

  package = {
    package_id: '',
    package_destination: '',
  }

  constructor(private db: DatabaseService, private router: Router) {}

  updatePackage() {
    this.db.updatePackage(this.package).subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['list-package']);
    }, 
    (error: any) => {
      this.router.navigate(['invalid-data']);

    }
  
  )

  }




}
