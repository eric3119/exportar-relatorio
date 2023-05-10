import { Component } from '@angular/core';

@Component({
    template: `
        <div class="bg-light">
            <h1>
                <a href="#echarts" (click)="echarts.scrollIntoView()" #echarts
                    >Apex</a
                >
            </h1>
            <div class="row bg-light">
                <div class="col">
                    <apexcharts-line></apexcharts-line>
                </div>
            </div>
            <h1>
                <a href="#echarts" (click)="echarts.scrollIntoView()" #echarts
                    >Echarts</a
                >
            </h1>
            <div class="row bg-light">
                <div class="col">
                    <echarts-line></echarts-line>
                </div>
                <div class="col">
                    <echarts-bar></echarts-bar>
                </div>
            </div>
            <h1>
                <a href="#chartjs" (click)="chartjs.scrollIntoView()" #chartjs
                    >ChartJS</a
                >
            </h1>
            <div class="row bg-light">
                <div class="col">
                    <chartjs-line></chartjs-line>
                </div>
                <div class="col">
                    <chartjs-bar></chartjs-bar>
                </div>
            </div>
            <h1>
                <a href="#plotly" (click)="plotly.scrollIntoView()" #plotly
                    >Plotly</a
                >
            </h1>

            <div class="row bg-light">
                <div class="col">
                    <plotly-line></plotly-line>
                </div>
                <div class="col">
                    <plotly-bubble></plotly-bubble>
                </div>
                <div class="col">
                    <plotly-mesh3d></plotly-mesh3d>
                </div>
            </div>
        </div>
    `,
})
export class MainComponent {}
