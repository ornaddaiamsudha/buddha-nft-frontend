export async function uploadToIPFS(form, files) {
  const API_KEY = 'c63457916daf1874e516';
  const API_SECRET = '27e213bcbcd8d4da78ddcc069d56515ff7770267388d93ac6bb467634bdb7175';

  try {
    // Upload image file to Pinata
    const imageFile = files[0];
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);

    const imageUploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
      body: imageFormData,
    });

    if (!imageUploadRes.ok) {
      const err = await imageUploadRes.json();
      throw new Error(`Image upload failed: ${err.error}`);
    }

    const imageData = await imageUploadRes.json();
    const imageCID = imageData.IpfsHash;
    const imageURI = `ipfs://${imageCID}`;
    const imageGatewayURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

    // Build metadata JSON object
    const metadata = {
      name: form.name,
      description: form.description,
      image: imageURI, // stored as ipfs:// but viewable via gateway
      attributes: [
        { trait_type: "Year", value: form.year },
        { trait_type: "Frame", value: form.frame },
      ],
    };

    // Upload metadata JSON to Pinata
    const metadataFormData = new FormData();
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    metadataFormData.append('file', metadataBlob, 'metadata.json');

    const metadataUploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRET,
      },
      body: metadataFormData,
    });

    if (!metadataUploadRes.ok) {
      const err = await metadataUploadRes.json();
      throw new Error(`Metadata upload failed: ${err.error}`);
    }

    const metadataData = await metadataUploadRes.json();
    const metadataCID = metadataData.IpfsHash;
    const metadataGatewayURL = `https://gateway.pinata.cloud/ipfs/${metadataCID}`;

    console.log("Image IPFS:", imageGatewayURL);
    console.log("Metadata IPFS:", metadataGatewayURL);

    return metadataGatewayURL; // tokenURI to be used in mint()
  } catch (err) {
    console.error("IPFS Upload Error:", err);
    throw err;
  }
}