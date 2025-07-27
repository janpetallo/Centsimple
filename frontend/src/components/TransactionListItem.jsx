import * as formatter from '../utils/format';
import ActionMenu from './ActionMenu';

function TransactionListItem({ transaction, onEdit, onDelete, error }) {
  return (
    <li className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant rounded-xl border p-4 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex grow flex-col gap-4 md:flex-row">
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2">
            <p className="bg-secondary-container text-on-secondary-container max-w-fit rounded-full px-2 py-1 text-xs whitespace-nowrap">
              {formatter.formatDate(transaction.date)}
            </p>
            <p className="bg-tertiary-container text-on-tertiary-container rounded-full px-2 py-1 text-xs">
              {transaction.category.name}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4">
          <p className="text-label-large p-1 text-right md:w-28">
            {formatter.formatCurrency(
              transaction.type === 'EXPENSE'
                ? -transaction.amount
                : transaction.amount
            )}
          </p>

          <ActionMenu
            onDelete={() => onDelete(transaction.id)}
            onEdit={() => onEdit(transaction)}
          />
        </div>
      </div>

      {error && error.id === transaction.id && (
        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
          {error.message}
        </p>
      )}
    </li>
  );
}

export default TransactionListItem;
