export function ButtonCustom({ children, onClick }) {
    return (
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={onClick}>
            {children}
        </button>
    );
}
