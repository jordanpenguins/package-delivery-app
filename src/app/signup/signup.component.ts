import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  
    user: any = {
      username: "",
      password: ""
    }
  
    constructor(private db: DatabaseService, private router: Router) {}
  
    signup() {
      this.db.signup(this.user).subscribe((data: any) => {
        console.log(data);
        if (data.status === "Sign up successfully") {
          console.log("Signup successfully");
          this.router.navigate(['/login']);
        } else {
          this.db.setAuthenticated(false);
          this.router.navigate(['/invalid-data']);
        }
      }
  
    )
      
    }


}
