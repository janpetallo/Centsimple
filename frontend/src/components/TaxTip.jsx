import CloseIcon from '../icons/CloseIcon';

function TaxTip({ tip, onDismiss }) {
  return (
    <>
      <div className='flex items-center justify-between'>
        <p className="text-on-surface-variant text-sm">Tax Tip</p>
        <button onClick={onDismiss}>
          <CloseIcon className="hover:text-primary h-5 w-5 cursor-pointer" />
        </button>
      </div>

      <div className="text-on-primary-container">
        <p className="whitespace-pre-line">{tip}</p>
      </div>
    </>
  );
}

export default TaxTip;
