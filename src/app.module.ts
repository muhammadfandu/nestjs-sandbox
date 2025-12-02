import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfService } from './pdf/pdf.service';
import { PdfController } from './pdf/pdf.controller';
import { BrowserService } from './browser/browser.service';
import { QualityControlPdfModule } from './quality-control/quality-control-pdf.module';

@Module({
  imports: [QualityControlPdfModule],
  controllers: [AppController, PdfController],
  providers: [AppService, PdfService, BrowserService],
})
export class AppModule {}
