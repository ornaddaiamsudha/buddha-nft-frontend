import React, { useEffect, useState } from "react";
import { getListedItems, buyItem } from "../utils/contractConfig";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getListedItems();
      console.log("Loaded marketplace items:", data);
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Marketplace</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No amulets listed for sale.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => {
            const yearAttr = item.metadata.attributes?.find(attr => attr.trait_type === "Year");
            const frameAttr = item.metadata.attributes?.find(attr => attr.trait_type === "Frame");

            return (
              <div
                key={item.tokenId}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
              >
                <img
                  src={item.metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  alt={item.metadata.name}
                  className="h-48 object-cover rounded mb-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.metadata.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.metadata.description}</p>
                  <p className="text-sm mt-2 text-gray-500">
                    Year: <span className="font-medium">{yearAttr?.value || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Frame: <span className="font-medium">{frameAttr?.value || "N/A"}</span>
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-bold text-blue-700 text-right mb-2">{item.price} ETH</p>
                  <button
                    onClick={() => buyItem(item.tokenId, item.price)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;