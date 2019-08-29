import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Payment } from "./payment.model";

@Injectable({ providedIn: "root" })
export class PaymentService {
  constructor(private http: HttpClient) {}

  pay(artworkId: string, userId: string, price: number) {
    console.log(price);
    return this.http.post("http://localhost:3000/api/payment", {
      artworkId: artworkId,
      userId: userId,
      price: price
    });
  }

  isPaid(artworkId: string, userId: string) {
    return this.http.get<{ isPaid: boolean }>(
      "http://localhost:3000/api/payment/isPaid/" + userId + "/" + artworkId
    );
  }

  getPayments() {
    return this.http.get<{ message: string; payments: Payment[] }>(
      "http://localhost:3000/api/payment"
    );
  }
}
