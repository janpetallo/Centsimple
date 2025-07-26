import CloseIcon from '../icons/CloseIcon';

function FilterPill({ label, onClear }) {
  return (
    <div className="bg-secondary-container text-on-secondary-container inline-flex w-fit items-center justify-between gap-2 rounded-full px-3 py-1 text-sm">
      <p>{label}</p>
      <button onClick={onClear}>
        <CloseIcon className="hover:text-primary h-5 w-5 cursor-pointer" />
      </button>
    </div>
  );
}

export default FilterPill;
