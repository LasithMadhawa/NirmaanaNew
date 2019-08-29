import { Component, OnInit, OnDestroy, Injectable, Input } from "@angular/core";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Artwork } from "../artwork.model";
import { ArtworksService } from "../artworks.service";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/header/auth.service";
import { UserService } from "src/app/users/user.service";
import { User } from "src/app/users/user.model";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

@Component({
  selector: "app-showcase",
  templateUrl: "./showcase.component.html",
  styleUrls: ["./showcase.component.css"]
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  faHeart = faHeart;

  @Input() artworks: Artwork[] = [];
  username: string;
  userId: string;
  user: User;
  userIsAuthenticated = false;
  isAdmin: boolean;
  private artworkSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public artworksService: ArtworksService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // -------------------IS AUTHENTICATED-------------------------
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        console.log(this.userIsAuthenticated + this.userId);
      });
    // ------------------- END IS AUTHENTICATED-------------------------
    this.userId = this.authService.getUserId();
    // this.artworksService.getArtworks();
    // if (this.artworks.length === 0) {
    this.artworkSub = this.artworksService
      .getArtworkUpdateListener()
      .subscribe((artworks: Artwork[]) => {
        this.artworks = artworks;
        console.log("Favourites:" + this.artworks[0].nFavourites);
        // Testin block
        if (this.userId != null) {
          this.userService.getUser(this.userId).subscribe(userData => {
            this.user = {
              _id: userData._id,
              username: userData.username,
              email: userData.email,
              isDesigner: userData.isDesigner,
              downloads: userData.downloads,
              favourites: userData.favourites,
              skills: userData.skills,
              description: userData.description,
              isAdmin: userData.isAdmin
            };
            console.log(this.user.favourites);
            this.isAdmin = this.user.isAdmin;
          });
        } else {
          this.user = {
            _id: "",
            username: "",
            email: "",
            isDesigner: null,
            downloads: [],
            favourites: [],
            skills: "",
            description: "",
            isAdmin: null
          };
        }
      });
    // }
    // ################COMING FROM OTHER COMPONENT------------------------------
    if (this.userId != null) {
      this.userService.getUser(this.userId).subscribe(userData => {
        this.user = {
          _id: userData._id,
          username: userData.username,
          email: userData.email,
          isDesigner: userData.isDesigner,
          downloads: userData.downloads,
          favourites: userData.favourites,
          skills: userData.skills,
          description: userData.description,
          isAdmin: userData.isAdmin
        };
        console.log(this.user.favourites);
        console.log("From other component");
        console.log(this.artworks[0]);
      });
    } else {
      this.user = {
        _id: "",
        username: "",
        email: "",
        isDesigner: null,
        downloads: [],
        favourites: [],
        skills: "",
        description: "",
        isAdmin: null
      };
    }
    console.log(this.user.favourites);

    // --------------END FROM OTHER COMPONENT---------------------
  }

  OnDelete(artworkId: string) {
    this.artworksService.deleteArtwork(artworkId);
    this.ngOnInit();
  }

  OnLike(artworkId: string) {
    this.userService
      .addFavourites(this.userId, artworkId)
      .subscribe(response => {
        console.log(response);
        this.artworksService.addFavourite(artworkId).subscribe(response => {
          console.log(response);
        });
        this.ngOnInit();
      });
  }

  OnDislike(artworkId: string) {
    console.log("Call Dislike");
    this.userService
      .removeFavourites(this.userId, artworkId)
      .subscribe(response => {
        console.log(response);
        this.artworksService.remFavourite(artworkId).subscribe(response => {
          console.log(response);
        });
        this.ngOnInit();
      });
  }

  ngOnDestroy() {
    this.artworkSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.user = null;
    this.userId = null;
    this.username = null;
  }
}
