
const TextArea = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="self-stretch h-[167px] flex-col justify-start items-start gap-0.5 flex overflow-hidden">
      <div className="self-stretch text-stone-800 text-sm font-normal font-['Inter'] leading-[21px]">
        {label}
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="self-stretch h-36 p-3 bg-neutral-50 rounded border border-slate-300 flex-col justify-start items-end gap-2 flex overflow-hidden text-gray-400 text-base font-normal font-['Inter'] leading-normal resize-none outline-none"
      />
    </div>
  );
};

export default TextArea;