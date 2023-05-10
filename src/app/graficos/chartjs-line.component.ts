import { Component } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs/public-api';
import { Chart } from 'chart.js';
import { lineMock } from './line-mock';

@Component({
  selector: 'chartjs-line',
  template: `<c-chart
    type="line"
    [data]="data"
    [options]="options"
    width="500"
    height="700"
  ></c-chart>`,
})
export class ChartJSLineComponent {
  data: typeof ChartjsComponent.prototype.data = {
    labels: lineMock.x,
    datasets: [
      {
        axis: 'y',
        label: lineMock.name,
        data: lineMock.y,
        fill: false,
        borderWidth: 1,
      },
    ],
  };

  options: typeof ChartjsComponent.prototype.options = {
    indexAxis: 'y',
    responsive: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: (ctx: { chart: Chart }) => {
          if (ctx.chart.options.interaction === undefined) {
            console.info('ctx.chart.options.interaction is undefined');
            return '';
          }

          console.info(ctx.chart.options.interaction);
          const {
            axis = 'xy',
            intersect,
            mode,
          } = ctx.chart.options.interaction;
          return (
            'Mode: ' + mode + ', axis: ' + axis + ', intersect: ' + intersect
          );
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Peso no Gancho (KLBF)',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Profundidade Medida Percorrida (m)',
        },
      },
    },
  };
}
