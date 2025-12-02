// handlebars-helpers.ts
// Register these helpers with Handlebars in your NestJS service

export const handlebarsHelpers = {
  // Format Unix timestamp to readable date
  formatDate: (timestamp: number): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${String(day).padStart(2, '0')}, ${year}`;
  },

  // Format status to readable text
  formatStatus: (status: string): string => {
    if (!status) return 'UNKNOWN';
    return status.replace(/_/g, ' ').toUpperCase();
  },

  // Pad issue number with zeros (e.g., 0 -> "001", 1 -> "002")
  padNumber: (index: number): string => {
    const num = index + 1;
    return String(num).padStart(3, '0');
  },

  // Get initials from name for avatar placeholder
  getInitials: (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  },

  // Filter documentation by type (new/updated)
  filterByType: (documentation: any[], type: string): any[] => {
    if (!documentation || !Array.isArray(documentation)) return [];
    return documentation.filter(doc => doc.type === type);
  },

  // Check if file is an image
  isImage: (fileType: string): boolean => {
    if (!fileType) return false;
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(fileType.toLowerCase());
  },
};
