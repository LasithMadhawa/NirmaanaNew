import { Component, OnInit } from "@angular/core";
import { Artwork } from "../../artwork.model";
import { ArtworksService } from "../../artworks.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Payment } from "src/app/payments/payment.model";
import { PaymentService } from "src/app/payments/payment.service";
import { AuthService } from "src/app/header/auth.service";
import { UserService } from "src/app/users/user.service";

@Component({
  selector: "app-artwork-view",
  templateUrl: "./artwork-view.component.html",
  styleUrls: ["./artwork-view.component.css"]
})
export class ArtworkViewComponent implements OnInit {
  // artwork = {
  //   _id: "5d5d1bb2e1f0cd2f980bc7a7",
  //   title: "Laptop",
  //   preview:
  //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo corporis totam exercitationem numquam ipsam ipsum repudiandae odit veniam eligendi excepturi assumenda omnis soluta quidem laborum labore repellat quaerat, quis dolore? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi incidunt quia quidem molestiae aliquid nostrum, cum maxime vero consequuntur laborum molestias natus iusto possimus debitis vitae numquam inventore labore temporibus!",
  //   imagePath: "http://localhost:3000/images/15.jpg-1566383026823.jpg",
  //   zipFilePath:
  //     "http://localhost:3000/imagesintern-lasith_madhawa_ux-ui.rar-1566383026824.rar",
  //   tags: [
  //     { display: "laptop", value: "laptop" },
  //     { display: "dark", value: "dark" }
  //   ],
  //   designer: "5d54153fe1137722c4376208",
  //   __v: 0
  // };
  isPaid: boolean;
  userId: string;
  designer: string;
  artwork: Artwork;
  payments: Payment[];
  isAuth: boolean;
  private artworkId: string;

  constructor(
    private artworkService: ArtworksService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.artworkId = paramMap.get("artworkId");
      this.artworkService.getArtwork(this.artworkId).subscribe(artworkData => {
        this.artwork = {
          _id: artworkData._id,
          title: artworkData.title,
          preview: artworkData.preview,
          imagePath: artworkData.imagePath,
          zipFilePath: artworkData.zipFilePath,
          tags: artworkData.tags,
          designer: artworkData.designer,
          price: artworkData.price,
          nDownloads: artworkData.nDownloads,
          nFavourites: artworkData.nFavourites
        };
      });
    });
    // this.paymentService.getPayments().subscribe(payments => {
    //   this.payments = payments.payments;
    //   console.log(payments);
    // });
    this.paymentService
      .isPaid(this.artworkId, this.userId)
      .subscribe(isPaid => {
        this.isPaid = isPaid.isPaid;
        console.log("Paid for" + this.isPaid);
      });
  }

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

  onDownload() {
    // console.log("this is onDownload");
    this.userService
      .addDownloads(this.userId, this.artwork._id)
      .subscribe(response => {
        // console.log("response");
        this.artworkService
          .addDownload(this.artwork._id)
          .subscribe(response => {
            // console.log(response);
          });
      });
  }
}
