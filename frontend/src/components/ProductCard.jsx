function ProductCard({ product }) {
  const { id, title, description, price, category, image, sold, dateOfSale } =
    product;

  return (
    <div
      className={`relative transition-all overflow-hidden shadow-xl ${
        sold ? "cursor-not-allowed" : "hover:scale-105 "
      }`}
    >
      {sold && <div className="absolute inset-0 z-10 bg-[#ffffff8e]"></div>}
      <div className="relative flex flex-col items-center gap-3 p-2 overflow-hidden border rounded-lg">
        <div className="mb-1">
          <img className="w-40 h-40" src={image} alt={title} />
        </div>
        <div>
          <div className="h-8 ">{title.substring(0, 20)}</div>
          <div className="h-16 mb-2">{description.substring(0, 40)}</div>
          <div className="h-12 text-xl ">₹{price.toFixed(2)}</div>
          <div className="flex items-center justify-between">
            <div>{new Date(dateOfSale).toDateString()}</div>
            <div
              className={` text-white flex items-center rounded-md px-3 py-1 ${
                sold ? "bg-red-600" : "bg-green-600 animate-bounce"
              } `}
            >
              {sold ? "Sold" : "Unsold"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
