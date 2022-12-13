import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getListByID } from "../../utils/firebase-api";
import { OutletLoader } from "../../layouts/_index";

type ParamsType = {
  listid: string;
  userid: string;
};

const PracticeDisplay = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;

  const { data, error, isFetching } = useQuery({
    queryKey: ["fetchList"],
    queryFn: () => getListByID({ userID: userid, listID: listid }),
  });

  if (isFetching) {
    return <OutletLoader />;
  }

  if (error instanceof Error) {
    return (
      <div className="outlet__container">
        An error has occured, could not fetch lists. {error.message}
      </div>
    );
  }

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">
        <div className="outlet__title" style={{ paddingLeft: 0 }}>
          <h2>{data?.title}</h2>
        </div>
      </div>
    </div>
  );
};

export default PracticeDisplay;
