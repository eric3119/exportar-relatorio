import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { init } from 'echarts';
import { lineMock } from './line-mock';

@Component({
    selector: 'echarts-line',
    template: `<div style="height: 700px; width: 500px;" #echartsDiv></div>`,
})
export class EchartsLineComponent implements AfterViewInit {
    @ViewChild('echartsDiv', { static: true })
    echartsDiv!: ElementRef<HTMLDivElement>;

    ngAfterViewInit(): void {
        const chart = init(this.echartsDiv.nativeElement);

        const options = {
            legend: {
                data: ['Altitude (km) vs. temperature (°C)'],
            },
            tooltip: {
                trigger: 'axis',
                formatter: 'Temperature : <br/>{b}km : {c}°C',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C',
                },
            },
            yAxis: {
                type: 'category',
                axisLine: { onZero: false },
                axisLabel: {
                    formatter: '{value} km',
                },
                boundaryGap: false,
                data: Array.from(lineMock.x).reverse(),
            },
            series: [
                {
                    name: 'Altitude (km) vs. temperature (°C)',
                    type: 'line',
                    symbolSize: 10,
                    symbol: 'circle',
                    lineStyle: {
                        width: 3,
                    },
                    data: Array.from(lineMock.y).reverse(),
                },
            ],
        };

        chart.setOption(options);
    }
}
