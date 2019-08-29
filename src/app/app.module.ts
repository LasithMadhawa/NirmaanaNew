import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouteReuseStrategy } from "@angular/router/";

import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { LandingComponent } from "./landing/landing.component";
import { ShowcaseComponent } from "./artworks/showcase/showcase.component";
import { ArtworkUploadComponent } from "./artworks/artwork-upload/artwork-upload.component";
import { AppRoutingModule } from "./app-routing.module";

import { TagInputModule } from "ngx-chips";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthInterceptor } from "./header/auth-interceptor";
import { ArtworkViewComponent } from "./artworks/artwork-view/artwork-view/artwork-view.component";
import { CacheRouteReuseStrategy } from "./cache-route-reuse.strategy";
import { ProfileComponent } from "./users/profile/profile.component";
import { CreateProfileComponent } from "./users/create-profile/create-profile.component";
import { DesignerProfileComponent } from "./users/designer-profile/designer-profile.component";
import { PaymentsComponent } from "./payments/payments.component";
import { ReportsComponent } from './reports/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    ShowcaseComponent,
    ArtworkUploadComponent,
    ArtworkViewComponent,
    ProfileComponent,
    CreateProfileComponent,
    DesignerProfileComponent,
    PaymentsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
