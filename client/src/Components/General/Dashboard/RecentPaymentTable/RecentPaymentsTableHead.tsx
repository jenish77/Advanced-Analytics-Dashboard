export const RecentPaymentsTableHead = () => {
  return (
    <thead>
      <tr>
        <th>Payment ID</th>
        <th>Gateway</th>
        <th>Merchant</th>
        <th>Amount</th>
        <th>paymentStatus</th>
        <th>Date</th>
        {/* <th className="text-end">Action</th> */}
      </tr>
    </thead>
  );
};
