import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';

import { svgEye } from '@shared/svg-icons/eye';
import { svgEyeCrossed } from '@shared/svg-icons/eye-crossed';
import { svgLoud } from '@shared/svg-icons/loud';
import { svgCopy } from '@shared/svg-icons/copy';
import { svgDownload } from '@shared/svg-icons/download';
import { NotificationService } from '@shared/services/notification';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: './seed-phrase.component.html',
  styleUrls: ['./seed-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseComponent implements OnInit {
  @Input() public seedPhrase: string;

  @Output() public readonly back: EventEmitter<void> = new EventEmitter();
  @Output() public readonly next: EventEmitter<void> = new EventEmitter();

  @ViewChild('pdfTemplate', { static: false }) public pdfTemplate: ElementRef<HTMLElement>;

  public isSeedPhraseVisible = false;
  public securedSeedPhrase: string;

  constructor(
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgCopy,
      svgDownload,
      svgEye,
      svgEyeCrossed,
      svgLoud,
    ]);
  }

  public ngOnInit(): void {
    this.securedSeedPhrase = this.seedPhrase.replace(/\w/g, '•');
  }

  public downloadSeedPhrase(): void {
    this.exportAsPDF(this.pdfTemplate.nativeElement);
  }

  public onSeedPhraseCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('sign_up.seed_phrase_page.seed_copied')
    );
  }

  private exportAsPDF(pdfTemplate: HTMLElement): void {
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

  public onBack(): void {
    this.back.emit();
  }

  public onNext(): void {
    this.next.emit();
  }

  public toggleSeedVisibility(): void {
    this.isSeedPhraseVisible = !this.isSeedPhraseVisible;
  }
}
