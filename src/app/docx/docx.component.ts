import { Component } from '@angular/core';
import { RelatorioService } from '../relatorio.service';
import { downloadDocx, getDocxReport } from './generate-docx';

@Component({
  selector: 'app-docx',
  templateUrl: './docx.component.html',
})
export class DOCXComponent {
  private template?: File;
  private logo?: File;

  constructor(private relatorioService: RelatorioService) {}

  onTemplateChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.template = target.files[0];
  }

  onLogoChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.logo = target.files[0];
  }

  async onSubmit() {
    if (!this.template) return;
    if (!this.logo) return;

    const fileReader = new FileReader();

    fileReader.addEventListener('load', async (evt) => {
      if (!this.template) return;
      if (!evt.target?.result) return;
      if (typeof evt.target.result !== 'string') return;

      const image = evt.target.result.replace('data:', '').replace(/^.+,/, '');
      const report = await getDocxReport(this.template, () => {
        return {
          texto: 'texto teste',
          logo: { width: 4, height: 1, data: image, extension: '.png' },
        };
      });

      this.relatorioService.relatorioDocxBlob = new Blob([report]);
      // downloadDocx(this.template, 'relatorio', () => {
      //   return {
      //     teste: 'teste2',
      //     logo: { width: 4, height: 1, data: image, extension: '.png' },
      //   };
      // });
    });

    fileReader.readAsDataURL(this.logo);
  }
}
