import { Component } from '@angular/core';
import { lineMock } from './line-mock';

@Component({
    selector: 'plotly-line',
    template: `<plotly-plot [data]="data" [layout]="layout"></plotly-plot>`,
})
export class PlotlyLineComponent {
    layout = { yaxis: { autorange: 'reversed' } };
    data = [
        {
            x: lineMock.y,
            y: lineMock.x,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' },
        },
    ];
}
