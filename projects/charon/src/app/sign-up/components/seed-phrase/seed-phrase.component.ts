import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLogo } from '@shared/svg-icons/logo';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: './seed-phrase.component.html',
  styleUrls: ['./seed-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseComponent {
  @Input() public seedPhrase: string;

  @Output() public readonly next: EventEmitter<void> = new EventEmitter();

  @ViewChild('pdfTemplate', { static: false }) public pdfTemplate: ElementRef<HTMLElement>;

  public isSeedPhraseVisible = false;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLogo,
    ]);
  }

  public downloadSeedPhrase(): void {
    this.exportAsPDF(this.pdfTemplate.nativeElement);
  }

  public exportAsPDF(pdfTemplate: HTMLElement): void {
    html2canvas(pdfTemplate).then((canvas) => {
      const pdf = new jsPDF('p', 'px', 'a4');
      const contentDataURL = canvas.toDataURL('image/png');

      const title = 'Seed Phrase';
      const message = 'Seed Phrase is the only way to recover your profile and wallet with DEC balance so take it seriously.';

      pdf.addImage(contentDataURL, 'PNG', 20, 20, 73.5, 20);
      pdf.setFontSize(20);
      pdf.text(title, 20, 65);
      pdf.setFontSize(10);
      pdf.text(pdf.splitTextToSize(message, 400), 20, 80);
      pdf.setFontSize(14);
      pdf.text(pdf.splitTextToSize(this.seedPhrase, 400), 20, 100);
      pdf.setFontSize(10);
      pdf.setTextColor(79, 128, 230);
      pdf.textWithLink('https://decentr.net', 20, 130, { url: 'https://decentr.net/' });
      pdf.save('seed-phrase.pdf');
    });
  }

  public onNext(): void {
    this.next.emit();
  }

  public showSeedPhrase(): void {
    this.isSeedPhraseVisible = true;
  }
}
