import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PdfService } from './services/pdf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  linkForm: FormGroup;
  linkList: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private pdfService: PdfService
  ) {
    this.linkForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  addLink() {
    if (this.linkForm.valid) {
      const url = this.linkForm.get('url')?.value;
      this.linkList.push(url);
      this.linkForm.reset();
    }
  }

  removeLink(index: number) {
    this.linkList.splice(index, 1);
  }

  downloadPdf() {
    this.pdfService.downloadPdf(this.linkList).subscribe((pdf) => {
      const blobUrl = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'ng-puppeteer.pdf';
      link.click();
      // this.linkList = [];
    });
  }
}
