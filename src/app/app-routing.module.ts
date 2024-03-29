import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';

import { AuthGuard } from './auth-guard/auth.guard';
import { ApprovePageComponent } from './pages/approve-page/approve-page.component';
import { CalenderPageComponent } from './pages/calender-page/calender-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FtrOf1PageComponent } from './pages/ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './pages/ftr-oj1-page/ftr-oj1-page.component';
import { FtrSv1PageComponent } from './pages/ftr-sv1-page/ftr-sv1-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { JobDayViewPageComponent } from './pages/job-day-view-page/job-day-view-page.component';
import { ManagementDashboardPageComponent } from './pages/management-dashboard-page/management-dashboard-page.component';
import { ManagementNewsPageComponent } from './pages/management-news-page/management-news-page.component';
import { ManagementRolePageComponent } from './pages/management-role-page/management-role-page.component';
import { NewsDetailPageComponent } from './pages/news-detail-page/news-detail-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { ManageUserPageComponent } from './pages/manage-user-page/manage-user-page.component';
import { ManageCoursePageComponent } from './pages/manage-course-page/manage-course-page.component';
import { WellfarePageComponent } from './pages/wellfare-page/wellfare-page.component';
import { BudgetComponent } from './pages/budget/budget.component';
import { WellfareDetailPageComponent } from './pages/wellfare-detail-page/wellfare-detail-page.component';
const routes: Routes = new Array<Route>(
  {
    path: 'sign-in',
    component: SignInPageComponent,
  },
  {
    path: 'pccth',
    canActivate: [AuthGuard],
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: '',
        component: WellfarePageComponent,
      },
      {
        path: 'manage-user',
        component: ManageUserPageComponent,
      },
      {
        path: 'wellfare',
        component: WellfarePageComponent,
      },
      {
        path: 'budget',
        component: BudgetComponent,
      },
      {
        path: 'wellfare-details',
        component: WellfareDetailPageComponent,
      },
      {
        // Redirects all paths that are not matching to the 'sign-in' route/path
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
    ),
  },
  {
    // Redirects all paths that are not matching to the 'sign-in' route/path
    path: '**',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  }
  // {
  //   // Redirects all paths that are not matching to the 'sign-in' route/path
  //   path: '**',
  //   redirectTo: 'sign-in',
  //   pathMatch: 'full',
  // }
);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard], // ตรวจสอบว่าคุณได้ระบุ Provider สำหรับ AuthGuard ที่นี่
})
export class AppRoutingModule {}
