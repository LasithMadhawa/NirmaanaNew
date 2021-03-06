import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "./user.model";
import { Artwork } from "../artworks/artwork.model";
import { AuthService } from "../header/auth.service";
import { Subscription } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
  private user: User;
  private username: string;
  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  updateAsDesigner(id: string, skills: string, description: string) {
    console.log("User service listening");
    return this.http.put("http://localhost:3000/api/user/" + id, {
      isDesigner: true,
      skills,
      description
    });
  }

  getUser(id: string) {
    // this.userId = this.authService.getUserId();
    return this.http.get<{
      _id: string;
      username: string;
      email: string;
      isDesigner: boolean;
      downloads: Artwork[];
      favourites: Artwork[];
      skills: string;
      description: string;
      isAdmin: boolean;
    }>("http://localhost:3000/api/user/" + id);
    // .subscribe(user => {
    //   this.user = user;
    //   this.username = user.username;
    // });
  }

  getFavourites(id: string) {
    return this.http.get<{
      favourites: Artwork[];
    }>("http://localhost:3000/api/user/favourites/" + id);
  }

  getDownloads(id: string) {
    return this.http.get<{
      downloads: Artwork[];
    }>("http://localhost:3000/api/user/downloads/" + id);
  }

  addFavourites(id: string, artworkId: string) {
    // console.log("came to service");
    return this.http.put(
      "http://localhost:3000/api/user/addtofavourites/" + id,
      { artworkId }
    );
  }

  addDownloads(id: string, artworkId: string) {
    // console.log("came to service");
    return this.http.put(
      "http://localhost:3000/api/user/addtodownloads/" + id,
      { artworkId }
    );
  }

  removeFavourites(id: string, artworkId: string) {
    // console.log("came to service");
    return this.http.put(
      "http://localhost:3000/api/user/removefavourites/" + id,
      { artworkId }
    );
  }
  getUserReportData() {
    return this.http.get<{
      data: any;
    }>("http://localhost:3000/api/user/getDataForReport");
  }

  getArtworksReportData() {
    return this.http.get<{
      data: any;
    }>("http://localhost:3000/api/artworks/getDataForReport");
  }

  getPaymentReportData() {
    return this.http.get<{
      data: any;
    }>("http://localhost:3000/api/payment/getDataForReport");
  }

  getTagsReportData() {
    return this.http.get<{
      data: any;
    }>("http://localhost:3000/api/artworks/getDataForReport_Tags");
  }
}
