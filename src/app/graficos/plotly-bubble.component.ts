import { Component } from '@angular/core';

@Component({
  selector: 'plotly-bubble',
  template: "<plotly-plot [data]='data' [layout]='layout'></plotly-plot>",
})
export class PlotlyBubbleComponent {
  data = [
    {
      x: [0, 1, 2, 3, 4, 5, 6],
      y: [1, 9, 4, 7, 5, 2, 4],
      mode: 'markers',
      marker: {
        size: [20, 40, 25, 10, 60, 90, 30],
      },
    },
  ];

  layout = {
    showlegend: false,
  };
}
