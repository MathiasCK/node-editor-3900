const Spinner = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="flex h-screen items-center justify-center space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-white"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
