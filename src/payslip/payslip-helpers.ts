// payslip-helpers.ts
// Register these helpers with Handlebars for payslip generation

export const payslipHelpers = {
  // Format currency with SGD prefix and 2 decimal places
  formatCurrency: (amount: number): string => {
    if (amount === null || amount === undefined) return 'S$0.00';
    return `S$${amount.toFixed(2)}`;
  },

  // Format Unix timestamp to "MMM YYYY" format (e.g., "MAY 2025")
  formatMonthYear: (timestamp: number): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  },

  // Format date range (e.g., "01 May 2025 - 31 May 2025")
  formatDateRange: (startTimestamp: number, endTimestamp: number): string => {
    if (!startTimestamp || !endTimestamp) return 'N/A';
    
    const startDate = new Date(startTimestamp * 1000);
    const endDate = new Date(endTimestamp * 1000);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  },

  // Filter components to get only earnings (type: EARNING)
  filterEarnings: (components: any[]): any[] => {
    if (!components || !Array.isArray(components)) return [];
    return components.filter(
      comp => comp.payComponentConfig && 
              comp.payComponentConfig.type === 'EARNING' &&
              comp.payComponentConfig.generated === 'none'
    );
  },

  // Filter components to get only deductions (type: DEDUCTION)
  filterDeductions: (components: any[]): any[] => {
    if (!components || !Array.isArray(components)) return [];
    return components.filter(
      comp => comp.payComponentConfig && 
              comp.payComponentConfig.type === 'DEDUCTION'
    );
  },

  // Filter components to get employer contributions
  filterEmployerContributions: (components: any[]): any[] => {
    if (!components || !Array.isArray(components)) return [];
    return components.filter(
      comp => comp.payComponentConfig && 
              comp.payComponentConfig.type === 'EMPLOYER_CONTRIBUTION'
    );
  },
};
