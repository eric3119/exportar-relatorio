import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DOCXComponent } from './docx/docx.component';
import { PDFComponent } from './pdf/pdf.component';
import { XLSXComponent } from './xlsx/xlsx.component';

@NgModule({
  declarations: [AppComponent, PDFComponent, DOCXComponent, XLSXComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
