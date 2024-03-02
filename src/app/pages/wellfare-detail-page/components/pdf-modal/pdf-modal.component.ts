import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss'],
})
export class PdfModalComponent implements OnInit {
  safeUrl!: SafeResourceUrl;
  @Input() Base64: string = '';
  @Input() reportValue: any;
  @Input() display: boolean = false;
  constructor(private sanitizer: DomSanitizer, public pdfSerive: WellfareDetailsService) { }

  ngOnInit(): void {
    if (this.display && this.Base64 != "") {
      const base64 = this.Base64
      this.safeUrl = this.createSafeUrl(base64);
    }
  }

  createSafeUrl(base64Pdf: string): SafeResourceUrl {
    const pdfUrl = `data:application/pdf;base64,${base64Pdf}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }

  downloadFile() {
    this.pdfSerive.downloadFile(this.reportValue.month, this.reportValue.year, this.reportValue.type).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'รายงานการเบิกค่ารักษาพยาบาล.pdf'; // Set the desired PDF file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
      }
    );
  }

}
