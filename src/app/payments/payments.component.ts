import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AuthService } from "../header/auth.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { PaymentService } from "./payment.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.css"]
})
export class PaymentsComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  userId: string;
  artworkId: string;
  price: number;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.price = parseInt(paramMap.get("price"));
      this.artworkId = paramMap.get("artworkId");
    });
  }

  onPay() {
    console.log(this.artworkId);
    console.log(this.userId);
    console.log(this.price);
    this.paymentService
      .pay(this.artworkId, this.userId, this.price)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(["/view", this.artworkId]);
      });
  }
}
