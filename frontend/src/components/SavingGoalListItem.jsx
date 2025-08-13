import * as formatter from '../utils/format';
import ActionMenu from './ActionMenu';

function SavingGoalListItem({ saving }) {
  return (
    <li className="bg-surface-container border-outline/10 hover:bg-surface-variant hover:text-on-surface-variant rounded-xl border p-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex grow flex-col gap-4">
          <p className="font-medium">{saving.name}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <p className="text-label-large p-1 text-right md:w-28">
            {formatter.formatCurrency(saving.currentBalance)}
          </p>

          {/* can replace when update and delete functionality are implemented */}
          {/* <ActionMenu
            onDelete={() => onDelete(transaction.id)}
            onEdit={() => onEdit(transaction)}
            /> */}
        </div>
      </div>

      {/* Can create an error message from the hook just like in transactionlistitem */}
      {/* {error && error.id === transaction.id && (
        <p className="text-on-error-container bg-error-container mt-2 w-fit rounded-2xl p-2 text-center text-sm">
          {error.message}
        </p>
      )} */}
    </li>
  );
}

export default SavingGoalListItem;
