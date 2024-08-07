import { DOCUMENT, NgStyle } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { UserService } from 'src/utils/user.service';
import { ApiService } from '../../../utils/api.service';
import { Chart } from 'chart.js/auto';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

// interface IUser {
//   name: string;
//   state: string;
//   registered: string;
//   country: string;
//   usage: number;
//   period: string;
//   payment: string;
//   activity: string;
//   avatar: string;
//   status: string;
//   color: string;
// }

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  cloudiness: number;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [WidgetsDropdownComponent, CommonModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent]
})
export class DashboardComponent implements OnInit, AfterViewInit  {
  chart: Chart | undefined;
  isOperator: boolean = false;
  error: string | null = null;
  loading: boolean = false;

  // readonly #destroyRef: DestroyRef = inject(DestroyRef);
  // readonly #document: Document = inject(DOCUMENT);
  // readonly #renderer: Renderer2 = inject(Renderer2);
  // readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  // public users: IUser[] = [
  //   {
  //     name: 'Yiorgos Avraamu',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Us',
  //     usage: 50,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Mastercard',
  //     activity: '10 sec ago',
  //     avatar: './assets/images/avatars/1.jpg',
  //     status: 'success',
  //     color: 'success'
  //   },
  //   {
  //     name: 'Avram Tarasios',
  //     state: 'Recurring ',
  //     registered: 'Jan 1, 2021',
  //     country: 'Br',
  //     usage: 10,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Visa',
  //     activity: '5 minutes ago',
  //     avatar: './assets/images/avatars/2.jpg',
  //     status: 'danger',
  //     color: 'info'
  //   },
  //   {
  //     name: 'Quintin Ed',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'In',
  //     usage: 74,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Stripe',
  //     activity: '1 hour ago',
  //     avatar: './assets/images/avatars/3.jpg',
  //     status: 'warning',
  //     color: 'warning'
  //   },
  //   {
  //     name: 'Enéas Kwadwo',
  //     state: 'Sleep',
  //     registered: 'Jan 1, 2021',
  //     country: 'Fr',
  //     usage: 98,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Paypal',
  //     activity: 'Last month',
  //     avatar: './assets/images/avatars/4.jpg',
  //     status: 'secondary',
  //     color: 'danger'
  //   },
  //   {
  //     name: 'Agapetus Tadeáš',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Es',
  //     usage: 22,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'ApplePay',
  //     activity: 'Last week',
  //     avatar: './assets/images/avatars/5.jpg',
  //     status: 'success',
  //     color: 'primary'
  //   },
  //   {
  //     name: 'Friderik Dávid',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Pl',
  //     usage: 43,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Amex',
  //     activity: 'Yesterday',
  //     avatar: './assets/images/avatars/6.jpg',
  //     status: 'info',
  //     color: 'dark'
  //   }
  // ];

  // public mainChart: IChartProps = { type: 'line' };
  // public mainChartRef: WritableSignal<any> = signal(undefined);
  // #mainChartRefEffect = effect(() => {
  //   if (this.mainChartRef()) {
  //     this.setChartStyles();
  //   }
  // });
  // public chart: Array<IChartProps> = [];
  // public trafficRadioGroup = new FormGroup({
  //   trafficRadio: new FormControl('Month')
  // });

  constructor(private apiService: ApiService, private userService: UserService) { }

  ngOnInit() {
    this.checkUserRole();
  }

  ngAfterViewInit() {
    if (this.isOperator) {
      this.fetchWeatherDataAndCreateChart();
    }
  }

  checkUserRole() {
    const userRole = this.userService.getUserRole();
    this.isOperator = userRole === 'operator';
    console.log('User role:', userRole, 'Is operator:', this.isOperator);
  }

  fetchWeatherDataAndCreateChart() {
    this.loading = true;
    this.error = null;
    const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
    const weatherData: { city: string, temp: number }[] = [];
  
    let completedRequests = 0;
    cities.forEach(city => {
      this.apiService.getWeatherData(city).subscribe({
        next: (data: any) => {
          weatherData.push({ city: city, temp: data.main.temp });
          completedRequests++;
          if (completedRequests === cities.length) {
            this.createChart(weatherData);
            this.loading = false;
          }
        },
        error: (error) => {
          console.error(`Error fetching data for ${city}:`, error);
          this.error = `Failed to fetch data for ${city}. ${error.message}`;
          this.loading = false;
        }
      });
    });
  }
  
  createChart(weatherData: { city: string, temp: number }[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    const labels = weatherData.map(data => data.city);
    const temperatures = weatherData.map(data => data.temp);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: temperatures,
          backgroundColor: temperatures.map(temp => this.getColorForTemperature(temp)),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'City Temperature Comparison'
          },
          tooltip: {
            callbacks: {
              label: (context) => `Temperature: ${context.formattedValue}°C`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Temperature (°C)'
            },
            ticks: {
              callback: (value) => `${value}°C`
            }
          },
          x: {
            title: {
              display: true,
              text: 'City'
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
    
    console.log('Chart created:', this.chart);
  }

  getColorForTemperature(temp: number): string {
    // Define color ranges for temperatures
    if (temp < 0) return 'rgba(0, 0, 255, 0.6)';  // Cold: Blue
    if (temp < 10) return 'rgba(0, 255, 255, 0.6)';  // Cool: Cyan
    if (temp < 20) return 'rgba(0, 255, 0, 0.6)';  // Mild: Green
    if (temp < 30) return 'rgba(255, 255, 0, 0.6)';  // Warm: Yellow
    return 'rgba(255, 0, 0, 0.6)';  // Hot: Red
  }

  handleCORSError(error: any) {
    console.log('CORS Error Details:', error);
    if (error.name === 'HttpErrorResponse' && error.status === 0) {
      this.error += ' The server is not allowing cross-origin requests.';
    }
  }
}

  // initCharts(): void {
  //   this.mainChart = this.#chartsData.mainChart;
  // }

  // setTrafficPeriod(value: string): void {
  //   this.trafficRadioGroup.setValue({ trafficRadio: value });
  //   this.#chartsData.initMainChart(value);
  //   this.initCharts();
  // }

  // handleChartRef($chartRef: any) {
  //   if ($chartRef) {
  //     this.mainChartRef.set($chartRef);
  //   }
  // }

  // updateChartOnColorModeChange() {
  //   const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
  //     this.setChartStyles();
  //   });

  //   this.#destroyRef.onDestroy(() => {
  //     unListen();
  //   });
  // }

  // setChartStyles() {
  //   if (this.mainChartRef()) {
  //     setTimeout(() => {
  //       const options: ChartOptions = { ...this.mainChart.options };
  //       const scales = this.#chartsData.getScales();
  //       this.mainChartRef().options.scales = { ...options.scales, ...scales };
  //       this.mainChartRef().update();
  //     });
  //   }
  // }

