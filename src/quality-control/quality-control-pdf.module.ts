// quality-control-pdf.module.ts
import { Module } from '@nestjs/common';
import { QualityControlPdfController } from './quality-control-pdf.controller';
import { QualityControlPdfService } from './quality-control-pdf.service';

@Module({
  controllers: [QualityControlPdfController],
  providers: [QualityControlPdfService],
  exports: [QualityControlPdfService], // Export if you need to use it in other modules
})
export class QualityControlPdfModule {}
