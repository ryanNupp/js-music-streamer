export default function IconButton({ Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-none w-8 h-8 m-1 p-1 border-transparent rounded-md hover:bg-gray-500 active:bg-gray-400"
    >
      <Icon />
    </button>
  );
}
