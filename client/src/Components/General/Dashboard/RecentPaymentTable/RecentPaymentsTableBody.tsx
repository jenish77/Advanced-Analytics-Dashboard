import React, { useState } from 'react';
import { Badge, Button } from 'reactstrap';

interface CurrentItems {
  _id: string;
  amount: number;
  paymentId: string;
  Gateway: string;
  category: string;
  paymentStatus: boolean;
  date: string;
}

interface RecentPaymentProps {
  currentItems: CurrentItems[];
}

const RecentPaymentsTableBody: React.FC<RecentPaymentProps> = ({ currentItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(currentItems.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage + 1, totalPages));
  };

  const currentItemsSlice = currentItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <tbody>
        {currentItemsSlice.map((item: CurrentItems, index: number) => {
         let paymentStatus = item.paymentStatus ? 'Success' : 'Pending';
         
        const shortPaymentId = item.paymentId.split('-')[0];

          return (
            <tr key={index}>
              <td>#{shortPaymentId}</td>
              <td className="project-dot">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <h6>{item.Gateway}</h6>
                  </div>
                </div>
              </td>
              {/* <td>{item.paymentStatus}</td> */}
              
              <td>{paymentStatus}</td>
              <td>{item.amount}</td>
              <td>
                <Badge >{item.paymentStatus}</Badge>
              </td>
              <td>{new Date(item.date).toISOString().split('T')[0]}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6}>
            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button
                color="primary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </td>
        </tr>
      </tfoot>
    </>
  );
};

export default RecentPaymentsTableBody;
