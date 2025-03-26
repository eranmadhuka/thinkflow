const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center text-blue-500 font-semibold text-lg">
          🔄
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-lg font-medium">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loading;
