import React, { useEffect, useState } from "react";
import ImageTrail from "../components/ImageTrail";
import { fetchInstagramImages } from "../services/instagram"; // importa a função

export default function MainScreen() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const imgs = await fetchInstagramImages();
      setImages(imgs);
    };

    loadImages();
  }, []);

  return (
    <>
      <div
        style={{ height: "500px", position: "relative", overflow: "hidden" }}
      >
        <ImageTrail
          items={
            images.length
              ? images
              : [
                  "https://picsum.photos/id/287/300/300",
                  "https://picsum.photos/id/1001/300/300",
                ]
          }
          variant={1}
          backgroundImage="https://scontent-ams4-1.cdninstagram.com/v/t39.30808-6/497700082_122162366318506495_6408172322433122039_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=1-7&_nc_sid=18de74&_nc_ohc=K_xVPtAFec8Q7kNvwH3_s2P&_nc_oc=AdmKOtJY02cE70GTlCR_N6HG8YyP7q2jeRsbjiv2_3R0_Ljzj_0vNC6Ozcd3XHVn1C9kKkJ6BRxQmMAh8LrvxWlQ&_nc_zt=23&_nc_ht=scontent-ams4-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=F8231RJSdr-DtaZlVdnTig&oh=00_AfQQjUkL7_nncj24n0HZ8-z_4YYT_Si3SFSPD_p1TQeLog&oe=6871F32A"
        />
      </div>
    </>
  );
}
