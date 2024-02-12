
const TextBox = () => {
    return ( 
        <div className=" bg-white grid place-items-center">
            <div className='text-neutral-800 bg-white p-2 w-[10rem] rounded flex flex-col space-y-10'>
                <textarea className='p-1 bg-white active:outline-none focus:outline-none rounded' placeholder='Type here'/>
            </div>
        </div>
    );};

export default TextBox;
