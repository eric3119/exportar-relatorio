import { Component, OnInit } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { Utils } from './utils';

@Component({
  selector: 'chartjs-bar',
  template: `<c-chart
    *ngIf="patternLoaded"
    type="bar"
    [data]="data"
    [options]="options"
    width="500"
    height="700"
  ></c-chart>`,
})
export class ChartJSBarComponent implements OnInit {
  patternLoaded = false;

  async ngOnInit(): Promise<void> {
    const [agt, lda] = await Utils.loadPatterns([
      '/assets/litologia_AGT.png',
      '/assets/litologia_LDA.png',
    ]);
    this.data!.datasets[0].backgroundColor[0] = agt;
    this.data!.datasets[1].backgroundColor[0] = lda;
    this.patternLoaded = true;
  }

  data: typeof ChartjsComponent.prototype.data = {
    labels: ['Eixo Y'],
    datasets: [
      {
        label: 'Texto',
        data: [30],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      },
      {
        label: 'Texto',
        data: [60],
        backgroundColor: ['rgba(0, 99, 132, 0.2)'],
      },
    ],
  };

  options: typeof ChartjsComponent.prototype.options = {
    barThickness: 100,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
}
