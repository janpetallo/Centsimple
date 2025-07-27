import * as formatter from '../utils/format';

function IncomeExpenseDetails({ reportData, colors }) {
  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <div className="flex items-center justify-between rounded-lg bg-surface-variant/50 p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 flex-shrink-0 rounded-full"
            style={{ backgroundColor: colors.income }}
          ></div>
          <span className="text-body-large font-medium text-on-surface">
            Total Income
          </span>
        </div>
        <span className="text-label-large font-medium text-on-surface">
          {formatter.formatCurrency(reportData.totalIncome)}
        </span>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-surface-variant/50 p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 flex-shrink-0 rounded-full"
            style={{ backgroundColor: colors.expense }}
          ></div>
          <span className="text-body-large font-medium text-on-surface">
            Total Expense
          </span>
        </div>
        <span className="text-label-large font-medium text-on-surface">
          {formatter.formatCurrency(reportData.totalExpense)}
        </span>
      </div>
    </div>
  );
}

export default IncomeExpenseDetails;