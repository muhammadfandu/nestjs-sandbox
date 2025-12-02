// quality-control-pdf.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { handlebarsHelpers } from './handlebars-helpers';

@Injectable()
export class QualityControlPdfService implements OnModuleDestroy {
  private browser: Browser;
  private browserPromise: Promise<Browser>;
  private template: HandlebarsTemplateDelegate;

  constructor() {
    // Register Handlebars helpers
    Object.keys(handlebarsHelpers).forEach((helperName) => {
      Handlebars.registerHelper(helperName, handlebarsHelpers[helperName]);
    });

    // Load and compile template
    const templatePath = path.join(__dirname, '..', 'templates', 'quality-control-report.hbs');
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

  async generateQualityControlReport(issues: any[]): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // Prepare data for template
      const templateData = {
        issues: issues,
      };

      // Render HTML from template
      const html = this.template(templateData);

      // Set content and wait for images to load
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Generate PDF with proper settings for multi-page
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf.buffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      await page.close(); // Close page, not browser
    }
  }

  // Single issue PDF generation
  async generateSingleIssueReport(issue: any): Promise<Buffer> {
    return this.generateQualityControlReport([issue]);
  }

  async onModuleDestroy() {
    if (this.browser && this.browser.isConnected()) {
      await this.browser.close();
    }
  }
}
