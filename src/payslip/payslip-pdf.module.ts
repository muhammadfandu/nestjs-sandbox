// payslip-pdf.module.ts
import { Module } from '@nestjs/common';
import { PayslipPdfController } from './payslip-pdf.controller';
import { PayslipPdfService } from './payslip-pdf.service';

@Module({
  controllers: [PayslipPdfController],
  providers: [PayslipPdfService],
  exports: [PayslipPdfService], // Export if you need to use it in other modules
})
export class PayslipPdfModule {}
