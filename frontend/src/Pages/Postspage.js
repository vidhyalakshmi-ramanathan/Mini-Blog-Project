import Postlistings from "../Components/Postlistings";
import Back from "../Components/Back";

function PostPage() {
  return (
    <>
      <Back />
      <Postlistings ignoreAuth={true} />
    </>
  );
}

export default PostPage;
