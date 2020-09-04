import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './public/components/login-page/login-page.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/initialize/welcome'
      }
    ]
  },
  {
    path: 'initialize',
    loadChildren: () => import('src/app/public/public.module').then(x => x.PublicModule),
  },
  {
    path: 'login',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
