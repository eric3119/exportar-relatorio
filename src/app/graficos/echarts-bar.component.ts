import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { init } from 'echarts';
import { Utils } from './utils';

@Component({
    selector: 'echarts-bar',
    template: `<div style="height: 700px; width: 500px;" #echartsDiv></div>`,
})
export class EchartsBarComponent implements AfterViewInit {
    @ViewChild('echartsDiv', { static: true })
    echartsDiv!: ElementRef<HTMLDivElement>;

    async ngAfterViewInit(): Promise<void> {
        const [agt, lda] = await Utils.loadPatternsHTML([
            '/assets/litologia_AGT.png',
            '/assets/litologia_LDA.png',
        ]);

        const data = [
            {
                label: 'LDA',
                value: 20,
                texture: {
                    image: lda, // supported as HTMLImageElement, HTMLCanvasElement, but not path string of SVG
                    repeat: 'repeat', // whether to tile, can be 'repeat-x', 'repeat-y', 'no-repeat'
                },
            },
            {
                label: 'AGT',
                value: 10,
                texture: {
                    image: agt, // supported as HTMLImageElement, HTMLCanvasElement, but not path string of SVG
                    repeat: 'repeat', // whether to tile, can be 'repeat-x', 'repeat-y', 'no-repeat'
                },
            },
        ];

        const chart = init(this.echartsDiv.nativeElement);

        chart.setOption({
            tooltip: {
                show: true,
                formatter: (params: any) => {
                    return data.find((d) => d.value === params.value)?.label;
                },
            },
            emphasis: {
                disabled: true,
            },
            xAxis: {
                type: 'category',
                data: ['TESTE'],
            },
            yAxis: {},
            series: [
                {
                    type: 'bar',
                    data: data,
                    stack: 'stack',
                    itemStyle: {
                        color: function (params: any) {
                            return params.data.texture;
                        },
                    },
                },
            ],
        });
    }
}
