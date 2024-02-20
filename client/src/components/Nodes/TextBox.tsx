const TextBox = () => {
  return (
    <div className=" grid place-items-center bg-white">
      <div className="flex w-[10rem] flex-col space-y-10 rounded bg-white p-2 text-neutral-800">
        <textarea
          className="rounded bg-white p-1 focus:outline-none active:outline-none"
          placeholder="Type here"
        />
      </div>
    </div>
  );
};

export default TextBox;
