import html2canvas from 'html2canvas';
import React, { useState } from 'react';

export const Home = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        product: '',
        quantity: '',
        price: ''
    });

    const [invoices, setInvoices] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submission

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (isSubmitting) return; // Prevent form resubmission while it's already submitting

    //     setIsSubmitting(true); // Lock form from submitting again

    //     const quantity = parseInt(formData.quantity, 10);
    //     const price = parseFloat(formData.price);
    //     const totalPrice = quantity * price;

    //     const newItem = {
    //         product: formData.product,
    //         quantity,
    //         price,
    //         totalPrice
    //     };

    //     setInvoices(prevInvoices => {
    //         // Find if invoice with the same name already exists
    //         const existingInvoiceIndex = prevInvoices.findIndex(
    //             inv => inv.name.toLowerCase() === formData.name.toLowerCase()
    //         );

    //         if (existingInvoiceIndex !== -1) {
    //             // If invoice exists, add the new item
    //             const updatedInvoices = [...prevInvoices];
    //             updatedInvoices[existingInvoiceIndex].items.push(newItem);
    //             return updatedInvoices;
    //         } else {
    //             // If no invoice exists, create a new one
    //             return [
    //                 {
    //                     id: `${Date.now()}-${Math.random()}`, // Use a more unique ID
    //                     name: formData.name,
    //                     items: [newItem]
    //                 },
    //                 ...prevInvoices
    //             ];
    //         }
    //     });

    //     // Clear the form and re-enable the submit button after the state update
    //     setFormData({ name: '', product: '', quantity: '', price: '' });

    //     // Re-enable the submit button after 300ms delay (prevents rapid double-click)
    //     setTimeout(() => setIsSubmitting(false), 300);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent form resubmission while it's already submitting

        setIsSubmitting(true); // Lock form from submitting again

        const quantity = parseInt(formData.quantity, 10);
        const price = parseFloat(formData.price);
        const totalPrice = quantity * price;

        const newItem = {
            product: formData.product,
            quantity,
            price,
            totalPrice
        };

        setInvoices(prevInvoices => {
            // Find if invoice with the same name already exists
            const existingInvoiceIndex = prevInvoices.findIndex(
                inv => inv.name.toLowerCase() === formData.name.toLowerCase()
            );

            if (existingInvoiceIndex !== -1) {
                // If invoice exists, check if the product already exists
                const existingInvoice = prevInvoices[existingInvoiceIndex];
                const existingProductIndex = existingInvoice.items.findIndex(
                    item => item.product.toLowerCase() === formData.product.toLowerCase()
                );

                if (existingProductIndex !== -1) {
                    // If the product already exists, replace the existing product with the new one
                    const updatedInvoice = { ...existingInvoice };
                    updatedInvoice.items[existingProductIndex] = newItem;

                    return [
                        ...prevInvoices.slice(0, existingInvoiceIndex),
                        updatedInvoice,
                        ...prevInvoices.slice(existingInvoiceIndex + 1)
                    ];
                } else {
                    // If the product doesn't exist, add the new product
                    const updatedInvoice = { ...existingInvoice };
                    updatedInvoice.items.push(newItem);

                    return [
                        ...prevInvoices.slice(0, existingInvoiceIndex),
                        updatedInvoice,
                        ...prevInvoices.slice(existingInvoiceIndex + 1)
                    ];
                }
            } else {
                // If no invoice exists, create a new one
                return [
                    {
                        id: `${Date.now()}-${Math.random()}`, // Use a more unique ID
                        name: formData.name,
                        items: [newItem]
                    },
                    ...prevInvoices
                ];
            }
        });

        // Clear the form and re-enable the submit button after the state update
        setFormData({ name: '', product: '', quantity: '', price: '' });

        // Re-enable the submit button after 300ms delay (prevents rapid double-click)
        setTimeout(() => setIsSubmitting(false), 300);
    };

    const handleDownloadImage = () => {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.download = 'page-screenshot.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="page-layout">
            <div className="form-section">
                <h2>Create Invoice</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>

                    <label>
                        Product:
                        <input type="text" name="product" value={formData.product} onChange={handleChange} required />
                    </label>

                    <label>
                        Quantity:
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" />
                    </label>

                    <label>
                        Price:
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" />
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Add to Invoice'}
                    </button>
                </form>
            </div>

            <div className="invoice-section">
                <h2>Invoices</h2>
                {invoices.length === 0 ? (
                    <p>No invoices yet.</p>
                ) : (
                    invoices.map(invoice => (
                        <div key={invoice.id} className="invoice">
                            <p><strong>Name:</strong> {invoice.name}</p>
                            <ul>
                                {invoice.items.map((item, index) => (
                                    <li key={index}>
                                        <strong>Product:</strong> {item.product},
                                        <strong> Quantity:</strong> {item.quantity},
                                        <strong> Price:</strong> Rp. {item.price.toLocaleString('id-ID')},
                                        <strong> Total:</strong> Rp. {item.totalPrice.toLocaleString('id-ID')}
                                    </li>
                                ))}
                            </ul>
                            <p className="grand-total">
                                <strong>Total Price:</strong> Rp. {invoice.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString('id-ID')}
                            </p>
                        </div>
                    ))
                )}

                {invoices.length > 0 && (
                    <div className="overall-total">
                        <hr />
                        <p>
                            <strong>Grand Total of All Invoices:</strong> Rp. {invoices
                                .reduce((grandSum, invoice) =>
                                    grandSum + invoice.items.reduce((sum, item) => sum + item.totalPrice, 0), 0
                                ).toLocaleString('id-ID')}
                        </p>
                    </div>
                )}
                <button onClick={handleDownloadImage} style={{ margin: '1rem 0' }}>
                    Download Page as Image
                </button>
            </div>
        </div>
    );
}
