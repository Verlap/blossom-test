interface InfoFieldProps {
  title: string;
  value: string;
}

const Component = ({ title, value }: InfoFieldProps) => {
  return (
    <div className="border-b border-gray-300 p-4 mb-4 last:border-b-0">
      <p className="text-base leading-6 font-semibold text-slate-900">
        {title}
      </p>
      <p className="text-base leading-6 font-medium text-slate-500">{value}</p>
    </div>
  );
};

export default Component;