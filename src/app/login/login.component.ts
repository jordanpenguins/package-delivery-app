import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user: any = {
    username: "",
    password: ""
  }

  constructor(private db: DatabaseService, private router: Router) {}

  login() {
    this.db.login(this.user).subscribe((data: any) => {
      console.log(data);
      if (data.status === "Login successfully") {
        console.log("Login successfully");
        this.db.setAuthenticated(true);
        this.router.navigate(['/']);
      } else {
        this.db.setAuthenticated(false);
        this.router.navigate(['/invalid-data']);
      }
    }

  )}

  


}
