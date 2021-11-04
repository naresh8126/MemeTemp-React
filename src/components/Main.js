import React from "react";
import Section from "./Section";
import Hero from "./Hero";
import Sec from "./Sec";
function Main() {
  document.title = "IceMemes";
  return (
    <div style={{ background: "#191c23;" }}>
      <Hero />
      {/* where(props.l,props.mid,props.r) 
          where("views","<=","10")
      */}
      
      <Sec  title="Featured Memes" content={<Section orderBy="random"/>}  />
      <Sec  title="Latest Memes" content={<Section orderBy="timestamp"/>}  />
      <Sec  title="Random Memes" content={<Section orderBy="random"/>}  />
      <Sec  title="Most Popular Memes" content={<Section orderBy="views"/>}  />
      <Sec  title="Most Liked Memes" content={<Section orderBy="likes"/>}  />
      <Sec  title="Longest Memes" content={<Section orderBy="duration"/>}  />
      
      
      
    </div>
  );
}

export default Main;
