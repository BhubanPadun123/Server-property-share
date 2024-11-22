const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const easyinvoice = require('easyinvoice');

const RoomBookingResponseOwner = (data) => {
    return new Promise((resolved, rejected) => {
        try {
            const invoiceData = {
                apiKey: "free",
                mode: "development",
                products: [
                    {
                        quantity: 2,
                        description: "Test product",
                        taxRate: 6,
                        price: 33.87
                    }
                ]
            };

            easyinvoice.createInvoice(invoiceData, (result) => {
                if (result.pdf) {
                    const filePath = path.resolve(__dirname, '../public/invoices', 'myInvoice.pdf');
                    
                    // Save the PDF data to a file
                    fs.writeFileSync(filePath, result.pdf, 'base64');
                    
                    // Resolve with the file path for later retrieval
                    resolved({ path: filePath });
                } else {
                    rejected({ error: "Error generating PDF" });
                }
            });
        } catch (error) {
            // Check if error.response exists before trying to access error.response.data
            if (error.response && error.response.data) {
                rejected({ error: error.response.data });
            } else {
                rejected({ error: error.message || "Unknown error occurred" });
            }
        }
    });
};

module.exports = {
    OwnerPDF: RoomBookingResponseOwner
};
