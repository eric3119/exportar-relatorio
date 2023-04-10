import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DOCXComponent } from './docx/docx.component';
import { PDFComponent } from './pdf/pdf.component';
import { XLSXComponent } from './xlsx/xlsx.component';
import { JsPdfComponent } from './jspdf/jspdf.component';

@NgModule({
  declarations: [AppComponent, PDFComponent, DOCXComponent, XLSXComponent, JsPdfComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
