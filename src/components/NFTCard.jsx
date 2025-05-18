{nfts.map((nft) => {
    const yearAttr = nft.metadata.attributes?.find(attr => attr.trait_type === "Year");
    const frameAttr = nft.metadata.attributes?.find(attr => attr.trait_type === "Frame");
  
    return (
      <div key={nft.tokenId} className="border p-4 rounded shadow">
        <img
          src={nft.metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt={nft.metadata.name}
          className="h-48 object-cover w-full rounded mb-2"
        />
        <h3 className="text-lg font-semibold">{nft.metadata.name}</h3>
        <p className="text-sm text-gray-600">{nft.metadata.description}</p>
        <p className="text-sm mt-1 text-gray-500">Year: {yearAttr?.value || "N/A"}</p>
        <p className="text-sm text-gray-500">Frame: {frameAttr?.value || "N/A"}</p>
        <button
          onClick={() => {
            setSelectedTokenId(nft.tokenId);
            setShowModal(true);
          }}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Sell
        </button>
      </div>
    );
  })}