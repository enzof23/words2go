import { User } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ListType } from "../../../types/list_types";

type ListCardProps = {
  data: ListType;
  route: string | null;
};

const ListCard = ({ data, route }: ListCardProps) => {
  const navigate = useNavigate();
  const user: User = useOutletContext();

  return (
    <div
      className="card__container list__card"
      onClick={
        () => navigate(`${route ? `/${route}` : ""}/${user.uid}/${data.listID}`)
        // <ListDisplay /> is rendered on this route
      }
    >
      <div className="list__info">
        <h5>{data.title}</h5>
        <p>
          {data.words.length} word{data.words.length === 1 ? null : "s"}
        </p>
      </div>
      <div className="open">{route === null ? "open" : "start"}</div>
    </div>
  );
};

export default ListCard;
