import Card from "./Card";
import pic from "./pic.jpg";

const Section = () => {
  return (
    <>
      <div class="grid grid-cols-1 2xl:grid-cols-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
        <Card uploaderName="naresh" uploadTime="2:24:4" thumbnail={pic} />
      </div>
    </>
  );
};

export default Section;
