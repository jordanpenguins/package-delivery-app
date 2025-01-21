import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InvalidDataComponent } from './invalid-data/invalid-data.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ListDriverComponent } from './list-driver/list-driver.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { ListPackageComponent } from './list-package/list-package.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { TranslateComponent } from './translate/translate.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalculateDistanceComponent } from './calculate-distance/calculate-distance.component';

/*
*/


export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'invalid-data',component: InvalidDataComponent},
    { path: 'header', component: HeaderComponent, canActivate: [authGuard] },
    { path: 'footer', component: FooterComponent, canActivate: [authGuard] },
    { path: 'add-driver', component: AddDriverComponent, canActivate: [authGuard] },
    { path: 'list-driver', component: ListDriverComponent, canActivate: [authGuard] },
    { path: 'delete-driver', component: DeleteDriverComponent, canActivate: [authGuard] },
    { path: 'update-driver', component: UpdateDriverComponent, canActivate: [authGuard] },
    { path: 'add-package', component: AddPackageComponent, canActivate: [authGuard] },
    { path: 'list-package', component: ListPackageComponent, canActivate: [authGuard] },
    { path: 'text-to-speech', component: TextToSpeechComponent, canActivate: [authGuard] },
    { path: 'translate', component: TranslateComponent, canActivate: [authGuard] },
    { path: 'delete-package', component: DeletePackageComponent, canActivate: [authGuard] },
    { path: 'update-package', component: UpdatePackageComponent, canActivate: [authGuard] },
    { path: 'statistics', component: StatisticsComponent, canActivate: [authGuard] },
    {path: 'generative-ai',component: CalculateDistanceComponent, canActivate: [authGuard]},
    {path: 'login',component: LoginComponent},
    {path: 'sign-up',component: SignupComponent},
    {path: '**',component: PageNotFoundComponent}
];


