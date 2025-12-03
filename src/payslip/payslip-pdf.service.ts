// payslip-pdf.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { payslipHelpers } from './payslip-helpers';

export interface PayslipData {
  id: string;
  baseSalary: number;
  overtimeSalary: number;
  workHours: string;
  overtimeHours: string;
  payrollId: string;
  totalEarnings: number;
  totalDeduction: number;
  totalSalary: number;
  userId: string;
  organisationId: string;
  createdAt: number;
  updatedAt: number;
  components: PayComponent[];
  payroll: PayrollInfo;
  user: UserInfo;
  hrEmail?: string; // Optional HR contact email
}

export interface PayComponent {
  id: string;
  amount: number;
  metadata: any;
  notes: string | null;
  payComponentConfig: {
    id: string;
    name: string;
    type: 'EARNING' | 'DEDUCTION' | 'EMPLOYER_CONTRIBUTION';
    description: string | null;
    generated: string;
  };
}

export interface PayrollInfo {
  id: string;
  payDate: number;
  status: string;
  startDate: number;
  endDate: number;
  payrollType: {
    id: string;
    name: string;
    description: string;
    organisationId: string;
    createdAt: number;
    updatedAt: number;
  };
}

export interface UserInfo {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  roleId: string;
  roleName: string;
}

@Injectable()
export class PayslipPdfService implements OnModuleDestroy {
  private browser: Browser;
  private browserPromise: Promise<Browser>;
  private template: HandlebarsTemplateDelegate;

  constructor() {
    // Register Handlebars helpers
    Object.keys(payslipHelpers).forEach((helperName) => {
      Handlebars.registerHelper(helperName, payslipHelpers[helperName]);
    });

    // Load and compile template
    const templatePath = path.join(__dirname, '..', 'templates', 'payslip.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    this.template = Handlebars.compile(templateSource);
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
        ],
      });
    }

    this.browser = await this.browserPromise;

    // Check if browser is still connected
    if (!this.browser.isConnected()) {
      console.log('Browser disconnected, recreating...');
      this.browserPromise = null;
      return this.getBrowser();
    }

    return this.browser;
  }

  async generatePayslipPdf(payslipData: PayslipData | any): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Set default HR email if not provided
      if (!payslipData.hrEmail) {
        payslipData.hrEmail = 'hr@company.com';
      }

      // Render HTML from template
      const html = this.template(payslipData);

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        preferCSSPageSize: false,
      });

      return Buffer.from(pdf.buffer);
    } catch (error) {
      console.error('Error generating payslip PDF:', error);
      throw error;
    } finally {
      await page.close(); // Close page, not browser
    }
  }

  // Generate payslips for multiple employees
  async generateBulkPayslips(payslipsData: PayslipData[]): Promise<Buffer[]> {
    const pdfs: Buffer[] = [];

    for (const payslipData of payslipsData) {
      try {
        const pdf = await this.generatePayslipPdf(payslipData);
        pdfs.push(pdf);
      } catch (error) {
        console.error(`Failed to generate payslip for user ${payslipData.userId}:`, error);
        // Continue with other payslips even if one fails
      }
    }

    return pdfs;
  }

  async onModuleDestroy() {
    if (this.browser && this.browser.isConnected()) {
      await this.browser.close();
    }
  }
}
