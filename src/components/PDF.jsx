import { useContext, useEffect } from 'react';
import AppContext from './context/appContext';
import { Resolution } from 'react-to-pdf';
import { useParams } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import { Helmet } from 'react-helmet-async';

function Pdf() {
  const context = useContext(AppContext);
  const { pdfData, getTransactionById } = context;
  const { id } = useParams();

  const { toPDF, targetRef } = usePDF({
    filename: pdfData?.pdfName || "Transaction",
    resolution: Resolution.HIGH
  });
   
  useEffect(() => {
    const fetchFunc = async()=>{
    await getTransactionById(id)
    console.log(pdfData, "qew")
    }
    fetchFunc()
  }, [id])
  

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="container text-center">
        <button
          className="btn btn-outline-primary my-4"
          onClick={() => toPDF()}
        >
          Download PDF
        </button>
      </div>

      <div
        ref={targetRef}
        style={{
          maxWidth: "793px",
          minHeight: "1122px",
          margin: "0 auto",
          background: "#fff",
          color: "#000",
          padding: "20px"
        }}
        className="shadow-lg rounded"
      >
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="fw-bold h3 py-3">Kamran Mobile Zone & Electronics</h1>
          {/* <p className="opacity-75">{pdfData?._id}</p> */}
        </div>

        {/* User & Granter Info */}
        <div className="row mb-4 g-3">
          <div className="col-12 col-md-6 border p-3 rounded-3">
            <h5 className="fw-bold">User Details</h5>
            <p><strong>Name:</strong> {pdfData?.fullName}</p>
            <p><strong>Phone:</strong> {pdfData?.contactNumber}</p>
            <p><strong>CNIC:</strong> {pdfData?.cnicNumber}</p>
            <p><strong>Address:</strong> {pdfData?.address}</p>
          </div>

          <div className="col-12 col-md-6 border p-3 rounded-3">
            <h5 className="fw-bold">Granter Details</h5>
            <p><strong>Name:</strong> {pdfData?.granterFullName}</p>
            <p><strong>Phone:</strong> {pdfData?.granterContactNumber}</p>
            <p><strong>CNIC:</strong> {pdfData?.granterCnicNumber}</p>
            <p><strong>Address:</strong> {pdfData?.granterAddress}</p>
          </div>
        </div>
         <div className="py-5">
  <table className="table table-bordered">
    <thead className="table-dark">
      <tr>
        <th scope="col">Product</th>
        {/* <th scope="col">Wholesaler</th> */}
        <th scope="col">Type</th>
        <th scope="col">Amount</th>
      </tr>
    </thead>
    <tbody>
      {pdfData?.productType ? (
        <tr>
          <td>{pdfData.productType.productName}</td>
          {/* <td>{pdfData.productType.wholesalerName}</td> */}
          <td>{pdfData.productType.productType}</td>
          <td>
            {pdfData.transactionType === "cash"
              ? `${pdfData.cashPrice} PKR`
              : `${pdfData.installmentPrice} PKR (Total)`}
          </td>
        </tr>
      ) : (
        <tr>
          <td colSpan="4" className="text-center text-muted">
            No product information available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        <div className="row">
                        <div className="col-6"></div>
                        <div className="col-6 p-1">
                            <div className='h-100 p-3 border border-dark rounded-4 flex-column d-flex justify-content-center'>
                                <div className="d-flex justify-content-between">
                                    <span className=" fw-bold">Sub Total</span>
                                    <span className=" opacity-75">{pdfData?.cashPrice.toLocaleString('en')} PKR</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className=" fw-bold">Tax</span>
                                    <span className=" opacity-75">Included</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className=" fw-bold">Total</span>
                                    <span className=" fw-bold h3">{pdfData?.cashPrice.toLocaleString('en')} PKR</span>
                                </div>
                            </div>
                        </div>
                    </div>

        {/* Notes */}
        <div>
          <h5 className="fw-bold mb-2">Notes</h5>
          <p className="fw-bold">Payment Method</p>
          <p className="opacity-75">
            Any form of convenient payment method is acceptable
          </p>
          <p className="mt-3">
            <strong>Date:</strong>{" "}
            {new Date(pdfData?.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}

export default Pdf;
