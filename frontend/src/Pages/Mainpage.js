import { useEffect } from "react";
import Hero from "../Components/Hero";
import Postlistings from "../Components/Postlistings";
import ViewAll from "../Components/Viewall";
import { Navigate } from "react-router-dom";
import { useToken } from "../token/useToken";

function Mainpage() {
  const { token } = useToken();
  useEffect(() => {
    if (token) {
      <Navigate to="/" replace={true} />;
    }
  });
  return (
    <>
      <Hero />
      <Postlistings limit={6} ignoreAuth={true} />
      <ViewAll />
    </>
  );
}

export default Mainpage;
