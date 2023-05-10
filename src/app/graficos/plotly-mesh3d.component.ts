import { Component } from '@angular/core';

@Component({
  selector: 'plotly-mesh3d',
  template: '<plotly-plot [data]="data"></plotly-plot>',
})
export class PlotlyMesh3DComponent {
  Tri = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 1],
    [1, 2, 3],
  ];
  data = [
    {
      type: 'mesh3d',
      x: [0, 1, 0, 0],
      y: [0, 0, 1, 0],
      z: [0, 0, 0, 1],
      i: this.Tri.map(function (f) {
        return f[0];
      }),
      j: this.Tri.map(function (f) {
        return f[1];
      }),
      k: this.Tri.map(function (f) {
        return f[2];
      }),
      facecolor: [
        'rgb(0, 0, 0)',
        'rgb(255, 0, 0)',
        'rgb(0, 255, 0)',
        'rgb(0, 0, 255)',
      ],

      flatshading: true,
    },
  ];
}
