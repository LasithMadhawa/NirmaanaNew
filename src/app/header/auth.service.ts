import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private userId: string = null;
  private isAdmin: boolean;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  createUser(email: string, password: string, username: string) {
    const userData = {
      username: username,
      email: email,
      password: password
    };
    return this.http.post("http://localhost:3000/api/user/signup", userData);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        isAdmin: boolean;
      }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.isAdmin = response.isAdmin;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId, this.isAdmin);
          console.log(expirationDate);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.isAdmin = JSON.parse(authInformation.isAdmin);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // this.router.navigate(["/"]);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    isAdmin: boolean
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("isAdmin", isAdmin.toString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      isAdmin: isAdmin
    };
  }
}
