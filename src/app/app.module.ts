import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DOCXComponent } from './docx/docx.component';
import { PlotlyMesh3DComponent } from './graficos/plotly-mesh3d.component';
import { HomeComponent } from './home/home.component';
import { JsPdfComponent } from './jspdf/jspdf.component';
import { PDFComponent } from './pdf/pdf.component';
import { XLSXComponent } from './xlsx/xlsx.component';

import { ChartjsModule } from '@coreui/angular-chartjs';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { ChartJSBarComponent } from './graficos/chartjs-bar.component';
import { ChartJSLineComponent } from './graficos/chartjs-line.component';
import { EchartsLineComponent } from './graficos/echarts-line.component';
import { MainComponent } from './graficos/main.component';
import { PlotlyBubbleComponent } from './graficos/plotly-bubble.component';
import { PlotlyLineComponent } from './graficos/plotly-line.component';
import { EchartsBarComponent } from './graficos/echarts-bar.component';
import { ApexchartsLineComponent } from './graficos/apexcharts-line.component';
import { NgApexchartsModule } from 'ng-apexcharts';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
    declarations: [
        AppComponent,
        PDFComponent,
        DOCXComponent,
        XLSXComponent,
        JsPdfComponent,
        HomeComponent,
        ApexchartsLineComponent,
        PlotlyMesh3DComponent,
        PlotlyLineComponent,
        PlotlyBubbleComponent,
        ChartJSLineComponent,
        ChartJSBarComponent,
        EchartsLineComponent,
        EchartsBarComponent,
        MainComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        PlotlyModule,
        ChartjsModule,
        NgApexchartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
