import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  faSearch,
  faAt,
  faKey,
  faUser,
  faEnvelope,
  faCheckDouble
} from "@fortawesome/free-solid-svg-icons";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  faSearch = faSearch;
  faAt = faAt;
  faKey = faKey;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCheckDouble = faCheckDouble;

  isLoading = false;
  userId: string;

  userIsAuthenticated = false;
  private authListnerSubs: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.closeSignInForm();
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

  onSignInBtn() {
    this.isLoading = this.userIsAuthenticated;
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    form.reset();
    // this.isLoading = false;
    // this.closeSignInForm();
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      console.log("Invalid");
      return;
    }
    console.log("Valid");

    this.authService.createUser(
      form.value.email,
      form.value.password,
      form.value.username
    );
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  closeSignInForm() {
    const element: HTMLElement = document.getElementById(
      "closeBtn"
    ) as HTMLElement;
    element.click();
    console.log(element);
  }
}
