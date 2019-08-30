import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { UserService } from "src/app/users/user.service";
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit {
  constructor(private userService: UserService) {}
  totalUsersChart_data = [];
  totalArtworksChart_data = [];
  totalPaymentsChart_data = [];
  totalTagsChart_data = [];
  ngOnInit() {
    this.userService.getArtworksReportData().subscribe(response => {
      this.totalArtworksChart_data = [];
      this.totalArtworksChart_data = response.data;
      this.generateTotalArtworksChart();
      console.log("Artworks:" + response.data);

      this.userService.getUserReportData().subscribe(res => {
        this.totalUsersChart_data = [];
        this.totalUsersChart_data = res.data;
        this.generateTotalUsersChart();
        console.log("Users" + res.data);
      });
    });

    this.userService.getPaymentReportData().subscribe(res => {
      this.totalPaymentsChart_data = [];
      this.totalPaymentsChart_data = res.data;
      this.generateTotalPaymentsChart();
    });

    this.userService.getTagsReportData().subscribe(resu => {
      this.totalTagsChart_data = [];
      this.totalTagsChart_data = resu.data;
      this.generateTagsByChartChart();
    });
  }

  totalUserChart;

  generateTotalUsersChart() {
    this.totalUserChart = new Chart("totalUsers", {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            label: "Users",
            backgroundColor: "#3e95cd",
            data: this.totalUsersChart_data
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Total Users"
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: 0,
                precision: 0
              }
            }
          ]
        }
      }
    });
  }

  totalArtworksChart;
  generateTotalArtworksChart() {
    this.totalArtworksChart = new Chart("totalArtworks", {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            label: "Artworks",
            backgroundColor: "#3e95cd",
            data: this.totalArtworksChart_data
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Total Artworks"
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: 0,
                precision: 0
              }
            }
          ]
        }
      }
    });
  }

  totalPaymentsChart;
  generateTotalPaymentsChart() {
    this.totalPaymentsChart = new Chart("totalPayments", {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            label: "Payments",
            backgroundColor: "#3e95cd",
            data: this.totalPaymentsChart_data
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Total Payments"
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: 0,
                precision: 0
              }
            }
          ]
        }
      }
    });
  }

  tagsChart;
  generateTagsByChartChart() {
    this.tagsChart = new Chart("tagsChart", {
      type: "bar",
      data: {
        labels: [
          "Birthday",
          "Music",
          "Christmas",
          "New Year",
          "Art",
          "Travel",
          "Work",
          "House",
          "Computer",
          "Relax"
        ],
        datasets: [
          {
            label: "Tags",
            backgroundColor: "#FBA71D",
            //backgroundColor:"#FFEFD5",
            data: this.totalTagsChart_data
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "No.of Artworks by Tags"
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMin: 0,
                precision: 0
              }
            }
          ]
        }
      }
    });
  }
}
