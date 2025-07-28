import * as formatter from '../utils/format';

function ExpenseBreakdown({ breakdown, colors }) {
  return (
    <div
      className="w-full overflow-y-auto"
    >
      <ul className="flex flex-col gap-2">
        {breakdown.map((item, index) => (
          <li
            key={item.categoryName}
            className="flex items-center justify-between rounded-lg bg-surface-variant/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 flex-shrink-0 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-body-large text-on-surface-variant">
                {item.categoryName}
              </span>
            </div>
            <span className="text-label-large font-medium text-on-surface">
              {formatter.formatCurrency(item.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseBreakdown;