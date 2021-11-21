import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import html2canvas from 'html2canvas';

import { NotificationService } from '@shared/services/notification';
import { svgCopy } from '@shared/svg-icons/copy';
import { svgDownload } from '@shared/svg-icons/download';
import { svgEye } from '@shared/svg-icons/eye';
import { svgEyeCrossed } from '@shared/svg-icons/eye-crossed';

@Component({
  selector: 'app-seed',
  templateUrl: './seed.component.html',
  styleUrls: ['./seed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedComponent implements OnInit {
  @Input() public value: string;

  @ViewChild('pdfTemplate', { static: false }) public pdfTemplate: ElementRef<HTMLElement>;

  public isSeedPhraseVisible = false;
  public securedSeedPhrase: string;

  constructor(
    private notificationService: NotificationService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCopy,
      svgDownload,
      svgEye,
      svgEyeCrossed,
    ]);

    this.securedSeedPhrase = this.value.replace(/\w/g, '•');
  }

  public downloadSeedPhrase(): void {
    this.exportAsPDF(this.pdfTemplate.nativeElement);
  }

  public onSeedPhraseCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('seed.seed_copied', null, 'shared')
    );
  }

  private exportAsPDF(pdfTemplate: HTMLElement): void {
    html2canvas(pdfTemplate).then((canvas) => {
      const pdf = new jsPDF('p', 'px', 'a4');
      const contentDataURL = canvas.toDataURL('image/png');

      const title = this.translocoService.translate('seed.pdf.title', null, 'shared');
      const message = this.translocoService.translate('seed.pdf.message', null, 'shared');

      pdf.addImage(contentDataURL, 'PNG', 20, 20, 73.5, 20);
      pdf.setFontSize(20);
      pdf.text(title, 20, 65);
      pdf.setFontSize(10);
      pdf.text(pdf.splitTextToSize(message, 400), 20, 80);
      pdf.setFontSize(14);
      pdf.text(pdf.splitTextToSize(this.value, 400), 20, 100);
      pdf.setFontSize(10);
      pdf.setTextColor(79, 128, 230);
      pdf.textWithLink('https://decentr.net', 20, 130, { url: 'https://decentr.net/' });
      pdf.save('seed-phrase.pdf');
    });
  }

  public toggleSeedVisibility(): void {
    this.isSeedPhraseVisible = !this.isSeedPhraseVisible;
  }
}
