import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../user.model";
import { AuthService } from "src/app/header/auth.service";
import { UserService } from "../user.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-designer-profile",
  templateUrl: "./designer-profile.component.html",
  styleUrls: ["./designer-profile.component.css"]
})
export class DesignerProfileComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  user: User;

  private userId: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      skills: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get("userId");
      this.isLoading = true;
      this.userService.getUser(this.userId).subscribe(userData => {
        this.isLoading = false;
        if (userData.isDesigner) {
          this.user = {
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            isDesigner: userData.isDesigner,
            skills: userData.skills,
            description: userData.description,
            favourites: userData.favourites,
            downloads: userData.downloads
          };
        } else {
          this.user = {
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            isDesigner: userData.isDesigner,
            skills: "",
            description: "",
            favourites: userData.favourites,
            downloads: userData.downloads
          };
        }

        this.form.setValue({
          skills: this.user.skills,
          description: this.user.description
        });
      });
    });
  }

  onUpdateAsDesigner() {
    console.log("Submitting...");
    if (this.form.invalid) {
      return;
    }
    this.userService
      .updateAsDesigner(
        this.userId,
        this.form.value.skills,
        this.form.value.description
      )
      .subscribe(respone => {
        console.log(respone);
        console.log("Extended as a designer");
        this.router.navigate(["user", this.userId]);
      });
  }
}
