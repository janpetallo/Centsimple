function LogoIcon({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle cx="50" cy="50" r="48" className="fill-primary-container" />

      <text
        x="50"
        y="68"
        fontFamily="Inter, sans-serif"
        fontSize="50"
        fontWeight="bold"
        textAnchor="middle"
        className="fill-on-primary-container"
      >
        C
      </text>
    </svg>
  );
}

export default LogoIcon;
