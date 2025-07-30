function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex w-full">
      {options.map((option, index, array) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`text-label-large grow px-4 py-2 text-center transition-colors ${
            option.value === value
              ? 'bg-primary-container text-on-primary-container'
              : 'border-outline text-on-surface-variant hover:bg-surface-container border'
          } ${index == 0 ? 'rounded-l-full' : ''} ${index == array.length - 1 ? 'rounded-r-full' : ''} ${
            // This is a clever trick to hide the border between unselected buttons
            option.value !== value && index !== options.length - 1
              ? '-mr-px'
              : ''
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
