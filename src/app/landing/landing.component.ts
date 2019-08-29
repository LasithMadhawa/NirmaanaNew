import { Component, OnInit } from "@angular/core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ShowcaseComponent } from "../artworks/showcase/showcase.component";
import { Subscription } from "rxjs";
import { ArtworksService } from "../artworks/artworks.service";
import { Artwork } from "../artworks/artwork.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
  faSearch = faSearch;
  // artworkSub: Subscription;
  constructor(
    private artworkService: ArtworksService,
    private router: Router
  ) {}

  ngOnInit() {}

  searchByTag(searchTag: string) {
    // this.artworksService.getArtworksByTag(searchTag);
    // this.artworkSub = this.artworksService
    //   .getArtworkUpdateListener()
    //   .subscribe((artworks: Artwork[]) => {
    //     this.artworks = artworks;
    //   });
    console.log(searchTag);
    if (searchTag === "") {
      this.artworkService.getArtworks();
    } else {
      this.artworkService.getArtworksByTag(searchTag);
    }
    this.router.navigate(["/show"]);
  }
}
