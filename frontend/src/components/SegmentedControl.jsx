import CheckIcon from '../icons/CheckIcon';

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex w-full gap-1">
      {options.map((option, index, array) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`text-label-large grow cursor-pointer px-4 py-2 text-center transition-colors ${
            option.value === value
              ? 'bg-tertiary text-on-tertiary rounded-full'
              : 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary'
          } ${
            index == 0 && option.value !== value ? 'rounded-l-full' : ''
          } ${index == array.length - 1 && option.value !== value ? 'rounded-r-full' : ''} `}
        >
          <div className="flex items-center justify-center gap-4">
            {option.value === value && <CheckIcon className="h-5 w-5" />}
            <span className="flex-shrink-0">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
