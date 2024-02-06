import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { JobDayAddPageModule } from './job-day-add-page/job-day-add-page.module';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FtrOf1Service } from '../api-services/ftr-of1.service';
import { SharedModule } from '../shared/shared.module';
import { CalenderPageComponent } from './calender-page/calender-page.component';
import { CalendarComponentsComponent } from './calender-page/components/calendar-components/calendar-components.component';
import { CalendarTableComponent } from './calender-page/components/calendar-table/calendar-table.component';
import { InformationProjectUserComponent } from './dashboard-page/components/information-project-user/information-project-user.component';
import { InformationUserComponent } from './dashboard-page/components/information-user/information-user.component';
import { TreemapChartComponent } from './dashboard-page/components/treemap-chart/treemap-chart.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { FtrOf1PageComponent } from './ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './ftr-oj1-page/ftr-oj1-page.component';
import { FtrSv1PageComponent } from './ftr-sv1-page/ftr-sv1-page.component';
import { CarouselNewsComponent } from './home-page/components/carousel-news/carousel-news.component';
import { ListCardPeopleComponent } from './home-page/components/list-card-people/list-card-people.component';
import { ListCardSystemComponent } from './home-page/components/list-card-system/list-card-system.component';
import { ListDescriptionComponent } from './home-page/components/list-description/list-description.component';
import { HomePageComponent } from './home-page/home-page.component';
import { JobDayViewPageComponent } from './job-day-view-page/job-day-view-page.component';
import { ManagementDashboardPageComponent } from './management-dashboard-page/management-dashboard-page.component';
import { ManagementNewsPageComponent } from './management-news-page/management-news-page.component';
import { ManagementRolePageComponent } from './management-role-page/management-role-page.component';
import { NewsDetailPageComponent } from './news-detail-page/news-detail-page.component';
import { NewsTableComponent } from './news-page/components/news-table/news-table.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { ApprovePageComponent } from './approve-page/approve-page.component';
import { ManageUserPageComponent } from './manage-user-page/manage-user-page.component';
import { ManageCoursePageComponent } from './manage-course-page/manage-course-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WellfarePageComponent } from './wellfare-page/wellfare-page.component';
import { WellfareDetailPageComponent } from './wellfare-detail-page/wellfare-detail-page.component';
import { BudgetComponent } from './budget/budget.component';
import { WellfareDialogComponent } from './wellfare-page/components/wellfare-dialog/wellfare-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OpdDialogComponent } from './wellfare-detail-page/components/opd-dialog/opd-dialog.component';
import { IpdDialogComponent } from './wellfare-detail-page/components/ipd-dialog/ipd-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    HomePageComponent,
    CarouselNewsComponent,
    ListCardSystemComponent,
    ListDescriptionComponent,
    ListCardPeopleComponent,

    NewsPageComponent,

    CalenderPageComponent,
    CalendarTableComponent,

    DashboardPageComponent,
    InformationUserComponent,
    InformationProjectUserComponent,

    JobDayViewPageComponent,

    ManagementNewsPageComponent,
    ManagementDashboardPageComponent,
    ManagementRolePageComponent,
    CalendarComponentsComponent,
    NewsTableComponent,
    TreemapChartComponent,
    NewsDetailPageComponent,
    FtrOf1PageComponent,
    FtrOj1PageComponent,
    FtrSv1PageComponent,
    SignInPageComponent,
    ApprovePageComponent,
    ManageUserPageComponent,
    ManageCoursePageComponent,
    WellfarePageComponent,
    WellfareDetailPageComponent,
    BudgetComponent,
    WellfareDialogComponent,
    OpdDialogComponent,
    IpdDialogComponent,
  ],
  imports: [
    MatRadioModule,
    DialogModule,
    InputTextareaModule,
    MatCheckboxModule,
    MatDialogModule,
    SharedModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatNativeDateModule,
    JobDayAddPageModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [FtrOf1Service],
})
export class PageModule {}
