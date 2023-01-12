import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";

export const ItemImage: React.FC<{ url: string }> = (props) => {
    const [loading, setLoading] = useState(true);
  const imageLoaded = () => {
    setLoading(false);
  }
  return <React.Fragment>
    <div style={{display: loading ? "block" : "none"}}>
    <RotatingLines
  strokeColor="grey"
  strokeWidth="5"
  animationDuration="0.75"
  width="96"
  visible={true}
/>
    </div>
    <div style={{display: loading ? "none" : "block", width: '100%'}}>
        <img 
          key={props.url}
          src={props.url}
          onLoad={imageLoaded}/>
    </div>
  </React.Fragment>;
}