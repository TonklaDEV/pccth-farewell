import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WellfareDetailsService } from 'src/app/api-services/wellfare-details.service';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss'],
})
export class PdfModalComponent implements OnInit {
  safeUrl!: SafeResourceUrl;
  @Input() Base64!: string;
  @Input() reportValue: any;
  @Input() display: boolean = false;
  constructor(private sanitizer: DomSanitizer,public pdfSerive : WellfareDetailsService) {}

  ngOnInit(): void {
    if (this.display) {
      console.log(this.reportValue);
      this.pdfSerive.getExpenseHistoryReportBase64(this.reportValue.month,this.reportValue.year,this.reportValue.type).subscribe(
        (res : any) => {
          const base64 = res.responseData.result;
          this.safeUrl = this.createSafeUrl(base64);
        }
      )
    }
  }

  createSafeUrl(base64Pdf: string): SafeResourceUrl {
    const pdfUrl = `data:application/pdf;base64,${base64Pdf}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }
}
