import React from "react";

export async function getStaticPaths() {
  const paths = [
    { params: { dynamicPage: "example1" } },
    { params: { dynamicPage: "example2" } },
  ];
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Here you could fetch data based on the dynamic page
  return { props: { dynamicPage: params.dynamicPage } };
}

const DynamicPage = ({ dynamicPage }) => {
  return <div>This is the dynamic page: {dynamicPage}</div>;
};

export default DynamicPage;
