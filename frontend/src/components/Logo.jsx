import LogoIcon from '../icons/LogoIcon';

function Logo() {
  return (
    <div className="flex items-center gap-2 justify-center">
      <LogoIcon className="h-10 w-10" />
      <span className="text-primary text-title-large hidden sm:inline">
        Centsimple
      </span>
    </div>
  );
}

export default Logo;
