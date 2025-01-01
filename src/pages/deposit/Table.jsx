import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";

const TABLE_HEAD = ["Type", "Transaction Code", "Number", "Status"];

const Table = ({ isLoading, isError, data }) => {
  return (
    <div>
      <div className="overflow-hidden mt-10 bg-background">
        <div className="p-0 overflow-x-auto">
          <table className="w-full table-auto text-center text-text-primary">
            <thead>
              <tr className="bg-background-section">
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="px-2 py-2 text-sm font-semibold text-gray-400"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    {TABLE_HEAD.map((_, i) => (
                      <td key={i} className="px-2 py-2">
                        <Skeleton height={20} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan={TABLE_HEAD.length}
                    className="px-4 py-4 text-center text-red-400"
                  >
                    Something went wrong. Please try again later.
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEAD.length}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    You have no requests yet.
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length > 0 ? (
                data.map(({ paymentType, transactionCode, number, status }, index) => {
                  const isLast = index === data.length - 1;
                  const rowClass = isLast ? "" : "border-b border-gray-700";

                  return (
                    <tr
                      key={transactionCode}
                      className={`${rowClass} ${
                        index % 2 ? "bg-background-section" : "bg-background-secondary"
                      }`}
                    >
                      <td className="px-4 py-2 text-sm">{paymentType}</td>
                      <td className="px-4 py-2 text-sm">
                        {transactionCode.slice(0, 4)}**{transactionCode.slice(-3)}
                      </td>
                      <td className="px-4 py-2 text-sm">{number.slice(0, 3)}**{number.slice(-3)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`py-1 px-2 rounded-full text-xs font-medium ${
                            status === "Success"
                              ? "text-green-300"
                              : "text-yellow-300"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={TABLE_HEAD.length}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    Invalid data format received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      paymentType: PropTypes.string.isRequired,
      transactionCode: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Table;
